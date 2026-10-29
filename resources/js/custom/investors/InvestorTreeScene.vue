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
let backMat: THREE.LineBasicMaterial;
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
const clusters: {
    pivot: THREE.Object3D;
    mesh: THREE.LineSegments;
    backMesh: THREE.LineSegments;
    count: number;
    axis: THREE.Vector3;
    axisHoriz: THREE.Vector3;
    perp: THREE.Vector3;
}[] = [];
const center = new THREE.Vector3(0, 2.55, 0);
/** candidate anchor points: the highest turbine gets a label above, the lowest leaf tip a label below */
const podAnchors: THREE.Vector3[] = [];
const leafAnchors: THREE.Vector3[] = [];
let raf = 0;
let resizeObserver: ResizeObserver | null = null;
let hostW = 1;
let hostH = 1;

const SUN_ARC_SAMPLES = 48;
const HAIL_COUNT = 42;
const hailSeeds: {
    x: number;
    z: number;
    hitY: number;
    speed: number;
    len: number;
    phase: number;
    bounceX: number;
    bounceZ: number;
}[] = [];

function sunPosition(p: number, out: THREE.Vector3): THREE.Vector3 {
    const phi = Math.PI * (0.88 - 0.76 * p);

    return out.set(Math.cos(phi) * 3.6, 4.35 + Math.sin(phi) * 1.15, 1.15);
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
const qRoll = new THREE.Quaternion();
const qPitch = new THREE.Quaternion();

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

    // 2 · 2-axis sun tracking & 180° hail-protection flip (leaves turn upside-down so their armored backs shield the PV glass)
    const sunOn = clamp01(props.sun);
    const storm = clamp01(props.storm);
    sunPosition(clamp01(props.track), sunTmp);

    clusters.forEach((c, i) => {
        const reveal = clamp01((draw - 0.5 - (i / clusters.length) * 0.4) / 0.1);
        c.mesh.geometry.setDrawRange(0, Math.floor((c.count / 2) * reveal) * 2);
        c.mesh.visible = reveal > 0;
        c.backMesh.visible = reveal > 0 && storm > 0.25;

        // Direction from this branch cluster's pivot toward the sun
        sunDir.copy(sunTmp).sub(c.pivot.position).normalize();

        // Roll around the branch's longitudinal spine axis tilts leaf normals toward +c.perp (axis × up)
        const rollTrack = 0.72 * sunDir.dot(c.perp) * sunOn;
        // Pitch around c.perp tilts leaf normals along +c.axisHoriz so side branches also angle toward the sun
        const pitchTrack = -0.28 * sunDir.dot(c.axisHoriz) * sunOn;

        // In hail/storm protection, each branch rolls a full 180° (π rad) around its spine so leaves lie flat upside-down
        // (zero vertical sail area in wind, while the reinforced leaf backs face upward to deflect hailstones)
        const flipSign = rollTrack >= 0 ? 1 : -1;
        const flipAngle = flipSign * Math.PI;
        const roll = rollTrack + (flipAngle - rollTrack) * storm + Math.sin(time * 0.0018 + i) * 0.018 * storm;
        const pitch = pitchTrack * (1 - storm);

        qRoll.setFromAxisAngle(c.axis, roll);
        qPitch.setFromAxisAngle(c.perp, pitch);
        c.pivot.quaternion.copy(qPitch).multiply(qRoll);
    });

    // 3 · emphasis & dorsal armor highlight when flipped 180°
    const hp = clamp01(props.hlPods);
    const hl = clamp01(props.hlLeaves);
    const flipped = clamp01((storm - 0.35) / 0.5);
    structMat.opacity = 0.95 * (1 - 0.5 * Math.max(hp, hl));
    leafMat.opacity = 0.95 * (1 - 0.75 * hp);
    backMat.opacity = 0.65 * flipped;
    podMat.opacity = 0.95 * (1 - 0.75 * hl);

    // 4 · sun
    sunMat.opacity = sunOn;
    sunPoint.position.copy(sunTmp);
    sunArcMat.opacity = 0.35 * sunOn;
    sunArc.geometry.setDrawRange(0, Math.max(2, Math.round(SUN_ARC_SAMPLES * clamp01(props.track))));

    // 5 · hail shower falling onto the canopy & deflecting off the upturned leaf backs
    windMat.opacity = 0.82 * storm;

    if (storm > 0.001) {
        const wp = windLines.geometry.getAttribute('position') as THREE.BufferAttribute;

        hailSeeds.forEach((s, i) => {
            const u = (s.phase + time * 0.00085 * s.speed) % 1;

            if (u < 0.78) {
                // Falling hail streak from sky (y = 5.8) down to canopy height (s.hitY)
                const fall = u / 0.78;
                const yTop = 5.8;
                const y = yTop - fall * (yTop - s.hitY);
                const x = s.x - (1 - fall) * 0.38;
                wp.setXYZ(i * 2, x, y, s.z);
                wp.setXYZ(i * 2 + 1, x - 0.09, y + s.len, s.z);
            } else {
                // Deflection bounce off the armored leaf back
                const b = (u - 0.78) / 0.22;
                const x = s.x + s.bounceX * b * 0.55;
                const y = s.hitY + (b * (1 - 0.65 * b)) * 0.42;
                const z = s.z + s.bounceZ * b * 0.55;
                wp.setXYZ(i * 2, x, y, z);
                wp.setXYZ(i * 2 + 1, x - s.bounceX * 0.14, y - 0.08, z - s.bounceZ * 0.14);
            }
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
    backMat = lineMaterial(0);
    podMat = lineMaterial();
    disposables.push(structMat, leafMat, backMat, podMat);

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

    // foliage clusters, each in its own pivot so it can roll and flip 180° onto its armored back
    // Pre-attenuated for THREE.AdditiveBlending so dense overlapping leaves stay crisp emerald
    const backSpineColor = new THREE.Color('#10b981').multiplyScalar(0.38);

    for (const part of tree.parts ?? []) {
        const [px, py, pz] = part.pivot;
        const local: number[] = [];

        for (let v = part.start; v < part.end; v++) {
            local.push(pos[v * 3] - px, pos[v * 3 + 1] - py, pos[v * 3 + 2] - pz);
        }

        // Build dorsal herringbone protective ribs on the back of every leaf in this cluster
        const backPos: number[] = [];
        const backCol: number[] = [];
        const pushBackSeg = (ax: number, ay: number, az: number, bx: number, by: number, bz: number, c: THREE.Color) => {
            backPos.push(ax, ay, az, bx, by, bz);
            backCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
        };

        const segCount = (part.end - part.start) / 2;

        for (let s = 8; s < segCount; s++) {
            const vIdx = part.start + s * 2;

            // Identify ONLY each leaf's single center-vein segment (in linear RGB, TREE_LEAF_VEIN.r ≈ 0.0018, whereas outline.r ≈ 0.021)
            if (col[vIdx * 3] < 0.008) {
                const pts: [number, number, number][] = [];

                for (let k = 0; k < 8; k++) {
                    const baseIdx = (s - 8 + k) * 6;
                    pts.push([local[baseIdx], local[baseIdx + 1], local[baseIdx + 2]]);
                }

                const [p0, p1, p2, p3, p4, p5, p6, p7] = pts;
                // Compute leaf backside normal offset so dorsal ribs sit cleanly on the underside
                const fx = p4[0] - p0[0];
                const fy = p4[1] - p0[1];
                const fz = p4[2] - p0[2];
                const rx = p6[0] - p2[0];
                const ry = p6[1] - p2[1];
                const rz = p6[2] - p2[2];
                let nx = fy * rz - fz * ry;
                let ny = fz * rx - fx * rz;
                let nz = fx * ry - fy * rx;
                const nLen = Math.hypot(nx, ny, nz) || 1;
                const sign = ny > 0 ? -0.006 / nLen : 0.006 / nLen;
                nx *= sign;
                ny *= sign;
                nz *= sign;

                const off = (p: [number, number, number]): [number, number, number] => [p[0] + nx, p[1] + ny, p[2] + nz];
                const o0 = off(p0);
                const o1 = off(p1);
                const o2 = off(p2);
                const o3 = off(p3);
                const o4 = off(p4);
                const o5 = off(p5);
                const o6 = off(p6);
                const o7 = off(p7);

                // 3 pairs of diagonal herringbone armor ribs on the leaf back (matching Treetino's green ribbed leaf backs)
                const spinePt = (t: number): [number, number, number] => [
                    o0[0] + (o4[0] - o0[0]) * t,
                    o0[1] + (o4[1] - o0[1]) * t,
                    o0[2] + (o4[2] - o0[2]) * t,
                ];
                const s1 = spinePt(0.08);
                const s2 = spinePt(0.32);
                const s3 = spinePt(0.58);
                pushBackSeg(s1[0], s1[1], s1[2], o1[0], o1[1], o1[2], backSpineColor);
                pushBackSeg(s1[0], s1[1], s1[2], o7[0], o7[1], o7[2], backSpineColor);
                pushBackSeg(s2[0], s2[1], s2[2], o2[0], o2[1], o2[2], backSpineColor);
                pushBackSeg(s2[0], s2[1], s2[2], o6[0], o6[1], o6[2], backSpineColor);
                pushBackSeg(s3[0], s3[1], s3[2], o3[0], o3[1], o3[2], backSpineColor);
                pushBackSeg(s3[0], s3[1], s3[2], o5[0], o5[1], o5[2], backSpineColor);
            }
        }

        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(local, 3));
        g.setAttribute('color', new THREE.Float32BufferAttribute(col.slice(part.start * 3, part.end * 3), 3));
        disposables.push(g);
        const mesh = new THREE.LineSegments(g, leafMat);

        const bg = new THREE.BufferGeometry();
        bg.setAttribute('position', new THREE.Float32BufferAttribute(backPos, 3));
        bg.setAttribute('color', new THREE.Float32BufferAttribute(backCol, 3));
        disposables.push(bg);
        const backMesh = new THREE.LineSegments(bg, backMat);
        backMesh.visible = false;

        const pivot = new THREE.Object3D();
        pivot.position.set(px, py, pz);
        pivot.add(mesh);
        pivot.add(backMesh);
        scene.add(pivot);
        const axis = new THREE.Vector3(...part.axis).normalize();
        const axisHoriz = new THREE.Vector3(axis.x, 0, axis.z).normalize();
        // Horizontal direction the leaf normals tilt towards when rolling positively around `axis`: axis × up
        const perp = new THREE.Vector3().crossVectors(axis, new THREE.Vector3(0, 1, 0)).normalize();
        clusters.push({ pivot, mesh, backMesh, count: part.end - part.start, axis, axisHoriz, perp });

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

    // hail streaks falling onto the canopy & bouncing off the upturned leaf backs
    for (let i = 0; i < HAIL_COUNT; i++) {
        const angle = (i / HAIL_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
        const radius = 0.45 + Math.random() * 2.55;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const hitY = 2.0 + Math.random() * 1.15;
        hailSeeds.push({
            x,
            z,
            hitY,
            speed: 0.75 + Math.random() * 0.55,
            len: 0.36 + Math.random() * 0.28,
            phase: Math.random(),
            bounceX: Math.cos(angle) + (Math.random() - 0.5) * 0.4,
            bounceZ: Math.sin(angle) + (Math.random() - 0.5) * 0.4,
        });
    }

    const wg = new THREE.BufferGeometry();
    wg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(HAIL_COUNT * 6), 3));
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
