<template>
    <!-- Chapter 06 · Tokenomics: same pinned stage as every other chapter (text left, visual right, 3 stats) -->
    <section ref="sectionRef" data-chapter="06" class="relative bg-zinc-950 text-white" style="height: 440vh">
        <div class="sticky top-0 h-screen h-dvh w-full overflow-hidden">
            <div class="pointer-events-none absolute inset-0">
                <div :class="CONTAINER" class="relative h-full">
                    <div :class="VISUAL_AREA" class="lg:top-[16vh]! lg:bottom-[12vh]!">
                        <!-- Panel 0 · Distribution: hairline ledger, bars draw in -->
                        <div class="absolute inset-0 flex items-center lg:justify-end" :style="panelStyle(0)">
                            <ul class="w-full max-w-[560px] border-t border-white/12">
                                <li v-for="(a, i) in allocations" :key="a.name" class="border-b border-white/12 py-3.5 sm:py-4">
                                    <div class="flex items-baseline gap-4">
                                        <span class="w-6 shrink-0 text-xs text-white/30 tabular-nums">{{ pad(i + 1) }}</span>
                                        <span class="min-w-0 flex-1 truncate text-sm sm:text-base" :class="a.accent ? 'text-white' : 'text-white/70'">
                                            {{ a.name }}
                                        </span>
                                        <span class="text-xl font-medium tracking-[-0.03em] tabular-nums sm:text-2xl" :class="a.accent && 'text-[#8ec5ff]'">
                                            {{ a.pct }}%
                                        </span>
                                    </div>
                                    <div class="mt-2.5 ml-10 h-[2px] rounded-full bg-white/10">
                                        <div
                                            class="h-full rounded-full"
                                            :class="a.accent ? 'bg-[#4d8dff] shadow-[0_0_12px_rgba(77,141,255,0.8)]' : 'bg-white/60'"
                                            :style="{ width: `${(a.pct / 35) * 100 * rowDraw(i)}%` }"
                                        ></div>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        <!-- Panel 1 · Vesting: same rows become a 48-month timeline -->
                        <div class="absolute inset-0 flex items-center lg:justify-end" :style="panelStyle(1)">
                            <div class="w-full max-w-[560px]">
                                <ul class="border-t border-white/12">
                                    <li v-for="(a, i) in allocations" :key="a.name" class="border-b border-white/12 py-3.5 sm:py-4">
                                        <div class="flex items-baseline justify-between gap-4">
                                            <span class="truncate text-sm sm:text-base" :class="a.accent ? 'text-white' : 'text-white/70'">{{ a.name }}</span>
                                            <span class="shrink-0 text-xs text-white/40 tabular-nums">{{ a.terms }}</span>
                                        </div>
                                        <div class="relative mt-2.5 h-[2px] bg-white/[0.06]">
                                            <!-- cliff (dashed) -->
                                            <div
                                                class="absolute inset-y-0 left-0 border-t border-dashed border-white/25"
                                                :style="{ width: `${(a.cliff / 48) * 100 * s.v}%` }"
                                            ></div>
                                            <!-- linear vesting -->
                                            <div
                                                class="absolute inset-y-0 rounded-full"
                                                :class="a.accent ? 'bg-[#4d8dff] shadow-[0_0_12px_rgba(77,141,255,0.8)]' : 'bg-white/60'"
                                                :style="{
                                                    left: `${(a.cliff / 48) * 100}%`,
                                                    width: `${(Math.min(48 - a.cliff, a.vest) / 48) * 100 * clamp01((s.v - 0.15) / 0.85)}%`,
                                                }"
                                            ></div>
                                            <!-- TGE unlock tick -->
                                            <span
                                                v-if="a.tge"
                                                class="absolute -top-[3px] left-0 h-2 w-2 rounded-full bg-white"
                                                :style="{ opacity: s.v }"
                                            ></span>
                                        </div>
                                    </li>
                                </ul>
                                <div class="mt-3 flex justify-between text-[11px] text-white/35 tabular-nums">
                                    <span>TGE</span>
                                    <span>12 mo</span>
                                    <span>24 mo</span>
                                    <span>36 mo</span>
                                    <span>48 mo</span>
                                </div>
                            </div>
                        </div>

                        <!-- Panel 2 · Where buybacks go: four sources into one 50 / 50 split -->
                        <div class="absolute inset-0 flex items-center lg:justify-end" :style="panelStyle(2)">
                            <div class="w-full max-w-[560px]">
                                <ul class="border-t border-white/12">
                                    <li
                                        v-for="(src, i) in sources"
                                        :key="src.name"
                                        class="flex items-baseline gap-4 border-b border-white/12 py-3.5 sm:py-4"
                                        :style="{ opacity: 0.25 + 0.75 * clamp01(s.r * 4 - i) }"
                                    >
                                        <span class="w-6 shrink-0 text-xs text-white/30 tabular-nums">{{ pad(i + 1) }}</span>
                                        <span class="min-w-0 flex-1 truncate text-sm text-white/70 sm:text-base">{{ src.name }}</span>
                                        <span class="text-xl font-medium tracking-[-0.03em] tabular-nums sm:text-2xl">{{ src.rate }}</span>
                                    </li>
                                </ul>

                                <p class="mt-8 text-xs text-white/45 sm:text-sm">Every repurchased $TREE</p>
                                <div class="split mt-3 h-3">
                                    <div class="bg-[#4d8dff]" :style="{ width: `${50 * s.split}%` }"></div>
                                    <div class="bg-white/70" :style="{ width: `${50 * s.split}%` }"></div>
                                </div>
                                <div class="mt-3 flex justify-between text-sm">
                                    <span><span class="text-[#8ec5ff]">50%</span> <span class="text-white/50">burned forever</span></span>
                                    <span><span class="text-white">50%</span> <span class="text-white/50">to veTREE stakers</span></span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <InvestorChapterText
                index="06"
                label="06 · TOKENOMICS"
                :beats="beats"
                :state="[
                    { in: s.b0, out: s.b0out },
                    { in: s.b1, out: s.b1out },
                    { in: s.b2, out: 0 },
                ]"
                :mark="s.mark"
            />
        </div>
    </section>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import type { Beat } from '@/custom/investors/InvestorChapterText.vue';
import InvestorChapterText from '@/custom/investors/InvestorChapterText.vue';
import { clamp01, CONTAINER, VISUAL_AREA } from '@/custom/investors/tokens';

gsap.registerPlugin(ScrollTrigger);

const pad = (n: number) => String(n).padStart(2, '0');

const allocations = [
    { name: 'Community & DePIN rewards', pct: 35, cliff: 0, vest: 96, tge: false, terms: 'Emitted over 8 yrs on kWh proofs' },
    { name: 'Liquidity & market making', pct: 25, cliff: 0, vest: 12, tge: true, terms: '40% at TGE · rest protocol-owned' },
    { name: 'Strategic & accelerator round', pct: 15, cliff: 6, vest: 18, tge: true, terms: '10% TGE · 6 mo cliff · 18 mo', accent: true },
    { name: 'Core team & founders', pct: 15, cliff: 12, vest: 36, tge: false, terms: '12 mo cliff · 36 mo linear' },
    { name: 'Ecosystem treasury', pct: 10, cliff: 3, vest: 24, tge: true, terms: '5% TGE · 3 mo cliff · 24 mo' },
];

const sources = [
    { name: 'Every Treetino hardware sale', rate: '10%' },
    { name: 'Every EV charging transaction', rate: '0.1%' },
    { name: 'RWA tokenization protocol revenue', rate: '1%' },
    { name: 'WATTINO grid arbitrage profit', rate: '20%' },
];

const beats: Beat[] = [
    {
        segments: [
            { text: 'One billion $TREE. ', break: true },
            { text: 'Not one more, ever.', tone: 'accent' },
        ],
        sub: 'Fixed supply minted once at TGE. The largest share is earned only by hardware that proves real kilowatt-hours on-chain.',
        stats: [
            { value: '1B', label: 'Fixed hard cap' },
            { value: '0%', label: 'Inflation after TGE' },
            { value: '11.85%', label: 'Circulating at TGE' },
        ],
    },
    {
        segments: [
            { text: 'Long cliffs, linear unlocks. ', break: true },
            { text: 'Team unlocks last.', tone: 'accent' },
        ],
        sub: 'Founders wait 12 months before a single token unlocks. Every schedule is enforced by Solana vesting contracts, not by promises.',
        stats: [
            { value: '12 mo', label: 'Team cliff' },
            { value: '6 mo', label: 'Strategic cliff' },
            { value: '8 yrs', label: 'DePIN emission' },
        ],
    },
    {
        segments: [
            { text: 'Real revenue buys $TREE. ', break: true },
            { text: 'Half of it is burned.', tone: 'accent' },
        ],
        sub: 'Four cash-flow streams from physical infrastructure buy $TREE on the open market. 50% is burned, 50% rewards veTREE stakers.',
        stats: [
            { value: '4', label: 'Revenue streams' },
            { value: '50%', label: 'Permanent burn' },
            { value: '50%', label: 'veTREE yield' },
        ],
    },
];

const sectionRef = ref<HTMLElement | null>(null);

const s = reactive({
    mark: 0,
    p0: 0,
    p1: 0,
    p2: 0,
    d: 0,
    v: 0,
    r: 0,
    split: 0,
    b0: 0,
    b0out: 0,
    b1: 0,
    b1out: 0,
    b2: 0,
});

function rowDraw(i: number) {
    return clamp01(s.d * allocations.length - i * 0.6);
}

function panelStyle(i: number) {
    const v = [s.p0 * (1 - s.p1), s.p1 * (1 - s.p2), s.p2][i];

    return {
        opacity: v,
        visibility: (v > 0.01 ? 'visible' : 'hidden') as 'visible' | 'hidden',
        transform: `translateY(${(1 - clamp01(v)) * 18}px)`,
    };
}

let timeline: gsap.core.Timeline | null = null;

onMounted(() => {
    timeline = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.6,
            invalidateOnRefresh: true,
        },
    });

    timeline
        .to(s, { mark: 1, duration: 0.4 }, 0)
        .to(s, { p0: 1, duration: 0.6 }, 0)
        .to(s, { b0: 1, duration: 1 }, 0.1)
        .to(s, { d: 1, duration: 1.4, ease: 'power1.out' }, 0.3)
        .to(s, { b0out: 1, duration: 0.4, ease: 'power1.in' }, 2.0)
        .to(s, { p1: 1, duration: 0.6 }, 2.1)
        .to(s, { b1: 1, duration: 1 }, 2.4)
        .to(s, { v: 1, duration: 1.4, ease: 'power1.out' }, 2.5)
        .to(s, { b1out: 1, duration: 0.4, ease: 'power1.in' }, 4.3)
        .to(s, { p2: 1, duration: 0.6 }, 4.4)
        .to(s, { b2: 1, duration: 1 }, 4.7)
        .to(s, { r: 1, duration: 1 }, 4.7)
        .to(s, { split: 1, duration: 0.8, ease: 'power1.out' }, 5.4)
        .to({}, { duration: 1 }, 6.2);

    requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
});
</script>

<style scoped>
/* Same split bar as the /pitch-fintech revenue calculator */
.split {
    display: flex;
    gap: 3px;
    overflow: hidden;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.06);
}
.split > div {
    height: 100%;
}
</style>
