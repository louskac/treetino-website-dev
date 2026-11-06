<template>
    <div class="relative overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(ellipse_80%_70%_at_50%_35%,rgba(77,141,255,0.14),rgba(9,9,11,0)_70%)]">
        <!-- 3D stage -->
        <div class="relative h-[250px] sm:h-[270px]">
            <ClientsTreeScene
                :variant="variant.systemId === 'strom-v1' ? 'v1' : 'v2'"
                :rpm="out.rpm"
                :sun-azimuth-deg="out.sun.azimuthDeg"
                :sun-elevation-deg="out.sun.elevationDeg"
                :sun-path="sunPath"
                :wind-from-deg="sample.windFromDeg"
                :wind-ms="out.hubWindMs"
                :storm="out.storm"
                :active="active"
                :view-azimuth="-1.45"
            />

            <!-- Top HUD: one compact line so the sky stays free for the sun -->
            <div class="pointer-events-none absolute inset-x-0 top-0 flex items-center gap-2 p-3.5">
                <span
                    class="inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-[0.18em] uppercase backdrop-blur-sm"
                    :class="mode === 'now' && isLive ? 'border-emerald-400/30 text-emerald-300' : 'border-[#8ec5ff]/30 text-[#8ec5ff]'"
                >
                    <span class="h-1 w-1 rounded-full" :class="mode === 'now' && isLive ? 'animate-pulse bg-emerald-300' : 'bg-[#8ec5ff]'"></span>
                    {{ modeLabel }}
                </span>
                <span class="text-[11px] text-white/45 tabular-nums">{{ stamp }}</span>
            </div>

            <!-- Big live power number -->
            <div class="pointer-events-none absolute bottom-3 left-3.5">
                <p class="font-mono text-[9px] tracking-[0.22em] text-white/40 uppercase">
                    {{ isEn ? 'Digital twin · output' : 'Digitální dvojče · výkon' }}
                </p>
                <p class="mt-1.5 text-[2rem] leading-none font-medium tracking-[-0.04em] text-white tabular-nums">
                    {{ num(out.totalKw, out.totalKw < 10 ? 2 : 1, locale) }}<span class="ml-1 text-sm tracking-normal text-white/45">kW</span>
                </p>
                <p class="mt-1 text-[11px] text-white/45">
                    <span class="text-[#8ec5ff]">{{ num(out.windKw, 2, locale) }}</span> {{ isEn ? 'wind' : 'vítr' }} ·
                    <span class="text-amber-300/90">{{ num(out.solarKw, 2, locale) }}</span> {{ isEn ? 'sun' : 'slunce' }}
                </p>
            </div>
            <div class="pointer-events-none absolute right-3.5 bottom-3 text-right">
                <p class="text-[13px] font-medium text-white">{{ tr(variant.title, locale) }}</p>
                <p class="text-[11px] text-white/40">{{ isEn ? 'hub' : 'osa' }} {{ num(variant.hubHeightM, 1, locale) }} m · {{ out.storm ? (isEn ? 'storm stow' : 'bouřková poloha') : nightOrTrack }}</p>
            </div>
        </div>

        <!-- Derived metrics -->
        <div class="grid grid-cols-4 border-t border-white/[0.07]">
            <div v-for="m in metrics" :key="m.label" class="border-r border-white/[0.07] px-3 py-2.5 last:border-r-0">
                <p class="text-[15px] leading-none font-medium tracking-[-0.02em] text-white tabular-nums">
                    {{ m.value }}<span class="ml-0.5 text-[10px] font-normal text-white/40">{{ m.unit }}</span>
                </p>
                <p class="mt-1 truncate text-[10px] text-white/40">{{ m.label }}</p>
            </div>
        </div>

        <!-- Day replay -->
        <div v-if="replayPoints.length > 1" class="border-t border-white/[0.07] px-3.5 pt-2.5 pb-3">
            <div class="flex items-center gap-3">
                <button
                    type="button"
                    class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/15 text-white/80 transition-colors hover:border-white/40 hover:text-white"
                    :aria-label="playing ? (isEn ? 'Pause' : 'Pozastavit') : isEn ? 'Replay the day' : 'Přehrát den'"
                    @click="togglePlay"
                >
                    <Pause v-if="playing" class="h-3 w-3" />
                    <Play v-else class="ml-0.5 h-3 w-3 fill-current" />
                </button>
                <div class="relative h-9 flex-1">
                    <svg viewBox="0 0 300 36" preserveAspectRatio="none" class="absolute inset-0 h-full w-full">
                        <path :d="strip.solar" fill="rgba(251,191,36,0.22)" />
                        <path :d="strip.wind" fill="rgba(142,197,255,0.35)" />
                        <path :d="strip.line" fill="none" stroke="#8ec5ff" stroke-width="1" vector-effect="non-scaling-stroke" />
                        <line :x1="playX" :x2="playX" y1="0" y2="36" stroke="white" stroke-width="1" vector-effect="non-scaling-stroke" />
                    </svg>
                    <input
                        v-model.number="replayT"
                        type="range"
                        :min="0"
                        :max="1"
                        step="0.001"
                        class="replay-range absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
                        :aria-label="isEn ? 'Time of day' : 'Čas dne'"
                        @input="onScrub"
                    />
                </div>
                <button
                    v-if="isLive"
                    type="button"
                    class="shrink-0 rounded-md px-2 py-1 font-mono text-[9px] tracking-[0.16em] uppercase transition-colors"
                    :class="mode === 'now' ? 'bg-emerald-400/15 text-emerald-300' : 'text-white/45 hover:text-white'"
                    @click="goLive"
                >
                    {{ isEn ? 'Live' : 'Živě' }}
                </button>
            </div>
            <div class="mt-1 flex justify-between pl-10 text-[10px] text-white/30 tabular-nums">
                <span>{{ pragueTime(replayPoints[0].epoch) }}</span>
                <span>{{ replayDayLabel }}</span>
                <span>{{ pragueTime(replayPoints[replayPoints.length - 1].epoch) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Pause, Play } from 'lucide-vue-next';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ClientsTreeScene from './ClientsTreeScene.vue';
import { computeLiveOutput, pragueTime, sampleFromCurrent, sampleFromIntraday, sunPosition } from './livePhysics';
import type { LiveSample } from './livePhysics';
import type { IntradayPoint, StationTelemetryBundle } from './pwsData';
import { degToCardinal16 } from './pwsData';
import { cardinalCs, longDate, num, tr } from './stationApp';
import type { StationVariantOption } from './stationApp';

const props = withDefaults(
    defineProps<{
        bundle: StationTelemetryBundle;
        live: StationTelemetryBundle['current'];
        variant: StationVariantOption;
        isLive: boolean;
        active?: boolean;
        /** Live intraday series (today) — replaces the stored one for the live station */
        intraday?: IntradayPoint[];
    }>(),
    { active: true, intraday: undefined },
);

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');

/* ------------------------------------------------------------------ */
/* Mode: live observation, or replay of a recorded day                 */
/* ------------------------------------------------------------------ */

const replayPoints = computed(() => {
    const b = props.bundle;
    const live = props.intraday && props.intraday.length > 1 ? props.intraday : b.intradayToday;
    const pts = props.isLive ? live : b.intradayPeakDay.length > 1 ? b.intradayPeakDay : b.intradayToday;

    return [...pts].sort((a, c) => a.epoch - c.epoch);
});

const mode = ref<'now' | 'replay'>(props.isLive ? 'now' : 'replay');
const replayT = ref(props.isLive ? 1 : 0.5);
const playing = ref(false);

const replayEpoch = computed(() => {
    const pts = replayPoints.value;

    if (!pts.length) {
        return props.live.epoch;
    }

    return pts[0].epoch + (pts[pts.length - 1].epoch - pts[0].epoch) * replayT.value;
});

const sample = computed<LiveSample>(() => {
    if (mode.value === 'replay') {
        return sampleFromIntraday(replayPoints.value, replayEpoch.value) ?? sampleFromCurrent(props.live);
    }

    return sampleFromCurrent(props.live);
});

const out = computed(() =>
    computeLiveOutput(props.bundle, props.variant.systemId, props.variant.quantity, props.variant.hubHeightM, sample.value),
);

/* Sun path of the shown day, in 15-minute steps */
const sunPath = computed(() => {
    const d = new Date(sample.value.epoch * 1000);
    const day = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
    const { lat, lon } = props.bundle.identity;

    return Array.from({ length: 97 }, (_, i) => {
        const p = sunPosition(new Date(day + i * 15 * 60_000), lat, lon);

        return { az: p.azimuthDeg, el: p.elevationDeg };
    });
});

/* Stacked wind/solar power strip across the replay day */
const strip = computed(() => {
    const pts = replayPoints.value;

    if (pts.length < 2) {
        return { wind: '', solar: '', line: '' };
    }

    const t0 = pts[0].epoch;
    const t1 = pts[pts.length - 1].epoch;
    const N = 72;
    const rows = Array.from({ length: N + 1 }, (_, i) => {
        const e = t0 + ((t1 - t0) * i) / N;
        const s = sampleFromIntraday(pts, e)!;
        const o = computeLiveOutput(props.bundle, props.variant.systemId, props.variant.quantity, props.variant.hubHeightM, s);

        return { x: (i / N) * 300, w: o.windKw, s: o.solarKw };
    });
    const max = Math.max(0.05, ...rows.map((r) => r.w + r.s)) * 1.12;
    const y = (v: number) => 36 - (v / max) * 34;
    const area = (top: (r: (typeof rows)[number]) => number, bottom: (r: (typeof rows)[number]) => number) =>
        `M${rows.map((r) => `${r.x.toFixed(1)},${y(top(r)).toFixed(2)}`).join(' L')} L${[...rows]
            .reverse()
            .map((r) => `${r.x.toFixed(1)},${y(bottom(r)).toFixed(2)}`)
            .join(' L')} Z`;

    return {
        wind: area(
            (r) => r.w,
            () => 0,
        ),
        solar: area(
            (r) => r.w + r.s,
            (r) => r.w,
        ),
        line: `M${rows.map((r) => `${r.x.toFixed(1)},${y(r.w + r.s).toFixed(2)}`).join(' L')}`,
    };
});

const playX = computed(() => (mode.value === 'replay' ? replayT.value * 300 : 300));

/* ------------------------------------------------------------------ */
/* Labels                                                              */
/* ------------------------------------------------------------------ */

const modeLabel = computed(() => {
    if (mode.value === 'now') {
        return props.isLive ? (isEn.value ? 'Live' : 'Živě') : isEn.value ? 'Final record' : 'Poslední záznam';
    }

    return isEn.value ? 'Replay' : 'Záznam';
});

const stamp = computed(() => {
    const e = sample.value.epoch;
    const iso = new Date(e * 1000).toLocaleDateString('sv-SE', { timeZone: 'Europe/Prague' });

    return `${longDate(iso, locale.value)} · ${pragueTime(e)}`;
});

const replayDayLabel = computed(() => {
    const pts = replayPoints.value;

    if (!pts.length) {
        return '';
    }

    const iso = pts[0].obsTimeLocal.slice(0, 10);
    const peak = !props.isLive && iso === props.bundle.aggregates.peakGustTimestamp.slice(0, 10);

    return `${longDate(iso, locale.value)}${peak ? (isEn.value ? ' · peak-gust day' : ' · den max. nárazu') : ''}`;
});

const nightOrTrack = computed(() => {
    if (out.value.sun.elevationDeg <= 0) {
        return isEn.value ? 'Night · leaves at rest' : 'Noc · listy v klidu';
    }

    return isEn.value ? 'Leaves tracking the sun' : 'Listy sledují slunce';
});

const metrics = computed(() => [
    { label: isEn.value ? `Wind @ ${num(props.variant.hubHeightM, 1, 'en')} m` : `Vítr v ${num(props.variant.hubHeightM, 1, 'cs')} m`, value: num(out.value.hubWindMs, 1, locale.value), unit: 'm/s' },
    { label: isEn.value ? 'Rotor speed' : 'Otáčky rotoru', value: num(out.value.rpm, 0, locale.value), unit: isEn.value ? 'rpm' : 'ot/min' },
    {
        label: isEn.value ? 'Sun elevation' : 'Výška slunce',
        value: num(Math.max(0, out.value.sun.elevationDeg), 0, locale.value),
        unit: `° ${cardinalCs(degToCardinal16(out.value.sun.azimuthDeg), locale.value)}`,
    },
    { label: isEn.value ? 'Wind from' : 'Vítr od', value: cardinalCs(degToCardinal16(sample.value.windFromDeg), locale.value), unit: '' },
]);

/* ------------------------------------------------------------------ */
/* Playback                                                            */
/* ------------------------------------------------------------------ */

let raf = 0;
let lastTs = 0;
const DAY_SECONDS = 16;

function step(ts: number) {
    const dt = Math.min(0.1, (ts - (lastTs || ts)) / 1000);
    lastTs = ts;
    replayT.value += dt / DAY_SECONDS;

    if (replayT.value >= 1) {
        replayT.value = 1;
        playing.value = false;

        return;
    }

    raf = requestAnimationFrame(step);
}

function play() {
    mode.value = 'replay';

    if (replayT.value >= 0.999) {
        replayT.value = 0;
    }

    playing.value = true;
    lastTs = 0;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(step);
}

function pause() {
    playing.value = false;
    cancelAnimationFrame(raf);
}

function togglePlay() {
    if (playing.value) {
        pause();
    } else {
        play();
    }
}

function onScrub() {
    pause();
    mode.value = 'replay';
}

function goLive() {
    pause();
    mode.value = 'now';
    replayT.value = 1;
}

watch(
    () => props.active,
    (on) => !on && pause(),
);

onMounted(() => {
    // Historic sites open on a replay of their most dramatic recorded day
    if (!props.isLive && replayPoints.value.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        replayT.value = 0.42;
        setTimeout(() => props.active && play(), 900);
    }
});

onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<style scoped>
.replay-range {
    -webkit-appearance: none;
    appearance: none;
}
</style>
