<template>
    <div ref="hostRef" class="relative h-full w-full">
        <canvas ref="canvasRef" class="block h-full w-full"></canvas>
    </div>
</template>

<script setup lang="ts">
/**
 * Utility-scale BESS site rendered purely from lines (three.js LineSegments).
 *
 * - `draw` (0..1) reveals the line work in build order (foundation → shell → details → racks → grid gear)
 * - `orbit` (-1..1) rotates the camera around the site
 * Both are meant to be scrubbed by scroll.
 */
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, watch } from 'vue';

const props = withDefaults(
    defineProps<{
        draw?: number;
        orbit?: number;
        active?: boolean;
    }>(),
    { draw: 1, orbit: 0, active: true },
);

const hostRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

type V3 = [number, number, number];

// 40 ft container: 12.19 × 2.90 × 2.44 m (x = length, y = height, z = depth)
const L = 12.19;
const H = 2.9;
const D = 2.44;

const COLORS = {
    ground: new THREE.Color('#1d4ed8'),
    frame: new THREE.Color('#9fd3ff'),
    skin: new THREE.Color('#4d8dff'),
    detail: new THREE.Color('#7dd3fc'),
    rack: new THREE.Color('#34d399'),
    hv: new THREE.Color('#fbbf24'),
};

const positions: number[] = [];
const colors: number[] = [];

function seg(a: V3, b: V3, c: THREE.Color) {
    positions.push(...a, ...b);
    colors.push(c.r, c.g, c.b, c.r, c.g, c.b);
}

function box(min: V3, max: V3, c: THREE.Color) {
    const [x0, y0, z0] = min;
    const [x1, y1, z1] = max;
    // bottom, top, verticals
    seg([x0, y0, z0], [x1, y0, z0], c);
    seg([x1, y0, z0], [x1, y0, z1], c);
    seg([x1, y0, z1], [x0, y0, z1], c);
    seg([x0, y0, z1], [x0, y0, z0], c);
    seg([x0, y0, z0], [x0, y1, z0], c);
    seg([x1, y0, z0], [x1, y1, z0], c);
    seg([x1, y0, z1], [x1, y1, z1], c);
    seg([x0, y0, z1], [x0, y1, z1], c);
    seg([x0, y1, z0], [x1, y1, z0], c);
    seg([x1, y1, z0], [x1, y1, z1], c);
    seg([x1, y1, z1], [x0, y1, z1], c);
    seg([x0, y1, z1], [x0, y1, z0], c);
}

/** Circle in a plane: axis 'x' → circle in YZ, 'y' → XZ, 'z' → XY */
function circle(center: V3, r: number, axis: 'x' | 'y' | 'z', c: THREE.Color, n = 28) {
    const pt = (t: number): V3 => {
        const a = Math.cos(t) * r;
        const b = Math.sin(t) * r;

        if (axis === 'x') {
            return [center[0], center[1] + a, center[2] + b];
        }

        if (axis === 'y') {
            return [center[0] + a, center[1], center[2] + b];
        }

        return [center[0] + a, center[1] + b, center[2]];
    };

    for (let i = 0; i < n; i++) {
        seg(pt((i / n) * Math.PI * 2), pt(((i + 1) / n) * Math.PI * 2), c);
    }
}

function buildSite() {
    // 1. Concrete foundation slab + strip footings
    box([-0.4, -0.25, -0.4], [L + 0.4, 0, D + 0.4], COLORS.ground);

    // 2. Container frame (corner posts, rails)
    box([0, 0, 0], [L, H, D], COLORS.frame);

    // 3. ISO corner castings
    const cc = 0.18;

    for (const x of [0, L - cc]) {
        for (const y of [0, H - cc]) {
            for (const z of [0, D - cc]) {
                box([x, y, z], [x + cc, y + cc, z + cc], COLORS.frame);
            }
        }
    }

    // 4. Corrugated side walls (trapezoidal profile → alternating inset verticals + rails)
    const pitch = 0.27;

    for (const z of [0, D]) {
        const inward = z === 0 ? 1 : -1;

        for (let x = pitch, i = 0; x < L - 0.1; x += pitch, i++) {
            const inset = i % 2 === 0 ? 0 : 0.045 * inward;
            seg([x, 0.12, z + inset], [x, H - 0.12, z + inset], COLORS.skin);
        }

        seg([0, 0.12, z], [L, 0.12, z], COLORS.skin);
        seg([0, H - 0.12, z], [L, H - 0.12, z], COLORS.skin);
    }

    // 5. Roof bows
    for (let x = 0.6; x < L; x += 0.6) {
        seg([x, H, 0], [x, H, D], COLORS.skin);
    }

    // 6. Service doors on the front long side (z = D) with handles and vents
    const doorW = 1.0;
    const doorH = 2.35;

    for (const x0 of [1.2, 3.9, 6.6, 9.3]) {
        const z = D + 0.01;
        seg([x0, 0.2, z], [x0 + doorW, 0.2, z], COLORS.detail);
        seg([x0 + doorW, 0.2, z], [x0 + doorW, 0.2 + doorH, z], COLORS.detail);
        seg([x0 + doorW, 0.2 + doorH, z], [x0, 0.2 + doorH, z], COLORS.detail);
        seg([x0, 0.2 + doorH, z], [x0, 0.2, z], COLORS.detail);
        // handle
        seg([x0 + doorW - 0.12, 1.1, z + 0.03], [x0 + doorW - 0.12, 1.45, z + 0.03], COLORS.detail);

        // louvre vent
        for (let k = 0; k < 6; k++) {
            const y = 1.85 + k * 0.08;
            seg([x0 + 0.2, y, z], [x0 + doorW - 0.2, y, z], COLORS.detail);
        }
    }

    // 7. End wall HVAC units (x = L) with fan grilles
    for (const y0 of [0.45, 1.6]) {
        const x = L;
        box([x, y0, 0.35], [x + 0.32, y0 + 0.95, D - 0.35], COLORS.detail);
        circle([x + 0.33, y0 + 0.475, D / 2], 0.36, 'x', COLORS.detail);
        circle([x + 0.33, y0 + 0.475, D / 2], 0.22, 'x', COLORS.detail, 20);
        seg([x + 0.33, y0 + 0.115, D / 2], [x + 0.33, y0 + 0.835, D / 2], COLORS.detail);
        seg([x + 0.33, y0 + 0.475, D / 2 - 0.36], [x + 0.33, y0 + 0.475, D / 2 + 0.36], COLORS.detail);
    }

    // 8. Cargo doors with locking bars (x = 0)
    seg([-0.01, 0.15, D / 2], [-0.01, H - 0.15, D / 2], COLORS.detail);

    for (const z of [0.35, 0.85, D - 0.85, D - 0.35]) {
        seg([-0.04, 0.2, z], [-0.04, H - 0.2, z], COLORS.detail);

        for (const y of [0.8, 2.0]) {
            seg([-0.04, y, z - 0.08], [-0.04, y, z + 0.08], COLORS.detail);
        }
    }

    // 9. Internal battery racks seen through the shell (two aisles, 9 racks each)
    const rackW = 1.08;
    const rackD = 0.72;
    const rackH = 2.3;

    for (const [z0, z1] of [
        [0.18, 0.18 + rackD],
        [D - 0.18 - rackD, D - 0.18],
    ]) {
        for (let r = 0; r < 9; r++) {
            const x0 = 0.9 + r * (rackW + 0.07);
            box([x0, 0.15, z0], [x0 + rackW, 0.15 + rackH, z1], COLORS.rack);
            const face = z0 < D / 2 ? z1 : z0;

            for (let m = 1; m < 9; m++) {
                const y = 0.15 + (rackH / 9) * m;
                seg([x0, y, face], [x0 + rackW, y, face], COLORS.rack);
            }
        }
    }

    // 10. Busbar / cable tray along the ceiling
    seg([0.6, H - 0.25, D / 2 - 0.1], [L - 0.6, H - 0.25, D / 2 - 0.1], COLORS.hv);
    seg([0.6, H - 0.25, D / 2 + 0.1], [L - 0.6, H - 0.25, D / 2 + 0.1], COLORS.hv);

    // 11. MV transformer skid next to the container (with radiator fins and 3 HV bushings)
    const tx = L + 2.2;
    const tz = 0.1;
    box([tx - 0.2, -0.25, tz - 0.2], [tx + 2.6, 0, tz + 2.4], COLORS.ground);
    box([tx, 0, tz], [tx + 2.4, 2.1, tz + 2.2], COLORS.frame);

    for (let k = 0; k < 9; k++) {
        const x = tx + 0.2 + k * 0.25;
        seg([x, 0.3, tz + 2.2], [x, 1.8, tz + 2.2], COLORS.skin);
        seg([x, 0.3, tz + 2.2 + 0.25], [x, 1.8, tz + 2.2 + 0.25], COLORS.skin);
        seg([x, 0.3, tz + 2.2], [x, 0.3, tz + 2.45], COLORS.skin);
        seg([x, 1.8, tz + 2.2], [x, 1.8, tz + 2.45], COLORS.skin);
    }

    for (let b = 0; b < 3; b++) {
        const bx = tx + 0.6 + b * 0.6;
        const bz = tz + 1.1;
        seg([bx, 2.1, bz], [bx, 2.75, bz], COLORS.hv);
        circle([bx, 2.75, bz], 0.09, 'y', COLORS.hv, 12);
        circle([bx, 2.35, bz], 0.13, 'y', COLORS.hv, 12);
    }

    // 12. Cable trench from container to transformer
    seg([L + 0.32, 0.02, D / 2 - 0.2], [tx, 0.02, D / 2 - 0.2], COLORS.hv);
    seg([L + 0.32, 0.02, D / 2 + 0.2], [tx, 0.02, D / 2 + 0.2], COLORS.hv);
}

/** Floor grid whose lines fade out radially, so it never shows a hard rectangular edge */
function buildGroundGrid(): THREE.LineSegments {
    const pts: number[] = [];
    const cols: number[] = [];
    const ext = 18;
    const step = 1.2;
    const sub = 0.6;
    const base = new THREE.Color('#2f5fd0');
    const fade = (x: number, z: number) => {
        const r = Math.hypot(x, z * 1.6) / ext;

        return Math.max(0, 1 - r) ** 2;
    };
    const push = (ax: number, az: number, bx: number, bz: number) => {
        pts.push(ax, -0.26, az, bx, -0.26, bz);
        cols.push(base.r, base.g, base.b, fade(ax, az), base.r, base.g, base.b, fade(bx, bz));
    };

    for (let v = -ext; v <= ext + 0.001; v += step) {
        for (let u = -ext; u < ext - 0.001; u += sub) {
            push(u, v, u + sub, v);
            push(v, u, v, u + sub);
        }
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    // RGBA: the radial fade lives in alpha, so faded lines vanish instead of turning dark
    g.setAttribute('color', new THREE.Float32BufferAttribute(cols, 4));
    const m = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
    });

    return new THREE.LineSegments(g, m);
}

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let site: THREE.LineSegments;
let siteMat: THREE.LineBasicMaterial;
let grid: THREE.LineSegments;
let totalVertices = 0;
let raf = 0;
let resizeObserver: ResizeObserver | null = null;
let visible = true;
let intersection: IntersectionObserver | null = null;
const center = new THREE.Vector3();
let radius = 10;

function resize() {
    const host = hostRef.value;

    if (!host || !renderer) {
        return;
    }

    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    // The site is long and flat: fit its length to ~82% of the width, and its (much smaller)
    // projected height to the canvas height — whichever needs the camera further away wins.
    const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const tanH = tanV * camera.aspect;
    const fitLength = (radius * 0.95) / tanH / 0.82;
    const fitHeight = (radius * 0.55) / tanV;
    camera.userData.distance = Math.max(fitLength, fitHeight);
    camera.updateProjectionMatrix();
}

function placeCamera(time: number) {
    // Scroll controls the orbit; a slow idle sway keeps it alive between scroll events
    const idle = Math.sin(time * 0.00025) * 0.04;
    const azimuth = -0.55 + props.orbit * 0.35 + idle;
    const elevation = 0.46;
    const dist = (camera.userData.distance as number) ?? 30;
    camera.position.set(
        center.x + Math.sin(azimuth) * Math.cos(elevation) * dist,
        center.y + Math.sin(elevation) * dist,
        center.z + Math.cos(azimuth) * Math.cos(elevation) * dist,
    );
    camera.lookAt(center);
    camera.updateMatrixWorld();
}

function frame(time: number) {
    raf = requestAnimationFrame(frame);

    if (!renderer || !visible || !props.active) {
        return;
    }

    const draw = Math.min(1, Math.max(0, props.draw));
    const count = Math.floor((totalVertices / 2) * draw) * 2;
    site.geometry.setDrawRange(0, count);
    siteMat.opacity = 0.95;
    (grid.material as THREE.LineBasicMaterial).opacity = 0.55 * Math.min(1, draw * 3);

    placeCamera(time);
    renderer.render(scene, camera);
}

/** Screen rect (host CSS px) of the battery container itself, for the morph into the panel card */
function getContainerRect(): { x: number; y: number; w: number; h: number } | null {
    const host = hostRef.value;

    if (!host || !camera) {
        return null;
    }

    placeCamera(performance.now());
    const w = host.clientWidth;
    const h = host.clientHeight;
    let x0 = Infinity;
    let y0 = Infinity;
    let x1 = -Infinity;
    let y1 = -Infinity;
    const v = new THREE.Vector3();

    for (const x of [0, L]) {
        for (const y of [0, H]) {
            for (const z of [0, D]) {
                v.set(x, y, z).project(camera);
                const sx = (v.x * 0.5 + 0.5) * w;
                const sy = (-v.y * 0.5 + 0.5) * h;
                x0 = Math.min(x0, sx);
                y0 = Math.min(y0, sy);
                x1 = Math.max(x1, sx);
                y1 = Math.max(y1, sy);
            }
        }
    }

    return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
}

defineExpose({ getContainerRect });

onMounted(() => {
    const canvas = canvasRef.value;

    if (!canvas || !hostRef.value) {
        return;
    }

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(28, 1, 0.1, 400);

    buildSite();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    totalVertices = positions.length / 3;
    geometry.computeBoundingSphere();
    center.copy(geometry.boundingSphere!.center);
    radius = geometry.boundingSphere!.radius;

    siteMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 0.95,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });
    site = new THREE.LineSegments(geometry, siteMat);
    scene.add(site);

    grid = buildGroundGrid();
    grid.position.set(center.x, 0, center.z);
    scene.add(grid);

    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hostRef.value);

    intersection = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
    });
    intersection.observe(hostRef.value);

    raf = requestAnimationFrame(frame);
});

watch(
    () => props.active,
    (on) => {
        if (on) {
            resize();
        }
    },
);

onUnmounted(() => {
    cancelAnimationFrame(raf);
    resizeObserver?.disconnect();
    intersection?.disconnect();
    site?.geometry.dispose();
    siteMat?.dispose();
    grid?.geometry.dispose();
    (grid?.material as THREE.Material | undefined)?.dispose();
    renderer?.dispose();
    renderer = null;
    positions.length = 0;
    colors.length = 0;
});
</script>
