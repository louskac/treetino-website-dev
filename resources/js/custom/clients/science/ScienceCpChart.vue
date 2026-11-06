<script setup lang="ts">
/**
 * cP–λ chart of every ČVUT rotor model (3 wind-tunnel campaigns) plus the
 * ANSYS Fluent CFD result of the D150 rotor with its Venturi stator.
 *
 * Honesty rules:
 *  - Only REF small (eq. 4), REF large (eq. 5) and CORE (eq. 6) use the fitted
 *    equations published in report R00.
 *  - The other tunnel models only have a published peak (cP,max, λ_opt); their
 *    curves are quadratic reconstructions read from report figure Obr. 8 and
 *    are drawn dimmed and labelled as such.
 *  - The CFD curves are the exact table points (ANSYS Fluent, 8 Oct 2026).
 */
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { ANSYS_FLUENT_D150_DECOMP, CVUT_ALL_CAMPAIGN_MODELS, CVUT_EXPERIMENTAL_CURVES } from '../cvutPhysics';
import type { CvutCurveId } from '../cvutPhysics';
import { num } from '../stationApp';

const props = defineProps<{
    /** Start the draw-on animation (chapter scrolled into view) */
    active: boolean;
    reducedMotion?: boolean;
}>();

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');
const uid = useId();

type SeriesKind = 'cfd' | 'cfd-part' | 'equation' | 'fit';

interface CpSeries {
    id: string;
    label: string;
    kind: SeriesKind;
    cpMax: number;
    lambdaOpt: number;
    campaign: string;
    source: string;
    method: string;
    equation: string | null;
    color: string;
    path: string;
    peak: { x: number; y: number };
    order: number;
}

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

const compact = ref(false);
const W = computed(() => (compact.value ? 460 : 720));
const H = computed(() => (compact.value ? 380 : 440));
const PAD = { l: 52, r: 20, t: 20, b: 44 };
const X_MAX = 1.4;
const Y_MAX = 0.42;

function sx(lambda: number): number {
    return PAD.l + (lambda / X_MAX) * (W.value - PAD.l - PAD.r);
}

function sy(cp: number): number {
    return H.value - PAD.b - (cp / Y_MAX) * (H.value - PAD.t - PAD.b);
}

function sampledPath(fn: (l: number) => number, from: number, to: number, steps = 64): string {
    let d = '';

    for (let i = 0; i <= steps; i++) {
        const l = from + ((to - from) * i) / steps;
        d += `${i === 0 ? 'M' : 'L'}${sx(l).toFixed(1)},${sy(fn(l)).toFixed(1)}`;
    }

    return d;
}

/** Smooth Catmull-Rom path through exact data points (CFD table) */
function smoothPath(pts: [number, number][]): string {
    const p = pts.map(([l, c]) => [sx(l), sy(c)] as [number, number]);
    let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;

    for (let i = 0; i < p.length - 1; i++) {
        const p0 = p[i - 1] ?? p[i];
        const p1 = p[i];
        const p2 = p[i + 1];
        const p3 = p[i + 2] ?? p2;
        const c1x = p1[0] + (p2[0] - p0[0]) / 6;
        const c1y = p1[1] + (p2[1] - p0[1]) / 6;
        const c2x = p2[0] - (p3[0] - p1[0]) / 6;
        const c2y = p2[1] - (p3[1] - p1[1]) / 6;
        d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }

    return d;
}

/* ------------------------------------------------------------------ */
/* Series                                                              */
/* ------------------------------------------------------------------ */

interface ModelMeta {
    match: string;
    id: string;
    short: string;
    color: string;
    range: [number, number];
    curveId?: CvutCurveId;
    eqNo?: number;
    /** Quadratic curvature for reconstructed curves cP = cP,max − k (λ − λopt)² */
    k?: number;
}

const MODEL_META: ModelMeta[] = [
    { match: 'REF 0,25', id: 'ref-small', short: 'REF 0,25×0,15', color: '#8ec5ff', range: [0.36, 1.08], curveId: 'cvut-ref-small', eqNo: 4 },
    { match: 'REF 0,30', id: 'ref-large', short: 'REF 0,30×0,15', color: '#4d8dff', range: [0.42, 1.2], curveId: 'cvut-ref-large', eqNo: 5 },
    { match: 'CORE', id: 'core', short: 'CORE', color: '#ffffff', range: [0.43, 1.02], curveId: 'cvut-core', eqNo: 6 },
    { match: 'SCOOPLET (', id: 'scooplet', short: 'SCOOPLET', color: '#fbbf24', range: [0.28, 1.11], k: 0.19 },
    { match: 'SCOOPLET-HELIX', id: 'scooplet-helix', short: 'SCOOPLET-HELIX', color: '#f9a8d4', range: [0.36, 1.14], k: 0.35 },
    { match: 'ROY', id: 'roy', short: 'ROY', color: '#c4b5fd', range: [0.46, 1.22], k: 0.33 },
    { match: 'SAVONIUS', id: 'savonius', short: 'SAVONIUS', color: '#fdba74', range: [0.4, 1.27], k: 0.165 },
    { match: 'Model 2', id: 'model-2', short: 'Model 2', color: '#93c5fd', range: [0.43, 0.88], k: 0.43 },
    { match: 'Model 3', id: 'model-3', short: 'Model 3', color: '#86efac', range: [0.1, 0.57], k: 0.25 },
    { match: 'Model 1', id: 'model-1', short: 'Model 1', color: '#fca5a5', range: [0.08, 0.61], k: 0.27 },
];

function fmt(v: number, d = 3): string {
    return num(v, d, locale.value);
}

function campaignLabel(raw: string): string {
    if (raw.includes('26. 8.')) {
        return isEn.value ? 'Tunnel campaign III · 26 Aug 2026' : 'Tunelová kampaň III · 26. 8. 2026';
    }

    if (raw.includes('25. 6.')) {
        return isEn.value ? 'Tunnel campaign II · 25 Jun 2026' : 'Tunelová kampaň II · 25. 6. 2026';
    }

    if (raw.includes('20. 5.')) {
        return isEn.value ? 'Tunnel campaign I · 20 May 2026' : 'Tunelová kampaň I · 20. 5. 2026';
    }

    return raw;
}

function equationText(curveId: CvutCurveId, eqNo: number): string {
    const coeffs: Record<string, [number, number, number]> = {
        'cvut-ref-small': [-0.821, 1.233, -0.27],
        'cvut-ref-large': [-0.837, 1.257, -0.288],
        'cvut-core': [-0.298, 0.347, 0.02],
    };
    const c = coeffs[curveId];

    if (!c) {
        return '';
    }

    const sign = (v: number) => (v < 0 ? '−' : '+');
    const abs = (v: number) => fmt(Math.abs(v), 3);

    return `cP(λ) = ${c[0] < 0 ? '−' : ''}${abs(c[0])}·λ² ${sign(c[1])} ${abs(c[1])}·λ ${sign(c[2])} ${abs(c[2])}   (${isEn.value ? 'eq.' : 'rov.'} ${eqNo})`;
}

const series = computed<CpSeries[]>(() => {
    const out: CpSeries[] = [];

    // CFD · rotor + stator (exact table)
    const cfdTotal: [number, number][] = [[0, 0], ...ANSYS_FLUENT_D150_DECOMP.map((r) => [r.tsr, r.d150Total] as [number, number])];
    const cfdBlades: [number, number][] = ANSYS_FLUENT_D150_DECOMP.map((r) => [r.tsr, r.d150Blades] as [number, number]);
    const cfdSource = isEn.value
        ? 'FS ČVUT · 2D simulation, ANSYS Fluent · 8 Oct 2026 (slide 4)'
        : 'FS ČVUT · 2D simulace, ANSYS Fluent · 08. 10. 2026 (slide 4)';

    out.push({
        id: 'cfd-total',
        label: isEn.value ? 'CFD · Scooplet D150 (total)' : 'CFD · Scooplet D150 (celkem)',
        kind: 'cfd',
        cpMax: 0.382,
        lambdaOpt: 1.0,
        campaign: isEn.value ? 'CFD · October 2026' : 'CFD · říjen 2026',
        source: cfdSource,
        method: isEn.value
            ? 'Exact simulated points, outer S-shell + inner pocket vanes'
            : 'Přesné body simulace, vnější S-skořepina + vnitřní křidélka v dutině',
        equation: isEn.value ? 'cP,total = cP,shell + cP,vanes = 0.287 + 0.095' : 'cP,total = cP,skořepina + cP,křidélka = 0,287 + 0,095',
        color: '#34d399',
        path: smoothPath(cfdTotal),
        peak: { x: sx(1.0), y: sy(0.382) },
        order: 0,
    });

    out.push({
        id: 'cfd-blades',
        label: isEn.value ? 'CFD · inner pocket vanes share' : 'CFD · podíl vnitřních křidélek',
        kind: 'cfd-part',
        cpMax: 0.095,
        lambdaOpt: 1.0,
        campaign: isEn.value ? 'CFD · October 2026' : 'CFD · říjen 2026',
        source: cfdSource,
        method: isEn.value ? 'Inner pocket vane share in the Scooplet D150 CFD simulation' : 'Podíl vnitřních křidélek ve stejné CFD simulaci Scooplet D150',
        equation: null,
        color: '#6ee7b7',
        path: smoothPath(cfdBlades),
        peak: { x: sx(1.0), y: sy(0.095) },
        order: 11,
    });

    CVUT_ALL_CAMPAIGN_MODELS.forEach((m, idx) => {
        const meta = MODEL_META.find((x) => m.name.startsWith(x.match));

        if (!meta) {
            return;
        }

        const exp = meta.curveId ? CVUT_EXPERIMENTAL_CURVES.find((c) => c.id === meta.curveId) : undefined;
        const k = meta.k ?? 0.3;
        const fn = exp && meta.eqNo ? exp.evalCp : (l: number) => Math.max(0, m.cpMax - k * (l - m.lambdaOpt) ** 2);
        const isEq = Boolean(exp && meta.eqNo);
        const localizedShort = isEn.value ? meta.short.replace(/,/g, '.') : meta.short;

        out.push({
            id: meta.id,
            label: localizedShort,
            kind: isEq ? 'equation' : 'fit',
            cpMax: m.cpMax,
            lambdaOpt: m.lambdaOpt,
            campaign: campaignLabel(m.campaign),
            source: isEn.value
                ? `FS ČVUT · Technical report R00 · 27 Aug 2026${isEq ? `, eq. ${meta.eqNo}` : ', Fig. 8'}`
                : `FS ČVUT · Technická zpráva R00 · 27. 08. 2026${isEq ? `, rov. ${meta.eqNo}` : ', obr. 8'}`,
            method: isEq
                ? isEn.value
                    ? 'Weighted 2nd-order fit of measured points (published equation)'
                    : 'Vážené proložení měřených bodů polynomem 2. st. (publikovaná rovnice)'
                : isEn.value
                  ? 'Curve shape reconstructed from Fig. 8; only the peak is published'
                  : 'Tvar křivky rekonstruován z obr. 8; publikováno je jen maximum',
            equation: isEq && meta.curveId && meta.eqNo ? equationText(meta.curveId, meta.eqNo) : null,
            color: meta.color,
            path: sampledPath(fn, meta.range[0], meta.range[1]),
            peak: { x: sx(m.lambdaOpt), y: sy(m.cpMax) },
            order: idx,
        });
    });

    return out;
});

/* Draw order: dimmed first, emphasis on top, CFD total last */
const drawOrder = computed(() => {
    const rank: Record<SeriesKind, number> = { fit: 0, 'cfd-part': 1, equation: 2, cfd: 3 };

    return [...series.value].sort((a, b) => rank[a.kind] - rank[b.kind] || a.order - b.order);
});

const legendGroups = computed(() => [
    { key: 'cfd', title: isEn.value ? 'CFD · ANSYS Fluent' : 'CFD · ANSYS Fluent', items: series.value.filter((s) => s.kind === 'cfd' || s.kind === 'cfd-part') },
    { key: 'eq', title: isEn.value ? 'Wind tunnel · published equation' : 'Tunel · publikovaná rovnice', items: series.value.filter((s) => s.kind === 'equation') },
    { key: 'fit', title: isEn.value ? 'Wind tunnel · peak only (Fig. 8)' : 'Tunel · jen maximum (obr. 8)', items: series.value.filter((s) => s.kind === 'fit') },
]);

/* ------------------------------------------------------------------ */
/* Interaction                                                         */
/* ------------------------------------------------------------------ */

const hovered = ref<string | null>(null);
const pinned = ref<string | null>(null);
const focusId = computed(() => hovered.value ?? pinned.value);
const focused = computed(() => series.value.find((s) => s.id === focusId.value) ?? null);

function togglePin(id: string) {
    pinned.value = pinned.value === id ? null : id;
}

function strokeFor(s: CpSeries): string {
    if (focusId.value === s.id) {
        return s.color;
    }

    if (s.kind === 'fit') {
        return 'rgba(255,255,255,0.28)';
    }

    return s.color;
}

function opacityFor(s: CpSeries): number {
    if (focusId.value) {
        return focusId.value === s.id ? 1 : 0.12;
    }

    if (s.kind === 'fit') {
        return 0.9;
    }

    if (s.kind === 'cfd-part') {
        return 0.55;
    }

    return 1;
}

function widthFor(s: CpSeries): number {
    const base = s.kind === 'cfd' ? 2.6 : s.kind === 'equation' ? 1.8 : 1.2;

    return focusId.value === s.id ? base + 0.8 : base;
}

/* Draw-on animation, once per mount */
const drawn = ref(false);

watch(
    () => props.active,
    (v) => {
        if (v) {
            drawn.value = true;
        }
    },
    { immediate: true },
);

function drawStyle(s: CpSeries, i: number) {
    if (props.reducedMotion) {
        return { strokeDasharray: s.kind === 'cfd-part' ? '4 5' : undefined };
    }

    if (s.kind === 'cfd-part') {
        return {
            strokeDasharray: '4 5',
            opacity: drawn.value ? undefined : 0,
            transition: `opacity 900ms ease ${0.6 + i * 0.08}s, stroke-opacity 300ms ease`,
        };
    }

    const dur = s.kind === 'cfd' ? 2.2 : 1.5;
    const delay = s.kind === 'cfd' ? 1.1 : 0.15 + i * 0.08;

    return {
        strokeDasharray: 1,
        strokeDashoffset: drawn.value ? 0 : 1,
        transition: `stroke-dashoffset ${dur}s cubic-bezier(.65,0,.35,1) ${delay}s, stroke-opacity 300ms ease, stroke-width 200ms ease`,
    };
}

/* Narrow containers get a compact viewBox so labels stay legible */
const plotWrap = ref<HTMLDivElement | null>(null);
let ro: ResizeObserver | null = null;

onMounted(() => {
    ro = new ResizeObserver((entries) => {
        const w = entries[0]?.contentRect.width ?? 720;
        compact.value = w < 560;
    });

    if (plotWrap.value) {
        ro.observe(plotWrap.value);
    }
});

onBeforeUnmount(() => {
    ro?.disconnect();
    ro = null;
});

const yTicks = [0, 0.1, 0.2, 0.3, 0.4];
const xTicks = [0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.2, 1.4];

const cfd = computed(() => series.value.find((s) => s.id === 'cfd-total')!);
const core = computed(() => series.value.find((s) => s.id === 'core'));
</script>

<template>
    <div class="grid gap-6 lg:grid-cols-[minmax(0,1fr)_15rem] lg:gap-8">
        <div ref="plotWrap" class="relative">
            <svg
                :viewBox="`0 0 ${W} ${H}`"
                class="w-full select-none"
                role="img"
                :aria-label="isEn ? 'Power coefficient versus tip-speed ratio of all ČVUT rotor models' : 'Součinitel výkonu v závislosti na rychlostním poměru všech modelů ČVUT'"
                @mouseleave="hovered = null"
            >
                <defs>
                    <filter :id="`${uid}-glow`" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="6" />
                    </filter>
                    <clipPath :id="`${uid}-clip`">
                        <rect :x="PAD.l" :y="PAD.t - 10" :width="W - PAD.l - PAD.r" :height="H - PAD.t - PAD.b + 10" />
                    </clipPath>
                    <linearGradient :id="`${uid}-area`" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="#34d399" stop-opacity="0.16" />
                        <stop offset="100%" stop-color="#34d399" stop-opacity="0" />
                    </linearGradient>
                </defs>

                <!-- Grid -->
                <g :style="{ fontSize: compact ? '17px' : '11px' }">
                    <line
                        v-for="t in yTicks"
                        :key="`y${t}`"
                        :x1="PAD.l"
                        :x2="W - PAD.r"
                        :y1="sy(t)"
                        :y2="sy(t)"
                        :stroke="t === 0 ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)'"
                        stroke-width="1"
                    />
                    <text
                        v-for="t in yTicks"
                        :key="`yl${t}`"
                        :x="PAD.l - 10"
                        :y="sy(t) + 4"
                        text-anchor="end"
                        class="fill-white/35 font-mono tabular-nums"
                    >
                        {{ fmt(t, 1) }}
                    </text>
                    <line
                        v-for="t in xTicks"
                        :key="`x${t}`"
                        :x1="sx(t)"
                        :x2="sx(t)"
                        :y1="PAD.t"
                        :y2="H - PAD.b"
                        stroke="rgba(255,255,255,0.04)"
                    />
                    <text
                        v-for="t in xTicks"
                        :key="`xl${t}`"
                        :x="sx(t)"
                        :y="H - PAD.b + 20"
                        text-anchor="middle"
                        class="fill-white/35 font-mono tabular-nums"
                    >
                        {{ fmt(t, 1) }}
                    </text>
                    <text :x="W - PAD.r" :y="H - 6" text-anchor="end" class="fill-white/45 font-mono tracking-[0.15em]">
                        λ · TSR
                    </text>
                    <text :x="PAD.l - 10" :y="PAD.t - 6" text-anchor="end" class="fill-white/45 font-mono">cP</text>
                </g>

                <g :clip-path="`url(#${uid}-clip)`">
                    <!-- CFD area + glow -->
                    <path
                        :d="`${cfd.path} L${sx(1.4)},${sy(0)} L${sx(0)},${sy(0)} Z`"
                        :fill="`url(#${uid}-area)`"
                        class="transition-opacity duration-[1500ms]"
                        :style="{ opacity: drawn ? (focusId && focusId !== 'cfd-total' ? 0.15 : 1) : 0, transitionDelay: drawn && !focusId ? '2.2s' : '0s' }"
                    />
                    <path
                        :d="cfd.path"
                        fill="none"
                        stroke="#34d399"
                        stroke-width="8"
                        stroke-linecap="round"
                        :filter="`url(#${uid}-glow)`"
                        pathLength="1"
                        :stroke-opacity="focusId && focusId !== 'cfd-total' ? 0.05 : 0.45"
                        :style="drawStyle(cfd, 0)"
                    />

                    <!-- Curves -->
                    <path
                        v-for="(s, i) in drawOrder"
                        :key="s.id"
                        :d="s.path"
                        fill="none"
                        :stroke="strokeFor(s)"
                        :stroke-width="widthFor(s)"
                        :stroke-opacity="opacityFor(s)"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        pathLength="1"
                        :style="drawStyle(s, i)"
                    />

                    <!-- Wide invisible hit areas -->
                    <path
                        v-for="s in drawOrder"
                        :key="`hit-${s.id}`"
                        :d="s.path"
                        fill="none"
                        stroke="transparent"
                        stroke-width="16"
                        class="cursor-pointer"
                        style="pointer-events: stroke"
                        @mouseenter="hovered = s.id"
                        @click="togglePin(s.id)"
                    />
                </g>

                <!-- Peak markers -->
                <g
                    class="transition-opacity duration-700"
                    :style="{ opacity: drawn || reducedMotion ? 1 : 0, transitionDelay: reducedMotion ? '0s' : '1.6s' }"
                >
                    <circle
                        v-for="s in drawOrder"
                        :key="`pk-${s.id}`"
                        :cx="s.peak.x"
                        :cy="s.peak.y"
                        :r="focusId === s.id ? 5 : s.kind === 'cfd' ? 4.5 : s.kind === 'equation' ? 3 : 2.2"
                        :fill="s.kind === 'fit' && focusId !== s.id ? 'rgba(255,255,255,0.45)' : s.color"
                        :fill-opacity="opacityFor(s)"
                        class="pointer-events-none transition-all duration-300"
                    />
                </g>

                <!-- Direct labels -->
                <g
                    class="pointer-events-none transition-opacity duration-700"
                    :style="{ opacity: (drawn || reducedMotion) && !focusId ? 1 : 0, transitionDelay: drawn && !focusId && !reducedMotion ? '2.6s' : '0s' }"
                >
                    <text :x="cfd.peak.x" :y="cfd.peak.y - 16" text-anchor="middle" :class="compact ? 'text-[17px]' : 'text-[13px]'" class="fill-[#34d399] font-medium" stroke="rgb(9,9,11)" stroke-width="5" paint-order="stroke">
                        CFD · ANSYS Fluent · {{ fmt(0.382) }}
                    </text>
                    <text v-if="core" :x="core.peak.x - 8" :y="core.peak.y + 22" text-anchor="middle" :class="compact ? 'text-[16px]' : 'text-[12px]'" class="fill-white/80" stroke="rgb(9,9,11)" stroke-width="5" paint-order="stroke">
                        {{ isEn ? 'CORE · bare rotor' : 'CORE · samotný rotor' }} {{ fmt(core.cpMax) }}
                    </text>
                </g>
            </svg>

            <!-- Readout (tooltip) -->
            <Transition
                enter-active-class="transition duration-200 ease-out"
                enter-from-class="opacity-0 translate-y-1"
                leave-active-class="transition duration-150 ease-in"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="focused"
                    :key="focused.id"
                    class="pointer-events-none mt-3 rounded-2xl sm:absolute sm:top-[4%] sm:left-[9%] sm:mt-0 sm:w-[min(19rem,78%)] border border-white/10 bg-zinc-950/85 p-4 shadow-2xl backdrop-blur-xl"
                >
                    <p class="flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] uppercase">
                        <span class="h-2 w-2 rounded-full" :style="{ background: focused.color, boxShadow: `0 0 10px ${focused.color}` }"></span>
                        <span class="text-white/45">{{ focused.campaign }}</span>
                    </p>
                    <p class="mt-2 text-base font-medium tracking-[-0.01em] text-white">{{ focused.label }}</p>
                    <div class="mt-3 grid grid-cols-2 gap-3 border-t border-white/10 pt-3">
                        <div>
                            <p class="text-2xl leading-none font-medium tracking-[-0.03em] tabular-nums" :style="{ color: focused.color }">
                                {{ fmt(focused.cpMax) }}
                            </p>
                            <p class="mt-1 text-[11px] text-white/45">c<sub>P,max</sub></p>
                        </div>
                        <div>
                            <p class="text-2xl leading-none font-medium tracking-[-0.03em] text-white tabular-nums">{{ fmt(focused.lambdaOpt) }}</p>
                            <p class="mt-1 text-[11px] text-white/45">λ<sub>opt</sub></p>
                        </div>
                    </div>
                    <p v-if="focused.equation" class="mt-3 font-mono text-[11px] leading-relaxed text-white/75">{{ focused.equation }}</p>
                    <p class="mt-2 text-[11px] leading-snug text-white/45">{{ focused.method }}</p>
                    <p class="mt-1 text-[11px] leading-snug text-white/35">{{ focused.source }}</p>
                </div>
            </Transition>
        </div>

        <!-- Legend -->
        <div class="flex flex-col gap-5 text-sm">
            <div v-for="g in legendGroups" :key="g.key">
                <p class="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">{{ g.title }}</p>
                <ul class="mt-2 flex flex-wrap gap-1.5 lg:flex-col lg:gap-0.5">
                    <li v-for="s in g.items" :key="s.id">
                        <button
                            type="button"
                            class="group flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors lg:-mx-2"
                            :class="focusId === s.id ? 'bg-white/[0.07] text-white' : 'text-white/60 hover:bg-white/[0.04] hover:text-white'"
                            :aria-pressed="pinned === s.id"
                            @mouseenter="hovered = s.id"
                            @mouseleave="hovered = null"
                            @focus="hovered = s.id"
                            @blur="hovered = null"
                            @click="togglePin(s.id)"
                        >
                            <span
                                class="h-[3px] w-4 shrink-0 rounded-full"
                                :style="{
                                    background: s.kind === 'fit' && focusId !== s.id ? 'rgba(255,255,255,0.35)' : s.color,
                                    boxShadow: s.kind === 'cfd' ? '0 0 8px #34d399' : undefined,
                                }"
                            ></span>
                            <span class="truncate text-[13px]">{{ s.label }}</span>
                            <span class="ml-auto pl-2 font-mono text-[11px] text-white/40 tabular-nums">{{ fmt(s.cpMax) }}</span>
                        </button>
                    </li>
                </ul>
            </div>
            <p class="text-[11px] leading-snug text-white/35">
                {{
                    isEn
                        ? 'Hover or tap a curve. Values: maximum power coefficient cP,max.'
                        : 'Najeďte nebo klepněte na křivku. Hodnoty: maximální součinitel výkonu cP,max.'
                }}
            </p>
        </div>
    </div>
</template>
