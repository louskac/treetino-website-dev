<template>
    <!-- Chapter 07 · Buyback model: data-room layout (headline left, numbered hairline rows right) + /pitch-fintech sliders -->
    <section data-chapter="07" class="relative overflow-hidden bg-zinc-950 pt-24 pb-28 text-white sm:pt-32 sm:pb-36">
        <div class="sim-glow pointer-events-none absolute inset-0"></div>
        <div class="sim-grid pointer-events-none absolute inset-0"></div>

        <div :class="CONTAINER" class="relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <!-- Left: mark, headline, presets, output -->
            <div class="flex flex-col justify-between lg:col-span-5">
                <div>
                    <InvestorChapterMark index="07" label="07 · BUYBACK MODEL" />
                    <h2 class="mt-6" :class="HEADLINE">
                        Move the sliders.<br />
                        <span class="text-[#8ec5ff] [text-shadow:0_0_40px_rgba(77,141,255,0.45)]">Watch the buy pressure.</span>
                    </h2>
                    <p class="mt-5 max-w-[34ch] text-sm leading-relaxed text-white/60 sm:text-lg">
                        Every number on the right is a real business line of Treetino. Each one routes a fixed share of revenue into $TREE.
                    </p>

                    <div class="mt-8 flex flex-wrap gap-2">
                        <button
                            v-for="p in presets"
                            :key="p.label"
                            type="button"
                            class="cursor-pointer rounded-full border px-3 py-1.5 text-xs font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm"
                            :class="
                                active === p.label
                                    ? 'border-[#8ec5ff]/60 bg-white/[0.06] text-white'
                                    : 'border-white/15 text-white/60 hover:border-white/35 hover:text-white'
                            "
                            @click="apply(p)"
                        >
                            {{ p.label }}
                        </button>
                    </div>
                </div>

                <div class="mt-12 lg:mt-16">
                    <p class="text-xs text-white/45 sm:text-sm">$TREE bought on the open market, per year</p>
                    <p class="mt-2 text-5xl leading-none font-medium tracking-[-0.045em] tabular-nums sm:text-6xl lg:text-[clamp(3.5rem,5vw,5rem)]">
                        {{ eur(total) }}
                    </p>

                    <div class="split mt-6 h-3">
                        <div
                            v-for="r in rows"
                            :key="r.key"
                            :style="{ width: `${total ? (r.buyback / total) * 100 : 0}%`, background: r.color }"
                        ></div>
                    </div>

                    <InvestorStats
                        class="mt-8"
                        :stats="[
                            { value: eur(total / 12), label: 'Per month' },
                            { value: `${((total / 2 / FDV) * 100).toFixed(1)}%`, label: 'Supply burned / yr' },
                            { value: eur(total / 2), label: 'To veTREE stakers' },
                        ]"
                    />
                </div>
            </div>

            <!-- Right: one numbered hairline row per revenue stream -->
            <ul class="calc border-t border-white/12 lg:col-span-7 lg:mt-1">
                <li v-for="(r, i) in rows" :key="r.key" class="flex gap-4 border-b border-white/12 py-6 sm:gap-6 sm:py-7">
                    <span class="w-6 shrink-0 pt-1 text-xs text-white/30 tabular-nums sm:text-sm">{{ String(i + 1).padStart(2, '0') }}</span>
                    <div class="min-w-0 flex-1">
                        <div class="flex items-baseline justify-between gap-4">
                            <p class="text-base font-medium tracking-[-0.01em] text-white sm:text-xl">
                                {{ r.title }}
                                <span class="ml-1 text-[#8ec5ff]">{{ r.rate }}</span>
                            </p>
                            <p class="shrink-0 text-base font-medium tabular-nums sm:text-xl">{{ eur(r.buyback) }}</p>
                        </div>
                        <div class="mt-1 flex items-baseline justify-between gap-4 text-xs text-white/40 sm:text-sm">
                            <span class="truncate">{{ r.meta }}</span>
                            <span class="shrink-0 text-white/70 tabular-nums">{{ r.display }}</span>
                        </div>
                        <input
                            v-model.number="state[r.key]"
                            type="range"
                            :min="r.min"
                            :max="r.max"
                            :step="r.step"
                            :aria-label="r.title"
                            :class="i === 0 && 'is-accent'"
                            :style="{ '--p': `${((state[r.key] - r.min) / (r.max - r.min)) * 100}%` }"
                        />
                    </div>
                </li>
                <li class="pt-5 text-xs leading-relaxed text-white/30 sm:text-sm">
                    Assumptions for discussion: €185k average tree, €18 average charging session at 2.4 sessions per charger per day,
                    1% annual protocol fee on tokenized assets. Supply burned is shown at a €{{ FDV / 1e6 }}M fully diluted valuation.
                </li>
            </ul>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import InvestorChapterMark from '@/custom/investors/InvestorChapterMark.vue';
import InvestorStats from '@/custom/investors/InvestorStats.vue';
import { CONTAINER, HEADLINE } from '@/custom/investors/tokens';

const FDV = 30_000_000;
const TREE_PRICE = 185_000;
const SESSIONS = 2.4;
const TICKET = 18;

type Key = 'trees' | 'chargers' | 'rwa' | 'arb';

const state = reactive<Record<Key, number>>({ trees: 25, chargers: 200, rwa: 6, arb: 1.2 });

const presets = [
    { label: 'First batch', v: { trees: 5, chargers: 20, rwa: 1, arb: 0.2 } },
    { label: 'Year one', v: { trees: 25, chargers: 200, rwa: 6, arb: 1.2 } },
    { label: 'Czechia', v: { trees: 100, chargers: 1000, rwa: 30, arb: 5 } },
    { label: 'Europe', v: { trees: 300, chargers: 5000, rwa: 100, arb: 15 } },
];
const active = ref('Year one');

function apply(p: (typeof presets)[number]) {
    active.value = p.label;
    Object.assign(state, p.v);
}

const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });
const plain = new Intl.NumberFormat('en');
const eur = (n: number) => `€${compact.format(n)}`;

const rows = computed(() => [
    {
        key: 'trees' as Key,
        title: 'Hardware sales',
        rate: '10%',
        meta: 'Treetino trees delivered per year',
        display: `${plain.format(state.trees)} trees`,
        min: 1,
        max: 300,
        step: 1,
        buyback: state.trees * TREE_PRICE * 0.1,
        color: '#4d8dff',
    },
    {
        key: 'chargers' as Key,
        title: 'EV charging',
        rate: '0.1%',
        meta: 'Chargers with Tapaya card payments',
        display: `${plain.format(state.chargers)} chargers`,
        min: 10,
        max: 5000,
        step: 10,
        buyback: state.chargers * SESSIONS * TICKET * 365 * 0.001,
        color: 'rgba(255,255,255,0.72)',
    },
    {
        key: 'rwa' as Key,
        title: 'RWA protocol',
        rate: '1%',
        meta: 'Energy assets tokenized on Solana',
        display: `€${state.rwa}M`,
        min: 1,
        max: 100,
        step: 1,
        buyback: state.rwa * 1e6 * 0.01,
        color: 'rgba(255,255,255,0.4)',
    },
    {
        key: 'arb' as Key,
        title: 'Grid arbitrage',
        rate: '20%',
        meta: 'WATTINO battery trading profit',
        display: `€${state.arb.toFixed(1)}M`,
        min: 0.1,
        max: 15,
        step: 0.1,
        buyback: state.arb * 1e6 * 0.2,
        color: 'rgba(255,255,255,0.18)',
    },
]);

const total = computed(() => rows.value.reduce((sum, r) => sum + r.buyback, 0));
</script>

<style scoped>
.sim-glow {
    background: radial-gradient(48% 58% at 22% 56%, rgba(47, 95, 208, 0.16) 0%, rgba(47, 95, 208, 0.04) 52%, transparent 100%);
}
.sim-grid {
    background-image:
        linear-gradient(to right, rgba(77, 141, 255, 0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(77, 141, 255, 0.08) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(50% 62% at 24% 62%, #000 0%, rgba(0, 0, 0, 0.45) 50%, transparent 100%);
}

.split {
    display: flex;
    gap: 3px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
}
.split > div {
    height: 100%;
    transition: width 0.25s ease;
}

/* Same slider as the /pitch-fintech revenue calculator */
.calc input[type='range'] {
    --fill: rgba(255, 255, 255, 0.85);
    -webkit-appearance: none;
    appearance: none;
    display: block;
    width: 100%;
    height: 28px;
    margin-top: 10px;
    background: transparent;
    cursor: pointer;
}
.calc input.is-accent {
    --fill: #4d8dff;
}
.calc input[type='range']::-webkit-slider-runnable-track {
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--fill) var(--p), rgba(255, 255, 255, 0.12) var(--p));
}
.calc input[type='range']::-moz-range-track {
    height: 2px;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--fill) var(--p), rgba(255, 255, 255, 0.12) var(--p));
}
.calc input[type='range']::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    margin-top: -8px;
    border-radius: 999px;
    background: #fff;
    box-shadow: 0 0 0 5px rgba(9, 9, 11, 0.9);
}
.calc input[type='range']::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border: 0;
    border-radius: 999px;
    background: #fff;
}
.calc input[type='range']:focus-visible {
    outline: none;
}
.calc input[type='range']:focus-visible::-webkit-slider-thumb {
    box-shadow:
        0 0 0 5px rgba(9, 9, 11, 0.9),
        0 0 0 7px #8ec5ff;
}
</style>
