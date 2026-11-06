<template>
    <div
        ref="hostRef"
        class="relative h-full w-full touch-pan-y select-none"
        :class="interactive ? 'cursor-grab active:cursor-grabbing' : ''"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="onPointerUp"
    >
        <canvas ref="canvasRef" class="block h-full w-full"></canvas>

        <!-- Compass labels pinned to the ground ring (positions written in the render loop) -->
        <span
            v-for="(c, i) in compassLabels"
            :key="c"
            :ref="(el) => (labelEls[i] = el as HTMLElement | null)"
            class="pointer-events-none absolute top-0 left-0 font-mono text-[9px] tracking-[0.2em] will-change-transform"
            :class="i === 0 ? 'text-[#8ec5ff]' : 'text-white/35'"
            style="opacity: 0"
        >
            {{ c }}
        </span>
    </div>
</template>

<script setup lang="ts">
/**
 * Line-drawn Treetino tree that behaves like the real one on site, right now:
 * - turbines spin at the RPM derived from the measured wind (λ_opt · v_hub / R)
 * - the sun sits at its true azimuth / elevation for the station and the V1 branches roll towards it
 * - wind streaks blow through the crown from the measured direction, at a speed that follows the wind
 * - storm stow flips every branch 180° when the hub gust exceeds the stow threshold
 * Drag to orbit; it drifts slowly on its own.
 */
import * as THREE from 'three';
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { glowTexture } from '@/custom/investors/sceneKit';
import type { TreeModel } from '@/custom/web3/wireKit';
import { fadingGrid, LineBuilder, lineMaterial, podLines, treetinoV1, treetinoV2, WIRE } from '@/custom/web3/wireKit';

const props = withDefaults(
    defineProps<{
        variant: 'v1' | 'v2';
        rpm?: number;
        sunAzimuthDeg?: number;
        sunElevationDeg?: number;
        /** Optional sun path of the day (az/el pairs) drawn as a faint arc across the sky */
        sunPath?: { az: number; el: number }[];
        windFromDeg?: number;
        windMs?: number;
        storm?: boolean;
        active?: boolean;
        interactive?: boolean;
        /** Camera azimuth offset (rad) so the sun side faces the viewer */
        viewAzimuth?: number;
    }>(),
    {
        rpm: 30,
        sunAzimuthDeg: 180,
        sunElevationDeg: 30,
        sunPath: () => [],
        windFromDeg: 270,
        windMs: 3,
        storm: false,
        active: true,
        interactive: true,
        viewAzimuth: 0,
    },
);

const { locale } = useI18n();
const compassLabels = computed(() => (locale.value === 'en' ? ['N', 'E', 'S', 'W'] : ['S', 'V', 'J', 'Z']));

const hostRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const labelEls: (HTMLElement | null)[] = [];

const RAD = Math.PI / 180;
const TREE_HEIGHT = 5.2;
const RING_R = 3.55;
const WIND_COUNT = 90;
const SUN_R = 4.9;

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let treeRoot: THREE.Group | null = null;
let structMat: THREE.LineBasicMaterial;
let leafMat: THREE.LineBasicMaterial;
let podMat: THREE.LineBasicMaterial;
let sunPoint: THREE.Points;
let sunMat: THREE.PointsMaterial;
let sunRay: THREE.Line;
let sunRayMat: THREE.LineBasicMaterial;
let sunPathLine: THREE.Line | null = null;
let sunPathMat: THREE.LineBasicMaterial;
let windLines: THREE.LineSegments;
let windMat: THREE.LineBasicMaterial;
let windArrow: THREE.LineSegments;
let windArrowMat: THREE.LineBasicMaterial;
let sunTick: THREE.LineSegments;
let sunTickMat: THREE.LineBasicMaterial;
const sceneDisposables: { dispose: () => void }[] = [];
let treeDisposables: { dispose: () => void }[] = [];
let podMeshes: THREE.LineSegments[] = [];
let clusters: { pivot: THREE.Object3D; axis: THREE.Vector3; axisHoriz: THREE.Vector3; perp: THREE.Vector3 }[] = [];
let v2Turntable: THREE.Group | null = null;

const center = new THREE.Vector3(0, TREE_HEIGHT * 0.48, 0);
let raf = 0;
let last = 0;
let resizeObserver: ResizeObserver | null = null;
let hostW = 1;
let hostH = 1;

/* smoothed state, so live updates glide instead of jumping */
const sm = { sunAz: props.sunAzimuthDeg, sunEl: props.sunElevationDeg, wind: props.windMs, windDir: props.windFromDeg, storm: 0, rpm: props.rpm };
let userAz = 0;
let drift = 0;

const windSeeds = Array.from({ length: WIND_COUNT }, (_, i) => {
    const r = (n: number) => {
        const v = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;

        return v - Math.floor(v);
    };

    return { u: r(1), lat: (r(2) - 0.5) * 7.4, y: 0.35 + r(3) * 5.2, len: 0.35 + r(4) * 0.55, speed: 0.75 + r(5) * 0.5 };
});

/** North = -z, east = +x (so a viewer looking north sees east on the right) */
function dirFromAzEl(azDeg: number, elDeg: number, out: THREE.Vector3): THREE.Vector3 {
    const az = azDeg * RAD;
    const el = elDeg * RAD;

    return out.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el));
}

function angleLerp(a: number, b: number, k: number): number {
    const d = ((b - a + 540) % 360) - 180;

    return (a + d * k + 360) % 360;
}

/* ------------------------------------------------------------------ */
/* Tree                                                                */
/* ------------------------------------------------------------------ */

function buildTree() {
    if (treeRoot) {
        scene.remove(treeRoot);
        treeDisposables.forEach((d) => d.dispose());
        treeDisposables = [];
        podMeshes = [];
        clusters = [];
        v2Turntable = null;
    }

    const model: TreeModel = props.variant === 'v1' ? treetinoV1() : treetinoV2({ withTurbines: true });
    const pos = model.body.positions;
    const col = model.body.colors;

    let maxY = 0;

    for (let i = 1; i < pos.length; i += 3) {
        maxY = Math.max(maxY, pos[i]);
    }

    for (const p of model.pods) {
        maxY = Math.max(maxY, p.base[1] + p.height);
    }

    const scale = TREE_HEIGHT / Math.max(0.5, maxY);

    treeRoot = new THREE.Group();
    treeRoot.scale.setScalar(scale);
    scene.add(treeRoot);

    const parts = model.parts ?? [];

    if (props.variant === 'v2' && !parts.length) {
        // V2 tracks the movement of the sun with the entire tree construction:
        // - vertices 0..48: stationary ground foundation ring
        // - vertices 48..end + pods: entire V2 tree construction rotating together on v2Turntable
        const RING_VERTS = 48;

        const baseGeo = new THREE.BufferGeometry();
        baseGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos.slice(0, RING_VERTS * 3), 3));
        baseGeo.setAttribute('color', new THREE.Float32BufferAttribute(col.slice(0, RING_VERTS * 3), 3));
        treeDisposables.push(baseGeo);
        treeRoot.add(new THREE.LineSegments(baseGeo, structMat));

        v2Turntable = new THREE.Group();
        treeRoot.add(v2Turntable);

        const constructGeo = new THREE.BufferGeometry();
        constructGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos.slice(RING_VERTS * 3), 3));
        constructGeo.setAttribute('color', new THREE.Float32BufferAttribute(col.slice(RING_VERTS * 3), 3));
        treeDisposables.push(constructGeo);
        v2Turntable.add(new THREE.LineSegments(constructGeo, leafMat));

        for (const pod of model.pods) {
            const pg = podLines(pod.height).geometry();
            treeDisposables.push(pg);
            const m = new THREE.LineSegments(pg, podMat);
            m.position.set(...pod.base);
            m.rotation.y = Math.random() * Math.PI;
            v2Turntable.add(m);
            podMeshes.push(m);
        }

        return;
    }

    const foliageStart = parts.length ? (model.foliageStart ?? model.body.vertexCount) : model.body.vertexCount;

    const sg = new THREE.BufferGeometry();
    sg.setAttribute('position', new THREE.Float32BufferAttribute(pos.slice(0, foliageStart * 3), 3));
    sg.setAttribute('color', new THREE.Float32BufferAttribute(col.slice(0, foliageStart * 3), 3));
    treeDisposables.push(sg);
    treeRoot.add(new THREE.LineSegments(sg, parts.length ? structMat : leafMat));

    for (const part of parts) {
        const [px, py, pz] = part.pivot;
        const local: number[] = [];

        for (let v = part.start; v < part.end; v++) {
            local.push(pos[v * 3] - px, pos[v * 3 + 1] - py, pos[v * 3 + 2] - pz);
        }

        const g = new THREE.BufferGeometry();
        g.setAttribute('position', new THREE.Float32BufferAttribute(local, 3));
        g.setAttribute('color', new THREE.Float32BufferAttribute(col.slice(part.start * 3, part.end * 3), 3));
        treeDisposables.push(g);

        const pivot = new THREE.Object3D();
        pivot.position.set(px, py, pz);
        pivot.add(new THREE.LineSegments(g, leafMat));
        treeRoot.add(pivot);

        const axis = new THREE.Vector3(...part.axis).normalize();
        const axisHoriz = new THREE.Vector3(axis.x, 0, axis.z).normalize();
        const perp = new THREE.Vector3().crossVectors(axis, new THREE.Vector3(0, 1, 0)).normalize();
        clusters.push({ pivot, axis, axisHoriz, perp });
    }

    for (const pod of model.pods) {
        const pg = podLines(pod.height).geometry();
        treeDisposables.push(pg);
        const m = new THREE.LineSegments(pg, podMat);
        m.position.set(...pod.base);
        m.rotation.y = Math.random() * Math.PI;
        treeRoot.add(m);
        podMeshes.push(m);
    }
}

/* ------------------------------------------------------------------ */
/* Sky, compass, wind                                                  */
/* ------------------------------------------------------------------ */

function buildSunPath() {
    if (sunPathLine) {
        scene.remove(sunPathLine);
        sunPathLine.geometry.dispose();
        sunPathLine = null;
    }

    const pts = props.sunPath.filter((p) => p.el > -2);

    if (pts.length < 2) {
        return;
    }

    const v = new THREE.Vector3();
    const arr: number[] = [];

    for (const p of pts) {
        dirFromAzEl(p.az, Math.max(0, p.el), v).multiplyScalar(SUN_R).add(center);
        arr.push(v.x, v.y, v.z);
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(arr, 3));
    sunPathLine = new THREE.Line(g, sunPathMat);
    scene.add(sunPathLine);
}

function buildCompass() {
    const b = new LineBuilder();
    const c = WIRE.skin.clone().multiplyScalar(0.55);
    const cBright = WIRE.frame.clone().multiplyScalar(0.8);
    b.circle([0, 0.01, 0], RING_R, 'y', c, 96);
    b.circle([0, 0.01, 0], RING_R * 0.965, 'y', WIRE.ground.clone().multiplyScalar(0.5), 96);

    for (let i = 0; i < 72; i++) {
        const a = (i / 72) * Math.PI * 2;
        const major = i % 18 === 0;
        const mid = i % 9 === 0;
        const r0 = RING_R * (major ? 0.9 : mid ? 0.935 : 0.95);
        const sx = Math.sin(a);
        const cz = -Math.cos(a);
        b.seg([sx * r0, 0.01, cz * r0], [sx * RING_R, 0.01, cz * RING_R], major ? cBright : c);
    }

    const g = b.geometry();
    const m = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.85, depthWrite: false, blending: THREE.AdditiveBlending });
    sceneDisposables.push(g, m);
    scene.add(new THREE.LineSegments(g, m));
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
    // Fit the crown + compass ring (≈ 7.6 wide) and sky (≈ 7 tall)
    camera.userData.distance = Math.max(4.7 / tanV, 5.0 / (tanV * camera.aspect));
    camera.updateProjectionMatrix();
}

/* ------------------------------------------------------------------ */
/* Render loop                                                         */
/* ------------------------------------------------------------------ */

const tmp = new THREE.Vector3();
const sunDir = new THREE.Vector3();
const qRoll = new THREE.Quaternion();
const qPitch = new THREE.Quaternion();
const windDirV = new THREE.Vector3();
const windSide = new THREE.Vector3();

function frame(time: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (time - (last || time)) / 1000);
    last = time;

    if (!renderer || !props.active) {
        return;
    }

    // Smooth the live inputs
    const k = 1 - Math.exp(-dt * 2.5);
    sm.sunAz = angleLerp(sm.sunAz, props.sunAzimuthDeg, k);
    sm.sunEl += (props.sunElevationDeg - sm.sunEl) * k;
    sm.wind += (props.windMs - sm.wind) * k;
    sm.windDir = angleLerp(sm.windDir, props.windFromDeg, k);
    sm.storm += ((props.storm ? 1 : 0) - sm.storm) * (1 - Math.exp(-dt * 1.4));
    sm.rpm += (props.rpm - sm.rpm) * k;

    // 1 · turbines at the real rotor speed
    const omega = (sm.rpm * 2 * Math.PI) / 60;
    podMeshes.forEach((m, i) => (m.rotation.y += omega * dt * (i % 2 ? 1 : -1)));

    // 2 · sun + tracking (V1 tracks per branch cluster; V2 rotates the entire tree construction)
    const sunOn = Math.min(1, Math.max(0, (sm.sunEl + 2) / 8));
    dirFromAzEl(sm.sunAz, Math.max(-4, sm.sunEl), sunDir);
    const storm = sm.storm;

    if (v2Turntable) {
        // V2: the entire tree construction rotates around its vertical axis to face the sun (+Z is South = 180°).
        // In storm/hail mode, it turns 180° away so the sloped back of the canopy shields the solar leaves.
        const dAzDeg = ((180 - sm.sunAz + 540) % 360) - 180;
        const sunYaw = THREE.MathUtils.clamp(dAzDeg * RAD, -1.65, 1.65) * (0.25 + 0.75 * sunOn);
        const stormYaw = sunYaw + (sunYaw >= 0 ? -Math.PI : Math.PI);
        v2Turntable.rotation.y = sunYaw + (stormYaw - sunYaw) * storm + Math.sin(time * 0.0018) * 0.015 * storm;
    } else {
        clusters.forEach((c, i) => {
            const rollTrack = 0.72 * sunDir.dot(c.perp) * sunOn;
            const pitchTrack = -0.28 * sunDir.dot(c.axisHoriz) * sunOn;
            const flip = (rollTrack >= 0 ? 1 : -1) * Math.PI;
            const roll = rollTrack + (flip - rollTrack) * storm + Math.sin(time * 0.0018 + i) * 0.015 * storm;
            qRoll.setFromAxisAngle(c.axis, roll);
            qPitch.setFromAxisAngle(c.perp, pitchTrack * (1 - storm));
            c.pivot.quaternion.copy(qPitch).multiply(qRoll);
        });
    }

    sunPoint.position.copy(sunDir).multiplyScalar(SUN_R).add(center);
    sunMat.opacity = sunOn;
    sunRayMat.opacity = 0.22 * sunOn;
    const rp = sunRay.geometry.getAttribute('position') as THREE.BufferAttribute;
    rp.setXYZ(0, sunPoint.position.x, sunPoint.position.y, sunPoint.position.z);
    rp.setXYZ(1, center.x, center.y + 0.4, center.z);
    rp.needsUpdate = true;
    sunPathMat.opacity = 0.32;
    leafMat.opacity = 0.62 + 0.33 * sunOn;

    // sun azimuth tick on the compass ring
    sunTick.rotation.y = -sm.sunAz * RAD;
    sunTickMat.opacity = 0.9 * sunOn;

    // 3 · wind streaks blowing from the measured direction
    const to = (sm.windDir + 180) % 360;
    dirFromAzEl(to, 0, windDirV);
    windSide.set(-windDirV.z, 0, windDirV.x);
    windArrow.rotation.y = -sm.windDir * RAD;
    const intensity = Math.min(1, Math.max(0.12, sm.wind / 7));
    windMat.opacity = 0.55 * intensity;
    windArrowMat.opacity = 0.85;
    const speed = 0.06 + sm.wind * 0.05;
    const wp = windLines.geometry.getAttribute('position') as THREE.BufferAttribute;

    windSeeds.forEach((s, i) => {
        s.u = (s.u + dt * speed * s.speed) % 1;
        const along = -4.4 + s.u * 8.8;
        const fade = Math.sin(s.u * Math.PI);
        const len = s.len * (0.5 + intensity) * fade;
        const x = windDirV.x * along + windSide.x * s.lat;
        const z = windDirV.z * along + windSide.z * s.lat;
        wp.setXYZ(i * 2, x, s.y, z);
        wp.setXYZ(i * 2 + 1, x - windDirV.x * len, s.y, z - windDirV.z * len);
    });
    wp.needsUpdate = true;

    // camera: user drag + slow drift, framed on the sunny side
    drift += dt * 0.05;
    const az = props.viewAzimuth + userAz + Math.sin(drift) * 0.35;
    const el = 0.2;
    const dist = (camera.userData.distance as number) ?? 14;
    camera.position.set(center.x + Math.sin(az) * Math.cos(el) * dist, center.y + Math.sin(el) * dist, center.z + Math.cos(az) * Math.cos(el) * dist);
    camera.lookAt(center.x, center.y + 0.55, center.z);
    camera.updateMatrixWorld();
    renderer.render(scene, camera);

    // compass labels: N, E, S, W
    for (let i = 0; i < 4; i++) {
        const elx = labelEls[i];

        if (!elx) {
            continue;
        }

        dirFromAzEl(i * 90, 0, tmp).multiplyScalar(RING_R * 1.1);
        tmp.y = 0.02;
        tmp.project(camera);
        const x = (tmp.x * 0.5 + 0.5) * hostW;
        const y = (-tmp.y * 0.5 + 0.5) * hostH;
        elx.style.transform = `translate(${x - elx.offsetWidth / 2}px, ${y - elx.offsetHeight / 2}px)`;
        elx.style.opacity = tmp.z < 1 ? '1' : '0';
    }
}

/* ------------------------------------------------------------------ */
/* Drag to orbit                                                       */
/* ------------------------------------------------------------------ */

let drag: { x: number; az: number } | null = null;

function onPointerDown(e: PointerEvent) {
    if (!props.interactive || e.pointerType === 'touch') {
        return;
    }

    drag = { x: e.clientX, az: userAz };
}

function onPointerMove(e: PointerEvent) {
    if (!drag) {
        return;
    }

    userAz = drag.az - (e.clientX - drag.x) * 0.008;
}

function onPointerUp() {
    drag = null;
}

/* touch: horizontal swipes orbit, vertical swipes keep scrolling the sheet */
let touch: { x: number; y: number; az: number; locked: boolean | null } | null = null;

function onTouchStart(e: TouchEvent) {
    if (!props.interactive) {
        return;
    }

    const t = e.touches[0];
    touch = { x: t.clientX, y: t.clientY, az: userAz, locked: null };
}

function onTouchMove(e: TouchEvent) {
    if (!touch) {
        return;
    }

    const t = e.touches[0];
    const dx = t.clientX - touch.x;
    const dy = t.clientY - touch.y;

    if (touch.locked === null && Math.abs(dx) + Math.abs(dy) > 6) {
        touch.locked = Math.abs(dx) > Math.abs(dy);
    }

    if (touch.locked) {
        e.preventDefault();
        userAz = touch.az - dx * 0.01;
    }
}

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */

onMounted(() => {
    const canvas = canvasRef.value;

    if (!canvas || !hostRef.value) {
        return;
    }

    try {
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    } catch {
        renderer = null;

        return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

    structMat = lineMaterial();
    leafMat = lineMaterial();
    podMat = lineMaterial();
    sceneDisposables.push(structMat, leafMat, podMat);

    buildTree();
    buildCompass();

    const grid = fadingGrid(7, 0.7);
    sceneDisposables.push(grid.geometry, grid.material as THREE.Material);
    scene.add(grid);

    // sun
    const tex = glowTexture();
    sunMat = new THREE.PointsMaterial({ map: tex, size: 110, sizeAttenuation: false, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    const spg = new THREE.BufferGeometry();
    spg.setAttribute('position', new THREE.Float32BufferAttribute([0, 0, 0], 3));
    sunPoint = new THREE.Points(spg, sunMat);
    sunPoint.frustumCulled = false;
    sceneDisposables.push(tex, spg, sunMat);
    scene.add(sunPoint);

    const rg = new THREE.BufferGeometry();
    rg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(6), 3));
    sunRayMat = new THREE.LineBasicMaterial({ color: WIRE.amber, transparent: true, opacity: 0, depthWrite: false, blending: THREE.AdditiveBlending });
    sunRay = new THREE.Line(rg, sunRayMat);
    sunRay.frustumCulled = false;
    sceneDisposables.push(rg, sunRayMat);
    scene.add(sunRay);

    sunPathMat = new THREE.LineBasicMaterial({ color: WIRE.amber, transparent: true, opacity: 0, depthWrite: false });
    sceneDisposables.push(sunPathMat);
    buildSunPath();

    // sun azimuth marker on the ring (drawn at north, rotated each frame)
    const st = new LineBuilder();
    st.poly(
        [
            [0, 0.02, -RING_R * 0.86],
            [0.12, 0.02, -RING_R * 1.0],
            [-0.12, 0.02, -RING_R * 1.0],
        ],
        WIRE.amber,
        true,
    );
    const stg = st.geometry();
    sunTickMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, depthWrite: false });
    sunTick = new THREE.LineSegments(stg, sunTickMat);
    sceneDisposables.push(stg, sunTickMat);
    scene.add(sunTick);

    // wind "from" arrow on the ring (drawn at north pointing inward, rotated each frame)
    const wa = new LineBuilder();
    const r0 = RING_R * 1.04;
    const r1 = RING_R * 0.78;
    wa.seg([0, 0.02, -r0], [0, 0.02, -r1], WIRE.detail);
    wa.seg([0, 0.02, -r1], [0.14, 0.02, -r1 - 0.22], WIRE.detail);
    wa.seg([0, 0.02, -r1], [-0.14, 0.02, -r1 - 0.22], WIRE.detail);
    const wag = wa.geometry();
    windArrowMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0, depthWrite: false });
    windArrow = new THREE.LineSegments(wag, windArrowMat);
    sceneDisposables.push(wag, windArrowMat);
    scene.add(windArrow);

    // wind streaks
    const wg = new THREE.BufferGeometry();
    wg.setAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(WIND_COUNT * 6), 3));
    windMat = new THREE.LineBasicMaterial({ color: WIRE.detail, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
    windLines = new THREE.LineSegments(wg, windMat);
    windLines.frustumCulled = false;
    sceneDisposables.push(wg, windMat);
    scene.add(windLines);

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hostRef.value);
    hostRef.value.addEventListener('touchstart', onTouchStart, { passive: true });
    hostRef.value.addEventListener('touchmove', onTouchMove, { passive: false });
    raf = requestAnimationFrame(frame);
});

watch(
    () => props.variant,
    () => renderer && buildTree(),
);

watch(
    () => props.sunPath,
    () => renderer && buildSunPath(),
);

watch(
    () => props.active,
    (on) => on && resize(),
);

onUnmounted(() => {
    cancelAnimationFrame(raf);
    resizeObserver?.disconnect();
    hostRef.value?.removeEventListener('touchstart', onTouchStart);
    hostRef.value?.removeEventListener('touchmove', onTouchMove);
    treeDisposables.forEach((d) => d.dispose());
    sceneDisposables.forEach((d) => d.dispose());
    sunPathLine?.geometry.dispose();
    renderer?.dispose();
    renderer = null;
});
</script>
