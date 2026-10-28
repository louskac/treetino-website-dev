<template>
    <div ref="hostRef" class="relative h-full w-full">
        <canvas ref="canvasRef" class="block h-full w-full"></canvas>

        <!-- Callouts pinned to 3D anchors (positions are written directly in the render loop) -->
        <div
            v-for="(c, i) in callouts"
            :key="c.title"
            :ref="(el) => (calloutEls[i] = el as HTMLElement | null)"
            class="pointer-events-none absolute top-0 left-0 will-change-transform"
            style="opacity: 0"
        >
            <div class="flex items-center gap-2" :style="{ flexDirection: c.dir === 'up' ? 'column' : 'column-reverse' }">
                <span class="callout-text block text-center whitespace-nowrap">
                    <span class="block text-xl leading-none font-medium tracking-[-0.03em] text-white tabular-nums sm:text-2xl">
                        {{ c.value }}
                    </span>
                    <span class="mt-1 block text-xs text-white/50 sm:mt-1.5 sm:text-sm">{{ c.title }}</span>
                </span>
                <span
                    class="block h-6 w-px shrink-0 sm:h-10"
                    :class="c.dir === 'up' ? 'bg-gradient-to-b from-white/10 to-white/60' : 'bg-gradient-to-t from-white/10 to-white/60'"
                ></span>
                <span class="relative block h-2.5 w-2.5 shrink-0 rounded-full border border-[#8ec5ff] bg-zinc-950">
                    <span class="absolute inset-0 animate-ping rounded-full bg-[#8ec5ff]/40"></span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * Line-drawn Treetino V1 that explains itself while you scroll:
 * - `draw`        builds the tree line by line
 * - `hlPods`      emphasises the 12 wind turbines (dims the leaves)
 * - `hlLeaves`    emphasises the solar canopy (dims the turbines)
 * - `calloutPods` / `calloutLeaves` show the anchored labels
 * - `sun` + `track` show a sun crossing the sky while every leaf cluster rolls towards it
 * - `storm`       blows wind lines through the tree and rolls every cluster into its stow position
 * - `orbit`       turns the camera slowly
 */
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { V3 } from '@/custom/web3/wireKit';
import { fadingGrid, lineMaterial, podLines, treetinoV1, WIRE } from '@/custom/web3/wireKit';

const props = withDefaults(
    defineProps<{
        draw?: number;
        hlPods?: number;
        hlLeaves?: number;
        calloutPods?: number;
        calloutLeaves?: number;
        sun?: number;
        track?: number;
        storm?: number;
        orbit?: number;
        active?: boolean;
    }>(),
    {
        draw: 1,
        hlPods: 0,
        hlLeaves: 0,
        calloutPods: 0,
        calloutLeaves: 0,
        sun: 0,
        track: 0.5,
        storm: 0,
        orbit: 0,
        active: true,
    },
);

const callouts = [
    { title: 'Wind turbines', value: '12 ×', dir: 'up' },
    { title: 'Solar leaves', value: '300 ×', dir: 'down' },
] as const;

const hostRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const calloutEls: (HTMLElement | null)[] = [];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let structure: THREE.LineSegments;
let structureCount = 0;
let structMat: THREE.LineBasicMaterial;
let leafMat: THREE.LineBasicMaterial;
let podMat: THREE.LineBasicMaterial;
let grid: THREE.LineSegments;
let sunPoint: THREE.Points;
let sunMat: THREE.PointsMaterial;
let sunArc: THREE.Line;
let sunArcMat: THREE.LineBasicMaterial;
let windLines: THREE.LineSegments;
let windMat: THREE.LineBasicMaterial;
const disposables: { dispose: () => void }[] = [];
const podMeshes: THREE.LineSegments[] = [];
const clusters: { pivot: THREE.Object3D; mesh: THREE.LineSegments; count: number; axis: THREE.Vector3; perp: THREE.Vector3 }[] = [];
const center = new THREE.Vector3(0, 2.55, 0);
/** candidate anchor points: the highest turbine gets a label above, the lowest leaf tip a label below */
const podAnchors: THREE.Vector3[] = [];
const leafAnchors: THREE.Vector3[] = [];
let raf = 0;
let resizeObserver: ResizeObserver | null = null;
let hostW = 1;
let hostH = 1;

const SUN_ARC_SAMPLES = 48;
const WIND_COUNT = 34;
const windSeeds: { y: number; z: number; speed: number; len: number; phase: number }[] = [];

function sunPosition(p: number, out: THREE.Vector3): THREE.Vector3 {
    const phi = Math.PI * (0.9 - 0.8 * p);

    return out.set(Math.cos(phi) * 3.5, 4.35 + Math.sin(phi) * 1.15, -1.6);
}

function resize() {
    const host = hostRef.value;

    if (!host || !renderer) {
        return;
    }

    hostW = host.clientWidth || 1;
    hostH = host.clientHeight || 1;
    renderer.setSize(hostW, hostH, false);
    camera.aspect = hostW / hostH;
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    // fit ~7 units of height and ~7.8 units of width, leaving room above and below for the callouts
    camera.userData.distance = Math.max(3.5 / tanV, 3.9 / (tanV * camera.aspect));
    camera.updateProjectionMatrix();
}

const tmp = new THREE.Vector3();
const sunTmp = new THREE.Vector3();
const sunDir = new THREE.Vector3();

function placeCallout(el: HTMLElement | null, candidates: THREE.Vector3[], opacity: number, up: boolean) {
    if (!el) {
        return;
    }

    if (opacity <= 0.01 || !candidates.length) {
        el.style.opacity = '0';

        return;
    }

    let ax = 0;
    let ay = up ? Infinity : -Infinity;

    for (const c of candidates) {
        tmp.copy(c).project(camera);
        const y = (-tmp.y * 0.5 + 0.5) * hostH;

        if (up ? y < ay : y > ay) {
            ay = y;
            ax = (tmp.x * 0.5 + 0.5) * hostW;
        }
    }

    const w = el.offsetWidth;
    const h = el.offsetHeight;
    el.style.transform = `translate(${ax - w / 2}px, ${up ? ay - h + 5 : ay - 5}px)`;
    el.style.opacity = String(opacity);
}

function frame(time: number) {
    raf = requestAnimationFrame(frame);

    if (!renderer || !props.active) {
        return;
    }

    const draw = clamp01(props.draw);

    // 1 · structure, then turbines, then the canopy cluster by cluster
    structure.geometry.setDrawRange(0, Math.floor((structureCount / 2) * clamp01(draw / 0.45)) * 2);
    (grid.material as THREE.LineBasicMaterial).opacity = 0.45 * clamp01(draw * 3);
    const podOn = clamp01((draw - 0.38) / 0.2);

    podMeshes.forEach((m, i) => {
        m.visible = podOn > 0;
        m.scale.setScalar(Math.max(0.001, podOn));
        m.rotation.y = time * (0.0012 + props.storm * 0.004) * (i % 2 ? 1 : -1) + i;
    });

    // 2 · sun tracking & storm stow — every cluster rolls around its own long axis
    const sunOn = clamp01(props.sun);
    const storm = clamp01(props.storm);
    sunPosition(clamp01(props.track), sunTmp);
    sunDir.set(sunTmp.x, 0, sunTmp.z - 0.0).normalize();

    clusters.forEach((c, i) => {
        const reveal = clamp01((draw - 0.5 - (i / clusters.length) * 0.4) / 0.1);
        c.mesh.geometry.setDrawRange(0, Math.floor((c.count / 2) * reveal) * 2);
        c.mesh.visible = reveal > 0;
        const trackAngle = 0.62 * sunDir.dot(c.perp) * sunOn;
        const stowAngle = (trackAngle >= 0 ? 1 : -1) * 1.3;
        const angle = trackAngle + (stowAngle - trackAngle) * storm + Math.sin(time * 0.0016 + i) * 0.03 * storm;
        c.pivot.quaternion.setFromAxisAngle(c.axis, angle);
    });

    // 3 · emphasis
    const hp = clamp01(props.hlPods);
    const hl = clamp01(props.hlLeaves);
    structMat.opacity = 0.95 * (1 - 0.5 * Math.max(hp, hl));
    leafMat.opacity = 0.95 * (1 - 0.75 * hp);
    podMat.opacity = 0.95 * (1 - 0.75 * hl);

    // 4 · sun
    sunMat.opacity = sunOn;
    sunPoint.position.copy(sunTmp);
    sunArcMat.opacity = 0.35 * sunOn;
    sunArc.geometry.setDrawRange(0, Math.max(2, Math.round(SUN_ARC_SAMPLES * clamp01(props.track))));

    // 5 · wind
    windMat.opacity = 0.75 * storm;

    if (storm > 0.001) {
        const wp = windLines.geometry.getAttribute('position') as THREE.BufferAttribute;

        windSeeds.forEach((s, i) => {
            const x = ((s.phase + time * 0.001 * s.speed) % 1) * 16 - 8;
            wp.setXYZ(i * 2, x, s.y, s.z);
            wp.setXYZ(i * 2 + 1, x + s.len, s.y + 0.02, s.z);
        });

        wp.needsUpdate = true;
    }

    // camera
    const az = -0.55 + props.orbit * 1.1 + Math.sin(time * 0.0002) * 0.03;
    const el = 0.12;
    const dist = (camera.userData.distance as number) ?? 12;
    camera.position.set(
        center.x + Math.sin(az) * Math.cos(el) * dist,
        center.y + Math.sin(el) * dist,
        center.z + Math.cos(az) * Math.cos(el) * dist,
    );
    camera.lookAt(center);
    camera.updateMatrixWorld();

    renderer.render(scene, camera);

    placeCallout(calloutEls[0], podAnchors, clamp01(props.calloutPods) * podOn, true);
    placeCallout(calloutEls[1], leafAnchors, clamp01(props.calloutLeaves) * clamp01((draw - 0.8) / 0.2), false);
}

function glowTexture(): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 128;
    c.height = 128;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, 'rgba(255,255,255,1)');
    g.addColorStop(0.18, 'rgba(255,236,170,0.95)');
    g.addColorStop(0.42, 'rgba(251,191,36,0.35)');
    g.addColorStop(1, 'rgba(251,191,36,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);

    return new THREE.CanvasTexture(c);
}

onMounted(() => {
    const canvas = canvasRef.value;

    if (!canvas || !hostRef.value) {
        return;
    }

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

    structMat = lineMaterial();
    leafMat = lineMaterial();
    podMat = lineMaterial();
    disposables.push(structMat, leafMat, podMat);

    const tree = treetinoV1();
    const pos = tree.body.positions;
    const col = tree.body.colors;
    const foliageStart = tree.foliageStart ?? tree.body.vertexCount;

    // trunk, boughs, pod brackets
    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.Float32BufferAttribute(pos.slice(0, foliageStart * 3), 3));
    sg.setAttribute('color', new THREE.Float32BufferAttribute(col.slice(0, foliageStart * 3), 3));
    disposables.push(sg);
    structure = new THREE.LineSegments(sg, structMat);
    structureCount = foliageStart;
    scene.add(structure);

    // foliage clusters, each in its own pivot so it can roll

    for (const part of tree.parts ?? []) {
        const [px, py, pz] = part.pivot;
        const local: number[] = [];

        for (let v = part.start; v < part.end; v++) {
            local.push(pos[v * 3] - px, pos[v * 3 + 1] - py, pos[v * 3 + 2] - pz);
        }

        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(local, 3));
        g.setAttribute('color', new THREE.Float32BufferAttribute(col.slice(part.start * 3, part.end * 3), 3));
        disposables.push(g);
        const mesh = new THREE.LineSegments(g, leafMat);
        const pivot = new THREE.Object3D();
        pivot.position.set(px, py, pz);
        pivot.add(mesh);
        scene.add(pivot);
        const axis = new THREE.Vector3(...part.axis).normalize();
        // horizontal direction the leaves tilt towards when rolling positively: axis × up
        const perp = new THREE.Vector3().crossVectors(axis, new THREE.Vector3(0, 1, 0)).multiplyScalar(-1).normalize();
        clusters.push({ pivot, mesh, count: part.end - part.start, axis, perp });

        // callout candidates: tips of the lower canopy clusters
        if (py < 2.2) {
            const tip: V3 = [px + part.axis[0] * 0.95, py + 0.12, pz + part.axis[2] * 0.95];
            leafAnchors.push(new THREE.Vector3(...tip));
        }
    }

    // turbines
    const podYs = tree.pods.map((p) => p.base[1]).sort((a, b) => a - b);
    const upperPodY = podYs[Math.floor(podYs.length / 2)] ?? 0;

    for (const pod of tree.pods) {
        const pg = podLines(pod.height).geometry();
        disposables.push(pg);
        const m = new THREE.LineSegments(pg, podMat);
        m.position.set(...pod.base);
        scene.add(m);
        podMeshes.push(m);

        // callout candidates: the upper half of the turbines
        if (pod.base[1] >= upperPodY) {
            podAnchors.push(new THREE.Vector3(pod.base[0], pod.base[1] + pod.height * 0.98, pod.base[2]));
        }
    }

    grid = fadingGrid(8, 0.8);
    disposables.push(grid.geometry, grid.material as THREE.Material);
    scene.add(grid);

    // sun + its path
    const tex = glowTexture();
    disposables.push(tex);
    sunMat = new THREE.PointsMaterial({
        map: tex,
        size: 120,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    const spg = new THREE.BufferGeometry();
    spg.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
    sunPoint = new THREE.Points(spg, sunMat);
    sunPoint.frustumCulled = false;
    disposables.push(spg, sunMat);
    scene.add(sunPoint);

    const arcPts: number[] = [];

    for (let i = 0; i <= SUN_ARC_SAMPLES; i++) {
        sunPosition(i / SUN_ARC_SAMPLES, tmp);
        arcPts.push(tmp.x, tmp.y, tmp.z);
    }

    const ag = new THREE.BufferGeometry();
    ag.setAttribute('position', new THREE.Float32BufferAttribute(arcPts, 3));
    sunArcMat = new THREE.LineBasicMaterial({ color: WIRE.amber, transparent: true, opacity: 0, depthWrite: false });
    sunArc = new THREE.Line(ag, sunArcMat);
    disposables.push(ag, sunArcMat);
    scene.add(sunArc);

    // wind streaks
    for (let i = 0; i < WIND_COUNT; i++) {
        windSeeds.push({
            y: 0.6 + Math.random() * 4.6,
            z: -2.2 + Math.random() * 4.4,
            speed: 0.55 + Math.random() * 0.6,
            len: 0.6 + Math.random() * 1.1,
            phase: Math.random(),
        });
    }

    const wg = new THREE.BufferGeometry();
    wg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(WIND_COUNT * 6), 3));
    windMat = new THREE.LineBasicMaterial({
        color: WIRE.detail,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    windLines = new THREE.LineSegments(wg, windMat);
    windLines.frustumCulled = false;
    disposables.push(wg, windMat);
    scene.add(windLines);

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hostRef.value);
    raf = requestAnimationFrame(frame);
});

watch(
    () => props.active,
    (on) => on && resize(),
);

onUnmounted(() => {
    cancelAnimationFrame(raf);
    resizeObserver?.disconnect();
    disposables.forEach((d) => d.dispose());
    renderer?.dispose();
    renderer = null;
});
</script>
