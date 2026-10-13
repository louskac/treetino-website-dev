<template>
    <div ref="hostRef" class="relative h-full w-full">
        <canvas ref="canvasRef" class="block h-full w-full"></canvas>
    </div>
</template>

<script setup lang="ts">
/**
 * Line-drawn 3D phone with a wallet on its screen — investors hold energy infrastructure instead of coins.
 * - `draw` (0..1) builds the phone line by line, then the screen lights up
 * - `ui` (0..1) plays the wallet: balance counts up, assets load in, an investment gets confirmed on Solana
 * - `orbit` (0..1) turns the phone towards the viewer
 */
import * as THREE from 'three';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { LineBuilder, lineMaterial, roundRectPoints, WIRE } from './wireKit';

const props = withDefaults(
    defineProps<{
        draw?: number;
        ui?: number;
        orbit?: number;
        active?: boolean;
    }>(),
    { draw: 1, ui: 1, orbit: 1, active: true },
);

const hostRef = ref<HTMLElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);

// Phone body (≈ iPhone proportions, 1 unit = 1 cm)
const W = 7.15;
const H = 14.7;
const D = 0.8;
const R = 1.15;
const BEZEL = 0.28;
const SW = W - BEZEL * 2;
const SH = H - BEZEL * 2;

function buildPhone(): LineBuilder {
    const b = new LineBuilder();
    const front = roundRectPoints(0, 0, W, H, R, D / 2, 8);
    const back = roundRectPoints(0, 0, W, H, R, -D / 2, 8);
    const mid = roundRectPoints(0, 0, W + 0.04, H + 0.04, R + 0.02, 0, 8);

    b.poly(front, WIRE.frame, true);
    b.poly(mid, WIRE.skin, true);
    b.poly(back, WIRE.frame, true);

    // side mesh: connect front ↔ back on every corner vertex and along the straight edges
    for (let i = 0; i < front.length; i += 2) {
        b.seg(front[i], back[i], WIRE.skin);
    }

    for (let y = -H / 2 + R + 0.9; y < H / 2 - R; y += 0.9) {
        b.seg([W / 2, y, D / 2], [W / 2, y, -D / 2], WIRE.skin);
        b.seg([-W / 2, y, D / 2], [-W / 2, y, -D / 2], WIRE.skin);
    }

    for (let x = -W / 2 + R + 0.9; x < W / 2 - R; x += 0.9) {
        b.seg([x, H / 2, D / 2], [x, H / 2, -D / 2], WIRE.skin);
        b.seg([x, -H / 2, D / 2], [x, -H / 2, -D / 2], WIRE.skin);
    }

    // screen glass
    b.roundRect(0, 0, SW, SH, R - BEZEL * 0.7, D / 2 + 0.01, WIRE.detail, 8);

    // buttons
    b.box([-W / 2 - 0.08, 4.1, -0.18], [-W / 2, 4.9, 0.18], WIRE.detail);
    b.box([-W / 2 - 0.08, 2.4, -0.18], [-W / 2, 3.6, 0.18], WIRE.detail);
    b.box([-W / 2 - 0.08, 1.0, -0.18], [-W / 2, 2.2, 0.18], WIRE.detail);
    b.box([W / 2, 1.8, -0.18], [W / 2 + 0.08, 3.9, 0.18], WIRE.detail);

    // camera plateau on the back
    const cx = -W / 2 + 2.0;
    const cy = H / 2 - 2.0;
    b.roundRect(cx, cy, 3.1, 3.1, 0.8, -D / 2 - 0.14, WIRE.frame, 6);
    b.roundRect(cx, cy, 3.1, 3.1, 0.8, -D / 2, WIRE.skin, 6);

    for (const [lx, ly] of [
        [cx - 0.72, cy + 0.72],
        [cx - 0.72, cy - 0.72],
        [cx + 0.72, cy],
    ]) {
        b.circle([lx, ly, -D / 2 - 0.18], 0.58, 'z', WIRE.detail, 20);
        b.circle([lx, ly, -D / 2 - 0.2], 0.3, 'z', WIRE.skin, 14);
    }

    return b;
}

// ---------------------------------------------------------------------------------------------
// Wallet screen (2D canvas → texture on the glass)
// ---------------------------------------------------------------------------------------------
const CW = 860;
const CH = Math.round((CW * SH) / SW);
const FONT = "'DM Sans', ui-sans-serif, system-ui, sans-serif";

const ASSETS = [
    { icon: 'battery', title: 'BESS Přeštice', sub: '8.6 MW · 17.2 MWh', value: 12400, extra: '35 % APY', green: true },
    { icon: 'wind', title: 'Kryry wind farm', sub: '2× Vestas V80 · 4 MW', value: 6150, extra: '+1.2 %', green: false },
    { icon: 'plug', title: 'EV hub Paris-Nord', sub: '10 bays · 350 kW', value: 3900, extra: '+0.8 %', green: false },
    { icon: 'tree', title: 'Treetino V1', sub: 'Sun + wind', value: 2410, extra: '+0.5 %', green: false },
];
const TOTAL = ASSETS.reduce((s, a) => s + a.value, 0);

function clamp01(v: number) {
    return Math.min(1, Math.max(0, v));
}

function ease(v: number) {
    const t = clamp01(v);

    return 1 - (1 - t) ** 3;
}

function rr(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);
}

function euro(v: number, decimals = 0) {
    return '€' + v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

function drawIcon(ctx: CanvasRenderingContext2D, kind: string, x: number, y: number, s: number) {
    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#9fd3ff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();

    if (kind === 'battery') {
        ctx.roundRect(-s * 0.32, -s * 0.2, s * 0.6, s * 0.4, 6);
        ctx.moveTo(s * 0.3, -s * 0.08);
        ctx.lineTo(s * 0.36, -s * 0.08);
        ctx.lineTo(s * 0.36, s * 0.08);
        ctx.lineTo(s * 0.3, s * 0.08);
        ctx.moveTo(-s * 0.04, -s * 0.12);
        ctx.lineTo(-s * 0.12, s * 0.02);
        ctx.lineTo(s * 0.02, s * 0.02);
        ctx.lineTo(-s * 0.06, s * 0.13);
    } else if (kind === 'wind') {
        ctx.moveTo(0, -s * 0.05);
        ctx.lineTo(0, s * 0.36);

        for (let i = 0; i < 3; i++) {
            const a = -Math.PI / 2 + (i * Math.PI * 2) / 3;
            ctx.moveTo(0, -s * 0.05);
            ctx.lineTo(Math.cos(a) * s * 0.3, -s * 0.05 + Math.sin(a) * s * 0.3);
        }
    } else if (kind === 'plug') {
        ctx.roundRect(-s * 0.18, -s * 0.3, s * 0.3, s * 0.6, 6);
        ctx.moveTo(s * 0.12, -s * 0.05);
        ctx.quadraticCurveTo(s * 0.34, -s * 0.05, s * 0.3, s * 0.25);
        ctx.moveTo(-s * 0.08, -s * 0.18);
        ctx.lineTo(s * 0.02, -s * 0.18);
    } else {
        ctx.moveTo(0, s * 0.36);
        ctx.lineTo(0, -s * 0.05);
        ctx.moveTo(0, s * 0.05);
        ctx.lineTo(-s * 0.26, -s * 0.12);
        ctx.moveTo(0, s * 0.05);
        ctx.lineTo(s * 0.26, -s * 0.12);
        ctx.moveTo(0, -s * 0.05);
        ctx.lineTo(0, -s * 0.3);
        ctx.moveTo(-s * 0.26, -s * 0.12);
        ctx.ellipse(-s * 0.26, -s * 0.2, s * 0.06, s * 0.09, 0, Math.PI / 2, Math.PI * 2.5);
        ctx.moveTo(s * 0.26, -s * 0.12);
        ctx.ellipse(s * 0.26, -s * 0.2, s * 0.06, s * 0.09, 0, Math.PI / 2, Math.PI * 2.5);
    }

    ctx.stroke();
    ctx.restore();
}

function drawWallet(ctx: CanvasRenderingContext2D, p: number) {
    ctx.clearRect(0, 0, CW, CH);

    // glass background with rounded corners
    ctx.save();
    rr(ctx, 0, 0, CW, CH, 92);
    ctx.clip();
    const bg = ctx.createLinearGradient(0, 0, 0, CH);
    bg.addColorStop(0, 'rgba(6,14,34,0.96)');
    bg.addColorStop(1, 'rgba(3,8,20,0.96)');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, CW, CH);
    const glow = ctx.createRadialGradient(CW / 2, 380, 20, CW / 2, 380, 620);
    glow.addColorStop(0, 'rgba(37,99,235,0.28)');
    glow.addColorStop(1, 'rgba(37,99,235,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, CW, CH);

    // status bar + dynamic island
    ctx.fillStyle = '#e6f2ff';
    ctx.font = `600 34px ${FONT}`;
    ctx.textBaseline = 'middle';
    ctx.fillText('9:41', 92, 72);
    ctx.fillStyle = '#000';
    rr(ctx, CW / 2 - 118, 40, 236, 66, 33);
    ctx.fill();
    ctx.strokeStyle = 'rgba(159,211,255,0.5)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.strokeStyle = '#e6f2ff';
    ctx.lineWidth = 3;
    rr(ctx, CW - 150, 60, 56, 26, 7);
    ctx.stroke();
    ctx.fillStyle = '#e6f2ff';
    ctx.fillRect(CW - 146, 64, 38, 18);

    for (let i = 0; i < 4; i++) {
        ctx.fillRect(CW - 236 + i * 14, 82 - i * 7, 9, 8 + i * 7);
    }

    // header
    ctx.fillStyle = '#e6f2ff';
    ctx.font = `600 42px ${FONT}`;
    ctx.fillText('Treetino Wallet', 72, 190);
    const sol = ctx.createLinearGradient(CW - 250, 0, CW - 72, 0);
    sol.addColorStop(0, '#9945FF');
    sol.addColorStop(1, '#14F195');
    ctx.strokeStyle = sol;
    ctx.lineWidth = 3;
    rr(ctx, CW - 250, 162, 178, 56, 28);
    ctx.stroke();
    ctx.fillStyle = '#e6f2ff';
    ctx.font = `500 28px ${FONT}`;
    ctx.fillText('Solana', CW - 200, 191);
    ctx.fillStyle = sol;
    ctx.beginPath();
    ctx.arc(CW - 222, 190, 9, 0, Math.PI * 2);
    ctx.fill();

    // balance
    const count = ease(p / 0.35);
    ctx.fillStyle = 'rgba(230,242,255,0.55)';
    ctx.font = `500 30px ${FONT}`;
    ctx.fillText('Portfolio value', 72, 300);
    ctx.fillStyle = '#ffffff';
    ctx.font = `600 104px ${FONT}`;
    ctx.fillText(euro(Math.round(TOTAL * count)), 66, 392);
    ctx.fillStyle = '#34d399';
    ctx.font = `600 30px ${FONT}`;
    ctx.fillText(`+${euro(412.18 * count, 2)}  today`, 72, 470);

    // sparkline
    const sp = ease((p - 0.08) / 0.35);

    if (sp > 0) {
        const pts: [number, number][] = [];

        for (let i = 0; i <= 40; i++) {
            const t = i / 40;
            const y = 640 - t * 80 - Math.sin(t * 9) * 16 - Math.sin(t * 23) * 7;
            pts.push([72 + t * (CW - 144), y]);
        }

        const n = Math.max(2, Math.floor(pts.length * sp));
        ctx.beginPath();
        pts.slice(0, n).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
        ctx.strokeStyle = '#4d8dff';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.lineTo(pts[n - 1][0], 690);
        ctx.lineTo(72, 690);
        ctx.closePath();
        const fill = ctx.createLinearGradient(0, 540, 0, 690);
        fill.addColorStop(0, 'rgba(77,141,255,0.35)');
        fill.addColorStop(1, 'rgba(77,141,255,0)');
        ctx.fillStyle = fill;
        ctx.fill();
        ctx.fillStyle = '#9fd3ff';
        ctx.beginPath();
        ctx.arc(pts[n - 1][0], pts[n - 1][1], 9, 0, Math.PI * 2);
        ctx.fill();
    }

    // actions
    const actions = ['Invest', 'Send', 'Receive'];
    actions.forEach((label, i) => {
        const x = 72 + 120 + i * ((CW - 144 - 240) / 2);
        ctx.strokeStyle = i === 0 ? '#4d8dff' : 'rgba(159,211,255,0.55)';
        ctx.fillStyle = i === 0 ? 'rgba(37,99,235,0.35)' : 'rgba(0,0,0,0)';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, 780, 50, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.strokeStyle = '#e6f2ff';
        ctx.beginPath();

        if (i === 0) {
            ctx.moveTo(x - 18, 780);
            ctx.lineTo(x + 18, 780);
            ctx.moveTo(x, 762);
            ctx.lineTo(x, 798);
        } else {
            const dir = i === 1 ? -1 : 1;
            ctx.moveTo(x, 780 - 18 * dir);
            ctx.lineTo(x, 780 + 18 * dir);
            ctx.moveTo(x - 12, 780 + 6 * dir);
            ctx.lineTo(x, 780 + 18 * dir);
            ctx.lineTo(x + 12, 780 + 6 * dir);
        }

        ctx.stroke();
        ctx.fillStyle = 'rgba(230,242,255,0.75)';
        ctx.font = `500 26px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText(label, x, 862);
        ctx.textAlign = 'left';
    });

    // assets list (energy infrastructure instead of coins)
    ctx.fillStyle = '#e6f2ff';
    ctx.font = `600 34px ${FONT}`;
    ctx.fillText('Energy assets', 72, 950);
    ctx.fillStyle = 'rgba(159,211,255,0.7)';
    ctx.font = `500 26px ${FONT}`;
    ctx.textAlign = 'right';
    ctx.fillText('See all', CW - 72, 950);
    ctx.textAlign = 'left';

    ASSETS.forEach((a, i) => {
        const k = ease((p - 0.25 - i * 0.08) / 0.12);

        if (k <= 0) {
            return;
        }

        const y = 1010 + i * 150 + (1 - k) * 40;
        ctx.globalAlpha = k;
        ctx.strokeStyle = 'rgba(159,211,255,0.18)';
        ctx.lineWidth = 2;
        rr(ctx, 56, y, CW - 112, 130, 30);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(77,141,255,0.6)';
        rr(ctx, 80, y + 22, 86, 86, 22);
        ctx.stroke();
        drawIcon(ctx, a.icon, 123, y + 65, 86);
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 32px ${FONT}`;
        ctx.fillText(a.title, 192, y + 48);
        ctx.fillStyle = 'rgba(230,242,255,0.55)';
        ctx.font = `500 25px ${FONT}`;
        ctx.fillText(a.sub, 192, y + 88);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 32px ${FONT}`;
        ctx.fillText(euro(a.value), CW - 84, y + 48);
        ctx.fillStyle = '#34d399';
        ctx.font = `600 25px ${FONT}`;
        ctx.fillText(a.extra, CW - 84, y + 88);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
    });

    // invest sheet → confirmed on Solana
    const sheet = ease((p - 0.68) / 0.14);

    if (sheet > 0) {
        ctx.fillStyle = `rgba(0,0,0,${0.45 * sheet})`;
        ctx.fillRect(0, 0, CW, CH);
        const top = CH - 640 * sheet;
        ctx.fillStyle = 'rgba(10,22,48,0.98)';
        rr(ctx, 0, top, CW, 700, 64);
        ctx.fill();
        ctx.strokeStyle = 'rgba(77,141,255,0.6)';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = 'rgba(230,242,255,0.3)';
        rr(ctx, CW / 2 - 50, top + 22, 100, 10, 5);
        ctx.fill();
        ctx.fillStyle = 'rgba(230,242,255,0.6)';
        ctx.font = `500 30px ${FONT}`;
        ctx.fillText('Invest in', 72, top + 100);
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 44px ${FONT}`;
        ctx.fillText('BESS Přeštice', 72, top + 156);
        ctx.font = `600 120px ${FONT}`;
        ctx.fillText('€500', 72, top + 290);
        ctx.fillStyle = '#34d399';
        ctx.font = `600 30px ${FONT}`;
        ctx.fillText('Up to 35 % APY · paid in EURTree', 72, top + 372);

        const done = p > 0.9;
        const btn = ctx.createLinearGradient(72, 0, CW - 72, 0);
        btn.addColorStop(0, done ? '#059669' : '#1d4ed8');
        btn.addColorStop(1, done ? '#10b981' : '#3b82f6');
        ctx.fillStyle = btn;
        rr(ctx, 72, top + 430, CW - 144, 116, 58);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = `600 36px ${FONT}`;
        ctx.textAlign = 'center';
        ctx.fillText(done ? '✓  Confirmed in 0.4 s' : 'Confirm on Solana', CW / 2, top + 490);
        ctx.textAlign = 'left';
    }

    ctx.restore();
}

// ---------------------------------------------------------------------------------------------
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let phone: THREE.Group;
let lines: THREE.LineSegments;
let lineMat: THREE.LineBasicMaterial;
let screenMat: THREE.MeshBasicMaterial;
let screenTex: THREE.CanvasTexture;
let screenCtx: CanvasRenderingContext2D | null = null;
let total = 0;
let raf = 0;
let lastUi = -1;
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
    // fit the phone height (with some air) and its width
    camera.userData.distance = Math.max((H * 0.62) / tanV, (W * 0.85) / (tanV * camera.aspect));
    camera.updateProjectionMatrix();
}

function redrawScreen() {
    if (!screenCtx) {
        return;
    }

    const ui = Math.round(clamp01(props.ui) * 400) / 400;

    if (ui === lastUi) {
        return;
    }

    lastUi = ui;
    drawWallet(screenCtx, ui);
    screenTex.needsUpdate = true;
}

function frame(time: number) {
    raf = requestAnimationFrame(frame);

    if (!renderer || !props.active) {
        return;
    }

    const draw = clamp01(props.draw);
    lines.geometry.setDrawRange(0, Math.floor((total / 2) * draw) * 2);
    screenMat.opacity = clamp01((draw - 0.55) / 0.35);
    redrawScreen();

    const o = clamp01(props.orbit);
    phone.rotation.set(0.1 + Math.sin(time * 0.0004) * 0.02, -0.85 + o * 0.62 + Math.sin(time * 0.0003) * 0.03, 0.04);
    phone.position.y = Math.sin(time * 0.0007) * 0.12;
    const dist = (camera.userData.distance as number) ?? 30;
    camera.position.set(0, 0, dist);
    camera.lookAt(0, 0, 0);
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
    camera = new THREE.PerspectiveCamera(26, 1, 0.1, 500);

    phone = new THREE.Group();
    scene.add(phone);

    const builder = buildPhone();
    lineMat = lineMaterial();
    lines = new THREE.LineSegments(builder.geometry(), lineMat);
    total = builder.vertexCount;
    phone.add(lines);

    const off = document.createElement('canvas');
    off.width = CW;
    off.height = CH;
    screenCtx = off.getContext('2d');
    screenTex = new THREE.CanvasTexture(off);
    screenTex.colorSpace = THREE.SRGBColorSpace;
    screenTex.anisotropy = 4;
    screenMat = new THREE.MeshBasicMaterial({ map: screenTex, transparent: true, opacity: 0, depthWrite: false });
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(SW - 0.02, SH - 0.02), screenMat);
    screen.position.z = D / 2 + 0.02;
    screen.renderOrder = 2;
    phone.add(screen);

    redrawScreen();
    document.fonts?.ready.then(() => {
        lastUi = -1;
        redrawScreen();
    });

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
    lines?.geometry.dispose();
    lineMat?.dispose();
    screenTex?.dispose();
    screenMat?.dispose();
    renderer?.dispose();
    renderer = null;
});
</script>
