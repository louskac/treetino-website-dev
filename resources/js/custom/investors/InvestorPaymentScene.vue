<template>
    <div ref="hostRef" class="relative h-full w-full">
        <canvas ref="canvasRef" class="block h-full w-full"></canvas>

        <!-- Callouts pinned to 3D anchors -->
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
 * Chapter 04 · 3D wireframe scene for the hardware EV charger payment gate:
 * - `tap`    draws the payment gate + parked EV, animates a contactless card tapping the terminal,
 *            pulses the NFC reader and streams 22 kW into the car
 * - `settle` reveals the Treetino V1 tree and streams instant settlement from the payment terminal
 *            back to the tree owner in under 2 seconds
 * - `scale`  reveals flanking payment-gate bays to show commercial multi-bay rollout
 */
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { V3 } from '@/custom/web3/wireKit';
import { fadingGrid, LineBuilder, lineMaterial, podLines, treetinoV2Hybrid, WIRE } from '@/custom/web3/wireKit';
import { arcPoints, cardLines, carLines, chargerPillar, contactless, dim, glowMaterial, glowTexture, mergeInto, Path } from './sceneKit';
import { clamp01 } from './tokens';

const props = withDefaults(
    defineProps<{
        tap?: number;
        settle?: number;
        scale?: number;
        orbit?: number;
        active?: boolean;
    }>(),
    {
        tap: 1,
        settle: 0,
        scale: 0,
        orbit: 0,
        active: true,
    },
);

const TREE_X = -4.25;
const V2_SCALE = 1.18;
const GATE_POS: V3 = [1.55, 0, 0.45];
const CAR_POS: V3 = [4.05, 0, 0.75];
const BAY_LEFT: V3 = [0.2, 0, -1.55];
const BAY_RIGHT: V3 = [2.9, 0, -1.55];
const SCALE_GATE = 1.25;

// Reader world position on the front face of the primary payment gate
const READER_POS: V3 = [GATE_POS[0], 1.12 * SCALE_GATE, GATE_POS[2] + 0.175 * SCALE_GATE + 0.02];

const CABLE_PATH = new Path(
    Array.from({ length: 14 }, (_, k) => {
        const t = k / 13;

        return [
            GATE_POS[0] + 0.32 + t * (CAR_POS[0] - 0.85 - GATE_POS[0] - 0.32),
            0.92 - Math.sin(t * Math.PI) * 0.45,
            GATE_POS[2] + t * (CAR_POS[2] - GATE_POS[2]),
        ] as V3;
    }),
);

const ENERGY_FEED = new Path([
    [TREE_X + 0.25, 0.05, 0.25],
    [TREE_X + 1.45, 0.05, 1.35],
    [GATE_POS[0], 0.05, 1.35],
    [GATE_POS[0], 0.05, GATE_POS[2] + 0.2],
]);

const SETTLE_ARC_MAIN = arcPoints([GATE_POS[0], 1.95 * SCALE_GATE, GATE_POS[2]], [TREE_X, 3.25, 0], 1.85, 32);
const SETTLE_ARC_L = arcPoints([BAY_LEFT[0], 2.0, BAY_LEFT[2]], [TREE_X, 3.25, 0], 1.65, 28);
const SETTLE_ARC_R = arcPoints([BAY_RIGHT[0], 2.0, BAY_RIGHT[2]], [TREE_X, 3.25, 0], 1.95, 28);

const SETTLE_PATHS = [new Path(SETTLE_ARC_MAIN), new Path(SETTLE_ARC_L), new Path(SETTLE_ARC_R)];

interface CalloutDef {
    value: string;
    title: string;
    anchor: THREE.Vector3;
    dir: 'up' | 'down';
    tone?: 'blue' | 'green';
}

const callouts: CalloutDef[] = [
    {
        value: 'CZK · EUR',
        title: 'Tap card or Apple Pay',
        anchor: new THREE.Vector3(GATE_POS[0], 1.95 * SCALE_GATE + 0.18, GATE_POS[2]),
        dir: 'up',
        tone: 'green',
    },
    {
        value: '<2 s',
        title: 'Instant payout to owner',
        anchor: new THREE.Vector3(-1.05, 4.35, 0.1),
        dir: 'up',
        tone: 'green',
    },
    {
        value: 'Treetino V2 · 5 m',
        title: 'Compact solar disc + 6× turbines',
        anchor: new THREE.Vector3(TREE_X, 0.02, 0.92),
        dir: 'down',
    },
    {
        value: 'Multi-bay',
        title: 'Licensed EU hardware',
        anchor: new THREE.Vector3(GATE_POS[0], 2.55, -0.55),
        dir: 'up',
        tone: 'green',
    },
];

const hostRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const calloutEls: (HTMLElement | null)[] = [];

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let gateMesh: THREE.LineSegments;
let gateCount = 0;
let gateMat: THREE.LineBasicMaterial;
let cardGroup: THREE.Object3D;
let cardMat: THREE.LineBasicMaterial;
let nfcRing: THREE.LineSegments;
let nfcRingMat: THREE.LineBasicMaterial;
let settleMesh: THREE.LineSegments;
let settleCount = 0;
let settleMat: THREE.LineBasicMaterial;
let scaleMesh: THREE.LineSegments;
let scaleCount = 0;
let scaleMat: THREE.LineBasicMaterial;
let grid: THREE.LineSegments;
let cablePoints: THREE.Points;
let cablePointsMat: THREE.PointsMaterial;
let groundPoints: THREE.Points;
let groundPointsMat: THREE.PointsMaterial;
let settlePoints: THREE.Points;
let settlePointsMat: THREE.PointsMaterial;
const podMeshes: THREE.LineSegments[] = [];
const disposables: { dispose: () => void }[] = [];
const center = new THREE.Vector3(0, 1.5, 0);
const tmp = new THREE.Vector3();
let raf = 0;
let resizeObserver: ResizeObserver | null = null;
let hostW = 1;
let hostH = 1;

const CABLE_DOTS = 10;
const GROUND_DOTS = 16;
const SETTLE_DOTS_PER_ARC = 9;

function resize() {
    const host = hostRef.value;

    if (!host || !renderer) {
        return;
    }

    hostW = host.clientWidth || 1;
    hostH = host.clientHeight || 1;
    renderer.setSize(hostW, hostH, false);
    camera.aspect = hostW / hostH;
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

    const tap = clamp01(props.tap);
    const settle = clamp01(props.settle);
    const scl = clamp01(props.scale);

    // 1 · Primary payment gate + EV car draw in
    gateMesh.geometry.setDrawRange(0, Math.floor((gateCount / 2) * clamp01(tap / 0.65)) * 2);
    (grid.material as THREE.LineBasicMaterial).opacity = 0.48 * clamp01(tap * 2.5);

    // Contactless card glides toward reader and taps repeatedly
    const cardShow = clamp01((tap - 0.45) / 0.4);
    cardMat.opacity = 0.95 * cardShow;
    cardGroup.visible = cardShow > 0.01;
    const tapOsc = Math.sin(time * 0.003) * 0.5 + 0.5;
    const cardDist = (1 - cardShow) * 0.95 + tapOsc * 0.14;
    cardGroup.position.set(READER_POS[0] - 0.18 * cardDist, READER_POS[1] - 0.05 * cardDist, READER_POS[2] + 0.22 + cardDist * 0.55);
    cardGroup.rotation.set(-0.18 + cardDist * 0.25, -0.28, 0.08);

    // NFC ripple on the terminal reader
    const ripple = (time * 0.0012) % 1;
    nfcRing.visible = cardShow > 0.2;
    nfcRing.scale.setScalar(0.65 + ripple * 1.6);
    nfcRingMat.opacity = cardShow * (1 - ripple) * 0.85;

    // 2 · Settlement: tree + ground conduit + overhead payout arc
    settleMesh.geometry.setDrawRange(0, Math.floor((settleCount / 2) * clamp01(settle / 0.75)) * 2);
    settleMesh.visible = settle > 0.005;
    const podOn = clamp01((settle - 0.45) / 0.4);

    podMeshes.forEach((m, i) => {
        m.visible = podOn > 0;
        m.scale.setScalar(Math.max(0.001, podOn));
        m.rotation.y = time * 0.0014 * (i % 2 ? 1 : -1) + i;
    });

    // 3 · Multi-bay scale-out
    scaleMesh.geometry.setDrawRange(0, Math.floor((scaleCount / 2) * scl) * 2);
    scaleMesh.visible = scl > 0.005;

    // 4 · Particles: cable charging, ground energy, overhead instant payout
    const cableFlow = clamp01((tap - 0.55) / 0.4);
    cablePointsMat.opacity = cableFlow;

    if (cableFlow > 0.01) {
        const attr = cablePoints.geometry.getAttribute('position') as THREE.BufferAttribute;

        for (let i = 0; i < CABLE_DOTS; i++) {
            const t = (i / CABLE_DOTS + time * 0.00032) % 1;
            CABLE_PATH.at(t, tmp);
            attr.setXYZ(i, tmp.x, tmp.y, tmp.z);
        }

        attr.needsUpdate = true;
    }

    const groundFlow = clamp01((settle - 0.4) / 0.5);
    groundPointsMat.opacity = groundFlow;

    if (groundFlow > 0.01) {
        const attr = groundPoints.geometry.getAttribute('position') as THREE.BufferAttribute;

        for (let i = 0; i < GROUND_DOTS; i++) {
            const t = (i / GROUND_DOTS + time * 0.00022) % 1;
            ENERGY_FEED.at(t, tmp);
            attr.setXYZ(i, tmp.x, tmp.y, tmp.z);
        }

        attr.needsUpdate = true;
    }

    const settleFlow = clamp01((settle - 0.35) / 0.5);
    settlePointsMat.opacity = settleFlow;

    if (settleFlow > 0.01) {
        const attr = settlePoints.geometry.getAttribute('position') as THREE.BufferAttribute;
        const activeArcs = scl > 0.45 ? 3 : 1;
        let k = 0;

        for (let a = 0; a < SETTLE_PATHS.length; a++) {
            const path = SETTLE_PATHS[a];

            for (let i = 0; i < SETTLE_DOTS_PER_ARC; i++) {
                if (a >= activeArcs) {
                    attr.setXYZ(k++, 0, -999, 0);
                    continue;
                }

                const t = (i / SETTLE_DOTS_PER_ARC + time * 0.00034 + a * 0.17) % 1;
                path.at(t, tmp);
                attr.setXYZ(k++, tmp.x, tmp.y, tmp.z);
            }
        }

        attr.needsUpdate = true;
    }

    // 5 · Camera transitions smoothly from close-up on the payment gate to the full tree↔gate loop
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const isPortrait = hostW < 640 || hostW < hostH;
    const pullBack = clamp01(settle * 0.85 + scl * 0.15);

    const focusX = 2.45 + (-0.35 - 2.45) * pullBack;
    const focusY = 1.28 + (1.65 - 1.28) * pullBack;
    const focusZ = 0.55 * (1 - pullBack);
    center.set(focusX, focusY, focusZ);

    const closeSpanW = isPortrait ? 3.2 : 3.4;
    const wideSpanW = isPortrait ? 7.6 : 7.8;
    const spanW = closeSpanW + (wideSpanW - closeSpanW) * pullBack;
    const spanH = 2.1 + (4.2 - 2.1) * pullBack;
    const dist = Math.max(spanW / (tanV * camera.aspect), spanH / tanV);

    const az = -0.18 + props.orbit * 0.38 + Math.sin(time * 0.00022) * 0.025;
    const el = 0.18 + pullBack * 0.09;
    camera.position.set(
        center.x + Math.sin(az) * Math.cos(el) * dist,
        center.y + Math.sin(el) * dist,
        center.z + Math.cos(az) * Math.cos(el) * dist,
    );
    camera.lookAt(center);
    camera.updateMatrixWorld();

    renderer.render(scene, camera);

    // 6 · HTML callouts (each beat shows its own callouts; V2 label stays visible once the tree is revealed)
    const tapOp = clamp01((tap - 0.55) / 0.35) * (1 - clamp01(settle * 2.2));
    const settleOp = clamp01((settle - 0.45) / 0.4) * (1 - clamp01(scl * 2.2));
    const v2Op = clamp01((settle - 0.45) / 0.4);
    const scaleOp = clamp01((scl - 0.45) / 0.45);

    placeCallout(calloutEls[0], callouts[0].anchor, tapOp, callouts[0].dir === 'up');
    placeCallout(calloutEls[1], callouts[1].anchor, settleOp, callouts[1].dir === 'up');
    placeCallout(calloutEls[2], callouts[2].anchor, v2Op, callouts[2].dir === 'up');
    placeCallout(calloutEls[3], callouts[3].anchor, scaleOp, callouts[3].dir === 'up');
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

    gateMat = lineMaterial();
    cardMat = lineMaterial();
    settleMat = lineMaterial();
    scaleMat = lineMaterial();
    disposables.push(gateMat, cardMat, settleMat, scaleMat);

    // --- Group 1: Primary payment gate + NFC details + charging cable + EV car ---
    const gb = new LineBuilder();
    mergeInto(gb, chargerPillar(SCALE_GATE, WIRE.green), GATE_POS, 1);
    contactless(gb, READER_POS[0], READER_POS[1], READER_POS[2], 0.11, WIRE.green);
    gb.poly(CABLE_PATH.pts, WIRE.amber);
    mergeInto(gb, carLines(0.92), CAR_POS, 1);

    const gg = gb.geometry();
    disposables.push(gg);
    gateMesh = new THREE.LineSegments(gg, gateMat);
    gateCount = gb.vertexCount;
    scene.add(gateMesh);

    // Floating bank card
    const cb = cardLines(0.42);
    const cg = cb.geometry();
    disposables.push(cg);
    const cardMesh = new THREE.LineSegments(cg, cardMat);
    cardGroup = new THREE.Object3D();
    cardGroup.add(cardMesh);
    scene.add(cardGroup);

    // NFC pulse ring on reader
    const nrb = new LineBuilder();
    nrb.circle([0, 0, 0], 0.16, 'z', WIRE.green, 28);
    const nrg = nrb.geometry();
    nfcRingMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    nfcRing = new THREE.LineSegments(nrg, nfcRingMat);
    nfcRing.position.set(READER_POS[0], READER_POS[1], READER_POS[2] + 0.01);
    disposables.push(nrg, nfcRingMat);
    scene.add(nfcRing);

    // --- Group 2: Treetino V2 Hybrid + ground feed + instant settlement arc ---
    const sb = new LineBuilder();
    const tree = treetinoV2Hybrid();
    mergeInto(sb, tree.body, [TREE_X, 0, 0], V2_SCALE);
    sb.poly(ENERGY_FEED.pts, dim(WIRE.amber, 0.5));
    sb.poly(SETTLE_ARC_MAIN, WIRE.green);

    const sg = sb.geometry();
    disposables.push(sg);
    settleMesh = new THREE.LineSegments(sg, settleMat);
    settleCount = sb.vertexCount;
    scene.add(settleMesh);

    for (const pod of tree.pods) {
        const pg = podLines(pod.height * V2_SCALE).geometry();
        disposables.push(pg);
        const m = new THREE.LineSegments(pg, settleMat);
        m.position.set(pod.base[0] * V2_SCALE + TREE_X, pod.base[1] * V2_SCALE, pod.base[2] * V2_SCALE);
        scene.add(m);
        podMeshes.push(m);
    }

    // --- Group 3: Flanking payment-gate bays for commercial rollout ---
    const scb = new LineBuilder();
    mergeInto(scb, chargerPillar(1.05, WIRE.green), BAY_LEFT, 1);
    mergeInto(scb, chargerPillar(1.05, WIRE.green), BAY_RIGHT, 1);

    // Parking bay markings
    for (const bx of [BAY_LEFT[0], GATE_POS[0], BAY_RIGHT[0]]) {
        scb.poly(
            [
                [bx - 0.55, 0.01, -2.1],
                [bx + 0.55, 0.01, -2.1],
                [bx + 0.55, 0.01, -0.9],
                [bx - 0.55, 0.01, -0.9],
            ],
            WIRE.ground,
            true,
        );
    }

    scb.poly(SETTLE_ARC_L, dim(WIRE.green, 0.7));
    scb.poly(SETTLE_ARC_R, dim(WIRE.green, 0.7));

    const scg = scb.geometry();
    disposables.push(scg);
    scaleMesh = new THREE.LineSegments(scg, scaleMat);
    scaleCount = scb.vertexCount;
    scene.add(scaleMesh);

    // --- Floor grid ---
    grid = fadingGrid(13, 1.0);
    grid.position.set(0, -0.14, 0);
    disposables.push(grid.geometry, grid.material as THREE.Material);
    scene.add(grid);

    // --- Particles ---
    const amberTex = glowTexture();
    const greenTex = glowTexture('rgba(167,243,208,0.95)', 'rgba(52,211,153,0.45)', 'rgba(52,211,153,0)');
    disposables.push(amberTex, greenTex);

    cablePointsMat = glowMaterial(amberTex, '#fbbf24', 18);
    const cpg = new THREE.BufferGeometry();
    cpg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(CABLE_DOTS * 3), 3));
    cablePoints = new THREE.Points(cpg, cablePointsMat);
    cablePoints.frustumCulled = false;
    disposables.push(cpg, cablePointsMat);
    scene.add(cablePoints);

    groundPointsMat = glowMaterial(amberTex, '#fbbf24', 15);
    const gpg = new THREE.BufferGeometry();
    gpg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(GROUND_DOTS * 3), 3));
    groundPoints = new THREE.Points(gpg, groundPointsMat);
    groundPoints.frustumCulled = false;
    disposables.push(gpg, groundPointsMat);
    scene.add(groundPoints);

    settlePointsMat = glowMaterial(greenTex, '#34d399', 18);
    const spg = new THREE.BufferGeometry();
    spg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(SETTLE_PATHS.length * SETTLE_DOTS_PER_ARC * 3), 3));
    settlePoints = new THREE.Points(spg, settlePointsMat);
    settlePoints.frustumCulled = false;
    disposables.push(spg, settlePointsMat);
    scene.add(settlePoints);

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
