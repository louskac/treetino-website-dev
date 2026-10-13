<template>
    <div ref="hostRef" class="relative h-full w-full">
        <canvas ref="canvasRef" class="block h-full w-full"></canvas>
    </div>
</template>

<script setup lang="ts">
/**
 * Final scene: Treetino V1 next to a battery container and an EV charger, drawn purely from lines.
 * Energy (amber) flows tree → battery → charger → car along the ground; EURTree (blue) flows back
 * through the air car → charger → battery → tree.
 * - `draw` (0..1) builds the scene in order
 * - `flow` (0..1) fades the flows in
 * - `orbit` (0..1) slowly turns the camera
 */
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { V3 } from './wireKit';
import { batteryContainer, fadingGrid, LineBuilder, lineMaterial, WIRE } from './wireKit';

const props = withDefaults(
    defineProps<{
        draw?: number;
        flow?: number;
        orbit?: number;
        active?: boolean;
    }>(),
    { draw: 1, flow: 1, orbit: 0.5, active: true },
);

const hostRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

// Layout (metres)
const TREE_X = -7.4;
const BATT_X = 0;
const CHARGER: V3 = [5.3, 0, -0.6];
const CAR_X = 7.6;

// ---------------------------------------------------------------------------------------------
// Treetino V1: white trunk → two leaders → lateral branches with pinnate solar leaves,
// plus ribbed egg-shaped vertical-axis wind turbines ("pods") that spin.
// ---------------------------------------------------------------------------------------------
interface Pod {
    base: V3;
    height: number;
}

function curve(a: V3, b: V3, lift: number, n = 8): V3[] {
    const pts: V3[] = [];

    for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * lift, a[2] + (b[2] - a[2]) * t]);
    }

    return pts;
}

function leaf(b: LineBuilder, at: V3, dir: [number, number, number], len: number, wid: number) {
    // dir: unit vector of the leaf axis; width goes in the horizontal plane perpendicular to it
    const side: V3 = [-dir[2], 0, dir[0]];
    const sl = Math.hypot(side[0], side[2]) || 1;
    side[0] /= sl;
    side[2] /= sl;
    const pt = (u: number, v: number): V3 => [
        at[0] + dir[0] * len * u + side[0] * wid * v,
        at[1] + dir[1] * len * u,
        at[2] + dir[2] * len * u + side[2] * wid * v,
    ];
    b.poly([pt(0, 0), pt(0.2, 0.42), pt(0.6, 0.5), pt(0.95, 0.22), pt(1, 0), pt(0.95, -0.22), pt(0.6, -0.5), pt(0.2, -0.42)], WIRE.green, true);
    b.seg(pt(0, 0), pt(0.95, 0), WIRE.green);
}

function lateral(b: LineBuilder, from: V3, angle: number, length: number, rise: number, pods: Pod[], withPod: boolean) {
    const to: V3 = [from[0] + Math.cos(angle) * length, from[1] + rise, from[2] + Math.sin(angle) * length];
    const pts = curve(from, to, length * 0.08, 10);
    b.poly(pts, WIRE.white);

    // pinnate leaflets along the outer two thirds
    const steps = Math.floor((length * 0.7) / 0.17);

    for (let i = 0; i <= steps; i++) {
        const t = 0.3 + (i / Math.max(1, steps)) * 0.7;
        const idx = Math.min(pts.length - 1, Math.round(t * (pts.length - 1)));
        const p = pts[idx];

        for (const s of [-1, 1]) {
            const a = angle + s * 1.05;
            leaf(b, p, [Math.cos(a) * 0.93, 0.36, Math.sin(a) * 0.93], 0.32, 0.1);
        }
    }

    leaf(b, to, [Math.cos(angle) * 0.95, 0.3, Math.sin(angle) * 0.95], 0.34, 0.1);

    if (withPod) {
        const mid = pts[Math.round(pts.length * 0.35)];
        const top: V3 = [mid[0], mid[1] + 0.25, mid[2]];
        b.seg(mid, top, WIRE.white);
        pods.push({ base: top, height: 0.78 });
    }
}

function treetinoV1(): { body: LineBuilder; pods: Pod[] } {
    const b = new LineBuilder();
    const pods: Pod[] = [];

    // foundation
    b.circle([0, 0, 0], 0.75, 'y', WIRE.ground, 24);

    // trunk (flared base, 8 longitudinal lines + rings)
    const radius = (y: number) => 0.15 + 0.22 * Math.exp(-y * 3.2);
    const heights = [0, 0.1, 0.25, 0.5, 0.9, 1.4, 2.0];

    for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        b.poly(
            heights.map((y) => [Math.cos(a) * radius(y), y, Math.sin(a) * radius(y)] as V3),
            WIRE.white,
        );
    }

    for (const y of [0, 0.6, 1.3, 2.0]) {
        b.circle([0, y, 0], radius(y), 'y', WIRE.frame, 12);
    }

    // two leaders
    const split: V3 = [0, 2.0, 0];
    const leaders: { tip: V3; tiers: number[] }[] = [
        { tip: [-0.75, 4.3, 0.25], tiers: [0.45, 0.78] },
        { tip: [0.8, 5.0, -0.2], tiers: [0.4, 0.7] },
    ];

    // wide low tier right at the split, radiating out
    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2 + 0.3;
        lateral(b, [split[0], split[1] + 0.1 + (i % 2) * 0.15, split[2]], a, 2.1 + (i % 3) * 0.25, 0.25, pods, i % 2 === 0);
    }

    leaders.forEach((leader, li) => {
        const pts = curve(split, leader.tip, 0.15, 10);
        b.poly(pts, WIRE.white);
        // second line for a bit of thickness
        b.poly(
            pts.map(([x, y, z]) => [x + 0.06, y, z + 0.04] as V3),
            WIRE.frame,
        );

        leader.tiers.forEach((t, ti) => {
            const p = pts[Math.round(t * (pts.length - 1))];

            for (let k = 0; k < 3; k++) {
                const a = (k / 3) * Math.PI * 2 + li * 1.1 + ti * 0.6;
                lateral(b, p, a, 1.25 + ti * 0.15 - k * 0.1, 0.35, pods, k === 0);
            }
        });

        // pod on top of each leader
        const tip = pts[pts.length - 1];
        const top: V3 = [tip[0], tip[1] + 0.2, tip[2]];
        b.seg(tip, top, WIRE.white);
        pods.push({ base: top, height: 0.9 });
    });

    // pod cups (static)
    for (const pod of pods) {
        const [x, y, z] = pod.base;
        b.circle([x, y, z], 0.07, 'y', WIRE.white, 10);
        b.circle([x, y + 0.12, z], 0.13, 'y', WIRE.white, 12);

        for (let i = 0; i < 4; i++) {
            const a = (i / 4) * Math.PI * 2;
            b.seg([x + Math.cos(a) * 0.07, y, z + Math.sin(a) * 0.07], [x + Math.cos(a) * 0.13, y + 0.12, z + Math.sin(a) * 0.13], WIRE.white);
        }
    }

    return { body: b, pods };
}

/** Ribbed egg-shaped turbine, origin at its bottom */
function podLines(height: number): LineBuilder {
    const b = new LineBuilder();
    const rMax = height * 0.31;
    const ribs = 10;
    const n = 14;
    const r = (s: number) => rMax * Math.sin(Math.PI * s) ** 0.75 * (1 - 0.18 * s);

    for (let i = 0; i < ribs; i++) {
        const a = (i / ribs) * Math.PI * 2;
        const pts: V3[] = [];

        for (let k = 0; k <= n; k++) {
            const s = k / n;
            pts.push([Math.cos(a) * r(s), 0.12 + s * height, Math.sin(a) * r(s)]);
        }

        b.poly(pts, i % 2 ? WIRE.frame : WIRE.white);
    }

    for (const s of [0.3, 0.55]) {
        b.circle([0, 0.12 + s * height, 0], r(s), 'y', WIRE.skin, 20);
    }

    return b;
}

// ---------------------------------------------------------------------------------------------
function chargerAndCar(b: LineBuilder) {
    const [cx, , cz] = CHARGER;
    // charger pillar
    b.box([cx - 0.3, 0, cz - 0.2], [cx + 0.3, 1.9, cz + 0.2], WIRE.frame);
    b.roundRect(cx, 1.45, 0.4, 0.3, 0.05, cz + 0.21, WIRE.green, 3);
    b.roundRect(cx, 0.95, 0.18, 0.18, 0.04, cz + 0.21, WIRE.detail, 3);
    b.box([cx - 0.4, -0.08, cz - 0.3], [cx + 0.4, 0, cz + 0.3], WIRE.ground);

    // car parked nose-in next to the charger (long axis along z)
    const profile: [number, number][] = [
        [-2.3, 0.38],
        [-2.32, 0.75],
        [-2.05, 0.95],
        [-1.05, 1.05],
        [-0.45, 1.45],
        [0.85, 1.45],
        [1.55, 1.02],
        [2.2, 0.88],
        [2.3, 0.55],
        [2.25, 0.38],
    ];
    const halfW = 0.9;
    const at = (z: number, y: number, x: number): V3 => [CAR_X + x, y, cz + 0.3 + z];

    for (const sx of [-halfW, halfW]) {
        b.poly(profile.map(([z, y]) => at(z, y, sx)), WIRE.white);
        // underside with wheel arches
        b.seg(at(-2.25, 0.38, sx), at(-1.85, 0.38, sx), WIRE.white);
        b.seg(at(-0.95, 0.38, sx), at(0.95, 0.38, sx), WIRE.white);
        b.seg(at(1.85, 0.38, sx), at(2.25, 0.38, sx), WIRE.white);
        // windows
        b.poly(
            [at(-0.95, 1.06, sx), at(-0.4, 1.38, sx), at(0.8, 1.38, sx), at(1.38, 1.04, sx)],
            WIRE.detail,
            true,
        );

        // wheels
        for (const wz of [-1.4, 1.4]) {
            b.circle(at(wz, 0.36, sx), 0.36, 'x', WIRE.frame, 18);
            b.circle(at(wz, 0.36, sx), 0.18, 'x', WIRE.skin, 12);
        }
    }

    for (const [z, y] of profile) {
        b.seg(at(z, y, -halfW), at(z, y, halfW), WIRE.skin);
    }

    // charging cable charger → car flank
    const cable: V3[] = [];

    for (let k = 0; k <= 10; k++) {
        const t = k / 10;
        cable.push([cx + 0.3 + t * (CAR_X - halfW - cx - 0.3), 1.0 - Math.sin(t * Math.PI) * 0.55 + t * 0.0, cz + t * 0.6]);
    }

    b.poly(cable, WIRE.amber);
}

// ---------------------------------------------------------------------------------------------
// Flows
// ---------------------------------------------------------------------------------------------
const ENERGY_PATH: V3[] = [
    [TREE_X + 0.3, 0.06, 0.3],
    [TREE_X + 1.8, 0.06, 1.75],
    [BATT_X - 2.6, 0.06, 1.75],
    [BATT_X - 2.6, 0.06, 1.3],
    [BATT_X + 2.6, 0.06, 1.3],
    [BATT_X + 2.6, 0.06, 1.75],
    [CHARGER[0], 0.06, 1.75],
    [CHARGER[0], 0.06, CHARGER[2] + 0.3],
];

function arc(a: V3, b: V3, h: number, n = 24): V3[] {
    const pts: V3[] = [];

    for (let i = 0; i <= n; i++) {
        const t = i / n;
        pts.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + Math.sin(t * Math.PI) * h, a[2] + (b[2] - a[2]) * t]);
    }

    return pts;
}

const MONEY_ARCS: V3[][] = [
    arc([CAR_X, 1.6, CHARGER[2] + 0.3], [BATT_X + 2.2, 2.75, 0], 1.6),
    arc([BATT_X - 2.2, 2.75, 0], [TREE_X + 0.5, 4.2, 0], 2.0),
];

function samplePolyline(pts: V3[], t: number): V3 {
    const lens: number[] = [0];

    for (let i = 1; i < pts.length; i++) {
        lens.push(lens[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1], pts[i][2] - pts[i - 1][2]));
    }

    const target = t * lens[lens.length - 1];
    let i = 1;

    while (i < lens.length - 1 && lens[i] < target) {
        i++;
    }

    const k = (target - lens[i - 1]) / (lens[i] - lens[i - 1] || 1);

    return [
        pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * k,
        pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * k,
        pts[i - 1][2] + (pts[i][2] - pts[i - 1][2]) * k,
    ];
}

function spriteTexture(ring: boolean): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);

    if (ring) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.arc(32, 32, 20, 0, Math.PI * 2);
        ctx.stroke();
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(32, 32, 9, 0, Math.PI * 2);
        ctx.stroke();
        g.addColorStop(0, 'rgba(255,255,255,0.35)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
    } else {
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.25, 'rgba(255,255,255,0.9)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
    }

    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);

    return new THREE.CanvasTexture(c);
}

// ---------------------------------------------------------------------------------------------
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let staticLines: THREE.LineSegments;
let staticTotal = 0;
let lineMat: THREE.LineBasicMaterial;
let grid: THREE.LineSegments;
const podMeshes: THREE.LineSegments[] = [];
let energyPoints: THREE.Points;
let moneyPoints: THREE.Points;
let energyMat: THREE.PointsMaterial;
let moneyMat: THREE.PointsMaterial;
const disposables: { dispose: () => void }[] = [];
const ENERGY_COUNT = 26;
const MONEY_PER_ARC = 7;
const center = new THREE.Vector3(-0.6, 1.9, 0);
let raf = 0;
let resizeObserver: ResizeObserver | null = null;

function resize() {
    const host = hostRef.value;

    if (!host || !renderer) {
        return;
    }

    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    camera.userData.distance = Math.max(10.6 / (tanV * camera.aspect), 3.8 / tanV);
    camera.updateProjectionMatrix();
}

function frame(time: number) {
    raf = requestAnimationFrame(frame);

    if (!renderer || !props.active) {
        return;
    }

    const draw = Math.min(1, Math.max(0, props.draw));
    staticLines.geometry.setDrawRange(0, Math.floor((staticTotal / 2) * Math.min(1, draw / 0.85)) * 2);
    (grid.material as THREE.LineBasicMaterial).opacity = 0.5 * Math.min(1, draw * 3);
    const podOn = Math.min(1, Math.max(0, (draw - 0.75) / 0.2));

    podMeshes.forEach((m, i) => {
        m.visible = podOn > 0;
        m.scale.setScalar(Math.max(0.001, podOn));
        m.rotation.y = time * 0.0012 * (i % 2 ? 1 : -1) + i;
    });

    // flows
    const flow = Math.min(1, Math.max(0, props.flow));
    energyMat.opacity = flow;
    moneyMat.opacity = flow;

    if (flow > 0) {
        const ep = energyPoints.geometry.getAttribute('position') as THREE.BufferAttribute;

        for (let i = 0; i < ENERGY_COUNT; i++) {
            const t = (i / ENERGY_COUNT + time * 0.00009) % 1;
            ep.setXYZ(i, ...samplePolyline(ENERGY_PATH, t));
        }

        ep.needsUpdate = true;
        const mp = moneyPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
        let k = 0;

        for (const pts of MONEY_ARCS) {
            for (let i = 0; i < MONEY_PER_ARC; i++) {
                const t = (i / MONEY_PER_ARC + time * 0.00012) % 1;
                mp.setXYZ(k++, ...samplePolyline(pts, t));
            }
        }

        mp.needsUpdate = true;
    }

    const az = -0.32 + props.orbit * 0.28 + Math.sin(time * 0.00022) * 0.03;
    const el = 0.26;
    const dist = (camera.userData.distance as number) ?? 30;
    camera.position.set(
        center.x + Math.sin(az) * Math.cos(el) * dist,
        center.y + Math.sin(el) * dist,
        center.z + Math.cos(az) * Math.cos(el) * dist,
    );
    camera.lookAt(center);
    renderer.render(scene, camera);
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
    camera = new THREE.PerspectiveCamera(28, 1, 0.1, 500);
    lineMat = lineMaterial();
    disposables.push(lineMat);

    // static scene, in drawing order
    const b = new LineBuilder();
    // energy conduits on the ground
    b.poly(ENERGY_PATH, WIRE.amber.clone().multiplyScalar(0.45));
    // battery
    const batt = batteryContainer(1);

    for (let i = 0; i < batt.positions.length; i += 3) {
        b.positions.push(batt.positions[i] + BATT_X, batt.positions[i + 1], batt.positions[i + 2]);
    }

    b.colors.push(...batt.colors);
    // tree
    const tree = treetinoV1();

    for (let i = 0; i < tree.body.positions.length; i += 3) {
        b.positions.push(tree.body.positions[i] + TREE_X, tree.body.positions[i + 1], tree.body.positions[i + 2]);
    }

    b.colors.push(...tree.body.colors);
    // charger + car
    chargerAndCar(b);
    // money arcs (faint guides)
    MONEY_ARCS.forEach((pts) => b.poly(pts, WIRE.skin.clone().multiplyScalar(0.4)));

    const g = b.geometry();
    disposables.push(g);
    staticLines = new THREE.LineSegments(g, lineMat);
    staticTotal = b.vertexCount;
    scene.add(staticLines);

    // spinning turbine pods
    for (const pod of tree.pods) {
        const pg = podLines(pod.height).geometry();
        disposables.push(pg);
        const m = new THREE.LineSegments(pg, lineMat);
        m.position.set(pod.base[0] + TREE_X, pod.base[1], pod.base[2]);
        scene.add(m);
        podMeshes.push(m);
    }

    grid = fadingGrid(16, 1.2);
    grid.position.set(center.x, -0.16, 0);
    disposables.push(grid.geometry, grid.material as THREE.Material);
    scene.add(grid);

    // flow particles
    const dotTex = spriteTexture(false);
    const ringTex = spriteTexture(true);
    disposables.push(dotTex, ringTex);
    energyMat = new THREE.PointsMaterial({
        map: dotTex,
        color: '#fbbf24',
        size: 16,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    moneyMat = new THREE.PointsMaterial({
        map: ringTex,
        color: '#7cb8ff',
        size: 26,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    disposables.push(energyMat, moneyMat);
    const eg = new THREE.BufferGeometry();
    eg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(ENERGY_COUNT * 3), 3));
    const mg = new THREE.BufferGeometry();
    mg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MONEY_ARCS.length * MONEY_PER_ARC * 3), 3));
    disposables.push(eg, mg);
    energyPoints = new THREE.Points(eg, energyMat);
    moneyPoints = new THREE.Points(mg, moneyMat);
    energyPoints.frustumCulled = false;
    moneyPoints.frustumCulled = false;
    scene.add(energyPoints, moneyPoints);

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
