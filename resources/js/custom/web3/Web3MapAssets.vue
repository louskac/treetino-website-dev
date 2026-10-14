<template>
    <div ref="hostRef" class="pointer-events-none absolute inset-0" aria-hidden="true">
        <canvas ref="canvasRef" class="block h-full w-full"></canvas>
    </div>
</template>

<script setup lang="ts">
/**
 * Line-drawn 3D energy assets (wind farms, solar parks, EV hubs) that build themselves on the
 * Europe map while the camera dives towards the battery site in Přeštice.
 * Rendered with an orthographic camera in screen pixels and glued to map coordinates.
 */
import * as THREE from 'three';
import { onMounted, onUnmounted, ref } from 'vue';
import { europeViewBox, KRYRY, mapToScreen, PARIS_NORD, viewScale } from './europeView';
import type { LineBuilder } from './wireKit';
import { evHub, lineMaterial, solarArray, windTurbine } from './wireKit';

const props = withDefaults(
    defineProps<{
        /** Same zoom value the map receives (0..1) */
        zoom?: number;
        /** 0..1 global opacity */
        fade?: number;
    }>(),
    { zoom: 0, fade: 1 },
);

type Kind = 'wind' | 'solar' | 'ev';

/** z0 = zoom level at which the asset starts building itself */
const SITES: { kind: Kind; x: number; y: number; z0: number }[] = [
    // Europe-wide, appear as soon as the scroll starts
    { kind: 'wind', x: 272, y: 283, z0: 0.0 },
    { kind: 'solar', x: 182, y: 440, z0: 0.03 },
    { kind: 'ev', x: PARIS_NORD.x, y: PARIS_NORD.y, z0: 0.06 },
    { kind: 'wind', x: 328, y: 268, z0: 0.09 },
    { kind: 'solar', x: 262, y: 414, z0: 0.12 },
    { kind: 'ev', x: 266, y: 311, z0: 0.15 },
    { kind: 'solar', x: 343, y: 424, z0: 0.18 },
    // Central Europe
    { kind: 'wind', x: 331, y: 323, z0: 0.3 },
    { kind: 'ev', x: 321, y: 360, z0: 0.34 },
    { kind: 'solar', x: 361, y: 351, z0: 0.38 },
    { kind: 'ev', x: 358, y: 361, z0: 0.42 },
    // Around Přeštice
    { kind: 'ev', x: 343.7, y: 336.9, z0: 0.5 },
    { kind: 'wind', x: KRYRY.x, y: KRYRY.y, z0: 0.56 },
    { kind: 'solar', x: 342, y: 346.5, z0: 0.63 },
    { kind: 'ev', x: 329.5, y: 340, z0: 0.68 },
];

/** Screen size (px) of one model unit at zoom 0 */
const BASE_PX: Record<Kind, number> = { wind: 58, solar: 46, ev: 72 };

const hostRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

interface Asset {
    site: (typeof SITES)[number];
    group: THREE.Group;
    body: THREE.LineSegments;
    total: number;
    rotor?: THREE.LineSegments;
}

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.OrthographicCamera;
let material: THREE.LineBasicMaterial;
const assets: Asset[] = [];
const geometries: THREE.BufferGeometry[] = [];
let raf = 0;
let width = 1;
let height = 1;
let resizeObserver: ResizeObserver | null = null;

function makeLines(builder: LineBuilder): THREE.LineSegments {
    const g = builder.geometry();
    geometries.push(g);

    return new THREE.LineSegments(g, material);
}

function build() {
    for (const site of SITES) {
        const outer = new THREE.Group();
        const inner = new THREE.Group();
        inner.rotation.set(0.52, -0.62 + (site.x % 7) * 0.05, 0);
        outer.add(inner);

        let body: THREE.LineSegments;
        let rotor: THREE.LineSegments | undefined;

        if (site.kind === 'wind') {
            const t = windTurbine(1);
            body = makeLines(t.body);
            rotor = makeLines(t.rotor);
            rotor.position.set(...t.hub);
            rotor.rotation.z = site.x;
            inner.add(rotor);
        } else if (site.kind === 'solar') {
            body = makeLines(solarArray(3, 4));
        } else {
            body = makeLines(evHub(3));
        }

        inner.add(body);
        scene.add(outer);
        assets.push({
            site,
            group: outer,
            body,
            rotor,
            total: body.geometry.getAttribute('position').count,
        });
    }
}

function resize() {
    const host = hostRef.value;

    if (!host || !renderer) {
        return;
    }

    width = host.clientWidth || 1;
    height = host.clientHeight || 1;
    renderer.setSize(width, height, false);
    camera.left = 0;
    camera.right = width;
    camera.top = 0;
    camera.bottom = -height;
    camera.updateProjectionMatrix();
}

function frame(time: number) {
    raf = requestAnimationFrame(frame);

    if (!renderer) {
        return;
    }

    const fade = Math.min(1, Math.max(0, props.fade));
    material.opacity = 0.95 * fade;

    if (fade <= 0.001) {
        renderer.clear();

        return;
    }

    const isPortrait = width < 768 && height > width;
    const vb = europeViewBox(props.zoom, isPortrait);
    const vb0 = europeViewBox(0, isPortrait);
    const growth = (viewScale(vb, width, height) / viewScale(vb0, width, height)) ** 0.42;

    for (const a of assets) {
        const appear = Math.min(1, Math.max(0, (props.zoom - a.site.z0) / 0.1));
        const [sx, sy] = mapToScreen(a.site.x, a.site.y, vb, width, height);
        const size = BASE_PX[a.site.kind] * growth * (0.75 + 0.25 * appear);
        const offscreen = sx < -300 || sx > width + 300 || sy < -300 || sy > height + 300;

        a.group.visible = appear > 0 && !offscreen;
        a.group.position.set(sx, -sy, 0);
        a.group.scale.setScalar(size);
        a.body.geometry.setDrawRange(0, Math.floor((a.total / 2) * appear) * 2);

        if (a.rotor) {
            a.rotor.visible = appear > 0.75;
            a.rotor.rotation.z = a.site.x + time * 0.0016;
        }
    }

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
    camera = new THREE.OrthographicCamera(0, 1, 0, -1, -2000, 2000);
    material = lineMaterial();
    build();
    resize();
    resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(hostRef.value);
    raf = requestAnimationFrame(frame);
});

onUnmounted(() => {
    cancelAnimationFrame(raf);
    resizeObserver?.disconnect();
    geometries.forEach((g) => g.dispose());
    material?.dispose();
    renderer?.dispose();
    renderer = null;
});
</script>
