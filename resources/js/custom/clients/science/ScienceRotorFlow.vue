<script setup lang="ts">
/**
 * 2D Cross-Section & 3D Barrel Flow Visualization of the Treetino Scooplet VAWT.
 *
 * Geometry based on FS ČVUT CAD & ANSYS Fluent / Ansys 2025 R2 simulations
 * (`scooplet-2D-vysledky_20261008.pdf`):
 *  - Single unified turbine model (Scooplet):
 *    1. Continuous shallow outer S-shell (`hlavní vnější S-skořepina`) forming the
 *       outer perimeter of both scoops.
 *    2. Two curved inner splitter vanes (`vnitřní usměrňovací křidélka`) placed on
 *       the CONCAVE INSIDE of each lobe, creating a converging internal slot channel.
 *    3. In 3D: barrel vertical profile R(z) = R_eq * (1 - 0.34*z²) with 3 horizontal
 *       crescent partition ribs and top/bottom saucer end-caps.
 *
 * Physics & Rotation Direction:
 *  - Wind blows from LEFT to RIGHT (+x).
 *  - In top-down view (+x right, +y down on screen):
 *    When a lobe passes through the bottom half (y > 0), its open concave pocket
 *    (with the inner splitter vane on the inside) faces LEFT into the oncoming wind
 *    and is pushed to the RIGHT (+x).
 *    When that lobe passes through the top half (y < 0), its smooth convex back
 *    faces LEFT and slices back to the LEFT (-x) against the wind.
 *    Therefore, the rotor physically rotates COUNTER-CLOCKWISE (`dPhi < 0` on screen).
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { num } from '../stationApp';

const props = defineProps<{
    active: boolean;
    viewMode: '2d' | '3d';
    windSpeed: number;
    tsr: number;
    reducedMotion: boolean;
}>();

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');
const f = (v: number, d = 2) => num(v, d, locale.value);

const wrap = ref<HTMLDivElement | null>(null);
const trailCanvas = ref<HTMLCanvasElement | null>(null);
const geoCanvas = ref<HTMLCanvasElement | null>(null);

// Interactive 3D camera orbit state
const camYaw = ref(-0.42);
const camPitch = ref(0.32);
const isDragging3D = ref(false);
let dragStartX = 0;
let dragStartY = 0;
let dragStartYaw = 0;
let dragStartPitch = 0;

/* ------------------------------------------------------------------ */
/* Aerodynamic & Geometric Constants                                   */
/* ------------------------------------------------------------------ */

const R_ROTOR = 1.28; // Outer swept radius of the Scooplet barrel at equator
const U_REF = 8.0; // Reference CFD wind speed [m/s]

/**
 * Maps physical wind speed `v` [2..14 m/s] to canvas advection speed [units/s].
 * Since `R_ROTOR = 1.28` canvas units represents `R_real = 0.65 m` (1 m ≈ 1.97 canvas units),
 * even a 2.0 m/s wind crosses the rotor radius in ~0.33 s. We keep a brisk, realistic
 * visual floor at 2 m/s (`2.65 units/s`) scaling smoothly up to `6.4 units/s` at 14 m/s.
 */
function visualWindSpeed(windMs: number): number {
    const clamped = Math.max(1.8, Math.min(16, windMs));

    return 2.15 + 0.31 * clamped;
}

// Streamline color palette (slow wake -> free-stream -> slot acceleration -> peak jet)
const PALETTE = [
    'rgb(30, 58, 138)', // 0: sheltered wake
    'rgb(37, 99, 235)', // 1
    'rgb(59, 130, 246)', // 2: free-stream (1.0 U)
    'rgb(96, 165, 250)', // 3
    'rgb(142, 197, 255)', // 4: outer capture
    'rgb(191, 219, 254)', // 5
    'rgb(255, 255, 255)', // 6: accelerated core stream
    'rgb(110, 231, 183)', // 7
    'rgb(52, 211, 153)', // 8: peak internal slot jet (up to 1.86 U)
];
const BUCKETS = PALETTE.length;

// Peak velocity in slot nozzle (14.9 m/s at 8.0 m/s and TSR = 1.0 per Ansys 2025 R2)
const peakSlotVelocityMs = computed(() => {
    const tsrFactor = 1 - 0.16 * Math.pow(props.tsr - 1.0, 2);

    return props.windSpeed * 1.8625 * Math.max(0.75, tsrFactor);
});

/* ------------------------------------------------------------------ */
/* Exact Scooplet Geometry Helpers (Shared by 2D and 3D)               */
/* ------------------------------------------------------------------ */

/**
 * Main continuous outer S-shell point in normalized rotor coordinates (R = 1).
 * `s` runs from -1 (left tip at phi=0) through 0 (center shaft) to +1 (right tip at phi=0).
 *
 * At `phi = 0`:
 *  - Right lobe (`s > 0`, `bx > 0`): `by < 0` (arches upward `⌒`), so its CONCAVE INSIDE
 *    faces `+y` (downward on screen).
 *  - Left lobe (`s < 0`, `bx < 0`): `by > 0` (cups downward `⌣`), so its CONCAVE INSIDE
 *    faces `-y` (upward on screen).
 */
function outerShellPoint(s: number): [number, number] {
    const bx = s * 0.94;
    const by = -0.27 * Math.sin(s * Math.PI) - 0.14 * s;

    return [bx, by];
}

/**
 * Inner splitter vane (`vnitřní usměrňovací křidélko`) located on the CONCAVE INSIDE
 * of each lobe (`sign = +1` for the `s > 0` lobe, `sign = -1` for the `s < 0` lobe).
 * `u` runs from 0 (inner end near center passage) to 1 (outer tip near scoop mouth).
 */
function innerVanePoint(u: number, sign: 1 | -1): [number, number] {
    const s = sign * (0.26 + u * 0.63); // spans s in [0.26, 0.89]
    const [ox, oy] = outerShellPoint(s);
    // Offset INWARD into the concave pocket:
    // For sign = +1 (oy < 0, arch on top), concave inside is +y (below arch) and -x (toward center)
    // For sign = -1 (oy > 0, cup on bottom), concave inside is -y (above cup) and +x (toward center)
    const slotGap = 0.145 - 0.025 * u;
    const ix = ox - sign * (0.055 * (0.35 + 0.65 * u));
    const iy = oy + sign * slotGap;

    return [ix, iy];
}

/* ------------------------------------------------------------------ */
/* 2D Velocity Field (Strictly forward-flowing, counter-clockwise)     */
/* ------------------------------------------------------------------ */

const fOut: [number, number] = [0, 0];

/**
 * Evaluates the 2D velocity field at world coordinates `(x, y)` (normalized by `R_ROTOR`)
 * for instantaneous rotor angle `phi` (wrapped to `[0, 2π)`).
 *
 * Note on coordinate system:
 *  - `+x` is right (wind blows from left to right, `vx > 0`).
 *  - `+y` is down on screen.
 *  - Rotor rotates counter-clockwise (`dPhi / dt < 0`), so the bottom half (`y > 0`)
 *    moves in `+x` (with the wind) while catching the wind in its open concave scoop,
 *    and the top half (`y < 0`) moves in `-x` (against the wind) with its convex back.
 */
function evaluateFlow2D(x: number, y: number, rotAngle: number, tsrVal: number, windScale: number, out: [number, number]) {
    const r2 = x * x + y * y;
    const r = Math.sqrt(r2);

    // 1. Smooth outer streamline capture & deflection around the swept cylinder
    const effR = 1.02;
    const effR2 = effR * effR;
    let vx = 1.0;
    let vy = 0.0;

    if (r > 0.35) {
        const inv = effR2 / Math.max(r2, 0.42);
        const c2 = (x * x - y * y) / Math.max(r2, 0.42);
        const s2 = (2 * x * y) / Math.max(r2, 0.42);
        const shield = r < 1.05 ? ((r - 0.35) / 0.7) * 0.16 : 0.22;
        vx = 1 - shield * inv * c2;
        vy = -shield * inv * s2;
    }

    // 2. Upstream funneling into the lower advancing scoop (y > 0) and gentle deflection over upper returning back (y < 0)
    if (x > -2.0 && x < 1.1 && Math.abs(y) < 1.5) {
        const funnelEnv = Math.exp(-((x + 0.35) * (x + 0.35)) / 0.95) * Math.exp(-(y * y) / 1.15);
        // Deflect incoming central air slightly downward (+y) into the advancing bottom scoop
        vy += 0.16 * funnelEnv * (1 - 0.4 * y);
    }

    // 3. Internal slot acceleration & cross-shaft S-channel jet inside the rotor (r < 1.25)
    if (r < 1.35) {
        const inside = Math.exp(-r2 / 0.78);
        const tsrBoost = Math.min(1.25, 0.7 + 0.32 * tsrVal);

        // Transform world (x, y) into rotor-local coordinates (bx, by) via rotation -rotAngle
        const cosA = Math.cos(rotAngle);
        const sinA = Math.sin(rotAngle);
        const bx = x * cosA + y * sinA;
        const by = -x * sinA + y * cosA;

        // Distance to the S-channel between outer shell and inner splitter vane
        const sApprox = Math.max(-1, Math.min(1, bx / 0.94));
        const [, shellY] = outerShellPoint(sApprox);
        const distToChannel = Math.abs(by - shellY * 0.75);
        const inSlot = Math.exp(-(distToChannel * distToChannel) / 0.14) * Math.exp(-(bx * bx) / 0.95);

        // Advancing bottom zone (y > 0) accelerates strongly with the wind (+x)
        const advBoost = y > -0.25 ? 0.52 + 0.32 * Math.max(0, y) : 0.22;
        const angleMod = 1 + 0.12 * Math.sin(2 * rotAngle);

        const ix = (1.18 + advBoost * tsrBoost * angleMod + 0.36 * inSlot) * windScale;
        // S-channel guides flow into the bottom scoop and across the shaft toward the exit
        const iy = (-0.24 * x + 0.18 * Math.cos(2 * rotAngle - x * 1.4)) * inside * windScale;

        vx = vx * windScale * (1 - inside) + ix * inside;
        vy = vy * windScale * (1 - inside) + iy;
    } else {
        vx *= windScale;
        vy *= windScale;
    }

    // 4. Gentle downstream wake behind rotor (x > 0.95)
    if (x > 0.95 && Math.abs(y) < 1.45) {
        const dx = x - 0.95;
        const wakeEnv = Math.exp(-dx / 3.8) * Math.exp(-(y * y) / 0.95);
        vx *= 1 - 0.16 * wakeEnv;
        vy += 0.12 * wakeEnv * Math.sin(dx * 2.2 + rotAngle * 2);
    }

    // Guarantee strictly forward left-to-right flow so particles never stall or circle backward
    if (vx < 0.35 * windScale) {
        vx = 0.35 * windScale;
    }

    out[0] = vx;
    out[1] = vy;
}

/* ------------------------------------------------------------------ */
/* Simulation State                                                    */
/* ------------------------------------------------------------------ */

let cssW = 0;
let cssH = 0;
let dpr = 1;
let scale = 1;
let hw = 5;
let hh = 3;
let n = 0;
let px = new Float32Array(0);
let py = new Float32Array(0);
let life = new Float32Array(0);
let maxLife = new Float32Array(0);
const segs: number[][] = Array.from({ length: BUCKETS }, () => []);

// 3D wind particles for the 3D barrel view
interface Particle3D {
    x: number;
    y: number;
    z: number;
    hx: number[];
    hy: number[];
    hz: number[];
    vMag: number;
}
const NUM_PARTICLES_3D = 64;
const particles3D: Particle3D[] = [];

function initParticles3D() {
    particles3D.length = 0;

    for (let i = 0; i < NUM_PARTICLES_3D; i++) {
        const x = -2.3 + Math.random() * 4.6;
        const y = (Math.random() - 0.5) * 2.1;
        const z = (Math.random() - 0.5) * 1.9;
        particles3D.push({
            x,
            y,
            z,
            hx: [x],
            hy: [y],
            hz: [z],
            vMag: 1.0,
        });
    }
}

let phi = 0.65;
let raf = 0;
let lastT = 0;
let ro: ResizeObserver | null = null;

function toScreenX(x: number) {
    return (x + hw) * scale;
}

function toScreenY(y: number) {
    return (y + hh) * scale;
}

function spawn(i: number, leftEdge: boolean) {
    px[i] = leftEdge ? -hw - Math.random() * 0.35 : (Math.random() * 2 - 1) * hw;
    const u = Math.random() * 2 - 1;
    const shaped = Math.sign(u) * Math.pow(Math.abs(u), 0.85);
    py[i] = shaped * hh * 0.94;
    const m = 2.6 + Math.random() * 2.4;
    maxLife[i] = m;
    life[i] = leftEdge ? m : Math.random() * m;
}

function setup() {
    const el = wrap.value;
    const tc = trailCanvas.value;
    const gc = geoCanvas.value;

    if (!el || !tc || !gc) {
        return;
    }

    const rect = el.getBoundingClientRect();
    cssW = Math.max(280, Math.floor(rect.width));
    cssH = Math.max(240, Math.floor(rect.height));
    dpr = Math.min(window.devicePixelRatio || 1, 2);

    for (const c of [tc, gc]) {
        c.width = Math.round(cssW * dpr);
        c.height = Math.round(cssH * dpr);
        const ctx = c.getContext('2d');
        ctx?.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    hh = 2.65;
    scale = cssH / (2 * hh);
    hw = cssW / (2 * scale);

    const targetCount = cssW < 560 ? 520 : 880;

    if (targetCount !== n) {
        n = targetCount;
        px = new Float32Array(n);
        py = new Float32Array(n);
        life = new Float32Array(n);
        maxLife = new Float32Array(n);
    }

    for (let i = 0; i < n; i++) {
        spawn(i, false);
    }

    if (particles3D.length === 0) {
        initParticles3D();
    }

    const tctx = tc.getContext('2d');

    if (tctx) {
        tctx.clearRect(0, 0, cssW, cssH);

        if (props.viewMode === '2d') {
            for (let s = 0; s < 32; s++) {
                fadeTrails(tctx, 1 / 60);
                stepParticles2D(tctx, 1 / 60);
            }
        }
    }

    const gctx = gc.getContext('2d');

    if (gctx) {
        if (props.viewMode === '2d') {
            drawGeometry2D(gctx);
        } else {
            drawScene3D(gctx, 1 / 60);
        }
    }
}

function stepParticles2D(ctx: CanvasRenderingContext2D, dt: number) {
    for (let b = 0; b < BUCKETS; b++) {
        segs[b].length = 0;
    }

    const vCanvas = visualWindSpeed(props.windSpeed);
    const windScale = vCanvas / visualWindSpeed(U_REF);
    const step = vCanvas * dt;

    for (let i = 0; i < n; i++) {
        const x0 = px[i];
        const y0 = py[i];

        evaluateFlow2D(x0, y0, phi, props.tsr, windScale, fOut);
        const vx1 = fOut[0];
        const vy1 = fOut[1];

        const mx = x0 + 0.5 * step * vx1;
        const my = y0 + 0.5 * step * vy1;
        evaluateFlow2D(mx, my, phi, props.tsr, windScale, fOut);
        const vx = fOut[0];
        const vy = fOut[1];

        const x1 = x0 + step * vx;
        const y1 = y0 + step * vy;

        const sx0 = toScreenX(x0);
        const sy0 = toScreenY(y0);
        const sx1 = toScreenX(x1);
        const sy1 = toScreenY(y1);

        // Normalize speed against reference so higher wind speeds or slot acceleration glow brighter
        const vNorm = Math.hypot(vx, vy) / Math.max(0.55, windScale * 0.85);
        const t = Math.max(0, Math.min(0.999, (vNorm - 0.55) / 1.45));
        const b = Math.floor(t * BUCKETS);
        segs[b].push(sx0, sy0, sx1, sy1);

        px[i] = x1;
        py[i] = y1;
        life[i] -= dt;

        if (x1 > hw + 0.25 || x1 < -hw - 0.5 || Math.abs(y1) > hh + 0.35) {
            spawn(i, true);
        } else if (life[i] <= 0) {
            spawn(i, true);
        }
    }

    ctx.globalCompositeOperation = 'lighter';
    ctx.lineCap = 'round';
    ctx.lineWidth = cssW < 640 ? 1.15 : 1.4;

    for (let b = 0; b < BUCKETS; b++) {
        const arr = segs[b];

        if (!arr.length) {
            continue;
        }

        ctx.strokeStyle = PALETTE[b];
        ctx.beginPath();

        for (let k = 0; k < arr.length; k += 4) {
            ctx.moveTo(arr[k], arr[k + 1]);
            ctx.lineTo(arr[k + 2], arr[k + 3]);
        }

        ctx.stroke();
    }

    ctx.globalCompositeOperation = 'source-over';
}

function fadeTrails(ctx: CanvasRenderingContext2D, dt: number) {
    const a = 1 - Math.pow(1 - 0.075, dt * 60);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillStyle = `rgba(0,0,0,${a.toFixed(4)})`;
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.globalCompositeOperation = 'source-over';
}

function drawGeometry2D(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, cssW, cssH);
    const cx = toScreenX(0);
    const cy = toScreenY(0);
    const rPx = R_ROTOR * scale;

    // Subtle swept-diameter reference ring
    ctx.save();
    ctx.setLineDash([3, 6]);
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(255,255,255,0.14)';
    ctx.beginPath();
    ctx.arc(cx, cy, rPx, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Rotate assembly by phi (which decreases over time = counter-clockwise on screen)
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(phi);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 1. Subtle crescent partition rib shading inside each concave pocket
    for (const sign of [1, -1] as const) {
        ctx.save();
        ctx.fillStyle = 'rgba(142,197,255,0.08)';
        ctx.beginPath();
        const steps = 24;

        for (let i = 0; i <= steps; i++) {
            const u = i / steps;
            const s = sign * (0.26 + u * 0.63);
            const [ox, oy] = outerShellPoint(s);

            if (i === 0) {
                ctx.moveTo(ox * rPx, oy * rPx);
            } else {
                ctx.lineTo(ox * rPx, oy * rPx);
            }
        }

        for (let i = steps; i >= 0; i--) {
            const u = i / steps;
            const [ix, iy] = innerVanePoint(u, sign);
            ctx.lineTo(ix * rPx, iy * rPx);
        }

        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    // 2. Inner splitter vanes (`vnitřní usměrňovací křidélka`) on the CONCAVE INSIDE of each lobe
    ctx.save();
    ctx.lineWidth = Math.max(2.2, 0.052 * scale);
    ctx.strokeStyle = 'rgba(142,197,255,0.95)';
    ctx.shadowColor = 'rgba(142,197,255,0.75)';
    ctx.shadowBlur = 12;

    for (const sign of [1, -1] as const) {
        ctx.beginPath();
        const steps = 28;

        for (let i = 0; i <= steps; i++) {
            const u = i / steps;
            const [ix, iy] = innerVanePoint(u, sign);

            if (i === 0) {
                ctx.moveTo(ix * rPx, iy * rPx);
            } else {
                ctx.lineTo(ix * rPx, iy * rPx);
            }
        }

        ctx.stroke();
    }

    ctx.restore();

    // 3. Main continuous outer S-shell (`hlavní vnější S-skořepina`)
    ctx.save();
    ctx.lineWidth = Math.max(2.8, 0.064 * scale);
    ctx.strokeStyle = 'rgba(255,255,255,0.96)';
    ctx.shadowColor = 'rgba(52,211,153,0.65)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    const steps = 48;

    for (let i = 0; i <= steps; i++) {
        const s = (i / steps) * 2 - 1;
        const [ox, oy] = outerShellPoint(s);

        if (i === 0) {
            ctx.moveTo(ox * rPx, oy * rPx);
        } else {
            ctx.lineTo(ox * rPx, oy * rPx);
        }
    }

    ctx.stroke();
    ctx.restore();

    // Center shaft pin
    ctx.fillStyle = 'rgba(255,255,255,0.92)';
    ctx.beginPath();
    ctx.arc(0, 0, Math.max(2.5, 0.042 * scale), 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}

/* ------------------------------------------------------------------ */
/* 3D Barrel Rotor & Dynamic World-Space Wind Shading                  */
/* ------------------------------------------------------------------ */

function project3D(wx: number, wy: number, wz: number, cx: number, cy: number, sc: number): [number, number, number] {
    const cyaw = Math.cos(camYaw.value);
    const syaw = Math.sin(camYaw.value);
    const cpitch = Math.cos(camPitch.value);
    const spitch = Math.sin(camPitch.value);

    // Horizontal plane is (wx, wy), vertical shaft axis is wz
    const rx = wx * cyaw - wy * syaw;
    const ry = wx * syaw + wy * cyaw;
    const rz = wz;

    const sx = rx;
    const sy = -rz * cpitch + ry * spitch;
    const depth = ry * cpitch + rz * spitch;

    const persp = 5.5 / Math.max(2.2, 5.5 + depth * 0.65);

    return [cx + sx * sc * persp, cy + sy * sc * persp, depth];
}

/**
 * Clean aerodynamic load color on the 3D rotor surface:
 *  - Low load (returning / leeward side): deep slate-blue
 *  - Medium load (free-stream capture): sky blue (`#38bdf8` / `#8ec5ff`)
 *  - High load (active wind-catching scoop & accelerated internal slot): bright emerald (`#34d399`)
 */
function aeroLoadRgb(load01: number, alpha = 1): string {
    const t = Math.max(0, Math.min(1, load01));
    let r = 0;
    let g = 0;
    let b = 0;

    if (t < 0.45) {
        const u = t / 0.45;
        r = 24 + u * 46;
        g = 46 + u * 98;
        b = 92 + u * 138;
    } else if (t < 0.8) {
        const u = (t - 0.45) / 0.35;
        r = 70 + u * 50;
        g = 144 + u * 72;
        b = 230 - u * 35;
    } else {
        const u = (t - 0.8) / 0.2;
        r = 120 - u * 68;
        g = 216 - u * 5;
        b = 195 - u * 42;
    }

    return `rgba(${Math.round(r)},${Math.round(g)},${Math.round(b)},${alpha})`;
}

/**
 * Computes the instantaneous aerodynamic wind load [0..1] on a point of lobe `sign`
 * in WORLD coordinates as the rotor turns through the wind (+X direction).
 *
 * Unlike a static texture, this depends on the lobe's instantaneous world orientation:
 *  - In horizontal world space `(wx, wy)`, wind blows toward `+X`.
 *  - At angle `phi`, lobe `sign` has its concave mouth pointing in world direction:
 *    `mouthDirX = -sign * Math.sin(phi)`, `mouthDirY = sign * Math.cos(phi)`.
 *  - When `mouthDirX < 0` (the concave scoop faces LEFT into the oncoming wind) and the
 *    lobe is passing through the advancing side (`wy * sign > 0` in world space), the wind
 *    funnels directly into this scoop and its internal slot (`load -> 0.95`).
 *  - Half a revolution later (`phi + π`), this lobe faces downwind with its convex back
 *    to the wind (`load -> 0.18`), while the OTHER lobe lights up as it catches the wind!
 */
function computeWorldBladeLoad(sign: 1 | -1, uFrac: number, zNorm: number, wx: number, wy: number, isInnerVane: boolean): number {
    // Mouth normal in world X (negative means concave scoop faces into the wind from -X)
    const mouthWorldX = -sign * Math.sin(phi);
    // Advancing pass alignment: 1 when scoop faces into the wind (-X), 0 when facing downwind (+X)
    const catchPhase = 0.5 * (1 - mouthWorldX);
    const activeScoop = Math.pow(catchPhase, 1.45);

    // World-space exposure to incoming wind (+X from left, advancing pass at wy > 0)
    const worldAdvancing = Math.max(0, Math.min(1, 0.55 + 0.45 * wy - 0.2 * wx));

    // Barrel vertical profile peaks at the equator (z = 0) and tapers toward caps (z = ±1)
    const barrelFactor = Math.max(0.25, 1 - 0.52 * zNorm * zNorm);

    // Radial profile: slot nozzle acceleration is strongest along the mid-to-outer scoop
    const radialFactor = isInnerVane ? 0.82 + 0.18 * (1 - Math.abs(uFrac - 0.55)) : 0.65 + 0.35 * Math.sin(uFrac * Math.PI * 0.85);

    const combined = (0.12 + 0.88 * activeScoop * (0.55 + 0.45 * worldAdvancing) * radialFactor) * barrelFactor;

    return Math.max(0.1, Math.min(0.98, combined));
}

function drawScene3D(ctx: CanvasRenderingContext2D, dt: number) {
    ctx.clearRect(0, 0, cssW, cssH);

    const cx = cssW * 0.5;
    const cy = cssH * 0.52;
    const sc = Math.min(cssW, cssH) * 0.255;

    // 1. Horizontal reference ground grid (z = -1.08)
    ctx.save();
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(148, 163, 184, 0.11)';
    const gridZ = -1.08;

    for (let gx = -2.4; gx <= 2.41; gx += 0.6) {
        const [x0, y0] = project3D(gx, -1.6, gridZ, cx, cy, sc);
        const [x1, y1] = project3D(gx, 1.6, gridZ, cx, cy, sc);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }

    for (let gy = -1.6; gy <= 1.61; gy += 0.533) {
        const [x0, y0] = project3D(-2.4, gy, gridZ, cx, cy, sc);
        const [x1, y1] = project3D(2.4, gy, gridZ, cx, cy, sc);
        ctx.beginPath();
        ctx.moveTo(x0, y0);
        ctx.lineTo(x1, y1);
        ctx.stroke();
    }

    ctx.restore();

    // 2. Build depth-sorted 3D triangles for the Scooplet barrel rotor
    interface Tri3D {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
        x2: number;
        y2: number;
        depth: number;
        fill: string;
        stroke?: string;
    }
    const tris: Tri3D[] = [];

    const zSteps = 16;
    const uSteps = 14;
    const hMax = 0.98;
    const cosP = Math.cos(phi);
    const sinP = Math.sin(phi);

    // Rotate local (bx, by) by phi in the horizontal plane
    const rotXY = (bx: number, by: number): [number, number] => [bx * cosP - by * sinP, bx * sinP + by * cosP];

    // 2A. Main continuous outer S-shell (both lobes `sign = +1` and `sign = -1`)
    for (const sign of [1, -1] as const) {
        for (let iz = 0; iz < zSteps; iz++) {
            const v0 = (iz / zSteps) * 2 - 1;
            const v1 = ((iz + 1) / zSteps) * 2 - 1;
            const z0 = v0 * hMax;
            const z1 = v1 * hMax;
            // Barrel equator bulge R(z) = R_eq * (1 - 0.34 * z^2)
            const rScale0 = 0.92 * (1 - 0.34 * v0 * v0);
            const rScale1 = 0.92 * (1 - 0.34 * v1 * v1);

            for (let iu = 0; iu < uSteps; iu++) {
                const u0 = iu / uSteps;
                const u1 = (iu + 1) / uSteps;

                const [b00x, b00y] = outerShellPoint(sign * u0);
                const [b10x, b10y] = outerShellPoint(sign * u1);

                const [wx00, wy00] = rotXY(b00x * rScale0, b00y * rScale0);
                const [wx10, wy10] = rotXY(b10x * rScale0, b10y * rScale0);
                const [wx01, wy01] = rotXY(b00x * rScale1, b00y * rScale1);
                const [wx11, wy11] = rotXY(b10x * rScale1, b10y * rScale1);

                const p00 = project3D(wx00, wy00, z0, cx, cy, sc);
                const p10 = project3D(wx10, wy10, z0, cx, cy, sc);
                const p01 = project3D(wx01, wy01, z1, cx, cy, sc);
                const p11 = project3D(wx11, wy11, z1, cx, cy, sc);

                const uMid = 0.5 * (u0 + u1);
                const vMid = 0.5 * (v0 + v1);
                const wxMid = 0.25 * (wx00 + wx10 + wx01 + wx11);
                const wyMid = 0.25 * (wy00 + wy10 + wy01 + wy11);
                const load = computeWorldBladeLoad(sign, uMid, vMid, wxMid, wyMid, false);
                const fill = aeroLoadRgb(load, 0.92);
                const stroke = iu === uSteps - 1 ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.08)';
                const dAvg = 0.25 * (p00[2] + p10[2] + p01[2] + p11[2]);

                tris.push(
                    { x0: p00[0], y0: p00[1], x1: p10[0], y1: p10[1], x2: p11[0], y2: p11[1], depth: dAvg, fill, stroke },
                    { x0: p00[0], y0: p00[1], x1: p11[0], y1: p11[1], x2: p01[0], y2: p01[1], depth: dAvg, fill },
                );
            }
        }

        // 2B. Inner splitter vane (`vnitřní usměrňovací křidélko`) on the CONCAVE INSIDE of each lobe
        const gSteps = 10;

        for (let iz = 0; iz < zSteps; iz++) {
            const v0 = (iz / zSteps) * 2 - 1;
            const v1 = ((iz + 1) / zSteps) * 2 - 1;
            const z0 = v0 * hMax;
            const z1 = v1 * hMax;
            const rScale0 = 0.92 * (1 - 0.34 * v0 * v0);
            const rScale1 = 0.92 * (1 - 0.34 * v1 * v1);

            for (let iu = 0; iu < gSteps; iu++) {
                const u0 = iu / gSteps;
                const u1 = (iu + 1) / gSteps;

                const [g00x, g00y] = innerVanePoint(u0, sign);
                const [g10x, g10y] = innerVanePoint(u1, sign);

                const [wx00, wy00] = rotXY(g00x * rScale0, g00y * rScale0);
                const [wx10, wy10] = rotXY(g10x * rScale0, g10y * rScale0);
                const [wx01, wy01] = rotXY(g00x * rScale1, g00y * rScale1);
                const [wx11, wy11] = rotXY(g10x * rScale1, g10y * rScale1);

                const p00 = project3D(wx00, wy00, z0, cx, cy, sc);
                const p10 = project3D(wx10, wy10, z0, cx, cy, sc);
                const p01 = project3D(wx01, wy01, z1, cx, cy, sc);
                const p11 = project3D(wx11, wy11, z1, cx, cy, sc);

                const uMid = 0.5 * (u0 + u1);
                const vMid = 0.5 * (v0 + v1);
                const wxMid = 0.25 * (wx00 + wx10 + wx01 + wx11);
                const wyMid = 0.25 * (wy00 + wy10 + wy01 + wy11);
                const load = computeWorldBladeLoad(sign, uMid, vMid, wxMid, wyMid, true);
                const fill = aeroLoadRgb(load, 0.88);
                const stroke = iu === 0 || iu === gSteps - 1 ? 'rgba(142,197,255,0.65)' : 'rgba(142,197,255,0.14)';
                const dAvg = 0.25 * (p00[2] + p10[2] + p01[2] + p11[2]);

                tris.push(
                    { x0: p00[0], y0: p00[1], x1: p10[0], y1: p10[1], x2: p11[0], y2: p11[1], depth: dAvg, fill, stroke },
                    { x0: p00[0], y0: p00[1], x1: p11[0], y1: p11[1], x2: p01[0], y2: p01[1], depth: dAvg, fill },
                );
            }
        }

        // 2C. Three horizontal crescent partition ribs (`3× srpková přepážka`) inside each concave pocket
        for (const ribV of [-0.48, 0.0, 0.48]) {
            const zRib = ribV * hMax;
            const rScaleRib = 0.92 * (1 - 0.34 * ribV * ribV);
            const ribSegs = 8;

            for (let iu = 0; iu < ribSegs; iu++) {
                const u0 = iu / ribSegs;
                const u1 = (iu + 1) / ribSegs;
                const s0 = sign * (0.26 + u0 * 0.63);
                const s1 = sign * (0.26 + u1 * 0.63);

                const [ox0, oy0] = outerShellPoint(s0);
                const [ox1, oy1] = outerShellPoint(s1);
                const [ix0, iy0] = innerVanePoint(u0, sign);
                const [ix1, iy1] = innerVanePoint(u1, sign);

                const [wOx0, wOy0] = rotXY(ox0 * rScaleRib, oy0 * rScaleRib);
                const [wOx1, wOy1] = rotXY(ox1 * rScaleRib, oy1 * rScaleRib);
                const [wIx0, wIy0] = rotXY(ix0 * rScaleRib, iy0 * rScaleRib);
                const [wIx1, wIy1] = rotXY(ix1 * rScaleRib, iy1 * rScaleRib);

                const p00 = project3D(wOx0, wOy0, zRib, cx, cy, sc);
                const p10 = project3D(wOx1, wOy1, zRib, cx, cy, sc);
                const p01 = project3D(wIx0, wIy0, zRib, cx, cy, sc);
                const p11 = project3D(wIx1, wIy1, zRib, cx, cy, sc);

                const dAvg = 0.25 * (p00[2] + p10[2] + p01[2] + p11[2]);
                tris.push(
                    {
                        x0: p00[0],
                        y0: p00[1],
                        x1: p10[0],
                        y1: p10[1],
                        x2: p11[0],
                        y2: p11[1],
                        depth: dAvg,
                        fill: 'rgba(203, 213, 225, 0.42)',
                        stroke: 'rgba(255, 255, 255, 0.38)',
                    },
                    {
                        x0: p00[0],
                        y0: p00[1],
                        x1: p11[0],
                        y1: p11[1],
                        x2: p01[0],
                        y2: p01[1],
                        depth: dAvg,
                        fill: 'rgba(203, 213, 225, 0.42)',
                    },
                );
            }
        }
    }

    // 2D. Top & bottom saucer end-caps (`z = ±hMax`)
    for (const capSign of [-1, 1] as const) {
        const zCap = capSign * hMax;
        const rCap = 0.62;
        const capSegs = 20;
        const pCenter = project3D(0, 0, zCap + capSign * 0.04, cx, cy, sc);

        for (let k = 0; k < capSegs; k++) {
            const a0 = (k / capSegs) * Math.PI * 2 + phi;
            const a1 = ((k + 1) / capSegs) * Math.PI * 2 + phi;
            const p0 = project3D(Math.cos(a0) * rCap, Math.sin(a0) * rCap, zCap, cx, cy, sc);
            const p1 = project3D(Math.cos(a1) * rCap, Math.sin(a1) * rCap, zCap, cx, cy, sc);
            const dAvg = (pCenter[2] + p0[2] + p1[2]) / 3;
            tris.push({
                x0: pCenter[0],
                y0: pCenter[1],
                x1: p0[0],
                y1: p0[1],
                x2: p1[0],
                y2: p1[1],
                depth: dAvg,
                fill: capSign > 0 ? 'rgba(226, 232, 240, 0.48)' : 'rgba(148, 163, 184, 0.34)',
                stroke: 'rgba(255, 255, 255, 0.16)',
            });
        }
    }

    // Sort back-to-front by depth
    tris.sort((a, b) => b.depth - a.depth);

    for (const tri of tris) {
        ctx.beginPath();
        ctx.moveTo(tri.x0, tri.y0);
        ctx.lineTo(tri.x1, tri.y1);
        ctx.lineTo(tri.x2, tri.y2);
        ctx.closePath();
        ctx.fillStyle = tri.fill;
        ctx.fill();

        if (tri.stroke) {
            ctx.strokeStyle = tri.stroke;
            ctx.lineWidth = 0.65;
            ctx.stroke();
        }
    }

    // 3. Advect & render 3D wind streamlines flowing around and through the barrel rotor
    const vCanvas = visualWindSpeed(props.windSpeed);
    const windScale = vCanvas / visualWindSpeed(U_REF);
    const stepDt = props.reducedMotion ? 0 : dt;
    ctx.lineCap = 'round';

    for (const pt of particles3D) {
        if (stepDt > 0) {
            const rXY = Math.hypot(pt.x, pt.y);
            const inHeight = Math.abs(pt.z) < 1.05;
            let vx = 1.65 * windScale;
            let vy = 0;
            let vz = 0;

            if (rXY < 1.15 && inHeight) {
                // Inside / passing through the barrel rotor: accelerate on the advancing front/bottom side (y > 0)
                const adv = pt.y > -0.15 ? 1.45 : 0.85;
                vx = (1.55 + 0.75 * adv) * windScale;
                // Gentle deflection matching the counter-clockwise rotation
                vy = (pt.x < 0 ? 0.42 : -0.35) * windScale;
                vz = -0.08 * pt.z * windScale;
            } else if (pt.x > 0.45 && rXY < 1.85 && inHeight) {
                // Helical wake roll-off downstream of the barrel
                const wakeDecay = Math.exp(-(pt.x - 0.45) * 0.55);
                const swirlAngle = pt.x * 2.6 + phi * 2;
                vx = (1.35 + 0.35 * (1 - wakeDecay)) * windScale;
                vy = 0.52 * Math.cos(swirlAngle) * wakeDecay * windScale;
                vz = 0.42 * Math.sin(swirlAngle) * wakeDecay * windScale;
            }

            pt.x += vx * stepDt;
            pt.y += vy * stepDt;
            pt.z += vz * stepDt;
            pt.vMag = Math.hypot(vx, vy, vz) / (1.65 * windScale);

            pt.hx.push(pt.x);
            pt.hy.push(pt.y);
            pt.hz.push(pt.z);

            if (pt.hx.length > 16) {
                pt.hx.shift();
                pt.hy.shift();
                pt.hz.shift();
            }

            if (pt.x > 2.45 || Math.abs(pt.y) > 1.7 || Math.abs(pt.z) > 1.35) {
                pt.x = -2.35 - Math.random() * 0.3;
                pt.y = (Math.random() - 0.5) * 1.85;
                pt.z = (Math.random() - 0.5) * 1.75;
                pt.hx = [pt.x];
                pt.hy = [pt.y];
                pt.hz = [pt.z];
            }
        }

        if (pt.hx.length >= 2) {
            ctx.beginPath();

            for (let k = 0; k < pt.hx.length; k++) {
                const [sx, sy] = project3D(pt.hx[k], pt.hy[k], pt.hz[k], cx, cy, sc);

                if (k === 0) {
                    ctx.moveTo(sx, sy);
                } else {
                    ctx.lineTo(sx, sy);
                }
            }

            const loadNorm = Math.max(0.15, Math.min(0.98, (pt.vMag - 0.65) / 0.85));
            ctx.strokeStyle = aeroLoadRgb(loadNorm, 0.72);
            ctx.lineWidth = 1.65;
            ctx.stroke();
        }
    }
}

/* ------------------------------------------------------------------ */
/* Animation Loop & Pointer Orbit Handlers                             */
/* ------------------------------------------------------------------ */

function frame(t: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, lastT ? (t - lastT) / 1000 : 1 / 60);
    lastT = t;

    // Physical kinematics: tip speed `omega * R_ROTOR = lambda * v_wind_canvas`.
    // At λ = 1.0, the rotor rim moves at the exact same speed as the wind particles.
    // Even at low λ (0.2), keep a realistic minimum rotation factor (0.38) so the
    // starting torque rotation never looks stalled.
    const vCanvas = visualWindSpeed(props.windSpeed);
    const effLambda = Math.max(0.38, props.tsr);
    const omega = (effLambda * vCanvas * 0.82) / R_ROTOR;

    // Counter-clockwise physical rotation (`dPhi < 0` on screen):
    // Bottom scoop (y > 0) opens to the left (-x) and moves to the right (+x) with the wind!
    phi = (phi - omega * dt + Math.PI * 20) % (Math.PI * 2);

    const tctx = trailCanvas.value?.getContext('2d');
    const gctx = geoCanvas.value?.getContext('2d');

    if (!tctx || !gctx) {
        return;
    }

    if (props.viewMode === '2d') {
        fadeTrails(tctx, dt);
        stepParticles2D(tctx, dt);
        drawGeometry2D(gctx);
    } else {
        tctx.clearRect(0, 0, cssW, cssH);
        drawScene3D(gctx, dt);
    }
}

function start() {
    if (raf || !props.active || props.reducedMotion) {
        return;
    }

    lastT = 0;
    raf = requestAnimationFrame(frame);
}

function stop() {
    if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
    }
}

function onPointerDown(e: PointerEvent) {
    if (props.viewMode !== '3d') {
        return;
    }

    isDragging3D.value = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    dragStartYaw = camYaw.value;
    dragStartPitch = camPitch.value;
    (e.currentTarget as HTMLElement | null)?.setPointerCapture?.(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
    if (!isDragging3D.value || props.viewMode !== '3d') {
        return;
    }

    const dx = e.clientX - dragStartX;
    const dy = e.clientY - dragStartY;
    camYaw.value = dragStartYaw + dx * 0.0085;
    camPitch.value = Math.max(-0.55, Math.min(1.15, dragStartPitch + dy * 0.0075));

    if (props.reducedMotion || !props.active) {
        const gctx = geoCanvas.value?.getContext('2d');

        if (gctx) {
            drawScene3D(gctx, 0);
        }
    }
}

function onPointerUp() {
    isDragging3D.value = false;
}

watch(
    () => [props.active, props.reducedMotion],
    () => {
        if (props.active && !props.reducedMotion) {
            start();
        } else {
            stop();
            setup();
        }
    },
);

watch(
    () => [props.viewMode, props.windSpeed, props.tsr],
    () => {
        const tctx = trailCanvas.value?.getContext('2d');
        const gctx = geoCanvas.value?.getContext('2d');

        if (!tctx || !gctx) {
            return;
        }

        if (props.viewMode === '2d') {
            drawGeometry2D(gctx);
        } else {
            tctx.clearRect(0, 0, cssW, cssH);
            drawScene3D(gctx, 0);
        }
    },
);

onMounted(() => {
    setup();

    if (typeof ResizeObserver !== 'undefined' && wrap.value) {
        ro = new ResizeObserver(() => setup());
        ro.observe(wrap.value);
    }

    start();
});

onBeforeUnmount(() => {
    stop();
    ro?.disconnect();
});
</script>

<template>
    <div
        ref="wrap"
        class="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#09090b] select-none"
        :class="viewMode === '3d' ? 'cursor-grab active:cursor-grabbing' : ''"
        style="
            background-image: radial-gradient(
                circle at 50% 50%,
                rgba(52, 211, 153, 0.06),
                rgba(142, 197, 255, 0.04) 42%,
                rgba(9, 9, 11, 0) 72%
            );
        "
        role="img"
        :aria-label="
            isEn
                ? 'Simulation of airflow through the Treetino Scooplet rotor with outer S-shell and inner splitter vanes'
                : 'Simulace proudění vzduchu rotorem Treetino Scooplet s vnější S-skořepinou a vnitřními usměrňovacími křidélky'
        "
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
    >
        <canvas ref="trailCanvas" class="absolute inset-0 h-full w-full" />
        <canvas ref="geoCanvas" class="pointer-events-none absolute inset-0 h-full w-full" />

        <!-- Top-left caption -->
        <div
            class="pointer-events-none absolute top-3.5 left-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase sm:text-[11px]"
        >
            <span>
                {{
                    viewMode === '2d'
                        ? isEn
                            ? 'Top-down 2D cross-section · Scooplet'
                            : 'Pohled shora · 2D průřez Scooplet'
                        : isEn
                          ? '3D barrel rotor · drag to rotate view'
                          : '3D soudečkový rotor · tažením otočíte pohled'
                }}
            </span>
        </div>

        <!-- Top-right wind speed & direction indicator -->
        <div
            class="pointer-events-none absolute top-3.5 right-4 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-[#8ec5ff]/85 uppercase sm:text-[11px]"
        >
            <span>{{ isEn ? 'wind' : 'vítr' }} {{ f(windSpeed, 1) }} m/s</span>
            <span aria-hidden="true">→</span>
        </div>

        <!-- Bottom-left live operating point -->
        <div class="pointer-events-none absolute bottom-3.5 left-4">
            <div class="flex items-baseline gap-2.5">
                <p class="font-mono text-xl font-medium tracking-tight text-white tabular-nums sm:text-2xl">
                    λ {{ f(tsr, 2) }}
                </p>
                <span class="font-mono text-xs text-[#34d399] tabular-nums">
                    v<sub>max</sub> {{ f(peakSlotVelocityMs, 1) }} m/s
                </span>
            </div>
            <p class="text-[11px] text-white/45">
                {{
                    viewMode === '2d'
                        ? isEn
                            ? 'outer S-shell (white) + inner pocket vanes (blue)'
                            : 'vnější S-skořepina (bílá) + vnitřní křidélka v dutině (modrá)'
                        : isEn
                          ? 'advancing scoop in wind (green) · returning back (blue) · 3× rib'
                          : 'záběrová lopatka ve větru (zelená) · návratová strana (modrá) · 3× přepážka'
                }}
            </p>
        </div>

        <!-- Bottom-right velocity scale -->
        <div class="pointer-events-none absolute right-4 bottom-3.5 flex flex-col items-end gap-1">
            <div
                class="h-1.5 w-24 rounded-full sm:w-28"
                style="background: linear-gradient(90deg, rgb(30, 58, 138), #3b82f6, #8ec5ff, #ffffff, #34d399)"
            ></div>
            <div class="flex w-24 justify-between font-mono text-[9px] text-white/40 tabular-nums sm:w-28">
                <span>0</span>
                <span>v [m/s]</span>
                <span>{{ f(peakSlotVelocityMs, 1) }}</span>
            </div>
        </div>
    </div>
</template>
