<script setup lang="ts">
import { ArrowDownToLine, ArrowUpRight, ChevronLeft, ChevronRight, FlaskConical, Play, Plus, X } from 'lucide-vue-next';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ClientsLiveTree from './ClientsLiveTree.vue';
import ClientsPaybackChart from './ClientsPaybackChart.vue';
import ClientsWindRose from './ClientsWindRose.vue';
import type { SiteOfferSimulationResult } from './cvutPhysics';
import type { IntradayPoint, StationTelemetryBundle } from './pwsData';
import {
    cardinalCs,
    czk,
    longDate,
    millions,
    num,
    shortDate,
    SUBSIDY_PCT,
    TARIFF_CZK_PER_KWH,
    tr
    
    
    
} from './stationApp';
import type { StationMediaItem, StationVariantOption, VariantQty } from './stationApp';
import { useTween } from './useTween';

const props = defineProps<{
    campaign: StationTelemetryBundle;
    live: StationTelemetryBundle['current'];
    isLive: boolean;
    status: 'live' | 'historic';
    statusNote: string;
    title: string;
    city: string;
    media: StationMediaItem[];
    variants: [StationVariantOption, StationVariantOption];
    sims: Record<VariantQty, SiteOfferSimulationResult>;
    qty: VariantQty;
    docs: { offer: string; study: string } | null;
    /** false while a full-screen overlay covers the panel (pauses the 3D tree) */
    active?: boolean;
    /** Today's live intraday series for the digital-twin replay */
    liveIntraday?: IntradayPoint[];
}>();

const emit = defineEmits<{
    close: [];
    'update:qty': [qty: VariantQty];
    print: [kind: 'offer' | 'study'];
    science: [];
}>();

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');

const activeVariant = computed(() => props.variants[props.qty - 1] ?? props.variants[0]);
const sim = computed(() => props.sims[props.qty]);
const agg = computed(() => props.campaign.aggregates);
const id = computed(() => props.campaign.identity);

const liveHeading = computed(() => {
    if (props.status === 'historic') {
        return isEn.value ? 'Final observation' : 'Poslední měření';
    }

    return isEn.value ? 'Right now' : 'Právě teď';
});

const liveTime = computed(() => {
    const t = props.live.obsTimeLocal || '';

    if (props.status === 'historic') {
        return `${longDate(t, locale.value)} ${t.slice(11, 16)}`;
    }

    if (props.isLive) {
        return isEn.value ? `updated ${t.slice(11, 16)}` : `aktualizováno ${t.slice(11, 16)}`;
    }

    return isEn.value
        ? `last record ${longDate(t, locale.value)} ${t.slice(11, 16)}`
        : `poslední záznam ${longDate(t, locale.value)} ${t.slice(11, 16)}`;
});

const dominant = computed(() => {
    const top = [...props.campaign.windRose16].sort((a, b) => b.pct - a.pct)[0];

    return { dir: cardinalCs(top.sector, locale.value), pct: top.pct };
});

/* Campaign chart: multi-day campaign uses dailyHistory; 1-day live station uses intradayToday */
const chart = computed(() => {
    const W = 360;
    const H = 84;
    const isSingleDay = props.campaign.dailyHistory.length <= 1 && props.campaign.intradayToday.length > 1;

    if (isSingleDay) {
        const pts = props.campaign.intradayToday;
        const maxG = Math.max(4, ...pts.map((p) => p.windgustHighMs)) * 1.08;
        const step = W / Math.max(1, pts.length);
        const peakIdx = pts.reduce((best, p, i) => (p.windgustHighMs > pts[best].windgustHighMs ? i : best), 0);
        const bars = pts.map((p, i) => ({
            x: i * step + step * 0.18,
            cx: i * step + step / 2,
            w: step * 0.64,
            h: (p.windgustHighMs / maxG) * H,
            peak: i === peakIdx,
            dateLabel: p.timeLabel,
            valLabel: fmt1(p.windgustHighMs),
        }));
        const line = pts
            .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step + step / 2).toFixed(1)},${(H - (p.windspeedAvgMs / maxG) * H).toFixed(1)}`)
            .join(' ');

        return {
            W,
            H,
            bars,
            line,
            firstLabel: pts[0]?.timeLabel ?? '',
            lastLabel: pts[pts.length - 1]?.timeLabel ?? '',
            avgLabel: isEn.value ? 'Interval average' : 'Průměr intervalu',
            gustLabel: isEn.value ? 'Wind gust' : 'Náraz větru',
            showAllTicks: false,
        };
    }

    const rows = props.campaign.dailyHistory;
    const isSparseArchive = props.campaign.identity.stationId === 'D3882832837' || rows.length <= 10;
    const maxG = Math.max(4, ...rows.map((r) => r.windgustHighMs)) * 1.15;
    const step = W / Math.max(1, rows.length);
    const peakIdx = rows.reduce((best, r, i) => (r.windgustHighMs > rows[best].windgustHighMs ? i : best), 0);
    const barW = isSparseArchive ? Math.min(26, step * 0.48) : step * 0.6;
    const bars = rows.map((r, i) => ({
        x: i * step + (step - barW) / 2,
        cx: i * step + step / 2,
        w: barW,
        h: (r.windgustHighMs / maxG) * H,
        peak: i === peakIdx,
        dateLabel: shortDate(r.date, locale.value),
        valLabel: fmt1(r.windgustHighMs),
    }));
    const line = rows
        .map((r, i) => {
            const val = isSparseArchive ? r.windspeedHighMs : r.windspeedAvgMs;

            return `${i === 0 ? 'M' : 'L'}${(i * step + step / 2).toFixed(1)},${(H - (val / maxG) * H).toFixed(1)}`;
        })
        .join(' ');

    return {
        W,
        H,
        bars,
        line,
        firstLabel: shortDate(rows[0]?.date ?? '', locale.value),
        lastLabel: shortDate(rows[rows.length - 1]?.date ?? '', locale.value),
        avgLabel: isSparseArchive
            ? isEn.value
                ? 'Max sustained'
                : 'Max. trvalý vítr'
            : isEn.value
              ? 'Daily average'
              : 'Denní průměr',
        gustLabel: isSparseArchive
            ? isEn.value
                ? 'Peak gust'
                : 'Max. náraz'
            : isEn.value
              ? 'Daily peak gust'
              : 'Max. náraz dne',
        showAllTicks: isSparseArchive,
    };
});

const windShare = computed(() => (sim.value.annualWindKwh / Math.max(1, sim.value.annualTotalKwh)) * 100);
const annualTween = useTween(computed(() => sim.value.annualTotalKwh), 1300);
const windShareTween = useTween(windShare, 1300);

const rows = computed(() => {
    const loc = locale.value;
    const days = sim.value.campaignDays;

    return [
        {
            label: isEn.value ? 'Configuration' : 'Sestava',
            value: tr(activeVariant.value.assembly, loc),
        },
        {
            label:
                days === 1
                    ? isEn.value
                        ? 'Day 1 measured yield'
                        : 'Za 1. den měření by vyrobil'
                    : isEn.value
                      ? `Yield over ${days} measured days`
                      : `Za ${days} dní měření by vyrobil`,
            value: `${num(sim.value.campaignTotalKwh, days === 1 ? 1 : 0, loc)} kWh`,
        },
        {
            label: isEn.value ? `Net investment (${SUBSIDY_PCT}% grant)` : `Investice po ${SUBSIDY_PCT}% dotaci`,
            value: czk(sim.value.netCapexAfterSubsidyCzk, loc),
        },
        {
            label: isEn.value
                ? `Annual savings (CZK ${num(TARIFF_CZK_PER_KWH, 2, 'en')}/kWh)`
                : `Roční úspora (${num(TARIFF_CZK_PER_KWH, 2, 'cs')} Kč/kWh)`,
            value: czk(sim.value.annualSavingsCzk, loc),
        },
        {
            label: isEn.value ? 'Payback period' : 'Návratnost',
            value: isEn.value ? `${num(sim.value.paybackYears, 1, 'en')} yrs` : `${num(sim.value.paybackYears, 1, 'cs')} let`,
            accent: true,
        },
        {
            label: isEn.value ? '25-year net profit' : 'Čistý zisk za 25 let',
            value: millions(sim.value.netProfit25YrCzk, 2, loc),
        },
    ];
});

const nowMetrics = computed(() => [
    { label: isEn.value ? 'Wind' : 'Vítr', value: fmt1(props.live.windspeedMs), unit: 'm/s' },
    { label: isEn.value ? 'Gust' : 'Náraz', value: fmt1(props.live.windgustMs), unit: 'm/s' },
    { label: isEn.value ? 'Direction' : 'Směr', value: cardinalCs(props.live.winddirCardinal, locale.value), arrow: true },
    { label: isEn.value ? 'Temp' : 'Teplota', value: fmt1(props.live.tempC), unit: '°C' },
]);

function fmt1(v: number) {
    return num(v, 1, locale.value);
}

const offerSubLabel = computed(() => {
    const isMixed = props.variants[0].systemId !== props.variants[1].systemId;

    if (isMixed) {
        return isEn.value ? 'PDF · 2× V2 / 2× V1' : 'PDF · 2× V2 / 2× V1';
    }

    if (props.variants[0].systemId === 'strom-v1' && props.variants[1].systemId === 'strom-v1') {
        return 'PDF · 3× V1 / 1× V1';
    }

    return isEn.value ? 'PDF · both options' : 'PDF · obě varianty';
});

/* ------------------------------------------------------------------ */
/* Site photos & video gallery (prefilled + user additions)            */
/* ------------------------------------------------------------------ */

const customMediaByStation = ref<Record<string, StationMediaItem[]>>({});
const fileInputRef = ref<HTMLInputElement | null>(null);
const activeMediaIndex = ref<number | null>(null);

function storageKey(stationId: string) {
    return `treetino_station_media_${stationId}`;
}

function loadCustomMedia(stationId: string) {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        const raw = window.localStorage.getItem(storageKey(stationId));

        if (raw) {
            customMediaByStation.value[stationId] = JSON.parse(raw);
        }
    } catch {
        // Ignore storage errors
    }
}

watch(
    () => id.value.stationId,
    (stationId) => {
        activeMediaIndex.value = null;
        loadCustomMedia(stationId);
    },
    { immediate: true },
);

const allMedia = computed<StationMediaItem[]>(() => [
    ...props.media,
    ...(customMediaByStation.value[id.value.stationId] ?? []),
]);

const activeMedia = computed(() => (activeMediaIndex.value !== null ? allMedia.value[activeMediaIndex.value] ?? null : null));

function openUploadPicker() {
    fileInputRef.value?.click();
}

function onFilesSelected(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    if (!files.length) {
        return;
    }

    const stationId = id.value.stationId;
    const existing = [...(customMediaByStation.value[stationId] ?? [])];

    for (const file of files) {
        const isVideo = file.type.startsWith('video/');
        const url = URL.createObjectURL(file);
        const capText = `${props.city} · ${file.name.replace(/\.[^.]+$/, '')}`;
        const item: StationMediaItem = {
            id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            kind: isVideo ? 'video' : 'image',
            src: url,
            caption: { cs: capText, en: capText },
        };
        existing.push(item);

        if (!isVideo && file.size <= 1_500_000) {
            const reader = new FileReader();
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    item.src = reader.result;

                    try {
                        window.localStorage.setItem(storageKey(stationId), JSON.stringify(customMediaByStation.value[stationId] ?? []));
                    } catch {
                        // Quota exceeded, keep in-memory URL
                    }
                }
            };
            reader.readAsDataURL(file);
        }
    }

    customMediaByStation.value = {
        ...customMediaByStation.value,
        [stationId]: existing,
    };
    input.value = '';
}

function stepMedia(delta: number) {
    if (activeMediaIndex.value === null || !allMedia.value.length) {
        return;
    }

    activeMediaIndex.value = (activeMediaIndex.value + delta + allMedia.value.length) % allMedia.value.length;
}
</script>

<template>
    <aside class="flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/85 shadow-2xl backdrop-blur-2xl">
        <!-- Mobile sheet grab handle -->
        <div class="mx-auto mt-2 h-1 w-9 shrink-0 rounded-full bg-white/15 lg:hidden" aria-hidden="true"></div>

        <!-- Header -->
        <header class="flex items-start justify-between gap-3 px-4 pt-2.5 pb-3.5 sm:gap-4 sm:px-6 sm:pt-6 sm:pb-5">
            <div class="min-w-0">
                <p class="flex items-center gap-2.5 text-[10px] font-medium tracking-[0.2em] uppercase sm:gap-3 sm:text-[11px]">
                    <span
                        class="flex items-center gap-1.5"
                        :class="status === 'live' ? 'text-[#8ec5ff]' : 'text-white/60'"
                    >
                        <span
                            class="h-1.5 w-1.5 rounded-full"
                            :class="
                                status === 'live'
                                    ? 'bg-[#8ec5ff] shadow-[0_0_8px_rgba(142,197,255,0.9)]'
                                    : 'bg-white/40'
                            "
                        ></span>
                        {{ status === 'live' ? (isEn ? 'Live' : 'Živě') : isEn ? 'Historic' : 'Historie' }}
                    </span>
                    <span class="h-px w-5 bg-white/20 sm:w-6"></span>
                    <span class="text-white/45 tabular-nums">{{ id.stationId }}</span>
                </p>
                <h2 class="mt-1.5 text-xl leading-tight font-medium tracking-[-0.03em] text-white sm:mt-3 sm:text-2xl">{{ title }}</h2>
                <p class="mt-0.5 truncate text-xs text-white/45 sm:mt-1 sm:text-sm">
                    {{ city }} · {{ id.elevationM }} {{ isEn ? 'm ASL' : 'm n. m.' }} · {{ statusNote }}
                </p>
            </div>
            <button
                type="button"
                class="-mt-0.5 -mr-1.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white/50 transition-colors hover:bg-white/[0.06] hover:text-white sm:-mt-1 sm:-mr-2 sm:h-9 sm:w-9"
                :aria-label="isEn ? 'Close detail' : 'Zavřít detail'"
                @click="emit('close')"
            >
                <X class="h-4 w-4" />
            </button>
        </header>

        <div data-panel-scroll class="panel-scroll flex-1 overflow-y-auto px-4 pb-5 sm:px-6 sm:pb-6">
            <!-- Digital twin: the offered tree, driven by this station's wind and sun -->
            <section class="pb-5">
                <ClientsLiveTree
                    :bundle="campaign"
                    :live="live"
                    :variant="activeVariant"
                    :is-live="isLive"
                    :active="active !== false"
                    :intraday="liveIntraday"
                />
            </section>

            <!-- Right now / last recorded -->
            <section class="border-t border-white/10 pt-5">
                <div class="flex items-baseline justify-between">
                    <h3 class="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">{{ liveHeading }}</h3>
                    <span class="text-xs text-white/35">{{ liveTime }}</span>
                </div>
                <div class="mt-4 grid grid-cols-4 gap-3">
                    <div v-for="m in nowMetrics" :key="m.label">
                        <p class="flex items-center gap-1.5 text-lg leading-none font-medium tracking-[-0.02em] tabular-nums">
                            <svg
                                v-if="m.arrow"
                                viewBox="0 0 16 16"
                                class="h-3.5 w-3.5 text-[#8ec5ff]"
                                :style="{ transform: `rotate(${live.winddirDeg + 180}deg)` }"
                            >
                                <path d="M8 2l3.5 10L8 10l-3.5 2z" fill="currentColor" />
                            </svg>
                            {{ m.value }}<span v-if="m.unit" class="text-xs font-normal text-white/40">{{ m.unit }}</span>
                        </p>
                        <p class="mt-1.5 text-[11px] text-white/45">{{ m.label }}</p>
                    </div>
                </div>
            </section>

            <!-- Site photos & videos -->
            <section class="mt-6 border-t border-white/10 pt-5">
                <div class="flex items-center justify-between">
                    <h3 class="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">
                        {{ isEn ? 'Installation site' : 'Místo instalace' }}
                    </h3>
                    <button
                        type="button"
                        class="inline-flex items-center gap-1 text-xs text-[#8ec5ff] transition-colors hover:text-white"
                        @click="openUploadPicker"
                    >
                        <Plus class="h-3.5 w-3.5" />
                        <span>{{ isEn ? 'Add photo' : 'Přidat foto' }}</span>
                    </button>
                    <input
                        ref="fileInputRef"
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        class="hidden"
                        @change="onFilesSelected"
                    />
                </div>

                <div class="mt-3.5 grid grid-cols-4 gap-2">
                    <button
                        v-for="(item, idx) in allMedia"
                        :key="item.id"
                        type="button"
                        class="group relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10 bg-zinc-900 text-left focus:outline-none focus:ring-1 focus:ring-[#8ec5ff]"
                        :title="tr(item.caption, locale)"
                        @click="activeMediaIndex = idx"
                    >
                        <img
                            v-if="item.kind === 'image' || item.poster"
                            :src="item.kind === 'video' ? item.poster : item.src"
                            :alt="tr(item.caption, locale)"
                            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <video
                            v-else
                            :src="item.src"
                            muted
                            playsinline
                            preload="metadata"
                            class="h-full w-full object-cover"
                        ></video>
                        <span
                            v-if="item.kind === 'video'"
                            class="absolute inset-0 flex items-center justify-center bg-black/35 transition-colors group-hover:bg-black/20"
                        >
                            <span class="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950/80 text-white ring-1 ring-white/25">
                                <Play class="ml-0.5 h-3 w-3 fill-current" />
                            </span>
                        </span>
                    </button>
                </div>
            </section>

            <!-- What the selected tree option would produce here -->
            <section class="mt-6 border-t border-white/10 pt-5">
                <div class="flex items-center justify-between gap-2">
                    <h3 class="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">
                        <span>{{ isEn ? 'Production' : 'Výroba' }}</span>
                        <span class="hidden sm:inline"> · {{ tr(activeVariant.shortModel, locale) }}</span>
                    </h3>
                    <div
                        class="flex rounded-lg border border-white/10 p-0.5 text-xs"
                        role="radiogroup"
                        :aria-label="isEn ? 'Configuration option' : 'Varianta stromů'"
                    >
                        <button
                            v-for="v in variants"
                            :key="v.key"
                            type="button"
                            role="radio"
                            :aria-checked="qty === v.key"
                            class="rounded-md px-2.5 py-1.5 font-medium whitespace-nowrap transition-colors"
                            :class="qty === v.key ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white'"
                            @click="emit('update:qty', v.key)"
                        >
                            {{ tr(v.buttonLabel, locale) }}
                        </button>
                    </div>
                </div>

                <p class="mt-5 text-[2.5rem] leading-none font-medium tracking-[-0.04em] tabular-nums">
                    {{ num(annualTween, 0, locale) }}<span class="ml-2 text-lg tracking-normal text-white/40">{{ isEn ? 'kWh / yr' : 'kWh / rok' }}</span>
                </p>

                <div class="mt-4 flex h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div class="bg-[#8ec5ff] shadow-[0_0_12px_rgba(142,197,255,0.8)]" :style="{ width: `${windShareTween}%` }"></div>
                    <div class="flex-1 bg-gradient-to-r from-amber-200/70 to-white/55"></div>
                </div>
                <div class="mt-2 flex justify-between text-xs text-white/45 tabular-nums">
                    <span><span class="text-[#8ec5ff]">{{ isEn ? 'Wind' : 'Vítr' }}</span> {{ num(sim.annualWindKwh, 0, locale) }} kWh</span>
                    <span><span class="text-white/80">{{ isEn ? 'Solar' : 'Slunce' }}</span> {{ num(sim.annualSolarKwh, 0, locale) }} kWh</span>
                </div>

                <dl class="mt-5">
                    <div v-for="r in rows" :key="r.label" class="flex items-baseline justify-between gap-4 border-t border-white/[0.07] py-2.5 text-sm">
                        <dt class="text-white/55">{{ r.label }}</dt>
                        <dd class="font-medium tabular-nums" :class="r.accent ? 'text-[#8ec5ff]' : 'text-white'">{{ r.value }}</dd>
                    </div>
                </dl>

                <!-- 25-year cash flow -->
                <div class="mt-4 rounded-xl border border-white/[0.07] bg-white/[0.015] px-3.5 pt-3 pb-2">
                    <div class="mb-2 flex items-baseline justify-between">
                        <span class="text-[11px] text-white/45">{{ isEn ? 'Cumulative cash flow · 25 years' : 'Kumulovaný cash flow · 25 let' }}</span>
                        <span class="text-[10px] text-white/30">{{ isEn ? '+3 % p.a. tariff' : '+3 % ročně tarif' }}</span>
                    </div>
                    <ClientsPaybackChart :cashflow="sim.cashflow25Years" :payback-years="sim.paybackYears" :net-capex="sim.netCapexAfterSubsidyCzk" />
                </div>
            </section>

            <!-- Measurement campaign -->
            <section class="mt-6 border-t border-white/10 pt-5">
                <div class="flex items-baseline justify-between">
                    <h3 class="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">
                        {{ isEn ? 'Measurement campaign' : 'Měřicí kampaň' }}
                    </h3>
                    <span class="text-xs text-white/35 tabular-nums">
                        {{
                            agg.dateStart === agg.dateEnd
                                ? isEn
                                    ? `since ${longDate(agg.dateStart, locale)}`
                                    : `od ${longDate(agg.dateStart, locale)}`
                                : `${shortDate(agg.dateStart, locale)} – ${longDate(agg.dateEnd, locale)}`
                        }}
                    </span>
                </div>

                <svg
                    :viewBox="`0 0 ${chart.W} ${chart.H + 16}`"
                    class="mt-4 w-full"
                    :aria-label="isEn ? 'Average wind speed and peak gust' : 'Průměrná rychlost větru a maximální náraz'"
                >
                    <rect
                        v-for="(b, i) in chart.bars"
                        :key="i"
                        :x="b.x"
                        :y="chart.H - b.h"
                        :width="b.w"
                        :height="b.h"
                        rx="1.5"
                        :fill="b.peak ? 'rgba(142,197,255,0.55)' : 'rgba(255,255,255,0.14)'"
                    />
                    <path :d="chart.line" fill="none" stroke="#8ec5ff" stroke-width="1.6" stroke-linejoin="round" />
                    <template v-if="chart.showAllTicks">
                        <template v-for="(b, i) in chart.bars" :key="'lbl-' + i">
                            <text
                                :x="b.cx"
                                :y="Math.max(8, chart.H - b.h - 3)"
                                text-anchor="middle"
                                :class="b.peak ? 'fill-[#8ec5ff] text-[8.5px] font-medium' : 'fill-white/50 text-[8px]'"
                            >
                                {{ b.valLabel }}
                            </text>
                            <text :x="b.cx" :y="chart.H + 13" text-anchor="middle" class="fill-white/35 text-[8.5px]">
                                {{ b.dateLabel }}
                            </text>
                        </template>
                    </template>
                    <template v-else>
                        <text x="0" :y="chart.H + 13" class="fill-white/30 text-[9px]">{{ chart.firstLabel }}</text>
                        <text :x="chart.W" :y="chart.H + 13" text-anchor="end" class="fill-white/30 text-[9px]">{{ chart.lastLabel }}</text>
                    </template>
                </svg>
                <div class="mt-2 flex items-center gap-4 text-[11px] text-white/40">
                    <span class="flex items-center gap-1.5"><span class="h-px w-3 bg-[#8ec5ff]"></span>{{ chart.avgLabel }}</span>
                    <span class="flex items-center gap-1.5"><span class="h-2 w-1.5 rounded-[1px] bg-white/20"></span>{{ chart.gustLabel }}</span>
                </div>

                <div class="mt-5 grid grid-cols-3 gap-4">
                    <div>
                        <p class="text-lg leading-none font-medium tabular-nums">
                            {{
                                agg.totalDays === 1
                                    ? isEn
                                        ? 'Day 1'
                                        : '1. den'
                                    : isEn
                                      ? `${agg.totalDays} days`
                                      : `${agg.totalDays} dní`
                            }}
                        </p>
                        <p class="mt-1.5 text-xs text-white/45">
                            {{
                                campaign.identity.stationId === 'D3882832837'
                                    ? isEn
                                        ? '232 bins · 92 extremes'
                                        : '232 binů · 92 extrémů'
                                    : `${num(agg.total5MinFrames, 0, locale)} ${isEn ? 'records' : 'záznamů'}`
                            }}
                        </p>
                    </div>
                    <div>
                        <p class="text-lg leading-none font-medium tabular-nums">{{ fmt1(agg.peakGustMs) }} m/s</p>
                        <p class="mt-1.5 text-xs text-white/45">{{ isEn ? 'Peak gust' : 'Nejsilnější náraz' }}</p>
                    </div>
                    <div>
                        <p class="text-lg leading-none font-medium">{{ dominant.dir }}</p>
                        <p class="mt-1.5 text-xs text-white/45">
                            {{ isEn ? `Prevails ${num(dominant.pct, 0, locale)}%` : `Převládá ${num(dominant.pct, 0, locale)} % času` }}
                        </p>
                    </div>
                </div>

                <!-- Wind rose -->
                <div class="mt-5 flex items-center gap-5 rounded-xl border border-white/[0.07] bg-white/[0.015] p-4">
                    <div class="w-[46%] shrink-0">
                        <ClientsWindRose :sectors="campaign.windRose16" :live-from-deg="isLive ? live.winddirDeg : null" />
                    </div>
                    <div class="min-w-0 text-[12px] leading-relaxed text-white/50">
                        <p class="text-[11px] font-medium tracking-[0.2em] text-white/45 uppercase">{{ isEn ? 'Wind rose' : 'Větrná růžice' }}</p>
                        <p class="mt-2">
                            {{
                                isEn
                                    ? `Share of time per direction across ${num(agg.total5MinFrames, 0, 'en')} records. Brighter petals blow harder.`
                                    : `Podíl času v každém směru z ${num(agg.total5MinFrames, 0, 'cs')} záznamů. Jasnější okvětí = silnější vítr.`
                            }}
                        </p>
                        <p v-if="isLive" class="mt-2 flex items-center gap-1.5 text-emerald-300/80">
                            <span class="h-px w-3 bg-emerald-300"></span>{{ isEn ? 'live direction' : 'aktuální směr' }}
                        </p>
                    </div>
                </div>
            </section>

            <!-- The science behind the numbers -->
            <section class="mt-6 border-t border-white/10 pt-5">
                <button
                    type="button"
                    class="group relative block w-full overflow-hidden rounded-2xl border border-white/10 bg-[linear-gradient(135deg,rgba(77,141,255,0.14),rgba(255,255,255,0.02)_65%,rgba(9,9,11,0)_100%)] p-4 text-left transition-colors hover:border-white/25"
                    @click="emit('science')"
                >
                    <span class="flex items-center justify-between">
                        <span class="flex items-center gap-2 text-[10px] font-medium tracking-[0.2em] text-[#8ec5ff] uppercase">
                            <FlaskConical class="h-3.5 w-3.5" />{{ isEn ? 'The science · ČVUT' : 'Věda · ČVUT' }}
                        </span>
                        <ArrowUpRight class="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white" />
                    </span>
                    <span class="mt-3 flex items-center gap-3.5">
                        <span class="shrink-0 text-[1.75rem] leading-none font-medium tracking-[-0.04em] whitespace-nowrap text-white tabular-nums">
                            <span class="mr-1.5 text-base font-normal tracking-normal text-white/55">c<sub class="text-[11px]">P</sub></span>{{ num(sim.activeCp, 3, locale) }}
                        </span>
                        <span class="min-w-0 flex-1 border-l border-white/10 pl-3.5 text-[12px] leading-snug text-white/55">
                            {{
                                isEn
                                    ? 'Wind-tunnel and CFD research behind every number on this page.'
                                    : 'Měření v aerodynamickém tunelu a CFD simulace za každým číslem.'
                            }}
                        </span>
                    </span>
                </button>
            </section>
        </div>

        <!-- Export -->
        <footer class="border-t border-white/10 bg-zinc-950/75 px-3.5 py-3 sm:px-6 sm:py-5">
            <div class="grid grid-cols-2 gap-2 sm:gap-2.5">
                <component
                    :is="docs && !isEn ? 'a' : 'button'"
                    :href="!isEn ? docs?.offer : undefined"
                    :download="docs && !isEn ? '' : undefined"
                    type="button"
                    class="group flex items-center justify-between gap-2 rounded-xl bg-t-blue px-3 py-2.5 text-left text-white shadow-[0_0_32px_rgba(77,141,255,0.35)] transition-shadow duration-200 hover:shadow-[0_0_44px_rgba(77,141,255,0.6)] sm:px-4 sm:py-3"
                    @click="(!docs || isEn) && emit('print', 'offer')"
                >
                    <span class="min-w-0">
                        <span class="block truncate text-[13px] font-medium sm:text-sm">
                            {{ isEn ? 'Price Offer' : 'Cenová nabídka' }}
                        </span>
                        <span class="block truncate text-[10px] text-white/60 sm:text-[11px]">{{ offerSubLabel }}</span>
                    </span>
                    <ArrowDownToLine class="h-4 w-4 shrink-0 text-white/70 transition-transform group-hover:translate-y-0.5" />
                </component>
                <component
                    :is="docs && !isEn ? 'a' : 'button'"
                    :href="!isEn ? docs?.study : undefined"
                    :download="docs && !isEn ? '' : undefined"
                    type="button"
                    class="group flex items-center justify-between gap-2 rounded-xl border border-white/20 bg-white/[0.03] px-3 py-2.5 text-left text-white transition-colors duration-200 hover:border-white/45 hover:bg-white/[0.07] sm:px-4 sm:py-3"
                    @click="(!docs || isEn) && emit('print', 'study')"
                >
                    <span class="min-w-0">
                        <span class="block truncate text-[13px] font-medium sm:text-sm">
                            {{ isEn ? 'Technical Study' : 'Technická studie' }}
                        </span>
                        <span class="block truncate text-[10px] text-white/50 sm:text-[11px]">
                            PDF · {{ tr(activeVariant.title, locale) }}
                        </span>
                    </span>
                    <ArrowDownToLine class="h-4 w-4 shrink-0 text-white/50 transition-transform group-hover:translate-y-0.5" />
                </component>
            </div>
        </footer>

        <!-- Lightbox modal for viewing site photos and playing location video -->
        <Teleport to="body">
            <div
                v-if="activeMedia"
                class="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/90 p-4 backdrop-blur-xl sm:p-8"
                @click.self="activeMediaIndex = null"
            >
                <button
                    type="button"
                    class="absolute top-5 right-5 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-zinc-900/80 text-white/75 transition-colors hover:text-white"
                    :aria-label="isEn ? 'Close preview' : 'Zavřít náhled'"
                    @click="activeMediaIndex = null"
                >
                    <X class="h-4 w-4" />
                </button>

                <button
                    v-if="allMedia.length > 1"
                    type="button"
                    class="absolute left-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-zinc-900/80 text-white/75 transition-colors hover:text-white sm:left-6"
                    :aria-label="isEn ? 'Previous' : 'Předchozí'"
                    @click="stepMedia(-1)"
                >
                    <ChevronLeft class="h-4 w-4" />
                </button>

                <div class="flex max-h-[86vh] max-w-4xl flex-col items-center">
                    <video
                        v-if="activeMedia.kind === 'video'"
                        :key="activeMedia.src"
                        :src="activeMedia.src"
                        :poster="activeMedia.poster"
                        controls
                        autoplay
                        playsinline
                        class="max-h-[76vh] rounded-xl border border-white/10 bg-black shadow-2xl"
                    ></video>
                    <img
                        v-else
                        :src="activeMedia.src"
                        :alt="tr(activeMedia.caption, locale)"
                        class="max-h-[76vh] rounded-xl border border-white/10 object-contain shadow-2xl"
                    />
                    <p class="mt-3 text-center text-xs text-white/60">{{ tr(activeMedia.caption, locale) }}</p>
                </div>

                <button
                    v-if="allMedia.length > 1"
                    type="button"
                    class="absolute right-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-zinc-900/80 text-white/75 transition-colors hover:text-white sm:right-6"
                    :aria-label="isEn ? 'Next' : 'Další'"
                    @click="stepMedia(1)"
                >
                    <ChevronRight class="h-4 w-4" />
                </button>
            </div>
        </Teleport>
    </aside>
</template>

<style scoped>
.panel-scroll {
    scrollbar-width: thin;
    scrollbar-color: rgba(255, 255, 255, 0.12) transparent;
}
</style>
