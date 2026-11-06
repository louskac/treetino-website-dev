<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { EUROPE_COUNTRIES } from '@/custom/web3/europePaths';
import { CZ_BBOX, MAP_CITIES, num } from './stationApp';

export interface MapStation {
    id: string;
    title: string;
    x: number;
    y: number;
    lat: number;
    lon: number;
    windMs: number;
    live: boolean;
    chipSide?: 'left' | 'right';
    /** Modelled annual output of the offered configuration (drives the energy halo) */
    annualKwh?: number;
}

export interface MapInsets {
    left: number;
    top: number;
    right: number;
    bottom: number;
}

export interface MapLink {
    from: string;
    to: string;
    label?: string;
}

const props = withDefaults(
    defineProps<{
        stations: MapStation[];
        selectedId: string | null;
        /** Occupied screen space (px) the map should keep its subject clear of */
        insets: MapInsets;
        /** Wind direction the live station reports (deg, meteorological "from") */
        windFromDeg: number;
        windMs: number;
        /** Fly in from a Europe-wide view on mount */
        intro?: boolean;
        /** Network links drawn between stations (screen-space arcs with travelling pulses) */
        links?: MapLink[];
    }>(),
    { intro: false, links: () => [] },
);

const emit = defineEmits<{
    select: [id: string];
    clear: [];
    introDone: [];
}>();

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');

const countries = EUROPE_COUNTRIES.filter((c) => c.id !== 'cz');
const czech = EUROPE_COUNTRIES.find((c) => c.id === 'cz')!;

/* ------------------------------------------------------------------ */
/* Camera                                                              */
/* ------------------------------------------------------------------ */

interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
}

const rootRef = ref<HTMLElement | null>(null);
const size = ref({ w: 1440, h: 900 });
const vb = ref<Box>({ x: 300, y: 300, w: 100, h: 62 });

const MIN_W = 8;
const MAX_W = 160;

function targetBox(): Box {
    const { w: W, h: H } = size.value;
    const ins = props.insets;
    const freeW = Math.max(120, W - ins.left - ins.right);
    const freeH = Math.max(120, H - ins.top - ins.bottom);
    const freeCx = ins.left + freeW / 2;
    const freeCy = ins.top + freeH / 2;

    const sel = props.stations.find((s) => s.id === props.selectedId);
    let cx: number;
    let cy: number;
    let s: number;

    if (sel) {
        // Focus: station centred in the free area, ~1/4 of the country visible
        cx = sel.x;
        cy = sel.y;
        s = Math.min(freeW / 22, freeH / 14);
    } else {
        const bw = CZ_BBOX.x1 - CZ_BBOX.x0;
        const bh = CZ_BBOX.y1 - CZ_BBOX.y0;
        cx = (CZ_BBOX.x0 + CZ_BBOX.x1) / 2;
        cy = (CZ_BBOX.y0 + CZ_BBOX.y1) / 2;
        s = Math.min(freeW / (bw * 1.12), freeH / (bh * 1.2));
    }

    return { x: cx - freeCx / s, y: cy - freeCy / s, w: W / s, h: H / s };
}

let raf = 0;
/** Pins ignite once the camera has arrived (immediately when there is no intro) */
const ignited = ref(!props.intro);

function animateTo(to: Box, duration = 1100, done?: () => void) {
    cancelAnimationFrame(raf);
    const from = { ...vb.value };
    const start = performance.now();
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now: number) => {
        const t = Math.max(0, Math.min(1, (now - start) / duration));
        const k = ease(t);
        // Interpolate scale in log space so zooming feels linear
        const w = Math.exp(Math.log(from.w) + (Math.log(to.w) - Math.log(from.w)) * k);
        const h = (w * to.h) / to.w;
        const fx = (from.x + from.w / 2) + ((to.x + to.w / 2) - (from.x + from.w / 2)) * k;
        const fy = (from.y + from.h / 2) + ((to.y + to.h / 2) - (from.y + from.h / 2)) * k;
        vb.value = { x: fx - w / 2, y: fy - h / 2, w, h };

        if (t < 1) {
            raf = requestAnimationFrame(step);
        } else {
            done?.();
        }
    };
    raf = requestAnimationFrame(step);
}

function measure() {
    const el = rootRef.value;

    if (!el) {
        return;
    }

    size.value = { w: el.clientWidth, h: el.clientHeight };
}

let ro: ResizeObserver | null = null;

onMounted(() => {
    measure();
    const target = targetBox();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (props.intro && !reduce) {
        // Start on a Europe-wide frame centred on Czechia, then dive in
        const W0 = target.w * 7.5;
        const H0 = (W0 * target.h) / target.w;
        const cx = target.x + target.w / 2;
        const cy = target.y + target.h / 2;
        vb.value = { x: cx - W0 / 2, y: cy - H0 / 2 - H0 * 0.04, w: W0, h: H0 };
        setTimeout(
            () =>
                animateTo(targetBox(), 2600, () => {
                    ignited.value = true;
                    emit('introDone');
                }),
            250,
        );
    } else {
        vb.value = target;
        ignited.value = true;

        if (props.intro) {
            emit('introDone');
        }
    }

    ro = new ResizeObserver(() => {
        measure();

        if (ignited.value) {
            vb.value = targetBox();
        }
    });

    if (rootRef.value) {
        ro.observe(rootRef.value);
    }
});

onBeforeUnmount(() => {
    cancelAnimationFrame(raf);
    ro?.disconnect();
});

watch(
    () => [props.selectedId, props.insets.left, props.insets.right, props.insets.top, props.insets.bottom],
    () => ignited.value && animateTo(targetBox()),
);

const scale = computed(() => size.value.w / vb.value.w);

function toScreen(x: number, y: number) {
    return { left: (x - vb.value.x) * scale.value, top: (y - vb.value.y) * scale.value };
}

const viewBoxAttr = computed(() => `${vb.value.x} ${vb.value.y} ${vb.value.w} ${vb.value.h}`);

/* ------------------------------------------------------------------ */
/* Pan & zoom (drag, wheel, buttons)                                   */
/* ------------------------------------------------------------------ */

let drag: { px: number; py: number; vx: number; vy: number; moved: boolean } | null = null;

function onPointerDown(e: PointerEvent) {
    if ((e.target as HTMLElement).closest('[data-map-ui]')) {
        return;
    }

    cancelAnimationFrame(raf);
    drag = { px: e.clientX, py: e.clientY, vx: vb.value.x, vy: vb.value.y, moved: false };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
}

function onPointerMove(e: PointerEvent) {
    if (!drag) {
        return;
    }

    const dx = e.clientX - drag.px;
    const dy = e.clientY - drag.py;

    if (Math.abs(dx) + Math.abs(dy) > 3) {
        drag.moved = true;
    }

    vb.value = { ...vb.value, x: drag.vx - dx / scale.value, y: drag.vy - dy / scale.value };
}

function onPointerUp() {
    if (drag && !drag.moved && props.selectedId) {
        emit('clear');
    }

    drag = null;
}

function zoomAt(factor: number, sx: number, sy: number) {
    cancelAnimationFrame(raf);
    const w = Math.min(MAX_W, Math.max(MIN_W, vb.value.w * factor));
    const k = w / vb.value.w;
    const mx = vb.value.x + sx / scale.value;
    const my = vb.value.y + sy / scale.value;
    vb.value = { x: mx - (mx - vb.value.x) * k, y: my - (my - vb.value.y) * k, w, h: vb.value.h * k };
}

function onWheel(e: WheelEvent) {
    const rect = rootRef.value!.getBoundingClientRect();
    zoomAt(Math.exp(e.deltaY * 0.0015), e.clientX - rect.left, e.clientY - rect.top);
}

function zoomButton(factor: number) {
    const to = { ...vb.value };
    const w = Math.min(MAX_W, Math.max(MIN_W, to.w * factor));
    const cx = to.x + to.w / 2;
    const cy = to.y + to.h / 2;
    const h = (to.h * w) / to.w;
    animateTo({ x: cx - w / 2, y: cy - h / 2, w, h }, 450);
}

function resetView() {
    animateTo(targetBox(), 800);
}

/* ------------------------------------------------------------------ */
/* Overlays                                                            */
/* ------------------------------------------------------------------ */

const stationPins = computed(() =>
    props.stations.map((s) => {
        const pos = toScreen(s.x, s.y);
        const rightLimit = props.selectedId ? size.value.w - props.insets.right + 12 : size.value.w;
        const effectiveChipSide: 'left' | 'right' =
            s.chipSide === 'left' || (pos.left + 195 > rightLimit && pos.left > 210) ? 'left' : 'right';

        return { ...s, ...pos, effectiveChipSide };
    }),
);

/* Cities in view, minus any that would collide with a station pin, its label chip, or the open drawer */
const cityLabels = computed(() => {
    const maxRight = props.selectedId ? size.value.w - props.insets.right - 55 : size.value.w + 40;

    return MAP_CITIES.map((c) => ({ ...c, displayName: isEn.value ? c.nameEn : c.name, ...toScreen(c.x, c.y) })).filter(
        (c) =>
            c.left > -40 &&
            c.top > -20 &&
            c.left < maxRight &&
            c.top < size.value.h + 20 &&
            !stationPins.value.some((p) => {
                const xMin = p.effectiveChipSide === 'left' ? p.left - 210 : p.left - 80;
                const xMax = p.effectiveChipSide === 'left' ? p.left + 80 : p.left + 230;

                return c.left > xMin && c.left < xMax && Math.abs(c.top - p.top) < 22;
            }),
    );
});

const selectedPin = computed(() => stationPins.value.find((s) => s.id === props.selectedId) ?? null);

/* Network arcs in screen space (so dash sizes stay in px at every zoom) */
const linkArcs = computed(() =>
    props.links
        .map((l, i) => {
            const a = stationPins.value.find((p) => p.id === l.from);
            const b = stationPins.value.find((p) => p.id === l.to);

            if (!a || !b) {
                return null;
            }

            const mx = (a.left + b.left) / 2;
            const my = (a.top + b.top) / 2;
            const dx = b.left - a.left;
            const dy = b.top - a.top;
            const len = Math.hypot(dx, dy) || 1;
            const bend = Math.min(90, len * 0.28);
            const cx = mx + (-dy / len) * bend;
            const cy = my + (dx / len) * bend - bend * 0.35;

            return {
                id: `link-${i}`,
                d: `M${a.left.toFixed(1)},${a.top.toFixed(1)} Q${cx.toFixed(1)},${cy.toFixed(1)} ${b.left.toFixed(1)},${b.top.toFixed(1)}`,
                label: l.label,
                lx: 0.25 * a.left + 0.5 * cx + 0.25 * b.left,
                ly: 0.25 * a.top + 0.5 * cy + 0.25 * b.top,
                len,
            };
        })
        .filter((v): v is NonNullable<typeof v> => !!v),
);

/* Energy halo diameter (px) follows the modelled annual output of each site */
function haloSize(kwh?: number) {
    if (!kwh) {
        return 0;
    }

    const zoomK = Math.min(1.6, Math.max(0.55, Math.sqrt(scale.value / 14)));

    return (70 + Math.sqrt(kwh) * 0.85) * zoomK;
}

/* Live wind streamlines, clipped to the Czech border and pointing where the wind blows */
const flowRotation = computed(() => (props.windFromDeg + 180 - 90 + 360) % 360);
const CZ_CX = (CZ_BBOX.x0 + CZ_BBOX.x1) / 2;
const CZ_CY = (CZ_BBOX.y0 + CZ_BBOX.y1) / 2;

const streamlines = Array.from({ length: 34 }, (_, i) => {
    const r = (n: number) => {
        const v = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;

        return v - Math.floor(v);
    };

    return {
        y: -34 + i * 2.05 + (r(1) - 0.5) * 1.2,
        x0: -48 + r(2) * 10,
        x1: 48 - r(3) * 10,
        dur: 0.6 + r(4) * 0.8,
        delay: -r(5) * 4,
        opacity: 0.18 + r(6) * 0.22,
    };
});

const flowSpeedFactor = computed(() => 1 / Math.max(0.6, Math.min(3, 0.6 + props.windMs * 0.6)));

function fmtCoord(v: number, pos: string, neg: string) {
    const numStr = isEn.value ? Math.abs(v).toFixed(3) : Math.abs(v).toFixed(3).replace('.', ',');

    return `${numStr}° ${v >= 0 ? pos : neg}`;
}

defineExpose({ resetView });
</script>

<template>
    <div
        ref="rootRef"
        class="station-map absolute inset-0 cursor-grab touch-none overflow-hidden select-none active:cursor-grabbing"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @wheel.prevent="onWheel"
    >
        <!-- Ambient studio lighting (same recipe as the /web3 Europe map) -->
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_55%_45%,rgba(14,165,233,0.12),rgba(0,0,0,0))]"></div>
        <div class="map-grid pointer-events-none absolute inset-0"></div>

        <svg class="absolute inset-0 h-full w-full" :viewBox="viewBoxAttr" preserveAspectRatio="xMidYMid meet">
            <defs>
                <filter id="cz-glow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="0.6" result="b" />
                    <feMerge>
                        <feMergeNode in="b" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
                <clipPath id="cz-clip">
                    <path :d="czech.d" />
                </clipPath>
                <linearGradient id="scan-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#8ec5ff" stop-opacity="0" />
                    <stop offset="80%" stop-color="#8ec5ff" stop-opacity="0.14" />
                    <stop offset="100%" stop-color="#e6f2ff" stop-opacity="0.35" />
                </linearGradient>
            </defs>

            <g fill="none" stroke-linejoin="round">
                <path
                    v-for="c in countries"
                    :key="c.id"
                    :d="c.d"
                    stroke="rgba(255,255,255,0.16)"
                    stroke-width="0.8"
                    vector-effect="non-scaling-stroke"
                />
            </g>

            <path :d="czech.d" fill="rgba(0,102,255,0.09)" stroke="none" />

            <!-- Live wind field -->
            <g clip-path="url(#cz-clip)">
                <g :transform="`translate(${CZ_CX} ${CZ_CY}) rotate(${flowRotation})`">
                    <line
                        v-for="(l, i) in streamlines"
                        :key="i"
                        :x1="l.x0"
                        :x2="l.x1"
                        :y1="l.y"
                        :y2="l.y"
                        class="streamline"
                        stroke="#8ec5ff"
                        stroke-width="1"
                        vector-effect="non-scaling-stroke"
                        stroke-linecap="round"
                        :stroke-opacity="l.opacity"
                        :style="{ animationDuration: `${l.dur * flowSpeedFactor * 2.4}s`, animationDelay: `${l.delay}s` }"
                    />
                </g>
            </g>

            <path
                :d="czech.d"
                fill="none"
                stroke="#4d8dff"
                stroke-width="1.5"
                vector-effect="non-scaling-stroke"
                filter="url(#cz-glow)"
            />

            <!-- Scan band sweeping across the country -->
            <g v-if="ignited" clip-path="url(#cz-clip)">
                <rect :x="CZ_BBOX.x0 - 8" :y="CZ_BBOX.y0 - 4" width="6" :height="CZ_BBOX.y1 - CZ_BBOX.y0 + 8" fill="url(#scan-grad)">
                    <animate attributeName="x" :from="CZ_BBOX.x0 - 8" :to="CZ_BBOX.x1 + 2" dur="7s" begin="0s" repeatCount="indefinite" />
                </rect>
            </g>
        </svg>

        <!-- Energy halos: bigger glow = more modelled kWh per year -->
        <div
            v-for="(s, i) in stationPins"
            :key="`halo-${s.id}`"
            class="halo pointer-events-none absolute rounded-full"
            :class="ignited ? 'halo-on' : 'opacity-0'"
            :style="{
                left: `${s.left}px`,
                top: `${s.top}px`,
                width: `${haloSize(s.annualKwh)}px`,
                height: `${haloSize(s.annualKwh)}px`,
                animationDelay: `${i * 0.18}s, ${i * 0.7}s`,
            }"
        ></div>

        <!-- Network: chronological campaign links with travelling pulses -->
        <svg v-if="linkArcs.length" class="pointer-events-none absolute inset-0 h-full w-full overflow-visible" :class="ignited ? 'links-on' : 'opacity-0'">
            <defs>
                <linearGradient id="link-grad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stop-color="#8ec5ff" stop-opacity="0.15" />
                    <stop offset="50%" stop-color="#8ec5ff" stop-opacity="0.7" />
                    <stop offset="100%" stop-color="#34d399" stop-opacity="0.5" />
                </linearGradient>
            </defs>
            <g v-for="(l, i) in linkArcs" :key="l.id">
                <path :id="l.id" :d="l.d" fill="none" stroke="url(#link-grad)" stroke-width="1" stroke-dasharray="2 5" class="link-dash" />
                <circle r="2.4" fill="#e6f2ff" class="link-pulse">
                    <animateMotion :dur="`${2.6 + i * 0.6}s`" repeatCount="indefinite" :begin="`${i * 0.8}s`">
                        <mpath :href="`#${l.id}`" />
                    </animateMotion>
                </circle>
            </g>
        </svg>
        <template v-for="l in linkArcs" :key="`${l.id}-label`">
            <div
                v-if="l.label && l.len > 120 && !selectedId"
                class="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-zinc-950/70 px-2 py-0.5 font-mono text-[9px] tracking-[0.14em] whitespace-nowrap text-white/45 uppercase backdrop-blur-sm transition-opacity duration-700"
                :class="ignited ? 'opacity-100' : 'opacity-0'"
                :style="{ left: `${l.lx}px`, top: `${l.ly}px` }"
            >
                {{ l.label }}
            </div>
        </template>

        <!-- Selected station crosshair -->
        <template v-if="selectedPin">
            <div class="pointer-events-none absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8ec5ff]/25 to-transparent" :style="{ top: `${selectedPin.top}px` }"></div>
            <div class="pointer-events-none absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-[#8ec5ff]/25 to-transparent" :style="{ left: `${selectedPin.left}px` }"></div>
        </template>

        <!-- Cities -->
        <div
            v-for="c in cityLabels"
            :key="c.name"
            class="pointer-events-none absolute flex -translate-y-1/2 items-center gap-1.5"
            :style="{ left: `${c.left}px`, top: `${c.top}px` }"
        >
            <span class="-ml-[2px] h-1 w-1 rounded-full bg-white/35"></span>
            <span class="text-[11px] whitespace-nowrap text-white/35">{{ c.displayName }}</span>
        </div>

        <!-- Stations -->
        <button
            v-for="(s, i) in stationPins"
            :key="s.id"
            type="button"
            data-map-ui
            class="group absolute z-10 -translate-x-1/2 -translate-y-1/2 outline-none"
            :class="ignited ? 'pin-on' : 'pointer-events-none opacity-0'"
            :style="{ left: `${s.left}px`, top: `${s.top}px`, animationDelay: `${i * 0.18}s` }"
            :aria-label="`${isEn ? 'Station' : 'Stanice'} ${s.title}`"
            @click="emit('select', s.id)"
        >
            <span class="relative flex h-10 w-10 items-center justify-center">
                <!-- ignition shockwave -->
                <span v-if="ignited" class="shockwave absolute inset-0 rounded-full border border-[#8ec5ff]/70" :style="{ animationDelay: `${i * 0.18}s` }"></span>
                <!-- radar sweep on live sites -->
                <span v-if="s.live" class="radar pointer-events-none absolute -inset-7 rounded-full"></span>
                <span v-if="s.live" class="absolute inset-0 animate-ping rounded-full bg-[#4d8dff]/25 [animation-duration:2.4s]"></span>
                <span
                    class="absolute inset-1.5 rounded-full border transition-colors duration-300"
                    :class="
                        s.id === selectedId
                            ? 'border-[#8ec5ff] bg-[#4d8dff]/20'
                            : s.live
                              ? 'border-[#8ec5ff]/55 bg-[#4d8dff]/10 group-hover:border-[#8ec5ff]'
                              : 'border-white/25 bg-white/[0.04] group-hover:border-white/50'
                    "
                ></span>
                <span
                    class="relative h-2.5 w-2.5 rounded-full transition-colors"
                    :class="
                        s.live || s.id === selectedId
                            ? 'bg-[#8ec5ff] shadow-[0_0_14px_rgba(142,197,255,0.9)]'
                            : 'bg-white/60 group-hover:bg-white'
                    "
                ></span>
            </span>
            <span
                class="absolute top-1/2 flex -translate-y-1/2 items-center gap-2 rounded-full border px-3 py-1.5 text-xs whitespace-nowrap backdrop-blur-md transition-colors duration-300"
                :class="[
                    s.effectiveChipSide === 'left' ? 'right-full mr-1' : 'left-full ml-1',
                    s.id === selectedId
                        ? 'border-[#8ec5ff]/40 bg-zinc-950/85 text-white'
                        : 'border-white/12 bg-zinc-950/70 text-white/80 group-hover:border-white/30 group-hover:text-white',
                ]"
            >
                <span class="font-medium">{{ s.title }}</span>
                <span class="text-white/35">·</span>
                <span v-if="s.live" class="text-[#8ec5ff] tabular-nums">{{ num(s.windMs, 1, locale) }} m/s</span>
                <span v-else class="text-white/45">{{ isEn ? 'historic' : 'historie' }}</span>
            </span>
        </button>

        <!-- Coordinates readout of the selection -->
        <div
            v-if="selectedPin"
            class="pointer-events-none absolute bottom-6 hidden -translate-x-1/2 font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase lg:block"
            :style="{ left: `${insets.left + Math.max(120, size.w - insets.left - insets.right) / 2}px` }"
        >
            {{ fmtCoord(selectedPin.lat, 'N', 'S') }} · {{ fmtCoord(selectedPin.lon, 'E', 'W') }}
        </div>

        <!-- Map controls -->
        <div data-map-ui class="absolute right-4 bottom-4 z-10 hidden flex-col overflow-hidden rounded-xl border border-white/10 bg-zinc-950/75 backdrop-blur-md sm:right-6 sm:bottom-6 lg:flex">
            <button type="button" class="map-ctl" :aria-label="isEn ? 'Zoom in' : 'Přiblížit'" @click="zoomButton(0.7)">+</button>
            <button type="button" class="map-ctl border-t border-white/10" :aria-label="isEn ? 'Zoom out' : 'Oddálit'" @click="zoomButton(1.4)">−</button>
            <button type="button" class="map-ctl border-t border-white/10" :aria-label="isEn ? 'Reset view' : 'Celá ČR'" @click="resetView">
                <svg viewBox="0 0 16 16" class="h-3.5 w-3.5" fill="none" stroke="currentColor" stroke-width="1.4">
                    <path d="M2 6V2h4M14 6V2h-4M2 10v4h4M14 10v4h-4" />
                </svg>
            </button>
        </div>
    </div>
</template>

<style scoped>
.map-grid {
    background-image:
        linear-gradient(to right, rgba(77, 141, 255, 0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(77, 141, 255, 0.05) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(ellipse 70% 70% at 55% 50%, #000 30%, transparent 80%);
}

.streamline {
    stroke-dasharray: 1.4 9.6;
    animation-name: flow;
    animation-timing-function: linear;
    animation-iteration-count: infinite;
}

@keyframes flow {
    from {
        stroke-dashoffset: 0;
    }
    to {
        stroke-dashoffset: -11;
    }
}

.map-ctl {
    display: flex;
    height: 2.5rem;
    width: 2.5rem;
    align-items: center;
    justify-content: center;
    font-size: 1.05rem;
    color: rgba(255, 255, 255, 0.7);
    transition: color 0.2s, background-color 0.2s;
}

.map-ctl:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
}

/* ---- ignition ---- */
.pin-on {
    animation: pin-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes pin-in {
    from {
        opacity: 0;
        scale: 0.4;
    }
    to {
        opacity: 1;
        scale: 1;
    }
}

.shockwave {
    animation: shockwave 1.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

@keyframes shockwave {
    from {
        transform: scale(0.3);
        opacity: 1;
    }
    to {
        transform: scale(4.5);
        opacity: 0;
    }
}

.radar {
    background: conic-gradient(from 0deg, rgba(142, 197, 255, 0) 0deg, rgba(142, 197, 255, 0) 290deg, rgba(142, 197, 255, 0.28) 360deg);
    mask-image: radial-gradient(circle, transparent 28%, #000 30%, #000 68%, transparent 70%);
    animation: radar 3.2s linear infinite;
}

@keyframes radar {
    to {
        transform: rotate(360deg);
    }
}

/* ---- energy halos ---- */
.halo {
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(77, 141, 255, 0.22) 0%, rgba(52, 211, 153, 0.07) 42%, rgba(9, 9, 11, 0) 70%);
}

.halo-on {
    animation:
        halo-in 1.6s ease-out both,
        halo-breathe 5s ease-in-out infinite;
}

@keyframes halo-in {
    from {
        opacity: 0;
        transform: translate(-50%, -50%) scale(0.2);
    }
    to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
    }
}

@keyframes halo-breathe {
    0%,
    100% {
        filter: brightness(1);
    }
    50% {
        filter: brightness(1.45);
    }
}

/* ---- network links ---- */
.links-on {
    animation: fade-in 1.2s 0.6s ease-out both;
}

.link-dash {
    animation: dash 1.6s linear infinite;
}

@keyframes dash {
    to {
        stroke-dashoffset: -14;
    }
}

.link-pulse {
    filter: drop-shadow(0 0 4px rgba(142, 197, 255, 0.95));
}

@keyframes fade-in {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

@media (prefers-reduced-motion: reduce) {
    .streamline,
    .radar,
    .link-dash,
    .halo-on {
        animation: none;
    }
}
</style>
