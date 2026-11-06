<template>
    <div class="relative h-full min-h-[420px] w-full">
        <ClientsTreeScene
            variant="v1"
            :rpm="storm ? 160 : 42"
            :sun-azimuth-deg="sun.azimuthDeg"
            :sun-elevation-deg="sun.elevationDeg"
            :sun-path="path"
            :wind-from-deg="250"
            :wind-ms="storm ? 14 : 3.5"
            :storm="storm"
            :active="active"
            :view-azimuth="-1.45"
        />

        <div class="pointer-events-none absolute top-4 left-4 sm:top-5 sm:left-5">
            <p class="font-mono text-[10px] tracking-[0.22em] text-amber-300/80 uppercase">{{ isEn ? 'Time-lapse · today' : 'Časosběr · dnes' }}</p>
            <p class="mt-1.5 text-3xl leading-none font-medium tracking-[-0.04em] text-white tabular-nums">{{ clock }}</p>
            <p class="mt-1 text-xs text-white/45 tabular-nums">
                {{ placeLabel }} · {{ isEn ? 'sun' : 'slunce' }} {{ num(Math.max(0, sun.elevationDeg), 0, locale) }}° ·
                {{ isEn ? 'az.' : 'az.' }} {{ num(sun.azimuthDeg, 0, locale) }}°
            </p>
        </div>

        <div class="absolute right-4 bottom-4 flex gap-2 sm:right-5 sm:bottom-5">
            <button
                type="button"
                class="rounded-full border px-3.5 py-1.5 text-xs font-medium backdrop-blur-md transition-colors"
                :class="storm ? 'border-[#8ec5ff]/60 bg-[#4d8dff]/20 text-white' : 'border-white/20 bg-zinc-950/60 text-white/80 hover:border-white/45'"
                @click="storm = !storm"
            >
                {{ storm ? (isEn ? 'Back to tracking' : 'Zpět ke sledování') : isEn ? 'Simulate hail storm' : 'Simulovat krupobití' }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import ClientsTreeScene from './ClientsTreeScene.vue';
import { pragueTime, sunPosition } from './livePhysics';
import { num } from './stationApp';

const props = withDefaults(defineProps<{ lat: number; lon: number; placeLabel: string; active?: boolean }>(), { active: true });

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');

const storm = ref(false);
const dayStart = (() => {
    const d = new Date();

    return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
})();

const path = computed(() =>
    Array.from({ length: 97 }, (_, i) => {
        const p = sunPosition(new Date(dayStart + i * 15 * 60_000), props.lat, props.lon);

        return { az: p.azimuthDeg, el: p.elevationDeg };
    }),
);

/* daylight window of today (first / last 15-min step above the horizon) */
const daylight = computed(() => {
    const up = path.value.map((p, i) => ({ i, up: p.el > 0 })).filter((p) => p.up);
    const a = up[0]?.i ?? 28;
    const b = up[up.length - 1]?.i ?? 68;

    return { t0: dayStart + (a - 1) * 15 * 60_000, t1: dayStart + (b + 1) * 15 * 60_000 };
});

const t = ref(0.15);
const now = computed(() => daylight.value.t0 + (daylight.value.t1 - daylight.value.t0) * t.value);
const sun = computed(() => sunPosition(new Date(now.value), props.lat, props.lon));
const clock = computed(() => pragueTime(now.value / 1000));

let raf = 0;
let last = 0;
const LOOP_S = 14;

function tick(ts: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (ts - (last || ts)) / 1000);
    last = ts;

    if (!props.active || storm.value) {
        return;
    }

    t.value = (t.value + dt / LOOP_S) % 1;
}

watch(
    () => props.active,
    (on) => {
        if (on) {
            last = 0;
        }
    },
);

onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        t.value = 0.5;

        return;
    }

    raf = requestAnimationFrame(tick);
});

onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>
