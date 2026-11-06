<script setup lang="ts">
/**
 * "The Science · ČVUT" full-screen overlay for /clients.
 * Presents the real FS ČVUT turbine research (wind tunnel, CFD) and traces the
 * selected station's offer from measurement to kWh and CZK.
 */
import { ArrowLeft, ArrowUpRight } from 'lucide-vue-next';
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, useSlots, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import Header from '@/custom/Header.vue';
import InvestorChapterMark from '@/custom/investors/InvestorChapterMark.vue';
import InvestorStats from '@/custom/investors/InvestorStats.vue';
import { HEADLINE, BTN_SECONDARY } from '@/custom/investors/tokens';
import { ANSYS_FLUENT_D150_DECOMP } from '../cvutPhysics';
import type { SiteOfferSimulationResult } from '../cvutPhysics';
import type { StationTelemetryBundle } from '../pwsData';
import { num, tr } from '../stationApp';
import type { StationEntry, StationVariantOption } from '../stationApp';
import ScienceChain from './ScienceChain.vue';
import ScienceCpChart from './ScienceCpChart.vue';
import ScienceRotorFlow from './ScienceRotorFlow.vue';

const props = defineProps<{
    open: boolean;
    entry: StationEntry;
    sim: SiteOfferSimulationResult;
    variant: StationVariantOption;
    live: StationTelemetryBundle['current'];
}>();

const emit = defineEmits<{
    close: [];
}>();

defineSlots<{
    tracking?: (props: { active: boolean }) => unknown;
}>();

const slots = useSlots();
const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');
const f = (v: number, d = 0) => num(v, d, locale.value);

/* ------------------------------------------------------------------ */
/* Chapters + scroll observation                                       */
/* ------------------------------------------------------------------ */

type ChapterId = 'tunnel' | 'stator' | 'chain' | 'tracking' | 'sources';

const chapters = computed<{ id: ChapterId; idx: string; label: string }[]>(() => [
    { id: 'tunnel', idx: '01', label: isEn.value ? 'Wind tunnel' : 'Aerodynamický tunel' },
    { id: 'stator', idx: '02', label: isEn.value ? 'Scooplet & CFD' : 'Scooplet a CFD' },
    { id: 'chain', idx: '03', label: isEn.value ? 'Measurement → kWh' : 'Měření → kWh' },
    { id: 'tracking', idx: '04', label: isEn.value ? 'Sun tracking' : 'Sledování slunce' },
    { id: 'sources', idx: '05', label: isEn.value ? 'Sources' : 'Zdroje' },
]);

const scroller = ref<HTMLDivElement | null>(null);
const closeBtn = ref<HTMLButtonElement | null>(null);
const reducedMotion = ref(false);
const activeChapter = ref<ChapterId>('tunnel');
const seen = reactive<Record<ChapterId, boolean>>({ tunnel: false, stator: false, chain: false, tracking: false, sources: false });
const inView = reactive<Record<ChapterId, boolean>>({ tunnel: false, stator: false, chain: false, tracking: false, sources: false });
const heroSeen = ref(false);

let visObserver: IntersectionObserver | null = null;
let navObserver: IntersectionObserver | null = null;
let clockTimer: ReturnType<typeof setInterval> | null = null;
let prevOverflow = '';

function chapterOf(el: Element): ChapterId | null {
    return (el.getAttribute('data-chapter') as ChapterId | null) ?? null;
}

function setupObservers() {
    teardownObservers();
    const root = scroller.value;

    if (!root) {
        return;
    }

    const sections = Array.from(root.querySelectorAll('[data-chapter]'));

    visObserver = new IntersectionObserver(
        (entries) => {
            for (const e of entries) {
                const id = chapterOf(e.target);

                if (!id) {
                    continue;
                }

                inView[id] = e.isIntersecting;

                if (e.isIntersecting) {
                    seen[id] = true;
                }
            }
        },
        { root, rootMargin: '0px 0px -12% 0px', threshold: [0, 0.12] },
    );

    navObserver = new IntersectionObserver(
        (entries) => {
            for (const e of entries) {
                const id = chapterOf(e.target);

                if (id && e.isIntersecting) {
                    activeChapter.value = id;
                }
            }
        },
        { root, rootMargin: '-40% 0px -55% 0px', threshold: 0 },
    );

    for (const s of sections) {
        visObserver.observe(s);
        navObserver.observe(s);
    }
}

function teardownObservers() {
    visObserver?.disconnect();
    navObserver?.disconnect();
    visObserver = null;
    navObserver = null;

    for (const k of Object.keys(inView) as ChapterId[]) {
        inView[k] = false;
    }
}

function scrollToChapter(id: ChapterId) {
    const el = scroller.value?.querySelector(`[data-chapter="${id}"]`);
    el?.scrollIntoView({ behavior: reducedMotion.value ? 'auto' : 'smooth', block: 'start' });
}

function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        emit('close');
    }
}

async function onOpen() {
    window.addEventListener('keydown', onKey, true);
    prevOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    now.value = new Date();
    clockTimer = setInterval(() => {
        now.value = new Date();
    }, 60_000);

    await nextTick();
    scroller.value?.scrollTo({ top: 0 });
    activeChapter.value = 'tunnel';
    setupObservers();
    closeBtn.value?.focus({ preventScroll: true });
    requestAnimationFrame(() => {
        heroSeen.value = true;
    });
}

function onClose() {
    window.removeEventListener('keydown', onKey, true);
    document.documentElement.style.overflow = prevOverflow;

    if (clockTimer) {
        clearInterval(clockTimer);
    }

    clockTimer = null;
    teardownObservers();
    heroSeen.value = false;

    for (const k of Object.keys(seen) as ChapterId[]) {
        seen[k] = false;
    }
}

function updateNarrow() {
    narrow.value = window.innerWidth < 640;
}

onMounted(() => {
    updateNarrow();
    window.addEventListener('resize', updateNarrow, { passive: true });
    reducedMotion.value = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (props.open) {
        void onOpen();
    }
});

watch(
    () => props.open,
    (v, old) => {
        if (typeof window === 'undefined' || v === old) {
            return;
        }

        if (v) {
            void onOpen();
        } else {
            onClose();
        }
    },
);

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateNarrow);

    if (props.open) {
        onClose();
    }
});

/** Reveal-on-scroll classes for text blocks */
function reveal(id: ChapterId | 'hero', delayMs = 0) {
    const on = reducedMotion.value || (id === 'hero' ? heroSeen.value : seen[id]);

    return {
        class: [
            'transition-[opacity,transform] duration-[1100ms] ease-[cubic-bezier(.2,.7,.2,1)]',
            on ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        ],
        style: { transitionDelay: on && !reducedMotion.value ? `${delayMs}ms` : '0ms' },
    };
}

/* ------------------------------------------------------------------ */
/* 01 · Tunnel stats                                                   */
/* ------------------------------------------------------------------ */

const tunnelStats = computed(() => [
    { value: '10', label: isEn.value ? 'rotor models measured' : 'změřených modelů rotoru' },
    { value: '3', label: isEn.value ? 'tunnel campaigns · 20 May, 25 Jun, 26 Aug 2026' : 'tunelové kampaně · 20. 5., 25. 6., 26. 8. 2026' },
    { value: isEn.value ? '6.2–11' : '6,2–11', label: isEn.value ? 'm/s tunnel wind speed' : 'm/s rychlost v tunelu' },
]);

const heroStats = computed(() => [
    { value: f(0.382, 3), label: isEn.value ? 'cP · Scooplet D150 (with inner vanes), CFD' : 'cP · Scooplet D150 (s vnitřními křidélky), CFD' },
    { value: f(0.121, 3), label: isEn.value ? 'cP · bare CORE rotor, tunnel' : 'cP · samotný rotor CORE, tunel' },
    { value: `×${f(0.382 / 0.121, 1)}`, label: isEn.value ? 'gain from inner pocket vanes' : 'nárůst výkonu s vnitřními křidélky' },
]);

/* ------------------------------------------------------------------ */
/* 02 · Scooplet CFD & Interactive Operating Point                     */
/* ------------------------------------------------------------------ */

const rotorViewMode = ref<'2d' | '3d'>('2d');
const windSpeed = ref(8.0);
const tsr = ref(1.0);
const FULL_SCALE_AREA_M2 = 0.76; // D = 1.3 m full-scale rotor active area (FS ČVUT)
const FULL_SCALE_RADIUS_M = 0.65; // R = D / 2 = 0.65 m
const AIR_DENSITY = 1.225; // kg/m³

const decomp = computed(() => {
    const rows = ANSYS_FLUENT_D150_DECOMP;
    const l = Math.min(rows[rows.length - 1].tsr, Math.max(rows[0].tsr, tsr.value));
    let i = 0;

    while (i < rows.length - 2 && l > rows[i + 1].tsr) {
        i++;
    }

    const a = rows[i];
    const b = rows[i + 1];
    const t = (l - a.tsr) / (b.tsr - a.tsr);
    const lerp = (x: number, y: number) => x + (y - x) * t;

    // In ANSYS Fluent decomposition:
    //  - `d150Guides` is the outer S-shell contribution (0.287 at λ=1.0, ~75% of power)
    //  - `d150Blades` is the inner pocket splitter vane contribution (0.095 at λ=1.0, ~25% of power)
    const outerShellCp = lerp(a.d150Guides, b.d150Guides);
    const innerVanesCp = lerp(a.d150Blades, b.d150Blades);
    const totalCp = lerp(a.d150Total, b.d150Total);

    const v = windSpeed.value;
    const powerW = 0.5 * AIR_DENSITY * FULL_SCALE_AREA_M2 * Math.pow(v, 3) * Math.max(0, totalCp);
    const omegaRadS = (tsr.value * v) / FULL_SCALE_RADIUS_M;
    const rpm = (omegaRadS * 60) / (2 * Math.PI);
    const peakJetMs = v * 1.8625 * Math.max(0.75, 1 - 0.16 * Math.pow(tsr.value - 1.0, 2));

    return {
        outerShellCp,
        innerVanesCp,
        total: totalCp,
        powerW,
        rpm,
        peakJetMs,
        exact: Math.abs(t) < 0.02 || Math.abs(1 - t) < 0.02,
    };
});

// Simple cP(λ) curve coordinates for the bottom-left interactive chart
const CP_CHART_W = 540;
const CP_CHART_H = 116;
const CP_PAD = { l: 34, r: 16, t: 14, b: 22 };

function cpChartX(lambdaVal: number): number {
    const plotW = CP_CHART_W - CP_PAD.l - CP_PAD.r;

    return CP_PAD.l + ((lambdaVal - 0.2) / 1.2) * plotW;
}

function cpChartY(cpVal: number): number {
    const plotH = CP_CHART_H - CP_PAD.t - CP_PAD.b;

    return CP_PAD.t + (1 - Math.max(0, Math.min(0.42, cpVal)) / 0.42) * plotH;
}

const cpCurveData = computed(() => {
    const pts = ANSYS_FLUENT_D150_DECOMP.map((r) => ({
        tsr: r.tsr,
        x: cpChartX(r.tsr),
        yTotal: cpChartY(r.d150Total),
        yOuter: cpChartY(r.d150Guides),
        cp: r.d150Total,
    }));

    const lineTotal = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.yTotal.toFixed(1)}`).join(' ');
    const lineOuter = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.yOuter.toFixed(1)}`).join(' ');
    const baseY = cpChartY(0);
    const areaTotal = `${lineTotal} L${pts[pts.length - 1].x.toFixed(1)},${baseY.toFixed(1)} L${pts[0].x.toFixed(1)},${baseY.toFixed(1)} Z`;

    return {
        pts,
        lineTotal,
        lineOuter,
        areaTotal,
        activeX: cpChartX(tsr.value),
        activeY: cpChartY(decomp.value.total),
        baseY,
    };
});

function onCpChartPick(e: MouseEvent) {
    const svg = e.currentTarget as SVGSVGElement | null;

    if (!svg) {
        return;
    }

    const rect = svg.getBoundingClientRect();
    const relX = ((e.clientX - rect.left) / Math.max(1, rect.width)) * CP_CHART_W;
    const plotW = CP_CHART_W - CP_PAD.l - CP_PAD.r;
    const rawTsr = 0.2 + ((relX - CP_PAD.l) / plotW) * 1.2;
    tsr.value = Math.round(Math.max(0.2, Math.min(1.4, rawTsr)) * 50) / 50;
}

/* ------------------------------------------------------------------ */
/* 04 · Sun path (NOAA solar position)                                 */
/* ------------------------------------------------------------------ */

const now = ref(new Date());
const DEG = Math.PI / 180;

function tzOffsetMinutes(date: Date, tz: string): number {
    try {
        const parts = new Intl.DateTimeFormat('en-US', {
            timeZone: tz,
            hourCycle: 'h23',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).formatToParts(date);
        const get = (t: string) => Number(parts.find((p) => p.type === t)?.value ?? 0);
        const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour') % 24, get('minute'));

        return Math.round((asUtc - date.getTime()) / 60_000);
    } catch {
        return -date.getTimezoneOffset();
    }
}

function dayOfYear(y: number, m: number, d: number): number {
    return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86_400_000);
}

function solarTerms(doy: number, hourUtc: number) {
    const g = ((2 * Math.PI) / 365) * (doy - 1 + (hourUtc - 12) / 24);
    const eqTime =
        229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
    const decl =
        0.006918 -
        0.399912 * Math.cos(g) +
        0.070257 * Math.sin(g) -
        0.006758 * Math.cos(2 * g) +
        0.000907 * Math.sin(2 * g) -
        0.002697 * Math.cos(3 * g) +
        0.00148 * Math.sin(3 * g);

    return { eqTime, decl };
}

/** Solar elevation + azimuth (deg) for UTC minutes of a given day */
function solarPos(doy: number, utcMin: number, lat: number, lon: number) {
    const { eqTime, decl } = solarTerms(doy, utcMin / 60);
    const tst = utcMin + eqTime + 4 * lon;
    const ha = (tst / 4 - 180) * DEG;
    const phi = lat * DEG;
    const cosZ = Math.sin(phi) * Math.sin(decl) + Math.cos(phi) * Math.cos(decl) * Math.cos(ha);
    const zen = Math.acos(Math.min(1, Math.max(-1, cosZ)));
    const az = (Math.atan2(Math.sin(ha), Math.cos(ha) * Math.sin(phi) - Math.tan(decl) * Math.cos(phi)) / DEG + 180 + 360) % 360;

    return { elev: 90 - zen / DEG, az };
}

function sunEvents(doy: number, lat: number, lon: number) {
    const { eqTime, decl } = solarTerms(doy, 12);
    const phi = lat * DEG;
    const cosH = Math.cos(90.833 * DEG) / (Math.cos(phi) * Math.cos(decl)) - Math.tan(phi) * Math.tan(decl);
    const noon = 720 - 4 * lon - eqTime;

    if (cosH > 1 || cosH < -1) {
        return { noon, rise: null, set: null, maxElev: 90 - Math.abs(lat - decl / DEG) };
    }

    const h0 = Math.acos(cosH) / DEG;

    return { noon, rise: 720 - 4 * (lon + h0) - eqTime, set: 720 - 4 * (lon - h0) - eqTime, maxElev: 90 - Math.abs(lat - decl / DEG) };
}

const narrow = ref(false);
const SUN_W = computed(() => (narrow.value ? 440 : 720));
const SUN_H = computed(() => (narrow.value ? 320 : 300));
const SUN_PAD = { l: 40, r: 16, t: 24, b: 36 };
const ELEV_MIN = -20;
const ELEV_MAX = 70;

function sunX(localMin: number): number {
    return SUN_PAD.l + (localMin / 1440) * (SUN_W.value - SUN_PAD.l - SUN_PAD.r);
}

function sunY(elev: number): number {
    return SUN_PAD.t + ((ELEV_MAX - elev) / (ELEV_MAX - ELEV_MIN)) * (SUN_H.value - SUN_PAD.t - SUN_PAD.b);
}

function hhmm(min: number): string {
    const m = ((Math.round(min) % 1440) + 1440) % 1440;

    return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}

const sunPath = computed(() => {
    const { lat, lon, tzName } = props.entry.bundle.identity;
    const tz = tzName || 'Europe/Prague';
    const d = now.value;
    const offset = tzOffsetMinutes(d, tz);
    const localMs = d.getTime() + offset * 60_000;
    const ld = new Date(localMs);
    const y = ld.getUTCFullYear();
    const doy = dayOfYear(y, ld.getUTCMonth() + 1, ld.getUTCDate());
    const nowLocalMin = ld.getUTCHours() * 60 + ld.getUTCMinutes();

    const curve = (dayN: number, off: number) => {
        let p = '';

        for (let m = 0; m <= 1440; m += 10) {
            const e = solarPos(dayN, m - off, lat, lon).elev;
            p += `${m === 0 ? 'M' : 'L'}${sunX(m).toFixed(1)},${sunY(e).toFixed(1)}`;
        }

        return p;
    };

    const offJun = tzOffsetMinutes(new Date(Date.UTC(y, 5, 21, 12)), tz);
    const offDec = tzOffsetMinutes(new Date(Date.UTC(y, 11, 21, 12)), tz);
    const ev = sunEvents(doy, lat, lon);
    const nowPos = solarPos(doy, nowLocalMin - offset, lat, lon);
    const juneEv = sunEvents(dayOfYear(y, 6, 21), lat, lon);
    const decEv = sunEvents(dayOfYear(y, 12, 21), lat, lon);
    const toLocal = (m: number | null) => (m === null ? null : m + offset);
    const rise = toLocal(ev.rise);
    const set = toLocal(ev.set);
    const noon = ev.noon + offset;

    return {
        today: curve(doy, offset),
        june: curve(dayOfYear(y, 6, 21), offJun),
        december: curve(dayOfYear(y, 12, 21), offDec),
        rise,
        set,
        noon,
        maxElev: ev.maxElev,
        juneMax: juneEv.maxElev,
        decMax: decEv.maxElev,
        juneLabel: { x: sunX(juneEv.noon + offJun), y: sunY(juneEv.maxElev) - 8 },
        decLabel: { x: sunX(decEv.noon + offDec) + 54, y: sunY(decEv.maxElev * 0.45) },
        dayLength: rise !== null && set !== null ? set - rise : null,
        nowMin: nowLocalMin,
        nowElev: nowPos.elev,
        nowAz: nowPos.az,
        dateLabel: isEn.value
            ? ld.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
            : ld.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }),
        lat,
        lon,
    };
});

const sunHoursTicks = [0, 3, 6, 9, 12, 15, 18, 21, 24];
const sunElevTicks = [-15, 0, 15, 30, 45, 60];

function azimuthName(az: number): string {
    const en = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const cs = ['S', 'SV', 'V', 'JV', 'J', 'JZ', 'Z', 'SZ'];
    const i = Math.round(az / 45) % 8;

    return isEn.value ? en[i] : cs[i];
}

const trackingFacts = computed(() => {
    const s = props.sim.system;
    const leaves = s.solarLeafCount * props.sim.quantity;

    return [
        {
            k: isEn.value ? '2-axis' : '2 osy',
            title: isEn.value ? 'Tracking per branch' : 'Natáčení každé větve',
            body: isEn.value
                ? `Every branch follows the sun on two axes${leaves ? ` · ${f(leaves)} leaves in this configuration` : ''}.`
                : `Každá větev sleduje slunce ve dvou osách${leaves ? ` · ${f(leaves)} listů v této konfiguraci` : ''}.`,
        },
        {
            k: '180°',
            title: isEn.value ? 'Hail flip' : 'Otočení před kroupami',
            body: isEn.value
                ? 'Leaves turn upside-down so their armoured backs face the sky.'
                : 'Listy se otočí vzhůru nohama, k obloze míří jejich pancéřovaná záda.',
        },
        {
            k: isEn.value ? 'Stow' : 'Stow',
            title: isEn.value ? 'Storm position' : 'Bouřková poloha',
            body: isEn.value ? 'In high wind the canopy parks itself in a safe storm stow.' : 'Při silném větru se koruna zaparkuje do bezpečné bouřkové polohy.',
        },
        {
            k: `${f(20.2, 1)} %`,
            title: isEn.value ? 'TopCon cells' : 'Články TopCon',
            body: isEn.value ? 'Cell efficiency of the solar leaves.' : 'Účinnost článků solárních listů.',
        },
        {
            k: `η ${f(s.solarCanopyFactor, 2)}`,
            title: isEn.value ? '3D canopy factor' : 'Faktor 3D koruny',
            body: isEn.value
                ? 'Canopy coefficient applied in the yield model for non-coplanar leaves and mutual shading.'
                : 'Koeficient koruny použitý ve výpočtu výroby pro nekoplanární listy a vzájemné stínění.',
        },
    ];
});

/* ------------------------------------------------------------------ */
/* 05 · Sources                                                        */
/* ------------------------------------------------------------------ */

const sources = computed(() => [
    {
        date: isEn.value ? '8 Oct 2026' : '08. 10. 2026',
        title: isEn.value
            ? '2D CFD Simulation Results — COMSOL Multiphysics & ANSYS Fluent (Scooplet VAWT)'
            : 'Výsledky 2D simulace — COMSOL Multiphysics a ANSYS Fluent (Model VAWT Scooplet)',
        meta: isEn.value
            ? 'Department of Fluid Mechanics and Thermodynamics · FS ČVUT · CAD geometry, cP vs TSR, raw blade moments'
            : 'Ústav mechaniky tekutin a termodynamiky · FS ČVUT · 3D CAD model, křivky cP(λ) a okamžité momenty lopatek',
        href: '/docs/cvut/FS-CVUT_Scooplet-2D-CFD_COMSOL-ANSYS_2026-10-08.pdf',
        size: isEn.value ? 'PDF · 1.6 MB' : 'PDF · 1,6 MB',
    },
    {
        date: isEn.value ? '27 Aug 2026' : '27. 08. 2026',
        title: isEn.value
            ? 'Technical Report R00 — Measurement of Power Characteristics of VAWT Models'
            : 'Technická zpráva R00 — Měření výkonových charakteristik modelů VAWT',
        meta: isEn.value
            ? 'Wind-tunnel report · FS ČVUT · Ing. Jakub Suchý, Ph.D. · 10 rotor models across 3 tunnel campaigns, eq. (2)–(6), Fig. 8'
            : 'Zpráva z aerodynamického tunelu · FS ČVUT · Ing. Jakub Suchý, Ph.D. · 10 modelů ve 3 kampaních, rov. (2)–(6), obr. 8',
        href: '/docs/cvut/FS-CVUT_R00_Mereni-VAWT_2026-08-27.pdf',
        size: 'PDF · 867 kB',
    },
    {
        date: isEn.value ? '26 Aug 2026' : '26. 08. 2026',
        title: isEn.value
            ? 'Full-Scale Torque & Power Characteristic — CORE D = 1.3 m (A = 0.76 m²)'
            : 'Výkonová a momentová charakteristika — CORE D = 1,3 m (A = 0,76 m²)',
        meta: isEn.value
            ? 'Full-scale recalculation from the wind-tunnel measurement of 26 Aug 2026 · eq. (6), P(n) & M(n) curves for 4–10 m/s'
            : 'Přepočet na reálné rozměry z měření 26. 8. 2026 · rov. (6), křivky P(n) a M(n) pro rychlosti větru 4–10 m/s',
        href: '/docs/cvut/FS-CVUT_Charakteristika-CORE-D1.3m_2026-08-26.pdf',
        size: 'PDF · 85 kB',
    },
]);

const hasTrackingSlot = computed(() => Boolean(slots.tracking));
</script>

<template>
    <Teleport to="body">
        <Transition
            enter-active-class="transition-[opacity,transform] duration-500 ease-[cubic-bezier(.2,.7,.2,1)]"
            enter-from-class="opacity-0 scale-[0.985]"
            leave-active-class="transition-[opacity,transform] duration-300 ease-in"
            leave-to-class="opacity-0 scale-[0.985]"
        >
            <div
                v-if="open"
                class="fixed inset-0 z-[60] bg-zinc-950 text-white"
                role="dialog"
                aria-modal="true"
                :aria-label="isEn ? 'The Science · ČVUT' : 'Věda · ČVUT'"
            >
                <!-- Ambient glow -->
                <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                    <div class="absolute -top-[30vh] left-1/2 h-[70vh] w-[90vw] -translate-x-1/2 rounded-full bg-[#4d8dff]/[0.08] blur-[120px]"></div>
                    <div class="absolute -bottom-[30vh] -left-[10vw] h-[60vh] w-[60vw] rounded-full bg-[#34d399]/[0.05] blur-[120px]"></div>
                </div>

                <!-- Normal site header with Logo, navigation, and CS/EN LocaleSwitcher -->
                <Header :scroll="false" :dark="true" />

                <!-- Right-hand floating chapter rail on desktop -->
                <nav
                    :aria-label="isEn ? 'Chapters' : 'Kapitoly'"
                    class="pointer-events-none fixed top-1/2 right-5 z-30 hidden -translate-y-1/2 lg:block xl:right-9"
                >
                    <ul class="flex flex-col items-end gap-3.5">
                        <li v-for="c in chapters" :key="c.id">
                            <button
                                type="button"
                                class="pointer-events-auto group flex items-center gap-3"
                                :aria-current="activeChapter === c.id ? 'true' : undefined"
                                @click="scrollToChapter(c.id)"
                            >
                                <span
                                    class="font-mono text-[10px] tracking-[0.16em] uppercase transition-all duration-300"
                                    :class="
                                        activeChapter === c.id
                                            ? 'text-white/80'
                                            : 'translate-x-1 text-white/0 group-hover:translate-x-0 group-hover:text-white/55'
                                    "
                                >
                                    {{ c.idx }} · {{ c.label }}
                                </span>
                                <span
                                    class="block h-px transition-all duration-300"
                                    :class="activeChapter === c.id ? 'w-7 bg-[#8ec5ff]' : 'w-3.5 bg-white/25 group-hover:bg-white/55'"
                                ></span>
                            </button>
                        </li>
                    </ul>
                </nav>

                <div ref="scroller" class="science-scroll relative h-full overflow-y-auto overscroll-contain">
                    <main class="relative mx-auto max-w-6xl px-5 pt-28 sm:px-8 sm:pt-36 lg:px-10">
                        <!-- Back to station button -->
                        <div>
                            <button
                                ref="closeBtn"
                                type="button"
                                class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-3.5 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-white/30 hover:bg-white/[0.07] hover:text-white"
                                @click="emit('close')"
                            >
                                <ArrowLeft class="h-3.5 w-3.5 text-[#8ec5ff]" />
                                <span>{{ isEn ? 'Back to station' : 'Zpět na stanici' }} · {{ tr(entry.title, locale) }}</span>
                            </button>
                        </div>

                        <!-- Hero -->
                        <section class="pt-8 pb-20 sm:pt-10 sm:pb-28">
                            <div v-bind="reveal('hero')">
                                <p class="font-mono text-[11px] tracking-[0.2em] text-white/45 uppercase">
                                    FS ČVUT · Ing. Jakub Suchý, Ph.D. · {{ tr(entry.clientName, locale) }}
                                </p>
                                <h1 class="mt-5 max-w-4xl" :class="HEADLINE">
                                    {{ isEn ? 'The physics behind your offer.' : 'Fyzika za vaší nabídkou.' }}
                                </h1>
                                <p class="mt-5 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
                                    {{
                                        isEn
                                            ? `Every kilowatt-hour quoted for ${tr(entry.city, locale)} traces back to wind-tunnel measurements and CFD simulations at the Czech Technical University — and to the station's own data.`
                                            : `Každá kilowatthodina v nabídce pro ${tr(entry.city, locale)} vychází z měření v aerodynamickém tunelu a CFD simulací na ČVUT — a z vlastních dat meteostanice.`
                                    }}
                                </p>
                            </div>
                            <div class="mt-12 max-w-2xl" v-bind="reveal('hero', 200)">
                                <InvestorStats :stats="heroStats" />
                            </div>
                        </section>

                        <!-- 01 · Wind tunnel -->
                        <section data-chapter="tunnel" class="scroll-mt-28 border-t border-white/[0.06] py-20 sm:py-28">
                            <div class="max-w-3xl" v-bind="reveal('tunnel')">
                                <InvestorChapterMark index="01" :label="chapters[0].label" />
                                <h2 class="mt-6" :class="HEADLINE">{{ isEn ? 'Measured, not promised.' : 'Změřeno, ne slíbeno.' }}</h2>
                                <p class="mt-5 text-base leading-relaxed text-white/55 sm:text-lg">
                                    {{
                                        isEn
                                            ? 'Circulating wind tunnel at FS ČVUT with an open 450 × 900 × 1200 mm test section (up to 46 m/s). Rotors of D = 0.15 m braked by a DC motor; torque from a UTILCELL 104 load cell, speed from an optical gate, logged on NI cDAQ-9183 in 25 s steady-state samples.'
                                            : 'Cirkulační aerodynamický tunel FS ČVUT s otevřeným měřicím prostorem 450 × 900 × 1200 mm (až 46 m/s). Rotory D = 0,15 m brzděné DC motorem; moment z tenzometru UTILCELL 104, otáčky z optické brány, záznam NI cDAQ-9183 ve 25s ustálených vzorcích.'
                                    }}
                                </p>
                            </div>

                            <div class="mt-12 rounded-3xl border border-white/10 bg-white/[0.015] p-4 sm:p-6 lg:p-8" v-bind="reveal('tunnel', 150)">
                                <ScienceCpChart :active="seen.tunnel" :reduced-motion="reducedMotion" />
                            </div>

                            <div class="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-12" v-bind="reveal('tunnel', 250)">
                                <InvestorStats :stats="tunnelStats" class="self-start" />
                                <div class="grid gap-3 sm:grid-cols-2">
                                    <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                        <p class="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">
                                            {{ isEn ? 'Tip-speed ratio · eq. (2)' : 'Rychlostní poměr · rov. (2)' }}
                                        </p>
                                        <div class="mt-4 flex items-center gap-3 font-serif text-2xl text-white italic">
                                            <span>λ</span><span class="not-italic text-white/50">=</span>
                                            <span class="inline-flex flex-col items-center leading-tight">
                                                <span class="px-1">2π<span>n</span>R</span>
                                                <span class="h-px w-full bg-white/60"></span>
                                                <span class="px-1">v</span>
                                            </span>
                                        </div>
                                        <p class="mt-4 text-xs leading-relaxed text-white/45">
                                            {{
                                                isEn
                                                    ? 'n rotor speed (1/s), R rotor radius, v undisturbed wind speed.'
                                                    : 'n otáčky (1/s), R poloměr rotoru, v rychlost nenarušeného proudění.'
                                            }}
                                        </p>
                                    </div>
                                    <div class="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                                        <p class="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">
                                            {{ isEn ? 'Power coefficient · eq. (3)' : 'Součinitel výkonu · rov. (3)' }}
                                        </p>
                                        <div class="mt-4 flex items-center gap-3 font-serif text-2xl text-white italic">
                                            <span>c<sub class="text-[0.6em]">P</sub></span><span class="not-italic text-white/50">=</span>
                                            <span class="inline-flex flex-col items-center leading-tight">
                                                <span class="px-1">P</span>
                                                <span class="h-px w-full bg-white/60"></span>
                                                <span class="px-1"><span class="not-italic">½</span> ρ v<sup class="text-[0.6em]">3</sup> A</span>
                                            </span>
                                        </div>
                                        <p class="mt-4 text-xs leading-relaxed text-white/45">
                                            {{
                                                isEn
                                                    ? 'P shaft power, ρ air density, A active swept area of the rotor.'
                                                    : 'P výkon na hřídeli, ρ hustota vzduchu, A aktivní průtočná plocha rotoru.'
                                            }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <!-- 02 · Scooplet dual-slot rotor & CFD -->
                        <section data-chapter="stator" class="scroll-mt-28 border-t border-white/[0.06] py-20 sm:py-28">
                            <div class="max-w-3xl" v-bind="reveal('stator')">
                                <InvestorChapterMark index="02" :label="chapters[1].label" />
                                <h2 class="mt-6" :class="HEADLINE">
                                    {{ isEn ? 'Inner pocket vanes triple the rotor.' : 'Křidélka uvnitř lopatek ztrojnásobí výkon.' }}
                                </h2>
                                <p class="mt-5 text-base leading-relaxed text-white/55 sm:text-lg">
                                    {{
                                        isEn
                                            ? 'The Treetino Scooplet turbine is a single unified barrel rotor: inside each concave lobe of the outer S-shell sits an internal splitter vane held by three horizontal crescent ribs. When the lower scoop opens into the wind from the left, the internal slot accelerates the flow up to 14.9 m/s, eliminates dead-air recirculation inside the pocket, and drives the rotor counter-clockwise with cP = 0.382 at λ = 1.0.'
                                            : 'Turbína Treetino Scooplet tvoří jeden soudečkový celek: uvnitř dutiny každého ramene vnější S-skořepiny je vloženo vnitřní usměrňovací křidélko sepnuté třemi vodorovnými srpkovými přepážkami. Když se spodní lopatka otevře proti větru zleva, vnitřní štěrbina urychlí proud až na 14,9 m/s, odstraní slepou kapsu stojícího vzduchu a roztáčí rotor proti směru hodinových ručiček s účinností cP = 0,382 při λ = 1,0.'
                                    }}
                                </p>
                            </div>

                            <div class="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
                                <div class="flex flex-col justify-between" v-bind="reveal('stator', 120)">
                                    <div>
                                        <ScienceRotorFlow
                                            :active="open && inView.stator"
                                            :view-mode="rotorViewMode"
                                            :wind-speed="windSpeed"
                                            :tsr="tsr"
                                            :reduced-motion="reducedMotion"
                                        />
                                        <!-- Sleek unified control bar: 2D / 3D segmented switch + single-line interaction hint -->
                                        <div class="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-1.5 pr-4">
                                            <div
                                                class="inline-flex rounded-xl bg-zinc-950/80 p-0.5 text-xs ring-1 ring-white/[0.08]"
                                                role="radiogroup"
                                                :aria-label="isEn ? 'Visualization view' : 'Zobrazení simulace'"
                                            >
                                                <button
                                                    v-for="opt in [
                                                        { v: '2d' as const, label: isEn ? '2D cross-section' : '2D průřez' },
                                                        { v: '3d' as const, label: isEn ? '3D rotor model' : '3D model rotoru' },
                                                    ]"
                                                    :key="opt.v"
                                                    type="button"
                                                    role="radio"
                                                    :aria-checked="rotorViewMode === opt.v"
                                                    class="rounded-[10px] px-3.5 py-2 font-medium whitespace-nowrap transition-all duration-200"
                                                    :class="
                                                        rotorViewMode === opt.v
                                                            ? 'bg-white/12 text-white shadow-sm ring-1 ring-white/15'
                                                            : 'text-white/45 hover:text-white'
                                                    "
                                                    @click="rotorViewMode = opt.v"
                                                >
                                                    {{ opt.label }}
                                                </button>
                                            </div>
                                            <span class="hidden items-center gap-2 truncate text-xs text-white/45 sm:inline-flex">
                                                <span class="h-1.5 w-1.5 shrink-0 rounded-full bg-[#8ec5ff]"></span>
                                                <span class="truncate">
                                                    {{
                                                        rotorViewMode === '3d'
                                                            ? isEn
                                                                ? 'Drag on the model to rotate camera'
                                                                : 'Tažením myší v modelu otočíte kameru'
                                                            : isEn
                                                              ? 'Slot flow · counter-clockwise rotation'
                                                              : 'Proudění ve štěrbině · rotace proti směru hod. ručiček'
                                                    }}
                                                </span>
                                            </span>
                                        </div>
                                    </div>

                                    <!-- Simple interactive cP(λ) & Power curve filling the bottom-left space -->
                                    <div class="mt-4 rounded-2xl border border-white/10 bg-white/[0.015] p-4">
                                        <div class="flex flex-wrap items-baseline justify-between gap-2">
                                            <p class="text-[10px] font-medium tracking-[0.18em] text-white/45 uppercase">
                                                {{
                                                    isEn
                                                        ? 'Efficiency curve cP(λ) · click to select λ'
                                                        : 'Křivka účinnosti cP(λ) · kliknutím zvolíte λ'
                                                }}
                                            </p>
                                            <div class="flex items-center gap-4 font-mono text-[11px] tabular-nums">
                                                <span class="flex items-center gap-1.5 text-[#8ec5ff]">
                                                    <span class="h-1.5 w-3 rounded-full bg-[#8ec5ff]"></span>
                                                    {{ isEn ? 'Total Scooplet' : 'Celkem Scooplet' }} ({{ f(decomp.total, 3) }})
                                                </span>
                                                <span class="flex items-center gap-1.5 text-white/50">
                                                    <span class="h-0.5 w-3 border-t border-dashed border-white/60"></span>
                                                    {{ isEn ? 'Outer S-shell' : 'Vnější S-skořepina' }} ({{ f(decomp.outerShellCp, 3) }})
                                                </span>
                                            </div>
                                        </div>

                                        <svg
                                            :viewBox="`0 0 ${CP_CHART_W} ${CP_CHART_H}`"
                                            class="mt-2 w-full cursor-pointer select-none"
                                            role="img"
                                            :aria-label="isEn ? 'Power coefficient cP vs tip-speed ratio lambda' : 'Závislost součinitele výkonu cP na rychlostním poměru lambda'"
                                            @click="onCpChartPick"
                                        >
                                            <defs>
                                                <linearGradient id="cp-simple-area" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stop-color="#8ec5ff" stop-opacity="0.28" />
                                                    <stop offset="100%" stop-color="#8ec5ff" stop-opacity="0.0" />
                                                </linearGradient>
                                            </defs>

                                            <!-- Horizontal grid lines (0.0, 0.2, 0.4) -->
                                            <g v-for="gv in [0, 0.2, 0.4]" :key="gv">
                                                <line
                                                    :x1="CP_PAD.l"
                                                    :x2="CP_CHART_W - CP_PAD.r"
                                                    :y1="cpChartY(gv)"
                                                    :y2="cpChartY(gv)"
                                                    :stroke="gv === 0 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.06)'"
                                                />
                                                <text
                                                    :x="CP_PAD.l - 6"
                                                    :y="cpChartY(gv) + 3"
                                                    text-anchor="end"
                                                    class="fill-white/35 font-mono text-[9px]"
                                                >
                                                    {{ f(gv, 1) }}
                                                </text>
                                            </g>

                                            <!-- Shaded area & curves -->
                                            <path :d="cpCurveData.areaTotal" fill="url(#cp-simple-area)" />
                                            <path
                                                :d="cpCurveData.lineOuter"
                                                fill="none"
                                                stroke="rgba(255,255,255,0.45)"
                                                stroke-width="1.4"
                                                stroke-dasharray="3 4"
                                            />
                                            <path
                                                :d="cpCurveData.lineTotal"
                                                fill="none"
                                                stroke="#8ec5ff"
                                                stroke-width="2.2"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />

                                            <!-- Measured CFD points -->
                                            <circle
                                                v-for="pt in cpCurveData.pts"
                                                :key="pt.tsr"
                                                :cx="pt.x"
                                                :cy="pt.yTotal"
                                                r="2.5"
                                                class="fill-[#09090b] stroke-[#8ec5ff]"
                                                stroke-width="1.5"
                                            />

                                            <!-- X-axis ticks -->
                                            <text
                                                v-for="pt in cpCurveData.pts"
                                                :key="`lbl-${pt.tsr}`"
                                                :x="pt.x"
                                                :y="CP_CHART_H - 5"
                                                text-anchor="middle"
                                                class="fill-white/40 font-mono text-[9px]"
                                            >
                                                λ={{ f(pt.tsr, 1) }}
                                            </text>

                                            <!-- Live operating point cursor -->
                                            <line
                                                :x1="cpCurveData.activeX"
                                                :x2="cpCurveData.activeX"
                                                :y1="CP_PAD.t"
                                                :y2="cpCurveData.baseY"
                                                stroke="rgba(142,197,255,0.55)"
                                                stroke-dasharray="2 3"
                                            />
                                            <circle
                                                :cx="cpCurveData.activeX"
                                                :cy="cpCurveData.activeY"
                                                r="5"
                                                fill="#8ec5ff"
                                            />
                                            <circle
                                                :cx="cpCurveData.activeX"
                                                :cy="cpCurveData.activeY"
                                                r="9"
                                                fill="rgba(142,197,255,0.22)"
                                            />
                                        </svg>
                                    </div>
                                </div>

                                <div class="flex flex-col justify-between gap-5" v-bind="reveal('stator', 240)">
                                    <!-- Live operating point metrics -->
                                    <div>
                                        <p class="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">
                                            {{ isEn ? 'Live operating point · ANSYS Fluent CFD' : 'Okamžitý pracovní bod · ANSYS Fluent CFD' }}
                                        </p>
                                        <div class="mt-3 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                                            <div>
                                                <p class="text-[10px] font-medium tracking-[0.14em] text-white/40 uppercase">
                                                    {{ isEn ? 'Power coeff. cP' : 'Součinitel cP' }}
                                                </p>
                                                <p class="mt-1 font-mono text-2xl font-semibold whitespace-nowrap text-white tabular-nums">
                                                    {{ f(decomp.total, 3) }}
                                                </p>
                                                <p class="mt-0.5 text-[11px] text-[#8ec5ff] tabular-nums">
                                                    {{ isEn ? 'at' : 'při' }} λ = {{ f(tsr, 2) }}
                                                </p>
                                            </div>
                                            <div class="border-l border-white/10 pl-3">
                                                <p class="text-[10px] font-medium tracking-[0.14em] text-white/40 uppercase">
                                                    {{ isEn ? 'Shaft power P' : 'Výkon na hřídeli' }}
                                                </p>
                                                <p class="mt-1 font-mono text-2xl font-semibold whitespace-nowrap text-[#8ec5ff] tabular-nums">
                                                    {{ f(decomp.powerW, 0) }} <span class="text-xs font-normal text-white/55">W</span>
                                                </p>
                                                <p class="mt-0.5 text-[11px] text-white/45 tabular-nums">
                                                    D = {{ f(1.3, 1) }} m · {{ f(windSpeed, 1) }} m/s
                                                </p>
                                            </div>
                                            <div class="border-l border-white/10 pl-3">
                                                <p class="text-[10px] font-medium tracking-[0.14em] text-white/40 uppercase">
                                                    {{ isEn ? 'Rotor speed' : 'Otáčky rotoru' }}
                                                </p>
                                                <p class="mt-1 font-mono text-2xl font-semibold whitespace-nowrap text-white tabular-nums">
                                                    {{ f(decomp.rpm, 0) }} <span class="text-xs font-normal text-white/55">{{ isEn ? 'RPM' : 'ot/min' }}</span>
                                                </p>
                                                <p class="mt-0.5 text-[11px] text-white/45">
                                                    {{ isEn ? 'direct PMG' : 'přímo na PMG' }}
                                                </p>
                                            </div>
                                        </div>

                                        <!-- View-aware explanation card: dynamically changes between 2D cross-section and 3D barrel model -->
                                        <div class="mt-4 space-y-2.5 rounded-2xl border border-white/10 bg-white/[0.015] p-4">
                                            <p class="text-[10px] font-medium tracking-[0.18em] text-white/45 uppercase">
                                                {{
                                                    rotorViewMode === '2d'
                                                        ? isEn
                                                            ? 'What each element in the 2D cross-section does'
                                                            : 'Co dělají prvky v 2D průřezu'
                                                        : isEn
                                                          ? 'What you see on the 3D barrel model'
                                                          : 'Co vidíte na 3D soudečkovém modelu'
                                                }}
                                            </p>

                                            <template v-if="rotorViewMode === '2d'">
                                                <div class="flex items-start justify-between gap-3 pt-1">
                                                    <div class="flex items-start gap-2.5">
                                                        <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"></span>
                                                        <div>
                                                            <p class="text-xs font-medium text-white">
                                                                {{ isEn ? 'Main outer S-shell (white curve)' : 'Hlavní vnější S-skořepina (bílá linie)' }}
                                                            </p>
                                                            <p class="mt-0.5 text-[11px] leading-relaxed text-white/50">
                                                                {{
                                                                    isEn
                                                                        ? 'Catches the oncoming wind in the lower advancing scoop while its upper convex back slices smoothly upwind.'
                                                                        : 'Zachytává hlavní proud větru ve spodní záběrové lopatce, zatímco horní vypouklá záda se vracejí s minimálním odporem proti větru.'
                                                                }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span class="shrink-0 font-mono text-xs font-medium text-white tabular-nums">
                                                        c<sub>P</sub> {{ f(decomp.outerShellCp, 3) }}
                                                    </span>
                                                </div>

                                                <div class="flex items-start justify-between gap-3 border-t border-white/[0.06] pt-2.5">
                                                    <div class="flex items-start gap-2.5">
                                                        <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#8ec5ff] shadow-[0_0_8px_rgba(142,197,255,0.8)]"></span>
                                                        <div>
                                                            <p class="text-xs font-medium text-white">
                                                                {{ isEn ? 'Inner pocket vanes (blue curves on the inside)' : 'Vnitřní křidélka v dutině (modré linie uvnitř ohybu)' }}
                                                            </p>
                                                            <p class="mt-0.5 text-[11px] leading-relaxed text-white/50">
                                                                {{
                                                                    isEn
                                                                        ? 'Placed on the concave inside of each lobe. They prevent dead-air recirculation in the pocket and funnel the jet across the shaft.'
                                                                        : 'Umístěna na vnitřní (konkávní) straně obou lopatek. Zabraňují vzniku slepé kapsy vzduchu a štěrbinou vedou proud přes střed hřídele.'
                                                                }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span
                                                        class="shrink-0 font-mono text-xs font-medium tabular-nums"
                                                        :class="decomp.innerVanesCp < 0 ? 'text-rose-300' : 'text-[#8ec5ff]'"
                                                    >
                                                        c<sub>P</sub> {{ f(decomp.innerVanesCp, 3) }}
                                                    </span>
                                                </div>
                                            </template>

                                            <template v-else>
                                                <div class="flex items-start justify-between gap-3 pt-1">
                                                    <div class="flex items-start gap-2.5">
                                                        <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-[#34d399] shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
                                                        <div>
                                                            <p class="text-xs font-medium text-white">
                                                                {{
                                                                    isEn
                                                                        ? 'Advancing scoop in wind (green) vs. returning side (blue)'
                                                                        : 'Záběrová lopatka ve větru (zelená) vs. návratová (modrá)'
                                                                }}
                                                            </p>
                                                            <p class="mt-0.5 text-[11px] leading-relaxed text-white/50">
                                                                {{
                                                                    isEn
                                                                        ? 'Whichever scoop is currently opening into the wind on the advancing pass lights up with peak aerodynamic pressure; half a turn later the opposite scoop takes over.'
                                                                        : 'Zeleně svítí lopatka, která se v daném okamžiku otevírá proti větru zleva a je jím tlačena po větru. Po otočení o 180° přebírá záběr protější lopatka.'
                                                                }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span class="shrink-0 font-mono text-xs font-medium text-[#34d399] tabular-nums">
                                                        v<sub>max</sub> {{ f(decomp.peakJetMs, 1) }} m/s
                                                    </span>
                                                </div>

                                                <div class="flex items-start justify-between gap-3 border-t border-white/[0.06] pt-2.5">
                                                    <div class="flex items-start gap-2.5">
                                                        <span class="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full bg-slate-300 shadow-[0_0_8px_rgba(203,213,225,0.6)]"></span>
                                                        <div>
                                                            <p class="text-xs font-medium text-white">
                                                                {{
                                                                    isEn
                                                                        ? 'Barrel profile & 3× horizontal crescent ribs (grey)'
                                                                        : 'Soudečkový tvar a 3× vodorovná srpková přepážka (šedá)'
                                                                }}
                                                            </p>
                                                            <p class="mt-0.5 text-[11px] leading-relaxed text-white/50">
                                                                {{
                                                                    isEn
                                                                        ? 'Three internal crescent baffles and saucer end-caps seal the pocket vertically so air pressure cannot leak along the shaft axis.'
                                                                        : 'Tři vodorovné přepážky uvnitř dutiny a koncové vrchlíky uzavírají kapsy svisle, aby zachycený tlak neunikal podél osy rotoru.'
                                                                }}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <span class="shrink-0 font-mono text-xs font-medium text-white/75 tabular-nums">
                                                        A = {{ f(0.76, 2) }} m²
                                                    </span>
                                                </div>
                                            </template>
                                        </div>
                                    </div>

                                    <!-- Interactive controls that visibly drive the simulation -->
                                    <div class="space-y-3">
                                        <!-- Slider 1: Wind speed v [m/s] -->
                                        <label class="block rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <span class="flex items-baseline justify-between gap-3">
                                                <span class="text-[11px] font-medium tracking-[0.16em] text-white/60 uppercase">
                                                    {{ isEn ? '1. Wind speed v · flow, RPM & power' : '1. Rychlost větru v · proudění, otáčky a výkon' }}
                                                </span>
                                                <span class="shrink-0 font-mono text-sm whitespace-nowrap text-[#8ec5ff] tabular-nums">{{ f(windSpeed, 1) }} m/s</span>
                                            </span>
                                            <input
                                                v-model.number="windSpeed"
                                                type="range"
                                                min="2.0"
                                                max="14.0"
                                                step="0.5"
                                                class="mt-2.5 w-full cursor-pointer accent-[#8ec5ff]"
                                                :aria-label="isEn ? 'Wind speed in m/s' : 'Rychlost větru v m/s'"
                                            />
                                            <span class="mt-1 flex justify-between font-mono text-[10px] text-white/35 tabular-nums">
                                                <span>{{ f(2.0, 1) }} m/s ({{ isEn ? 'cut-in' : 'rozběh' }})</span>
                                                <span>{{ f(8.0, 1) }} m/s (CFD ČVUT)</span>
                                                <span>{{ f(14.0, 1) }} m/s ({{ isEn ? 'strong wind' : 'silný vítr' }})</span>
                                            </span>
                                        </label>

                                        <!-- Slider 2: Tip-speed ratio λ (generator load) -->
                                        <label class="block rounded-2xl border border-white/10 bg-white/[0.02] p-3.5">
                                            <span class="flex items-baseline justify-between gap-3">
                                                <span class="text-[11px] font-medium tracking-[0.16em] text-white/60 uppercase">
                                                    {{ isEn ? '2. Generator load · tip-speed ratio λ = ωR/v' : '2. Zatížení generátoru · rychlostní poměr λ = ωR/v' }}
                                                </span>
                                                <span class="shrink-0 font-mono text-sm whitespace-nowrap text-[#8ec5ff] tabular-nums">λ = {{ f(tsr, 2) }}</span>
                                            </span>
                                            <input
                                                v-model.number="tsr"
                                                type="range"
                                                min="0.2"
                                                max="1.4"
                                                step="0.02"
                                                class="mt-2.5 w-full cursor-pointer accent-[#8ec5ff]"
                                                :aria-label="isEn ? 'Tip-speed ratio' : 'Rychlostní poměr'"
                                            />
                                            <span class="mt-1 flex justify-between font-mono text-[10px] text-white/35 tabular-nums">
                                                <span>{{ f(0.2, 1) }} ({{ isEn ? 'braked / start' : 'záběr / brzděno' }})</span>
                                                <span>{{ f(1.0, 1) }} (MPPT max cP {{ f(0.382, 3) }})</span>
                                                <span>{{ f(1.4, 1) }} ({{ isEn ? 'unloaded' : 'odlehčeno' }})</span>
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <p class="mt-8 max-w-3xl text-xs leading-relaxed text-white/35">
                                {{
                                    isEn
                                        ? 'CFD simulation in ANSYS Fluent & COMSOL Multiphysics (FS ČVUT, 8 Oct 2026) and wind-tunnel report R00 (27 Aug 2026).'
                                        : 'CFD simulace v ANSYS Fluent a COMSOL Multiphysics (FS ČVUT, 8. 10. 2026) a tunelová zpráva R00 (27. 8. 2026).'
                                }}
                            </p>
                        </section>

                        <!-- 03 · Measurement → kWh -->
                        <section data-chapter="chain" class="scroll-mt-28 border-t border-white/[0.06] py-20 sm:py-28">
                            <div class="max-w-3xl" v-bind="reveal('chain')">
                                <InvestorChapterMark index="03" :label="chapters[2].label" />
                                <h2 class="mt-6" :class="HEADLINE">{{ isEn ? 'Every kilowatt-hour, traceable.' : 'Každá kWh dohledatelná.' }}</h2>
                                <p class="mt-5 text-base leading-relaxed text-white/55 sm:text-lg">
                                    {{
                                        isEn
                                            ? `The exact chain behind the offer for ${tr(entry.clientName, locale)} · ${tr(variant.title, locale)}. Same model, same numbers as in the PDF.`
                                            : `Přesný výpočetní řetězec nabídky pro ${tr(entry.clientName, locale)} · ${tr(variant.title, locale)}. Stejný model, stejná čísla jako v PDF.`
                                    }}
                                </p>
                                <p class="mt-4 inline-flex flex-wrap items-center gap-x-3 gap-y-1 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs text-white/55">
                                    <span class="flex items-center gap-1.5 text-white/80">
                                        <span class="h-1.5 w-1.5 rounded-full bg-[#8ec5ff]"></span>{{ entry.bundle.identity.stationId }}
                                    </span>
                                    <span>{{ isEn ? 'now' : 'teď' }} {{ f(live.windspeedMs, 1) }} m/s · {{ f(live.tempC, 1) }} °C · {{ f(live.pressureHpa, 0) }} hPa</span>
                                </p>
                            </div>

                            <div class="mt-14">
                                <ScienceChain :entry="entry" :sim="sim" :variant="variant" :active="seen.chain" :reduced-motion="reducedMotion" />
                            </div>
                        </section>

                        <!-- 04 · Sun tracking -->
                        <section data-chapter="tracking" class="scroll-mt-28 border-t border-white/[0.06] py-20 sm:py-28">
                            <div class="max-w-3xl" v-bind="reveal('tracking')">
                                <InvestorChapterMark index="04" :label="chapters[3].label" />
                                <h2 class="mt-6" :class="HEADLINE">{{ isEn ? 'Leaves that follow the sun.' : 'Listy, které sledují slunce.' }}</h2>
                            </div>

                            <div class="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-8">
                                <div
                                    class="relative min-h-[60vh] overflow-hidden rounded-3xl border border-white/10 bg-black/40"
                                    v-bind="reveal('tracking', 120)"
                                >
                                    <slot name="tracking" :active="open && inView.tracking" />
                                    <div v-if="!hasTrackingSlot" class="absolute inset-0 flex items-center justify-center">
                                        <div class="h-40 w-40 rounded-full bg-[#fbbf24]/20 blur-3xl"></div>
                                    </div>
                                </div>

                                <ul class="flex flex-col divide-y divide-white/[0.07] self-start" v-bind="reveal('tracking', 220)">
                                    <li v-for="fact in trackingFacts" :key="fact.title" class="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 py-4 first:pt-0">
                                        <span class="text-xl leading-tight font-medium tracking-[-0.02em] text-[#fbbf24] tabular-nums">{{ fact.k }}</span>
                                        <span>
                                            <span class="block text-sm font-medium text-white">{{ fact.title }}</span>
                                            <span class="mt-1 block text-xs leading-relaxed text-white/50">{{ fact.body }}</span>
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <!-- Sun path -->
                            <div class="mt-6 rounded-3xl border border-white/10 bg-white/[0.015] p-4 sm:p-6 lg:p-8" v-bind="reveal('tracking', 300)">
                                <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                                    <p class="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">
                                        {{ isEn ? 'Sun path today' : 'Dráha slunce dnes' }} · {{ sunPath.dateLabel }}
                                    </p>
                                    <p class="font-mono text-[11px] text-white/35 tabular-nums">
                                        {{ f(sunPath.lat, 3) }}° N · {{ f(sunPath.lon, 3) }}° E · {{ entry.bundle.identity.stationId }}
                                    </p>
                                </div>

                                <svg :viewBox="`0 0 ${SUN_W} ${SUN_H}`" :style="{ fontSize: narrow ? '16px' : '10px' }" class="mt-4 w-full" role="img" :aria-label="isEn ? 'Solar elevation over today' : 'Výška slunce během dneška'">
                                    <defs>
                                        <linearGradient id="science-sun-fill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stop-color="#fbbf24" stop-opacity="0.28" />
                                            <stop offset="100%" stop-color="#fbbf24" stop-opacity="0" />
                                        </linearGradient>
                                        <linearGradient id="science-sun-stroke" x1="0" y1="0" x2="1" y2="0">
                                            <stop offset="0%" stop-color="#8ec5ff" />
                                            <stop offset="50%" stop-color="#fbbf24" />
                                            <stop offset="100%" stop-color="#8ec5ff" />
                                        </linearGradient>
                                        <clipPath id="science-sun-plot">
                                            <rect :x="SUN_PAD.l" :y="SUN_PAD.t - 12" :width="SUN_W - SUN_PAD.l - SUN_PAD.r" :height="SUN_H - SUN_PAD.t - SUN_PAD.b + 12" />
                                        </clipPath>
                                        <clipPath id="science-sun-above">
                                            <rect :x="SUN_PAD.l" :y="0" :width="SUN_W" :height="sunY(0)" />
                                        </clipPath>
                                        <filter id="science-sun-glow" x="-100%" y="-100%" width="300%" height="300%">
                                            <feGaussianBlur stdDeviation="5" />
                                        </filter>
                                    </defs>

                                    <!-- grid -->
                                    <line
                                        v-for="e in sunElevTicks"
                                        :key="`e${e}`"
                                        :x1="SUN_PAD.l"
                                        :x2="SUN_W - SUN_PAD.r"
                                        :y1="sunY(e)"
                                        :y2="sunY(e)"
                                        :stroke="e === 0 ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.05)'"
                                    />
                                    <text v-for="e in sunElevTicks" :key="`el${e}`" :x="SUN_PAD.l - 8" :y="sunY(e) + 4" text-anchor="end" class="fill-white/30 font-mono">
                                        {{ e }}°
                                    </text>
                                    <text
                                        v-for="h in sunHoursTicks"
                                        :key="`h${h}`"
                                        :x="sunX(h * 60)"
                                        :y="SUN_H - 12"
                                        text-anchor="middle"
                                        class="fill-white/30 font-mono"
                                    >
                                        {{ String(h).padStart(2, '0') }}
                                    </text>

                                    <!-- solstice references -->
                                    <path :d="sunPath.june" clip-path="url(#science-sun-plot)" fill="none" stroke="rgba(255,255,255,0.18)" stroke-dasharray="3 5" />
                                    <path :d="sunPath.december" clip-path="url(#science-sun-plot)" fill="none" stroke="rgba(255,255,255,0.18)" stroke-dasharray="3 5" />
                                    <text :x="sunPath.juneLabel.x" :y="sunPath.juneLabel.y" text-anchor="middle" class="fill-white/35 font-mono">
                                        {{ isEn ? '21 Jun' : '21. 6.' }} · {{ f(sunPath.juneMax, 0) }}°
                                    </text>
                                    <text :x="sunPath.decLabel.x" :y="sunPath.decLabel.y" text-anchor="start" class="fill-white/35 font-mono">
                                        {{ isEn ? '21 Dec' : '21. 12.' }} · {{ f(sunPath.decMax, 0) }}°
                                    </text>

                                    <!-- today -->
                                    <path
                                        :d="`${sunPath.today} L${sunX(1440)},${sunY(0)} L${sunX(0)},${sunY(0)} Z`"
                                        fill="url(#science-sun-fill)"
                                        clip-path="url(#science-sun-above)"
                                        class="transition-opacity duration-1000"
                                        :style="{ opacity: seen.tracking || reducedMotion ? 1 : 0, transitionDelay: reducedMotion ? '0s' : '1.2s' }"
                                    />
                                    <path
                                        :d="sunPath.today"
                                        clip-path="url(#science-sun-plot)"
                                        fill="none"
                                        stroke="url(#science-sun-stroke)"
                                        stroke-width="2.2"
                                        stroke-linecap="round"
                                        pathLength="1"
                                        :style="
                                            reducedMotion
                                                ? undefined
                                                : {
                                                      strokeDasharray: 1,
                                                      strokeDashoffset: seen.tracking ? 0 : 1,
                                                      transition: 'stroke-dashoffset 2s cubic-bezier(.65,0,.35,1) .4s',
                                                  }
                                        "
                                    />

                                    <!-- events -->
                                    <g class="transition-opacity duration-700" :style="{ opacity: seen.tracking || reducedMotion ? 1 : 0, transitionDelay: reducedMotion ? '0s' : '1.6s' }">
                                        <template v-if="sunPath.rise !== null">
                                            <circle :cx="sunX(sunPath.rise)" :cy="sunY(0)" r="3" fill="#fbbf24" />
                                            <text :x="sunX(sunPath.rise)" :y="sunY(0) + 16" text-anchor="middle" class="fill-white/60 font-mono">
                                                ↑ {{ hhmm(sunPath.rise) }}
                                            </text>
                                        </template>
                                        <template v-if="sunPath.set !== null">
                                            <circle :cx="sunX(sunPath.set)" :cy="sunY(0)" r="3" fill="#fbbf24" />
                                            <text :x="sunX(sunPath.set)" :y="sunY(0) + 16" text-anchor="middle" class="fill-white/60 font-mono">
                                                ↓ {{ hhmm(sunPath.set) }}
                                            </text>
                                        </template>
                                        <line
                                            :x1="sunX(sunPath.noon)"
                                            :x2="sunX(sunPath.noon)"
                                            :y1="sunY(sunPath.maxElev)"
                                            :y2="sunY(0)"
                                            stroke="rgba(251,191,36,0.35)"
                                            stroke-dasharray="2 4"
                                        />
                                        <text :x="sunX(sunPath.noon)" :y="sunY(sunPath.maxElev) - 10" text-anchor="middle" class="fill-[#fbbf24] font-mono">
                                            {{ hhmm(sunPath.noon) }} · {{ f(sunPath.maxElev, 1) }}°
                                        </text>

                                        <!-- now -->
                                        <line
                                            :x1="sunX(sunPath.nowMin)"
                                            :x2="sunX(sunPath.nowMin)"
                                            :y1="SUN_PAD.t"
                                            :y2="SUN_H - SUN_PAD.b"
                                            stroke="rgba(255,255,255,0.12)"
                                        />
                                        <circle
                                            :cx="sunX(sunPath.nowMin)"
                                            :cy="sunY(sunPath.nowElev)"
                                            r="10"
                                            :fill="sunPath.nowElev > 0 ? '#fbbf24' : '#8ec5ff'"
                                            filter="url(#science-sun-glow)"
                                            :opacity="sunPath.nowElev > 0 ? 0.9 : 0.4"
                                        />
                                        <circle
                                            :cx="sunX(sunPath.nowMin)"
                                            :cy="sunY(sunPath.nowElev)"
                                            r="5"
                                            :fill="sunPath.nowElev > 0 ? '#fde68a' : 'rgba(142,197,255,0.7)'"
                                        />
                                    </g>
                                </svg>

                                <dl class="mt-4 grid grid-cols-2 gap-4 border-t border-white/10 pt-4 sm:grid-cols-4">
                                    <div>
                                        <dt class="text-[11px] text-white/45">{{ isEn ? 'Sunrise · sunset' : 'Východ · západ' }}</dt>
                                        <dd class="mt-1 text-lg font-medium tabular-nums">
                                            {{ sunPath.rise !== null ? hhmm(sunPath.rise) : '—' }} · {{ sunPath.set !== null ? hhmm(sunPath.set) : '—' }}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt class="text-[11px] text-white/45">{{ isEn ? 'Day length' : 'Délka dne' }}</dt>
                                        <dd class="mt-1 text-lg font-medium tabular-nums">
                                            {{ sunPath.dayLength !== null ? `${Math.floor(sunPath.dayLength / 60)} h ${String(Math.round(sunPath.dayLength % 60)).padStart(2, '0')} min` : '—' }}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt class="text-[11px] text-white/45">{{ isEn ? 'Solar noon · max. elevation' : 'Pravé poledne · max. výška' }}</dt>
                                        <dd class="mt-1 text-lg font-medium tabular-nums">{{ hhmm(sunPath.noon) }} · {{ f(sunPath.maxElev, 1) }}°</dd>
                                    </div>
                                    <div>
                                        <dt class="text-[11px] text-white/45">{{ isEn ? 'Sun now' : 'Slunce teď' }} · {{ hhmm(sunPath.nowMin) }}</dt>
                                        <dd class="mt-1 text-lg font-medium tabular-nums" :class="sunPath.nowElev > 0 ? 'text-[#fbbf24]' : 'text-white/60'">
                                            {{ f(sunPath.nowElev, 1) }}° · {{ azimuthName(sunPath.nowAz) }} {{ f(sunPath.nowAz, 0) }}°
                                        </dd>
                                    </div>
                                </dl>
                                <p class="mt-4 text-[11px] leading-relaxed text-white/30">
                                    {{
                                        isEn
                                            ? 'Solar position computed in-browser with the NOAA declination / equation-of-time formulas for the station coordinates. Dashed: solstices.'
                                            : 'Poloha slunce spočtena v prohlížeči dle vzorců NOAA (deklinace, časová rovnice) pro souřadnice stanice. Čárkovaně: slunovraty.'
                                    }}
                                </p>
                            </div>
                        </section>

                        <!-- 05 · Sources -->
                        <section data-chapter="sources" class="scroll-mt-28 border-t border-white/[0.06] py-20 sm:py-28">
                            <div class="max-w-3xl" v-bind="reveal('sources')">
                                <InvestorChapterMark index="05" :label="chapters[4].label" />
                                <h2 class="mt-6" :class="HEADLINE">{{ isEn ? 'Read the originals.' : 'Přečtěte si originály.' }}</h2>
                                <p class="mt-4 max-w-2xl text-base leading-relaxed text-white/55">
                                    {{
                                        isEn
                                            ? 'Every equation, wind-tunnel campaign, and CFD simulation behind the Treetino yield model is documented in the original Faculty of Mechanical Engineering (FS ČVUT) reports below.'
                                            : 'Každá rovnice, tunelová kampaň i CFD simulace za výpočtem výroby Treetino je zdokumentována v originálních zprávách Fakulty strojní ČVUT níže.'
                                    }}
                                </p>
                            </div>

                            <div class="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-10">
                                <!-- Original FS ČVUT PDF reports -->
                                <ol
                                    class="divide-y divide-white/[0.07] overflow-hidden rounded-2xl border border-white/10 bg-white/[0.015]"
                                    v-bind="reveal('sources', 120)"
                                >
                                    <li v-for="(s, idx) in sources" :key="s.href">
                                        <a
                                            :href="s.href"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            class="group flex items-start justify-between gap-4 p-5 transition-colors hover:bg-white/[0.03] sm:p-6"
                                        >
                                            <div class="flex min-w-0 items-start gap-4">
                                                <span
                                                    class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] font-mono text-xs text-[#8ec5ff] transition-colors group-hover:border-[#8ec5ff]/40 group-hover:bg-[#8ec5ff]/10"
                                                >
                                                    {{ String(idx + 1).padStart(2, '0') }}
                                                </span>
                                                <div class="min-w-0">
                                                    <div class="flex flex-wrap items-center gap-2 text-[11px] text-white/40">
                                                        <span class="font-mono tabular-nums">{{ s.date }}</span>
                                                        <span>·</span>
                                                        <span class="rounded border border-white/10 bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10px] text-white/65">
                                                            {{ s.size }}
                                                        </span>
                                                    </div>
                                                    <p class="mt-2 text-[15px] leading-snug font-medium text-white transition-colors group-hover:text-[#8ec5ff]">
                                                        {{ s.title }}
                                                    </p>
                                                    <p class="mt-1.5 text-xs leading-relaxed text-white/45">{{ s.meta }}</p>
                                                </div>
                                            </div>
                                            <span
                                                class="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/50 transition-all group-hover:border-white/30 group-hover:bg-white/[0.08] group-hover:text-white"
                                            >
                                                <ArrowUpRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                            </span>
                                        </a>
                                    </li>
                                </ol>

                                <!-- Methodology & Verification architectural card -->
                                <div
                                    class="flex flex-col justify-between rounded-2xl border border-white/10 bg-[radial-gradient(120%_100%_at_100%_0%,rgba(77,141,255,0.12),rgba(255,255,255,0.015)_70%)] p-6 sm:p-7"
                                    v-bind="reveal('sources', 220)"
                                >
                                    <div>
                                        <p class="flex items-center gap-3 text-[11px] font-medium tracking-[0.2em] uppercase">
                                            <span class="text-[#8ec5ff]">{{ isEn ? 'Methodology' : 'Metodika' }}</span>
                                            <span class="h-px w-6 bg-white/20"></span>
                                            <span class="text-white/45">FS ČVUT · 2026</span>
                                        </p>

                                        <div class="mt-5 grid grid-cols-3 divide-x divide-white/[0.08] rounded-xl border border-white/[0.08] bg-zinc-950/60 py-3.5 text-center">
                                            <div class="px-2">
                                                <p class="text-xl leading-none font-medium tracking-[-0.03em] text-white tabular-nums">
                                                    {{ f(0.382, 3) }}
                                                </p>
                                                <p class="mt-1.5 text-[10px] text-white/45">c<sub>P</sub> Scooplet CFD</p>
                                            </div>
                                            <div class="px-2">
                                                <p class="text-xl leading-none font-medium tracking-[-0.03em] text-[#8ec5ff] tabular-nums">
                                                    {{ f(14.9, 1) }} <span class="text-xs font-normal text-white/45">m/s</span>
                                                </p>
                                                <p class="mt-1.5 text-[10px] text-white/45">{{ isEn ? 'Slot jet peak' : 'Proud ve štěrbině' }}</p>
                                            </div>
                                            <div class="px-2">
                                                <p class="text-xl leading-none font-medium tracking-[-0.03em] text-white tabular-nums">
                                                    10
                                                </p>
                                                <p class="mt-1.5 text-[10px] text-white/45">{{ isEn ? 'Tunnel models' : 'Modelů v tunelu' }}</p>
                                            </div>
                                        </div>

                                        <p class="mt-5 text-sm leading-relaxed text-white/65">
                                            {{
                                                isEn
                                                    ? 'The site production calculator uses cP = 0.382 — the verified ANSYS Fluent CFD result for the Scooplet D150 barrel rotor (outer S-shell + internal pocket splitter vanes). Sub-scale 3D-printed models tested in the wind tunnel reach cP = 0.12–0.19; per report R00, tunnel values represent a conservative lower bound because bearing friction torque was not subtracted.'
                                                    : 'Výpočet výroby pro klientské lokality používá cP = 0,382 — ověřený výsledek CFD simulace ANSYS Fluent pro soudečkový rotor Scooplet D150 (vnější S-skořepina + vnitřní křidélka v dutině). Zmenšené modely měřené v aerodynamickém tunelu dosahují cP = 0,12–0,19; dle zprávy R00 jde o konzervativní spodní hranici, protože brzdný moment v ložiskách nebylo možné odečíst.'
                                            }}
                                        </p>
                                    </div>

                                    <div class="mt-6 flex flex-wrap items-center justify-between gap-2 border-t border-white/[0.08] pt-4 text-xs text-white/45">
                                        <span>{{ isEn ? 'Dept. of Fluid Mechanics & Thermodynamics · FS ČVUT' : 'Ústav mechaniky tekutin a termodynamiky · FS ČVUT' }}</span>
                                        <span class="font-medium text-white/70">Ing. Jakub Suchý, Ph.D.</span>
                                    </div>
                                </div>
                            </div>

                            <div class="mt-16 flex justify-center">
                                <button type="button" :class="BTN_SECONDARY" @click="emit('close')">
                                    <ArrowLeft class="h-4 w-4 text-[#8ec5ff]" />
                                    {{ isEn ? 'Back to the station' : 'Zpět na stanici' }}
                                </button>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.science-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.15) transparent;
}
</style>
