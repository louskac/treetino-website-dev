<template>
    <div ref="hostRef" class="relative h-full w-full">
        <canvas ref="canvasRef" class="block h-full w-full"></canvas>
    </div>
</template>

<script setup lang="ts">
/**
 * Final scene: Treetino Energy Tree (V1, V2 Solar Disc, or V2 Hybrid) next to a battery container and an EV charger, drawn purely from lines.
 * Energy (amber) flows tree → battery → charger → car along the ground; EURTree (blue) flows back
 * through the air car → charger → battery → tree.
 * - `draw` (0..1) builds the scene in order
 * - `flow` (0..1) fades the flows in
 * - `orbit` (0..1) slowly turns the camera
 * - `treeVariant` ('v1' | 'v2-solar' | 'v2-hybrid') selects between Treetino V1 (12× VTE), V2 Solar Disc (without-turbines), and V2 Hybrid (6× VTE)
 *
 * AI / DEVELOPER NOTE:
 * The 3D wireframe tree builders (`treetinoV1`, `treetinoV2`, `treetinoV2Solar`, `treetinoV2Hybrid`, `treetinoTree`, `podLines`)
 * are defined and exported in `./wireKit.ts` so they can be imported and rendered in any component across the app.
 */
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import type { TreeVariant, V3 } from './wireKit';
import { batteryContainer, fadingGrid, LineBuilder, lineMaterial, podLines, treetinoTree, WIRE } from './wireKit';

const props = withDefaults(
    defineProps<{
        draw?: number;
        flow?: number;
        orbit?: number;
        active?: boolean;
        /** Tree model variant: `'v1'` (default, 12× VTE candelabra), `'v2-solar'` (tilted solar leaf disc), or `'v2-hybrid'` (tilted solar disc + 6× VTE) */
        treeVariant?: TreeVariant;
    }>(),
    { draw: 1, flow: 1, orbit: 0.5, active: true, treeVariant: 'v1' },
);

const hostRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

// Layout (metres)
const TREE_X = -6.85;
const BATT_X = 0;
const CHARGER: V3 = [5.3, 0, -0.6];
const CAR_X = 7.6;

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

const FUNNEL_POS: V3 = [2.55, 3.05, 0];

// Minted EURTree stablecoin arc emerging from the bottom spout of the funnel into the Tree (investors)
const STABLE_ARC: V3[] = arc([FUNNEL_POS[0] - 0.25, FUNNEL_POS[1] - 0.42, 0], [TREE_X + 0.5, 4.1, 0], 1.95, 32);

// Guide streams feeding from the Car & Charger up to the Funnel lip
const FIAT_FEED_GUIDES: V3[][] = [
    arc([CAR_X, 1.45, CHARGER[2] + 0.3], [FUNNEL_POS[0] + 0.75, FUNNEL_POS[1] + 0.85, 0.1], 1.15, 20),
    arc([CHARGER[0], 1.45, CHARGER[2] + 0.21], [FUNNEL_POS[0] + 0.45, FUNNEL_POS[1] + 0.85, -0.15], 0.85, 20),
];

/**
 * 3D wireframe On-Ramp Funnel:
 * Wide emerald-green top mouth where Fiat (€) pours in, tapering down to a blue EURTree mint spout.
 */
function onRampFunnel(): { staticPart: LineBuilder; rotorPart: LineBuilder } {
    const s = new LineBuilder();
    const r = new LineBuilder();
    const green = new THREE.Color('#34d399');
    const midColor = new THREE.Color('#a7f3d0');
    const blue = new THREE.Color('#60a5fa');

    // Funnel profile: u = 0 (top mouth, dy = +0.85, rad = 1.08) -> u = 1 (bottom spout, dy = -0.45, rad = 0.22)
    const profileRadius = (u: number) => 0.22 + 0.86 * Math.pow(1 - u, 1.65);
    const profileY = (u: number) => 0.85 - u * 1.3;

    // Horizontal rings along the funnel height
    const ringSteps = [
        { u: 0.0, col: green, segs: 32 },
        { u: 0.28, col: green.clone().lerp(midColor, 0.5), segs: 28 },
        { u: 0.58, col: WIRE.white, segs: 24 },
        { u: 0.82, col: blue.clone().lerp(WIRE.white, 0.3), segs: 20 },
        { u: 1.0, col: blue, segs: 20 },
    ];

    for (const st of ringSteps) {
        s.circle([0, profileY(st.u), 0], profileRadius(st.u), 'y', st.col, st.segs);
    }

    // 12 curved meridian ribs from top lip to bottom spout
    const ribs = 12;
    const steps = 12;

    for (let i = 0; i < ribs; i++) {
        const a = (i / ribs) * Math.PI * 2;
        const ca = Math.cos(a);
        const sa = Math.sin(a);

        for (let k = 0; k < steps; k++) {
            const u0 = k / steps;
            const u1 = (k + 1) / steps;
            const p0: V3 = [ca * profileRadius(u0), profileY(u0), sa * profileRadius(u0)];
            const p1: V3 = [ca * profileRadius(u1), profileY(u1), sa * profileRadius(u1)];
            const col = u0 < 0.45 ? green : u0 < 0.72 ? WIRE.white : blue;
            s.seg(p0, p1, col);
        }
    }

    // Spinning inner vortex ring inside the funnel throat
    r.circle([0, 0.15, 0], 0.52, 'y', green, 18);
    r.circle([0, -0.18, 0], 0.34, 'y', blue, 18);

    for (let i = 0; i < 6; i++) {
        const a = (i / 6) * Math.PI * 2;
        r.seg(
            [Math.cos(a) * 0.52, 0.15, Math.sin(a) * 0.52],
            [Math.cos(a + 0.5) * 0.34, -0.18, Math.sin(a + 0.5) * 0.34],
            WIRE.white,
        );
    }

    return { staticPart: s, rotorPart: r };
}

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

function spriteTexture(kind: 'energy' | 'fiat' | 'stable'): THREE.CanvasTexture {
    const c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    const ctx = c.getContext('2d')!;
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);

    if (kind === 'fiat') {
        g.addColorStop(0, 'rgba(52,211,153,0.4)');
        g.addColorStop(0.75, 'rgba(52,211,153,0.12)');
        g.addColorStop(1, 'rgba(52,211,153,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);

        // Rounded banknote / card badge
        ctx.strokeStyle = '#34d399';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(10, 15, 44, 34, 7);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px ui-sans-serif, system-ui, -apple-system, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('€', 32, 33);
    } else if (kind === 'stable') {
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(32, 32, 22, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(32, 32, 22, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#93c5fd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(32, 32, 10, 0, Math.PI * 2);
        ctx.stroke();

        g.addColorStop(0, 'rgba(96,165,250,0.15)');
        g.addColorStop(0.7, 'rgba(96,165,250,0.3)');
        g.addColorStop(1, 'rgba(96,165,250,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
    } else {
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(0.25, 'rgba(251,191,36,0.9)');
        g.addColorStop(1, 'rgba(251,191,36,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, 64, 64);
    }

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
let funnelRotorMesh: THREE.LineSegments | null = null;
let energyPoints: THREE.Points;
let fiatPoints: THREE.Points;
let moneyPoints: THREE.Points;
let energyMat: THREE.PointsMaterial;
let fiatMat: THREE.PointsMaterial;
let moneyMat: THREE.PointsMaterial;
const disposables: { dispose: () => void }[] = [];
const MAX_ENERGY_COUNT = 26;
const MAX_FIAT_COUNT = 18;
const MAX_MONEY_COUNT = 11;
let currentEnergyCount = 26;
let currentFiatCount = 18;
let currentMoneyCount = 11;
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
    const isPortrait = w < 640 || w < h;

    if (isPortrait) {
        center.set(-0.75, 1.25, 0);
        camera.userData.distance = Math.max(7.7 / (tanV * camera.aspect), 4.2 / tanV);
        if (fiatMat) fiatMat.size = 16;
        if (moneyMat) moneyMat.size = 14;
        if (energyMat) energyMat.size = 8;
        currentFiatCount = 12;
        currentMoneyCount = 7;
        currentEnergyCount = 14;
    } else {
        camera.userData.distance = Math.max(10.6 / (tanV * camera.aspect), 3.8 / tanV);
        center.set(-0.6, 1.9, 0);
        if (fiatMat) fiatMat.size = 26;
        if (moneyMat) moneyMat.size = 24;
        if (energyMat) energyMat.size = 16;
        currentFiatCount = 18;
        currentMoneyCount = 11;
        currentEnergyCount = 26;
    }
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

    if (funnelRotorMesh) {
        funnelRotorMesh.visible = podOn > 0;
        funnelRotorMesh.scale.setScalar(Math.max(0.001, podOn));
        funnelRotorMesh.rotation.y = -time * 0.0022;
    }

    // flows
    const flow = Math.min(1, Math.max(0, props.flow));
    energyMat.opacity = flow;
    fiatMat.opacity = flow;
    moneyMat.opacity = flow;

    if (flow > 0) {
        const ep = energyPoints.geometry.getAttribute('position') as THREE.BufferAttribute;

        for (let i = 0; i < currentEnergyCount; i++) {
            const t = (i / currentEnergyCount + time * 0.00009) % 1;
            ep.setXYZ(i, ...samplePolyline(ENERGY_PATH, t));
        }
        for (let i = currentEnergyCount; i < MAX_ENERGY_COUNT; i++) {
            ep.setXYZ(i, 0, -999, 0);
        }

        ep.needsUpdate = true;

        // Stage 1: Fiat (€) being poured into the Funnel:
        // First 8 particles stream from the Car/Charger up to the funnel lip,
        // and the remaining 10 particles cascade & spiral down inside the funnel mouth like liquid being poured!
        const fp = fiatPoints.geometry.getAttribute('position') as THREE.BufferAttribute;
        const feedCount = Math.min(6, Math.floor(currentFiatCount * 0.35));
        let fk = 0;

        for (let i = 0; i < feedCount; i++) {
            const guide = FIAT_FEED_GUIDES[i % FIAT_FEED_GUIDES.length];
            const t = (i / feedCount + time * 0.00022) % 1;
            fp.setXYZ(fk++, ...samplePolyline(guide, t));
        }

        const pourCount = currentFiatCount - feedCount;

        for (let i = 0; i < pourCount; i++) {
            // p goes 0 (high above funnel mouth) -> 1 (deep inside funnel spout) with gravity acceleration
            const phase = (i / pourCount + time * 0.00028) % 1;
            const grav = phase * phase;
            const y = FUNNEL_POS[1] + 1.55 - grav * 1.95;
            // Spiral radius tightens as fiat pours down into the throat
            const rad = (1 - phase) * 0.88 + 0.08;
            const angle = i * 2.39996 + time * 0.0026 + phase * 4.2;
            // Slight drift from right (+x) as it pours into the funnel center
            const x = FUNNEL_POS[0] + (1 - phase) * 0.35 + Math.cos(angle) * rad;
            const z = Math.sin(angle) * rad;
            fp.setXYZ(fk++, x, y, z);
        }

        while (fk < MAX_FIAT_COUNT) {
            fp.setXYZ(fk++, 0, -999, 0);
        }

        fp.needsUpdate = true;

        // Stage 2: Minted EURTree stablecoin rings streaming out of the funnel spout into the Tree
        const mp = moneyPoints.geometry.getAttribute('position') as THREE.BufferAttribute;

        for (let i = 0; i < currentMoneyCount; i++) {
            const t = (i / currentMoneyCount + time * 0.00012) % 1;
            mp.setXYZ(i, ...samplePolyline(STABLE_ARC, t));
        }
        for (let i = currentMoneyCount; i < MAX_MONEY_COUNT; i++) {
            mp.setXYZ(i, 0, -999, 0);
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

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, preserveDrawingBuffer: true });
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
    // tree ('v1' | 'v2-solar' | 'v2-hybrid' via props.treeVariant; see ./wireKit.ts)
    const tree = treetinoTree(props.treeVariant);

    for (let i = 0; i < tree.body.positions.length; i += 3) {
        b.positions.push(tree.body.positions[i] + TREE_X, tree.body.positions[i + 1], tree.body.positions[i + 2]);
    }

    b.colors.push(...tree.body.colors);
    // charger + car
    chargerAndCar(b);

    // 3D On-Ramp Funnel static body
    const funnel = onRampFunnel();

    for (let i = 0; i < funnel.staticPart.positions.length; i += 3) {
        b.positions.push(
            funnel.staticPart.positions[i] + FUNNEL_POS[0],
            funnel.staticPart.positions[i + 1] + FUNNEL_POS[1],
            funnel.staticPart.positions[i + 2] + FUNNEL_POS[2],
        );
    }

    b.colors.push(...funnel.staticPart.colors);

    // faint guides: emerald for fiat feed, blue for EURTree yield output
    FIAT_FEED_GUIDES.forEach((pts) => b.poly(pts, WIRE.green.clone().multiplyScalar(0.32)));
    b.poly(STABLE_ARC, WIRE.skin.clone().multiplyScalar(0.42));

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

    // spinning inner vortex ring inside the On-Ramp Funnel
    const fgRotor = funnel.rotorPart.geometry();
    disposables.push(fgRotor);
    funnelRotorMesh = new THREE.LineSegments(fgRotor, lineMat);
    funnelRotorMesh.position.set(FUNNEL_POS[0], FUNNEL_POS[1], FUNNEL_POS[2]);
    scene.add(funnelRotorMesh);

    grid = fadingGrid(16, 1.2);
    grid.position.set(center.x, -0.16, 0);
    disposables.push(grid.geometry, grid.material as THREE.Material);
    scene.add(grid);

    // flow particles
    const dotTex = spriteTexture('energy');
    const fiatTex = spriteTexture('fiat');
    const ringTex = spriteTexture('stable');
    disposables.push(dotTex, fiatTex, ringTex);
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
    fiatMat = new THREE.PointsMaterial({
        map: fiatTex,
        color: '#ffffff',
        size: 26,
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
    disposables.push(energyMat, fiatMat, moneyMat);
    const eg = new THREE.BufferGeometry();
    eg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MAX_ENERGY_COUNT * 3), 3));
    const fg = new THREE.BufferGeometry();
    fg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MAX_FIAT_COUNT * 3), 3));
    const mg = new THREE.BufferGeometry();
    mg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(MAX_MONEY_COUNT * 3), 3));
    disposables.push(eg, fg, mg);
    energyPoints = new THREE.Points(eg, energyMat);
    fiatPoints = new THREE.Points(fg, fiatMat);
    moneyPoints = new THREE.Points(mg, moneyMat);
    energyPoints.frustumCulled = false;
    fiatPoints.frustumCulled = false;
    moneyPoints.frustumCulled = false;
    scene.add(energyPoints, fiatPoints, moneyPoints);

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
