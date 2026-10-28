<template>
    <div ref="hostRef" class="relative h-full w-full">
        <canvas ref="canvasRef" class="block h-full w-full"></canvas>

        <!-- Callouts pinned to 3D anchors (positions updated directly in the render loop) -->
        <div
            v-for="(c, i) in callouts"
            :key="c.title"
            :ref="(el) => (calloutEls[i] = el as HTMLElement | null)"
            class="pointer-events-none absolute top-0 left-0 will-change-transform"
            style="opacity: 0"
        >
            <div class="flex items-center gap-1.5" :style="{ flexDirection: c.dir === 'up' ? 'column' : 'column-reverse' }">
                <span class="block text-center whitespace-nowrap">
                    <span
                        class="block text-base leading-none font-medium tracking-[-0.03em] tabular-nums sm:text-xl"
                        :class="c.tone === 'green' ? 'text-emerald-300' : 'text-white'"
                    >
                        {{ c.value }}
                    </span>
                    <span class="mt-1 block text-[11px] text-white/50 sm:text-xs">{{ c.title }}</span>
                </span>
                <span
                    class="block h-5 w-px shrink-0 sm:h-8"
                    :class="c.dir === 'up' ? 'bg-gradient-to-b from-white/10 to-white/60' : 'bg-gradient-to-t from-white/10 to-white/60'"
                ></span>
                <span
                    class="relative block h-2 w-2 shrink-0 rounded-full border bg-zinc-950"
                    :class="c.tone === 'green' ? 'border-emerald-400' : 'border-[#8ec5ff]'"
                >
                    <span
                        class="absolute inset-0 animate-ping rounded-full"
                        :class="c.tone === 'green' ? 'bg-emerald-400/40' : 'bg-[#8ec5ff]/40'"
                    ></span>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/**
 * 3D wireframe microgrid that replaces the flat SVG block diagram in Chapter 02:
 * - `sources` builds the V1 tree, the Victron + LiFePO4 power core, and the DC feed between them
 * - `loads`   draws the EV charger + car, the site building and the grid pylon, and streams amber kWh to each
 * - `brain`   raises the emerald TreeApp telemetry arcs above the site with live control pulses
 * - `orbit`   slowly turns the camera across the microgrid
 */
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { V3 } from '@/custom/web3/wireKit';
import { batteryContainer, fadingGrid, LineBuilder, lineMaterial, podLines, treetinoV1, WIRE } from '@/custom/web3/wireKit';
import { arcPoints, buildingLines, carLines, chargerPillar, dim, glowMaterial, glowTexture, mergeInto, Path, pylonLines } from './sceneKit';
import { clamp01 } from './tokens';

const props = withDefaults(
    defineProps<{
        sources?: number;
        loads?: number;
        brain?: number;
        orbit?: number;
        active?: boolean;
    }>(),
    {
        sources: 1,
        loads: 0,
        brain: 0,
        orbit: 0,
        active: true,
    },
);

const TREE_X = -5.6;
const CORE_X = -0.45;
const EV_POS: V3 = [3.65, 0, 2.15];
const CAR_POS: V3 = [5.55, 0, 2.45];
const BLDG_POS: V3 = [3.75, 0, -1.65];
const PYLON_POS: V3 = [6.65, 0, -0.65];

interface CalloutDef {
    value: string;
    title: string;
    anchor: THREE.Vector3;
    dir: 'up' | 'down';
    group: 'sources' | 'loads' | 'brain';
    tone?: 'blue' | 'green';
}

const callouts: CalloutDef[] = [
    { value: '49.8 kW', title: 'Solar + wind', anchor: new THREE.Vector3(TREE_X, 4.55, 0), dir: 'up', group: 'sources' },
    { value: 'Victron · 100 kWh', title: 'Power core & LiFePO4', anchor: new THREE.Vector3(CORE_X, 2.35, 0), dir: 'up', group: 'sources' },
    { value: '22 kW', title: 'EV hub', anchor: new THREE.Vector3(CAR_POS[0] - 0.4, 0.02, CAR_POS[2] + 1.05), dir: 'down', group: 'loads' },
    { value: 'On-site', title: 'Building load', anchor: new THREE.Vector3(BLDG_POS[0] - 0.2, 2.15, BLDG_POS[2]), dir: 'up', group: 'loads' },
    { value: 'Surplus', title: 'Grid export', anchor: new THREE.Vector3(PYLON_POS[0] + 0.2, 3.65, PYLON_POS[2]), dir: 'up', group: 'loads' },
    { value: 'TreeApp AI', title: 'Live load & sun control', anchor: new THREE.Vector3(CORE_X, 3.95, 0), dir: 'up', group: 'brain', tone: 'green' },
];

const SOURCE_PATH = new Path([
    [TREE_X + 0.25, 0.05, 0.2],
    [TREE_X + 1.5, 0.05, 1.1],
    [CORE_X - 2.65, 0.05, 1.1],
    [CORE_X - 2.45, 0.05, 0.3],
]);

const LOAD_PATHS = [
    new Path([
        [CORE_X + 2.45, 0.05, 0.45],
        [CORE_X + 3.0, 0.05, 2.15],
        [EV_POS[0], 0.05, EV_POS[2]],
        [CAR_POS[0] - 0.65, 0.55, CAR_POS[2]],
    ]),
    new Path([
        [CORE_X + 2.45, 0.05, -0.35],
        [CORE_X + 3.1, 0.05, BLDG_POS[2]],
        [BLDG_POS[0] - 1.1, 0.05, BLDG_POS[2]],
    ]),
    new Path([
        [CORE_X + 2.45, 0.05, -0.05],
        [PYLON_POS[0], 0.05, PYLON_POS[2]],
    ]),
];

const BRAIN_ARCS: V3[][] = [
    arcPoints([CORE_X, 2.15, 0], [TREE_X, 3.55, 0], 1.55, 28),
    arcPoints([CORE_X, 2.15, 0], [EV_POS[0], 1.75, EV_POS[2]], 1.25, 24),
    arcPoints([CORE_X, 2.15, 0], [BLDG_POS[0], 1.85, BLDG_POS[2]], 1.25, 24),
    arcPoints([CORE_X, 2.15, 0], [PYLON_POS[0], 2.85, PYLON_POS[2]], 1.35, 24),
];
const BRAIN_PATHS = BRAIN_ARCS.map((pts) => new Path(pts));

const hostRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const calloutEls: (HTMLElement | null)[] = [];

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let sourcesMesh: THREE.LineSegments;
let sourcesCount = 0;
let sourcesMat: THREE.LineBasicMaterial;
let loadsMesh: THREE.LineSegments;
let loadsCount = 0;
let loadsMat: THREE.LineBasicMaterial;
let brainMesh: THREE.LineSegments;
let brainCount = 0;
let brainMat: THREE.LineBasicMaterial;
let pulseRing: THREE.LineSegments;
let pulseRingMat: THREE.LineBasicMaterial;
let grid: THREE.LineSegments;
let srcPoints: THREE.Points;
let srcPointsMat: THREE.PointsMaterial;
let loadPoints: THREE.Points;
let loadPointsMat: THREE.PointsMaterial;
let brainPoints: THREE.Points;
let brainPointsMat: THREE.PointsMaterial;
const podMeshes: THREE.LineSegments[] = [];
const disposables: { dispose: () => void }[] = [];
const center = new THREE.Vector3(0.2, 1.55, 0);
const tmp = new THREE.Vector3();
let raf = 0;
let resizeObserver: ResizeObserver | null = null;
let hostW = 1;
let hostH = 1;

const SRC_DOTS = 14;
const LOAD_DOTS_PER_PATH = 9;
const BRAIN_DOTS_PER_PATH = 6;

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
    const isPortrait = hostW < 640 || hostW < hostH;

    if (isPortrait) {
        center.set(0.0, 1.35, 0);
        camera.userData.distance = Math.max(8.6 / (tanV * camera.aspect), 4.5 / tanV);
    } else {
        center.set(0.15, 1.65, 0);
        camera.userData.distance = Math.max(8.8 / (tanV * camera.aspect), 4.3 / tanV);
    }

    camera.updateProjectionMatrix();
}

function placeCallout(el: HTMLElement | null, world: THREE.Vector3, opacity: number, up: boolean) {
    if (!el) {
        return;
    }

    if (opacity <= 0.01) {
        el.style.opacity = '0';

        return;
    }

    tmp.copy(world).project(camera);
    const x = (tmp.x * 0.5 + 0.5) * hostW;
    const y = (-tmp.y * 0.5 + 0.5) * hostH;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const clampedX = Math.min(hostW - w / 2 - 8, Math.max(w / 2 + 8, x));
    const top = up ? y - h + 4 : y - 4;
    const clampedTop = Math.min(hostH - h - 6, Math.max(6, top));
    el.style.transform = `translate(${clampedX - w / 2}px, ${clampedTop}px)`;
    el.style.opacity = String(opacity);
}

function frame(time: number) {
    raf = requestAnimationFrame(frame);

    if (!renderer || !props.active) {
        return;
    }

    const src = clamp01(props.sources);
    const lds = clamp01(props.loads);
    const brn = clamp01(props.brain);

    // 1 · sources: tree + core + DC conduit
    sourcesMesh.geometry.setDrawRange(0, Math.floor((sourcesCount / 2) * clamp01(src / 0.8)) * 2);
    (grid.material as THREE.LineBasicMaterial).opacity = 0.48 * clamp01(src * 2.5);
    const podOn = clamp01((src - 0.55) / 0.35);

    podMeshes.forEach((m, i) => {
        m.visible = podOn > 0;
        m.scale.setScalar(Math.max(0.001, podOn));
        m.rotation.y = time * 0.0014 * (i % 2 ? 1 : -1) + i;
    });

    // 2 · loads: EV hub, site building, grid pylon
    loadsMesh.geometry.setDrawRange(0, Math.floor((loadsCount / 2) * lds) * 2);
    loadsMesh.visible = lds > 0.005;

    // 3 · TreeApp brain arcs + pulsing ground halo
    brainMesh.geometry.setDrawRange(0, Math.floor((brainCount / 2) * brn) * 2);
    brainMesh.visible = brn > 0.005;
    const pulse = (time * 0.0007) % 1;
    pulseRing.visible = brn > 0.01;
    pulseRing.scale.setScalar(1 + pulse * 0.85);
    pulseRingMat.opacity = brn * (1 - pulse) * 0.65;

    // Slight dim of hardware when TreeApp overlay takes focus
    sourcesMat.opacity = 0.95 * (1 - 0.18 * brn);
    loadsMat.opacity = 0.95 * (1 - 0.18 * brn);
    brainMat.opacity = 0.85 * brn;

    // 4 · moving energy & telemetry particles
    const srcFlow = clamp01((src - 0.65) / 0.35);
    srcPointsMat.opacity = srcFlow;

    if (srcFlow > 0.01) {
        const attr = srcPoints.geometry.getAttribute('position') as THREE.BufferAttribute;

        for (let i = 0; i < SRC_DOTS; i++) {
            const t = (i / SRC_DOTS + time * 0.00022) % 1;
            SOURCE_PATH.at(t, tmp);
            attr.setXYZ(i, tmp.x, tmp.y, tmp.z);
        }

        attr.needsUpdate = true;
    }

    const loadFlow = clamp01((lds - 0.35) / 0.65);
    loadPointsMat.opacity = loadFlow;

    if (loadFlow > 0.01) {
        const attr = loadPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
        let k = 0;

        for (const path of LOAD_PATHS) {
            for (let i = 0; i < LOAD_DOTS_PER_PATH; i++) {
                const t = (i / LOAD_DOTS_PER_PATH + time * 0.0002) % 1;
                path.at(t, tmp);
                attr.setXYZ(k++, tmp.x, tmp.y, tmp.z);
            }
        }

        attr.needsUpdate = true;
    }

    const brainFlow = clamp01((brn - 0.25) / 0.75);
    brainPointsMat.opacity = brainFlow;

    if (brainFlow > 0.01) {
        const attr = brainPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
        let k = 0;

        for (const path of BRAIN_PATHS) {
            for (let i = 0; i < BRAIN_DOTS_PER_PATH; i++) {
                const t = (i / BRAIN_DOTS_PER_PATH + time * 0.00028) % 1;
                path.at(t, tmp);
                attr.setXYZ(k++, tmp.x, tmp.y, tmp.z);
            }
        }

        attr.needsUpdate = true;
    }

    // 5 · camera
    const az = -0.28 + props.orbit * 0.42 + Math.sin(time * 0.0002) * 0.025;
    const el = 0.31;
    const dist = (camera.userData.distance as number) ?? 26;
    camera.position.set(
        center.x + Math.sin(az) * Math.cos(el) * dist,
        center.y + Math.sin(el) * dist,
        center.z + Math.cos(az) * Math.cos(el) * dist,
    );
    camera.lookAt(center);
    camera.updateMatrixWorld();

    renderer.render(scene, camera);

    // 6 · HTML callouts (each beat shows only its own callouts)
    const srcCalloutOp = clamp01((src - 0.7) / 0.25) * (1 - clamp01(lds * 2.2));
    const loadCalloutOp = clamp01((lds - 0.5) / 0.4) * (1 - clamp01(brn * 2.2));
    const brainCalloutOp = clamp01((brn - 0.45) / 0.45);

    callouts.forEach((c, i) => {
        const op = c.group === 'sources' ? srcCalloutOp : c.group === 'loads' ? loadCalloutOp : brainCalloutOp;
        placeCallout(calloutEls[i], c.anchor, op, c.dir === 'up');
    });
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
    camera = new THREE.PerspectiveCamera(28, 1, 0.1, 300);

    sourcesMat = lineMaterial();
    loadsMat = lineMaterial();
    brainMat = lineMaterial(0.85);
    disposables.push(sourcesMat, loadsMat, brainMat);

    // --- Group 1: Sources (V1 tree + DC conduit + Victron/LiFePO4 container) ---
    const sb = new LineBuilder();
    const tree = treetinoV1();
    mergeInto(sb, tree.body, [TREE_X, 0, 0], 1);
    sb.poly(SOURCE_PATH.pts, dim(WIRE.amber, 0.55));
    mergeInto(sb, batteryContainer(0.82), [CORE_X, 0, 0], 1);

    const sg = sb.geometry();
    disposables.push(sg);
    sourcesMesh = new THREE.LineSegments(sg, sourcesMat);
    sourcesCount = sb.vertexCount;
    scene.add(sourcesMesh);

    for (const pod of tree.pods) {
        const pg = podLines(pod.height).geometry();
        disposables.push(pg);
        const m = new THREE.LineSegments(pg, sourcesMat);
        m.position.set(pod.base[0] + TREE_X, pod.base[1], pod.base[2]);
        scene.add(m);
        podMeshes.push(m);
    }

    // --- Group 2: Loads (conduits + EV charger & car + building + grid pylon) ---
    const lb = new LineBuilder();

    for (const path of LOAD_PATHS) {
        lb.poly(path.pts, dim(WIRE.amber, 0.5));
    }

    mergeInto(lb, chargerPillar(0.85), EV_POS, 1);
    mergeInto(lb, carLines(0.76), CAR_POS, 1);
    // charging cable from pillar to car
    const cable: V3[] = [];

    for (let k = 0; k <= 10; k++) {
        const t = k / 10;
        cable.push([
            EV_POS[0] + 0.24 + t * (CAR_POS[0] - 0.68 - EV_POS[0] - 0.24),
            0.85 - Math.sin(t * Math.PI) * 0.42,
            EV_POS[2] + t * (CAR_POS[2] - EV_POS[2]),
        ]);
    }

    lb.poly(cable, WIRE.amber);
    mergeInto(lb, buildingLines(2.3, 1.55, 1.9), BLDG_POS, 1);
    const pylon = pylonLines(3.3);
    mergeInto(lb, pylon.lines, PYLON_POS, 1);

    const lg = lb.geometry();
    disposables.push(lg);
    loadsMesh = new THREE.LineSegments(lg, loadsMat);
    loadsCount = lb.vertexCount;
    scene.add(loadsMesh);

    // --- Group 3: TreeApp AI telemetry arcs + ground ring ---
    const bb = new LineBuilder();
    BRAIN_ARCS.forEach((pts) => bb.poly(pts, WIRE.green));
    // core beacon rings
    bb.circle([CORE_X, 2.2, 0], 0.35, 'y', WIRE.green, 28);
    bb.circle([CORE_X, 2.2, 0], 0.65, 'y', dim(WIRE.green, 0.55), 32);

    const bg = bb.geometry();
    disposables.push(bg);
    brainMesh = new THREE.LineSegments(bg, brainMat);
    brainCount = bb.vertexCount;
    scene.add(brainMesh);

    const prb = new LineBuilder();
    prb.circle([0, 0.04, 0], 2.2, 'y', WIRE.green, 48);
    const prg = prb.geometry();
    pulseRingMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    pulseRing = new THREE.LineSegments(prg, pulseRingMat);
    pulseRing.position.set(CORE_X, 0, 0);
    disposables.push(prg, pulseRingMat);
    scene.add(pulseRing);

    // --- Floor grid ---
    grid = fadingGrid(13, 1.0);
    grid.position.set(center.x, -0.14, 0);
    disposables.push(grid.geometry, grid.material as THREE.Material);
    scene.add(grid);

    // --- Glow particles ---
    const amberTex = glowTexture();
    const greenTex = glowTexture('rgba(167,243,208,0.95)', 'rgba(52,211,153,0.4)', 'rgba(52,211,153,0)');
    disposables.push(amberTex, greenTex);

    srcPointsMat = glowMaterial(amberTex, '#fbbf24', 18);
    const spg = new THREE.BufferGeometry();
    spg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(SRC_DOTS * 3), 3));
    srcPoints = new THREE.Points(spg, srcPointsMat);
    srcPoints.frustumCulled = false;
    disposables.push(spg, srcPointsMat);
    scene.add(srcPoints);

    loadPointsMat = glowMaterial(amberTex, '#fbbf24', 16);
    const lpg = new THREE.BufferGeometry();
    lpg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(LOAD_PATHS.length * LOAD_DOTS_PER_PATH * 3), 3));
    loadPoints = new THREE.Points(lpg, loadPointsMat);
    loadPoints.frustumCulled = false;
    disposables.push(lpg, loadPointsMat);
    scene.add(loadPoints);

    brainPointsMat = glowMaterial(greenTex, '#34d399', 15);
    const bpg = new THREE.BufferGeometry();
    bpg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(BRAIN_PATHS.length * BRAIN_DOTS_PER_PATH * 3), 3));
    brainPoints = new THREE.Points(bpg, brainPointsMat);
    brainPoints.frustumCulled = false;
    disposables.push(bpg, brainPointsMat);
    scene.add(brainPoints);

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
