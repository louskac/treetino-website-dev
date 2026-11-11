<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ArrowUpRight, ChevronRight, FlaskConical } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ClientsOfferPdf from '@/custom/clients/ClientsOfferPdf.vue';
import ClientsStationMap from '@/custom/clients/ClientsStationMap.vue';
import type { MapInsets, MapStation } from '@/custom/clients/ClientsStationMap.vue';
import ClientsStationPanel from '@/custom/clients/ClientsStationPanel.vue';
import ClientsStudyPdf from '@/custom/clients/ClientsStudyPdf.vue';
import ClientsTrackingDemo from '@/custom/clients/ClientsTrackingDemo.vue';
import { computeLiveOutput, sampleFromCurrent } from '@/custom/clients/livePhysics';
import { fetchLiveStationTelemetry } from '@/custom/clients/pwsData';
import type { IntradayPoint, StationTelemetryBundle } from '@/custom/clients/pwsData';
import ClientsScience from '@/custom/clients/science/ClientsScience.vue';
import {
    cardinalCs,
    computePortfolio,
    documentUrls,
    getStationEntry,
    millions,
    num,
    PENDING_STATIONS,
    simulateVariant,
    STATION_ENTRIES,
    STATION_LINKS,
    tr
    
    
} from '@/custom/clients/stationApp';
import type { StationEntry, VariantQty } from '@/custom/clients/stationApp';
import { useTween } from '@/custom/clients/useTween';
import CookieBanner from '@/custom/CookieBanner.vue';
import Header from '@/custom/Header.vue';
import InvestorChapterMark from '@/custom/investors/InvestorChapterMark.vue';
import { CONTAINER, HEADLINE } from '@/custom/investors/tokens';
import LiquidGlassFilter from '@/custom/LiquidGlassFilter.vue';

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');

/* ------------------------------------------------------------------ */
/* Mode: interactive app, or a bare A4 document for print / PDF export */
/* ------------------------------------------------------------------ */

const query = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
const printKind = (['offer', 'study'] as const).find((k) => k === query.get('print')) ?? null;
const rawModelParam = (query.get('model') || '').toLowerCase();
const rawVariantParam = query.get('variant') || query.get('qty') || '';
const printQty: VariantQty = rawModelParam === 'v1' || rawVariantParam === '2' ? 2 : 1;
const printStationId = query.get('station')?.toUpperCase() || 'IPRAGU1761';
const issuedIso = new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------------ */
/* App state: Live stations + Historic stations                        */
/* ------------------------------------------------------------------ */

const initialStationParam = query.get('station')?.toUpperCase() || (query.get('detail') ? 'IPRAGU1761' : null);
const selectedId = ref<string | null>(
    initialStationParam && STATION_ENTRIES.some((s) => s.id === initialStationParam) ? initialStationParam : null,
);
const qty = ref<VariantQty>(printQty);

const liveTelemetryById = ref<Record<string, StationTelemetryBundle['current']>>(
    Object.fromEntries(STATION_ENTRIES.map((s) => [s.id, s.bundle.current])),
);
/** Today's live intraday series (digital-twin replay only; never feeds the PDF numbers) */
const liveIntradayById = ref<Record<string, IntradayPoint[]>>({});

const activeEntry = computed<StationEntry>(() => getStationEntry(printKind ? printStationId : (selectedId.value ?? 'ISTOCH13')));
const campaign = computed(() => activeEntry.value.bundle);
const sims = computed<Record<VariantQty, ReturnType<typeof simulateVariant>>>(() => ({
    1: simulateVariant(activeEntry.value, 1),
    2: simulateVariant(activeEntry.value, 2),
}));

const activePrintVariant = computed(() => activeEntry.value.variants[printQty - 1] ?? activeEntry.value.variants[0]);
const activeVariant = computed(() => activeEntry.value.variants[qty.value - 1] ?? activeEntry.value.variants[0]);

const activeCurrent = computed(() => liveTelemetryById.value[activeEntry.value.id] ?? activeEntry.value.bundle.current);
const isStationLive = (entry: StationEntry) => entry.status === 'live';

const liveStations = computed(() => STATION_ENTRIES.filter((s) => s.status === 'live'));
const historicStations = computed(() => STATION_ENTRIES.filter((s) => s.status === 'historic'));

/* Portfolio: one engine, same numbers as the PDFs */
const portfolio = computePortfolio();
const portfolioById = Object.fromEntries(portfolio.rows.map((r) => [r.entry.id, r]));

const stations = computed<MapStation[]>(() =>
    STATION_ENTRIES.map((s) => {
        const cur = liveTelemetryById.value[s.id] ?? s.bundle.current;

        return {
            id: s.id,
            title: tr(s.title, locale.value),
            x: s.bundle.identity.mapX,
            y: s.bundle.identity.mapY,
            lat: s.bundle.identity.lat,
            lon: s.bundle.identity.lon,
            windMs: cur.windspeedMs,
            live: s.status === 'live',
            chipSide: s.chipSide,
            annualKwh: portfolioById[s.id]?.sim.annualTotalKwh,
        };
    }),
);

const mapLinks = computed(() => STATION_LINKS.map((l) => ({ from: l.from, to: l.to, label: l.label ? tr(l.label, locale.value) : undefined })));

const mapWindCurrent = computed(() => {
    if (selectedId.value) {
        return activeCurrent.value;
    }

    return liveTelemetryById.value.ISTOCH13 ?? STATION_ENTRIES[0].bundle.current;
});

const docs = computed(() => (selectedId.value ? documentUrls(activeEntry.value, qty.value) : null));

/* Count-up KPIs */
const kpiStart = ref(false);
const tClients = useTween(computed(() => (kpiStart.value ? portfolio.clients : 0)), 900);
const tTrees = useTween(computed(() => (kpiStart.value ? portfolio.trees : 0)), 1100);
const tMwh = useTween(computed(() => (kpiStart.value ? portfolio.annualKwh / 1000 : 0)), 1600);
const tCapex = useTween(computed(() => (kpiStart.value ? portfolio.capexCzk : 0)), 1600);
const tDays = useTween(computed(() => (kpiStart.value ? portfolio.measuredDays : 0)), 1300);
const tCo2 = useTween(computed(() => (kpiStart.value ? portfolio.co2TonsPerYear : 0)), 1400);

const kpis = computed(() => [
    { value: num(Math.round(tClients.value), 0, locale.value), label: isEn.value ? 'client sites' : 'klientské lokality' },
    { value: num(Math.round(tTrees.value), 0, locale.value), label: isEn.value ? 'trees offered' : 'stromů v nabídkách' },
    { value: num(tMwh.value, 1, locale.value), unit: isEn.value ? 'MWh/yr' : 'MWh/rok', label: isEn.value ? 'modelled output' : 'modelovaná výroba' },
    { value: millions(tCapex.value, 1, locale.value), label: isEn.value ? 'offer pipeline' : 'objem nabídek' },
    { value: num(Math.round(tDays.value), 0, locale.value), unit: isEn.value ? 'days' : 'dní', label: isEn.value ? 'field telemetry' : 'měření v terénu' },
    { value: num(tCo2.value, 1, locale.value), unit: isEn.value ? 't CO₂/yr' : 't CO₂/rok', label: isEn.value ? 'avoided' : 'ušetřeno' },
]);

/* Live feed (overview HUD): what the offered Stochov trees would make right now */
const liveFeed = computed(() => {
    const entry = liveStations.value[0];

    if (!entry) {
        return null;
    }

    const cur = liveTelemetryById.value[entry.id] ?? entry.bundle.current;
    const variant = entry.variants[entry.portfolioVariant - 1];
    const out = computeLiveOutput(entry.bundle, variant.systemId, variant.quantity, variant.hubHeightM, sampleFromCurrent(cur));

    return { entry, cur, variant, out };
});

function select(id: string) {
    selectedId.value = id;
}

function clear() {
    selectedId.value = null;
}

function openPrint(kind: 'offer' | 'study') {
    const st = selectedId.value || 'ISTOCH13';
    const q = kind === 'study' ? `&qty=${qty.value}` : '';
    window.open(`/clients?print=${kind}&station=${st}${q}&lang=${locale.value}&autoprint=1`, '_blank', 'noopener');
}

/* The Science overlay */
const scienceOpen = ref(query.get('science') === '1');

function openScience() {
    scienceOpen.value = true;
}

/* Keep the URL shareable without reloading */
watch(selectedId, (id) => {
    if (printKind) {
        return;
    }

    const url = new URL(window.location.href);

    if (id) {
        url.searchParams.set('station', id);
    } else {
        url.searchParams.delete('station');
    }

    url.searchParams.delete('detail');
    window.history.replaceState(window.history.state, '', url);
});

watch(scienceOpen, (open) => {
    if (printKind) {
        return;
    }

    const url = new URL(window.location.href);

    if (open) {
        url.searchParams.set('science', '1');
    } else {
        url.searchParams.delete('science');
    }

    window.history.replaceState(window.history.state, '', url);
});

/* ------------------------------------------------------------------ */
/* Intro: Europe dives into Czechia once per session                   */
/* ------------------------------------------------------------------ */

const playIntro = (() => {
    if (printKind || typeof window === 'undefined' || selectedId.value) {
        return false;
    }

    try {
        return !window.sessionStorage.getItem('treetino_clients_intro');
    } catch {
        return true;
    }
})();
const introDone = ref(!playIntro);

function onIntroDone() {
    introDone.value = true;
    kpiStart.value = true;

    try {
        window.sessionStorage.setItem('treetino_clients_intro', '1');
    } catch {
        // private mode
    }
}

/* ------------------------------------------------------------------ */
/* Map framing: keep the subject clear of the floating UI              */
/* ------------------------------------------------------------------ */

const containerRef = ref<HTMLElement | null>(null);
const heroTextRef = ref<HTMLElement | null>(null);
const stationCardRef = ref<HTMLElement | null>(null);
const viewport = ref({ w: 1440, h: 900, left: 200, right: 1240 });
const mobileMapBounds = ref({ top: 245, bottom: 245 });

function measure() {
    const r = containerRef.value?.getBoundingClientRect();
    const h = window.innerHeight;
    viewport.value = {
        w: window.innerWidth,
        h,
        left: r?.left ?? 24,
        right: r?.right ?? window.innerWidth - 24,
    };

    const heroEl = heroTextRef.value;
    const cardEl = stationCardRef.value;
    const secEl = heroEl?.offsetParent as HTMLElement | null;

    if (heroEl && cardEl && secEl) {
        const secTop = secEl.offsetTop;
        const heroBottom = secTop + heroEl.offsetTop + heroEl.offsetHeight;
        const cardTop = secTop + cardEl.offsetTop;

        if (heroBottom > 0 && cardTop > heroBottom) {
            mobileMapBounds.value = {
                top: Math.round(heroBottom + 6),
                bottom: Math.round(h - cardTop + 6),
            };
        }
    }
}

const isDesktop = computed(() => viewport.value.w >= 1024);
const panelW = computed(() => (viewport.value.w >= 1280 ? 460 : 440));

const insets = computed<MapInsets>(() => {
    const { w, h, left, right } = viewport.value;

    if (!isDesktop.value) {
        return selectedId.value
            ? { left: 10, top: 88, right: 10, bottom: Math.round(h * 0.72) }
            : { left: 16, top: mobileMapBounds.value.top, right: 16, bottom: mobileMapBounds.value.bottom };
    }

    if (selectedId.value) {
        return { left: left, top: 144, right: w - right + panelW.value + 36, bottom: 40 };
    }

    return { left: left + 400, top: 144, right: 40, bottom: 40 };
});

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */

function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape' && !scienceOpen.value) {
        clear();
    }
}

onMounted(async () => {
    if (printKind) {
        document.documentElement.classList.add('clients-print-mode');

        if (query.get('autoprint')) {
            await document.fonts.ready;
            await new Promise((r) => setTimeout(r, 300));
            window.print();
        }

        return;
    }

    measure();
    requestAnimationFrame(measure);
    window.addEventListener('resize', measure);
    window.addEventListener('keydown', onKey);
    document.documentElement.classList.add('clients-app-mode');

    if (!playIntro) {
        kpiStart.value = true;
    }

    const liveStationsList = STATION_ENTRIES.filter((s) => s.status === 'live');
    await Promise.all(
        liveStationsList.map(async (st) => {
            try {
                const bundle = await fetchLiveStationTelemetry(st.id);
                if (bundle.isLiveApi) {
                    liveTelemetryById.value = {
                        ...liveTelemetryById.value,
                        [st.id]: bundle.current,
                    };
                    liveIntradayById.value = {
                        ...liveIntradayById.value,
                        [st.id]: bundle.intradayToday,
                    };
                }
            } catch {
                // Offline: falls back to the last recorded observation
            }
        }),
    );
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', measure);
    window.removeEventListener('keydown', onKey);
    document.documentElement.classList.remove('clients-app-mode', 'clients-print-mode');
});
</script>

<template>
    <Head>
        <title>{{ isEn ? 'Telemetry Stations · Treetino' : 'Měřicí stanice · Treetino' }}</title>
        <meta name="robots" content="noindex, nofollow" />
        <meta
            name="description"
            :content="
                isEn
                    ? 'Treetino telemetry station network. Verified wind and solar observations and site-specific energy yield for Tree V2 & V1.'
                    : 'Síť měřicích stanic Treetino. Skutečná data větru a slunce a výpočet výroby Stromu V2 a V1 pro konkrétní místo.'
            "
        />
    </Head>

    <!-- Bare documents for print / PDF export -->
    <main v-if="printKind" class="clients-print">
        <ClientsOfferPdf
            v-if="printKind === 'offer'"
            :campaign="campaign"
            :variants="activeEntry.variants"
            :sims="sims"
            :client-name="tr(activeEntry.clientName, locale)"
            :cover-photo="activeEntry.offerCoverPhoto"
            :cover-caption="tr(activeEntry.offerCoverCaption, locale)"
            :issued-iso="issuedIso"
        />
        <ClientsStudyPdf
            v-else
            :campaign="campaign"
            :sim="sims[printQty]"
            :variant="activePrintVariant"
            :client-name="tr(activeEntry.clientName, locale)"
            :site-photo="activeEntry.sitePhoto"
        />
    </main>

    <!-- The app -->
    <div v-else class="dark fixed inset-0 h-dvh overflow-hidden bg-zinc-950 text-white">
        <LiquidGlassFilter />

        <ClientsStationMap
            :stations="stations"
            :selected-id="selectedId"
            :insets="insets"
            :wind-from-deg="mapWindCurrent.winddirDeg"
            :wind-ms="mapWindCurrent.windspeedMs"
            :intro="playIntro"
            :links="mapLinks"
            @select="select"
            @clear="clear"
            @intro-done="onIntroDone"
        />

        <!-- Edge vignettes keep the floating UI legible over the map -->
        <div class="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-zinc-950 via-zinc-950/70 to-transparent"></div>
        <div
            class="pointer-events-none absolute inset-y-0 left-0 hidden w-[46rem] bg-gradient-to-r from-zinc-950/90 via-zinc-950/40 to-transparent transition-opacity duration-500 lg:block"
            :class="selectedId ? 'opacity-0' : 'opacity-100'"
        ></div>

        <Header :scroll="false" :dark="true" />

        <div ref="containerRef" :class="CONTAINER" class="pointer-events-none absolute inset-0 z-20">
            <!-- Overview column -->
            <Transition name="column">
                <section
                    v-if="!selectedId"
                    class="absolute inset-x-0 top-24 bottom-3 flex flex-col sm:top-36 sm:bottom-4 lg:top-36 lg:bottom-7 lg:w-[380px]"
                    :class="{ 'intro-stagger': playIntro }"
                >
                    <div class="rise" style="--d: 0.35s">
                        <InvestorChapterMark :index="isEn ? 'CZ' : 'ČR'" :label="isEn ? 'Treetino Field Network' : 'Síť měřicích stanic Treetino'" />
                    </div>
                    <h1 :class="HEADLINE" class="rise mt-2.5 sm:mt-3.5 lg:mt-4" style="--d: 0.5s">
                        {{ isEn ? 'Real wind.' : 'Skutečný vítr.' }}<br />
                        <span class="headline-shine">{{ isEn ? 'Real numbers.' : 'Skutečná čísla.' }}</span>
                    </h1>
                    <p ref="heroTextRef" class="rise mt-2 max-w-[34ch] text-[13.5px] leading-snug text-white/55 sm:mt-2.5 sm:text-[15px] sm:leading-relaxed lg:mt-3 [@media(max-height:840px)]:lg:hidden" style="--d: 0.65s">
                        {{
                            isEn
                                ? 'Every client site measured on location. Pick one to watch its Treetino tree run on that site’s real wind and sun.'
                                : 'Každá lokalita klienta změřená přímo na místě. Vyberte ji a sledujte, jak by tam Strom Treetino běžel na skutečný vítr a slunce.'
                        }}
                    </p>

                    <!-- Station list: unified, minimal architectural list -->
                    <div
                        ref="stationCardRef"
                        class="rise pointer-events-auto mt-auto overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:mt-4"
                        style="--d: 0.8s"
                    >
                        <div class="divide-y divide-white/[0.07]">
                            <button
                                v-for="st in [...liveStations, ...historicStations]"
                                :key="st.id"
                                type="button"
                                class="station-row group flex w-full items-center gap-2.5 px-3.5 py-3 text-left transition-colors hover:bg-white/[0.04] sm:gap-3.5 sm:px-4 sm:py-3.5"
                                @click="select(st.id)"
                            >
                                <span class="relative flex h-2 w-2 shrink-0">
                                    <span
                                        v-if="st.status === 'live'"
                                        class="absolute inset-0 animate-ping rounded-full bg-[#8ec5ff]/75 [animation-duration:2s]"
                                    ></span>
                                    <span
                                        class="relative h-2 w-2 rounded-full"
                                        :class="st.status === 'live' ? 'bg-[#8ec5ff] shadow-[0_0_8px_rgba(142,197,255,0.9)]' : 'bg-white/25'"
                                    ></span>
                                </span>

                                <span class="min-w-0 flex-1">
                                    <span class="block truncate text-[15px] leading-tight font-medium tracking-[-0.015em] text-white">
                                        {{ tr(st.title, locale) }}
                                    </span>
                                    <span class="mt-1 block truncate text-xs text-white/45">
                                        <template v-if="st.status === 'live'">
                                            <span class="text-[#8ec5ff]/90">{{ isEn ? 'Live' : 'Měří živě' }}</span> ·
                                        </template>
                                        <template v-else>{{ tr(st.city, locale) }} · </template>
                                        {{ tr(portfolioById[st.id].variant.buttonLabel, locale) }}
                                    </span>
                                </span>

                                <span class="shrink-0 text-right tabular-nums">
                                    <span
                                        v-if="st.status === 'live'"
                                        class="block text-[13px] leading-tight font-medium text-[#8ec5ff]"
                                    >
                                        {{ num((liveTelemetryById[st.id] ?? st.bundle.current).windspeedMs, 1, locale) }}
                                        <span class="text-[11px] font-normal text-[#8ec5ff]/70">m/s</span>
                                    </span>
                                    <span v-else class="block text-[13px] leading-tight font-medium text-white/80">
                                        {{ st.bundle.aggregates.totalDays || st.bundle.dailyHistory.length }}
                                        <span class="text-[11px] font-normal text-white/45">{{ isEn ? 'days' : 'dní' }}</span>
                                    </span>
                                    <span class="mt-0.5 block text-[11px] text-white/40">
                                        {{ num(portfolioById[st.id].sim.annualTotalKwh, 0, locale) }} {{ isEn ? 'kWh/yr' : 'kWh/rok' }}
                                    </span>
                                </span>

                                <ChevronRight class="h-4 w-4 shrink-0 text-white/25 transition-all group-hover:translate-x-0.5 group-hover:text-white/75" />
                            </button>
                        </div>

                        <!-- Mobile science entry footer (replaces floating top-right badge that overlapped the eyebrow) -->
                        <button
                            type="button"
                            class="group flex w-full items-center justify-between border-t border-white/[0.07] bg-[linear-gradient(135deg,rgba(77,141,255,0.12),rgba(255,255,255,0.02))] px-3.5 py-2.5 text-left text-xs font-medium text-white transition-colors hover:bg-white/[0.05] lg:hidden"
                            @click="openScience"
                        >
                            <span class="flex items-center gap-2">
                                <FlaskConical class="h-3.5 w-3.5 text-[#8ec5ff]" />
                                <span>{{ isEn ? 'The science behind the numbers · ČVUT' : 'Věda za čísly · ČVUT' }}</span>
                            </span>
                            <ArrowUpRight class="h-3.5 w-3.5 text-white/45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                        </button>

                        <!-- Prepared stations footer (desktop / tablet) -->
                        <div class="hidden items-center justify-between border-t border-white/[0.07] bg-white/[0.015] px-4 py-2.5 text-xs lg:flex">
                            <span class="text-white/40">
                                {{ isEn ? 'Ready for deployment on new sites' : 'Připraveno k instalaci na dalších lokalitách' }}
                            </span>
                            <span class="font-medium text-white/60 tabular-nums">
                                +{{ PENDING_STATIONS.length }} {{ isEn ? 'stations' : 'stanice' }}
                            </span>
                        </div>
                    </div>

                    <!-- Portfolio KPIs: computed live from the same engine as the PDFs -->
                    <div class="rise mt-3.5 hidden lg:block" style="--d: 0.95s">
                        <div class="grid grid-cols-3 gap-x-5 gap-y-3 border-t border-white/12 pt-3.5">
                            <div v-for="k in kpis" :key="k.label">
                                <p class="text-[1.45rem] leading-none font-medium tracking-[-0.035em] whitespace-nowrap text-white tabular-nums">
                                    {{ k.value }}<span v-if="k.unit" class="ml-1 text-[11px] font-normal tracking-normal text-white/40">{{ k.unit }}</span>
                                </p>
                                <p class="mt-1.5 text-[11px] leading-snug text-white/45">{{ k.label }}</p>
                            </div>
                        </div>
                    </div>

                    <div class="rise pointer-events-auto mt-3.5 hidden gap-2.5 lg:flex" style="--d: 1.1s">
                        <button
                            type="button"
                            class="group inline-flex flex-1 items-center justify-between gap-2 rounded-xl border border-white/12 bg-[linear-gradient(135deg,rgba(77,141,255,0.12),rgba(255,255,255,0.02))] px-4 py-3 text-left text-sm font-medium text-white backdrop-blur-md transition-colors hover:border-white/30 hover:bg-white/[0.05]"
                            @click="openScience"
                        >
                            <span class="flex items-center gap-2.5">
                                <FlaskConical class="h-4 w-4 text-[#8ec5ff]" />
                                {{ isEn ? 'The science behind the numbers · ČVUT' : 'Věda za čísly · ČVUT' }}
                            </span>
                            <ArrowUpRight class="h-4 w-4 text-white/45 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                        </button>
                    </div>
                </section>
            </Transition>

            <!-- Live feed HUD (desktop overview) -->
            <Transition name="hud">
                <button
                    v-if="!selectedId && liveFeed && isDesktop && introDone"
                    type="button"
                    class="group pointer-events-auto absolute top-36 right-0 w-[276px] overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(120%_95%_at_85%_0%,rgba(77,141,255,0.16),rgba(9,9,11,0.84)_70%)] text-left shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-2xl transition-colors hover:border-white/25"
                    @click="select(liveFeed.entry.id)"
                >
                    <div class="p-4">
                        <div class="flex items-center justify-between">
                            <span class="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] uppercase">
                                <span class="relative flex h-1.5 w-1.5">
                                    <span class="absolute inset-0 animate-ping rounded-full bg-[#8ec5ff]/75 [animation-duration:2s]"></span>
                                    <span class="relative h-1.5 w-1.5 rounded-full bg-[#8ec5ff]"></span>
                                </span>
                                <span class="text-[#8ec5ff]">{{ isEn ? 'Live feed' : 'Živý přenos' }}</span>
                                <span class="h-px w-3 bg-white/15"></span>
                                <span class="font-mono text-white/40 tabular-nums">{{ liveFeed.entry.id }}</span>
                            </span>
                            <ArrowUpRight class="h-3.5 w-3.5 text-white/35 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                        </div>

                        <p class="mt-2.5 text-[13px] font-medium text-white">
                            {{ tr(liveFeed.entry.title, locale) }}
                            <span class="font-normal text-white/45">· {{ tr(liveFeed.variant.buttonLabel, locale) }}</span>
                        </p>

                        <div class="mt-3 flex items-baseline justify-between gap-2">
                            <p class="text-[2.15rem] leading-none font-medium tracking-[-0.04em] text-white tabular-nums">
                                {{ num(liveFeed.out.totalKw, 2, locale) }}<span class="ml-1 text-xs font-normal tracking-normal text-white/45">kW</span>
                            </p>
                            <p class="text-right text-[11px] text-white/45 tabular-nums">
                                <span class="text-[#8ec5ff]">{{ num(liveFeed.out.windKw, 2, locale) }}</span> {{ isEn ? 'wind' : 'vítr' }} ·
                                <span class="text-amber-300/90">{{ num(liveFeed.out.solarKw, 2, locale) }}</span> {{ isEn ? 'sun' : 'slunce' }}
                            </p>
                        </div>

                        <div class="mt-2.5 flex h-1 overflow-hidden rounded-full bg-white/10">
                            <div
                                class="bg-[#8ec5ff]"
                                :style="{
                                    width: `${Math.round((liveFeed.out.windKw / Math.max(0.01, liveFeed.out.totalKw)) * 100)}%`,
                                }"
                            ></div>
                            <div class="flex-1 bg-amber-300/75"></div>
                        </div>
                    </div>

                    <div class="grid grid-cols-3 divide-x divide-white/[0.07] border-t border-white/[0.08] bg-white/[0.015]">
                        <div class="px-3.5 py-2.5">
                            <p class="text-[13px] leading-none font-medium text-white tabular-nums">
                                {{ num(liveFeed.cur.windspeedMs, 1, locale) }}<span class="ml-0.5 text-[10px] font-normal text-white/40">m/s</span>
                            </p>
                            <p class="mt-1 text-[10px] text-white/40">{{ isEn ? 'Wind' : 'Vítr' }}</p>
                        </div>
                        <div class="px-3.5 py-2.5">
                            <p class="text-[13px] leading-none font-medium text-white tabular-nums">
                                {{ num(liveFeed.out.rpm, 0, locale) }}<span class="ml-0.5 text-[10px] font-normal text-white/40">{{ isEn ? 'rpm' : 'ot/min' }}</span>
                            </p>
                            <p class="mt-1 text-[10px] text-white/40">{{ isEn ? 'Rotor' : 'Otáčky' }}</p>
                        </div>
                        <div class="px-3.5 py-2.5">
                            <p class="text-[13px] leading-none font-medium text-white tabular-nums">
                                {{ cardinalCs(liveFeed.cur.winddirCardinal, locale) }}
                            </p>
                            <p class="mt-1 text-[10px] text-white/40">{{ isEn ? 'Direction' : 'Směr' }}</p>
                        </div>
                    </div>
                </button>
            </Transition>

            <!-- Station detail -->
            <Transition :name="isDesktop ? 'drawer' : 'sheet'">
                <div
                    v-if="selectedId"
                    class="pointer-events-auto fixed inset-x-2.5 top-28 bottom-2.5 sm:inset-x-3 sm:top-[30%] lg:absolute lg:inset-x-auto lg:top-36 lg:right-0 lg:bottom-6 lg:w-[440px] xl:w-[460px]"
                >
                    <ClientsStationPanel
                        :key="activeEntry.id"
                        :campaign="campaign"
                        :live="activeCurrent"
                        :is-live="isStationLive(activeEntry)"
                        :status="activeEntry.status"
                        :status-note="tr(activeEntry.statusNote, locale)"
                        :title="tr(activeEntry.title, locale)"
                        :city="tr(activeEntry.city, locale)"
                        :media="activeEntry.media"
                        :variants="activeEntry.variants"
                        :sims="sims"
                        :qty="qty"
                        :docs="docs"
                        :active="!scienceOpen"
                        :live-intraday="liveIntradayById[activeEntry.id]"
                        @close="clear"
                        @select-station="select"
                        @update:qty="qty = $event"
                        @print="openPrint"
                        @science="openScience"
                    />
                </div>
            </Transition>
        </div>

        <ClientsScience
            :open="scienceOpen"
            :entry="activeEntry"
            :sim="sims[qty]"
            :variant="activeVariant"
            :live="activeCurrent"
            @close="scienceOpen = false"
        >
            <template #tracking>
                <ClientsTrackingDemo
                    v-if="scienceOpen"
                    :lat="activeEntry.bundle.identity.lat"
                    :lon="activeEntry.bundle.identity.lon"
                    :place-label="tr(activeEntry.city, locale)"
                    :variant="activeVariant.systemId === 'strom-v1' ? 'v1' : 'v2'"
                />
            </template>
        </ClientsScience>

        <CookieBanner />
    </div>
</template>

<style scoped>
.column-enter-active,
.column-leave-active {
    transition:
        opacity 0.45s ease,
        transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.column-enter-from,
.column-leave-to {
    opacity: 0;
    transform: translateX(-16px);
}

.hud-enter-active,
.hud-leave-active {
    transition:
        opacity 0.5s ease,
        transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
}
.hud-enter-from,
.hud-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

.drawer-enter-active,
.drawer-leave-active {
    transition:
        opacity 0.45s ease,
        transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
}
.drawer-enter-from,
.drawer-leave-to {
    opacity: 0;
    transform: translateX(32px);
}

.sheet-enter-active,
.sheet-leave-active {
    transition:
        opacity 0.35s ease,
        transform 0.45s cubic-bezier(0.22, 1, 0.36, 1);
}
.sheet-enter-from,
.sheet-leave-to {
    opacity: 0;
    transform: translateY(40px);
}

/* Intro: the column assembles while the camera dives in */
.intro-stagger .rise {
    animation: rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both;
    animation-delay: var(--d, 0s);
}

@keyframes rise {
    from {
        opacity: 0;
        transform: translateY(18px);
        filter: blur(6px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
        filter: blur(0);
    }
}

.headline-shine {
    background: linear-gradient(100deg, #8ec5ff 0%, #8ec5ff 38%, #e6f2ff 50%, #8ec5ff 62%, #8ec5ff 100%);
    background-size: 250% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    animation: shine 6s ease-in-out 1.6s infinite;
}

@keyframes shine {
    0% {
        background-position: 100% 0;
    }
    40%,
    100% {
        background-position: -50% 0;
    }
}

.pending-dot {
    animation: pending 2.4s ease-in-out infinite;
}

@keyframes pending {
    0%,
    100% {
        border-color: rgba(255, 255, 255, 0.25);
    }
    50% {
        border-color: rgba(142, 197, 255, 0.85);
    }
}

.eq-bar {
    height: 30%;
    animation: eq 1.2s ease-in-out infinite alternate;
    opacity: 0.85;
}

@keyframes eq {
    from {
        height: 20%;
    }
    to {
        height: 100%;
    }
}

@media (prefers-reduced-motion: reduce) {
    .intro-stagger .rise,
    .headline-shine,
    .pending-dot,
    .eq-bar {
        animation: none;
    }
}
</style>

<style>
html.clients-app-mode,
html.clients-app-mode body {
    overflow: hidden;
    overscroll-behavior: none;
    background: #09090b;
}

html.clients-print-mode,
html.clients-print-mode body {
    margin: 0;
    background: #27272a;
}

.clients-print {
    padding: 10mm 0;
}

@media print {
    html.clients-print-mode,
    html.clients-print-mode body {
        background: #09090b !important;
    }

    .clients-print {
        padding: 0;
    }
}
</style>
