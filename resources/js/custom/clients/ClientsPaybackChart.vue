<template>
    <div class="relative">
        <svg :viewBox="`0 0 ${W} ${H + 18}`" class="w-full overflow-visible" :aria-label="isEn ? '25-year cumulative cash flow' : 'Kumulovaný cash flow za 25 let'">
            <defs>
                <linearGradient :id="`pb-pos-${uid}`" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#34d399" stop-opacity="0.35" />
                    <stop offset="100%" stop-color="#34d399" stop-opacity="0" />
                </linearGradient>
                <linearGradient :id="`pb-neg-${uid}`" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stop-color="#f87171" stop-opacity="0.28" />
                    <stop offset="100%" stop-color="#f87171" stop-opacity="0" />
                </linearGradient>
                <clipPath :id="`pb-above-${uid}`">
                    <rect x="0" y="0" :width="W" :height="Math.max(0, zeroY)" />
                </clipPath>
                <clipPath :id="`pb-below-${uid}`">
                    <rect x="0" :y="zeroY" :width="W" :height="Math.max(0, H - zeroY)" />
                </clipPath>
                <clipPath :id="`pb-reveal-${uid}`">
                    <rect x="0" y="-20" :width="Math.max(0, W * reveal)" :height="H + 40" />
                </clipPath>
            </defs>

            <!-- year grid -->
            <g class="text-[8px]">
                <template v-for="y in [0, 5, 10, 15, 20, 25]" :key="y">
                    <line :x1="xAt(y)" :x2="xAt(y)" y1="0" :y2="H" stroke="rgba(255,255,255,0.05)" />
                    <text :x="xAt(y)" :y="H + 13" text-anchor="middle" class="fill-white/30">{{ y }}</text>
                </template>
            </g>
            <line x1="0" :x2="W" :y1="zeroY" :y2="zeroY" stroke="rgba(255,255,255,0.22)" stroke-dasharray="2 3" />

            <g :clip-path="`url(#pb-reveal-${uid})`">
                <path :d="area" :fill="`url(#pb-pos-${uid})`" :clip-path="`url(#pb-above-${uid})`" />
                <path :d="area" :fill="`url(#pb-neg-${uid})`" :clip-path="`url(#pb-below-${uid})`" />
                <path :d="line" fill="none" stroke="#f87171" stroke-width="1.6" stroke-linejoin="round" :clip-path="`url(#pb-below-${uid})`" />
                <path :d="line" fill="none" stroke="#34d399" stroke-width="1.8" stroke-linejoin="round" :clip-path="`url(#pb-above-${uid})`" />
            </g>

            <!-- break-even -->
            <g v-if="paybackYears <= 25" :style="{ opacity: reveal > paybackYears / 25 ? 1 : 0, transition: 'opacity .4s' }">
                <line :x1="xAt(paybackYears)" :x2="xAt(paybackYears)" :y1="zeroY - 26" :y2="zeroY" stroke="rgba(255,255,255,0.4)" />
                <circle :cx="xAt(paybackYears)" :cy="zeroY" r="3.4" fill="#09090b" stroke="#fff" stroke-width="1.4" />
                <circle :cx="xAt(paybackYears)" :cy="zeroY" r="7" fill="none" stroke="rgba(255,255,255,0.35)" class="pb-pulse" />
                <text :x="xAt(paybackYears) + 5" :y="zeroY - 18" class="fill-white text-[9px] font-medium">
                    {{ isEn ? `Break-even · ${num(paybackYears, 1, 'en')} yrs` : `Návratnost · ${num(paybackYears, 1, 'cs')} let` }}
                </text>
            </g>

            <!-- end value -->
            <g :style="{ opacity: reveal > 0.98 ? 1 : 0, transition: 'opacity .5s' }">
                <circle :cx="xAt(25)" :cy="yAt(endValue)" r="3" fill="#34d399" />
                <text :x="xAt(25) - 6" :y="yAt(endValue) - 7" text-anchor="end" class="fill-emerald-300 text-[10px] font-medium">
                    +{{ millions(endValue, 2, locale) }}
                </text>
            </g>
            <text x="2" :y="yAt(-netCapex) + 12" class="fill-red-300/70 text-[8.5px]">−{{ czk(netCapex, locale) }}</text>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { CashflowYearPoint } from './cvutPhysics';
import { czk, millions, num } from './stationApp';

const props = defineProps<{
    cashflow: CashflowYearPoint[];
    paybackYears: number;
    netCapex: number;
}>();

const { locale } = useI18n();
const isEn = computed(() => locale.value === 'en');
const uid = Math.random().toString(36).slice(2, 8);

const W = 360;
const H = 110;

const minV = computed(() => Math.min(...props.cashflow.map((p) => p.cumulativeCashflowCzk)));
const maxV = computed(() => Math.max(...props.cashflow.map((p) => p.cumulativeCashflowCzk)));
const endValue = computed(() => props.cashflow[props.cashflow.length - 1]?.cumulativeCashflowCzk ?? 0);

function xAt(year: number) {
    return (year / 25) * W;
}

function yAt(v: number) {
    const lo = minV.value * 1.12;
    const hi = maxV.value * 1.12;

    return H - ((v - lo) / Math.max(1, hi - lo)) * H;
}

const zeroY = computed(() => yAt(0));
const line = computed(() => props.cashflow.map((p, i) => `${i ? 'L' : 'M'}${xAt(p.year).toFixed(1)},${yAt(p.cumulativeCashflowCzk).toFixed(1)}`).join(' '));
const area = computed(() => `${line.value} L${xAt(25)},${zeroY.value} L0,${zeroY.value} Z`);

/* draw-on animation, replayed whenever the configuration changes */
const reveal = ref(0);
let raf = 0;

function animate() {
    cancelAnimationFrame(raf);

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        reveal.value = 1;

        return;
    }

    const start = performance.now();
    const dur = 1500;
    const tick = (now: number) => {
        const t = Math.max(0, Math.min(1, (now - start) / dur));
        reveal.value = 1 - Math.pow(1 - t, 3);

        if (t < 1) {
            raf = requestAnimationFrame(tick);
        }
    };
    reveal.value = 0;
    raf = requestAnimationFrame(tick);
}

onMounted(animate);
watch(() => props.cashflow, animate);
onBeforeUnmount(() => cancelAnimationFrame(raf));
</script>

<style scoped>
.pb-pulse {
    transform-box: fill-box;
    transform-origin: center;
    animation: pb-pulse 2.2s ease-out infinite;
}

@keyframes pb-pulse {
    from {
        transform: scale(0.6);
        opacity: 0.9;
    }
    to {
        transform: scale(2.2);
        opacity: 0;
    }
}
</style>
