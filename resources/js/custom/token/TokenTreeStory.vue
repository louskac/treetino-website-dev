<template>
    <!-- Chapter 01 · 10% Hardware Sales Buyback: Tree hardware generates cashflow, 10% routed to $TREE buybacks -->
    <section ref="sectionRef" data-chapter="01" class="relative bg-zinc-950 text-white" style="height: 560vh">
        <div class="sticky top-0 h-screen h-dvh w-full overflow-hidden">
            <div class="pointer-events-none absolute inset-0">
                <div :class="CONTAINER" class="relative h-full">
                    <div :class="VISUAL_AREA">
                        <InvestorTreeScene
                            :draw="s.draw"
                            :hl-pods="s.hlPods"
                            :hl-leaves="s.hlLeaves"
                            :callout-pods="s.cPods"
                            :callout-leaves="s.cLeaves"
                            :sun="s.sun"
                            :track="s.track"
                            :storm="s.storm"
                            :orbit="s.orbit"
                            :active="active"
                        />
                    </div>
                </div>
            </div>

            <InvestorChapterText
                index="01"
                label="01 · 10% HARDWARE SALES BUYBACK"
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
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue';
import type { Beat } from '@/custom/investors/InvestorChapterText.vue';
import InvestorChapterText from '@/custom/investors/InvestorChapterText.vue';
import InvestorTreeScene from '@/custom/investors/InvestorTreeScene.vue';
import { CONTAINER, VISUAL_AREA } from '@/custom/investors/tokens';

gsap.registerPlugin(ScrollTrigger);

const beats = computed<Beat[]>(() => [
    {
        segments: [
            { text: '10% of every hardware sale ', break: true },
            { text: 'routed into open-market $TREE buybacks.', tone: 'accent' },
        ],
        sub: 'Every Treetino unit sells between €120,000 and €250,000. 10% of gross invoice value is systematically escrowed and executed via decentralized liquidity pools upon factory dispatch.',
        stats: [
            { value: '€120k–250k', label: 'Unit Sales Price' },
            { value: '10%', label: 'Gross Sale Buyback' },
            { value: '€70,500', label: 'M-Kovo Initial Batch' },
        ],
    },
    {
        segments: [
            { text: '300 dual-axis solar leaves ', break: true },
            { text: 'track the sun for +40% real energy yield.', tone: 'accent' },
        ],
        sub: 'Patented kinematic actuation (EP 4664750 A1) keeps solar leaves perpendicular to incident light throughout the day, generating outsized energy revenues and higher buyback power.',
        stats: [
            { value: '+40%', label: 'Active Solar Yield' },
            { value: '12 kWp', label: 'Leaf Array Capacity' },
            { value: '15 min', label: 'Grid Settlement Cycle' },
        ],
    },
    {
        segments: [
            { text: '12 vertical wind turbines ', break: true },
            { text: 'generate 24/7 baseline cashflow.', tone: 'accent' },
        ],
        sub: 'Omnidirectional helical turbines capture low-altitude turbulent gusts day and night. Hardware telemetry signs generation proofs directly to Solana via Certino DePIN oracles.',
        stats: [
            { value: '12', label: 'Helical Turbines' },
            { value: '24/7', label: 'Continuous Generation' },
            { value: '100%', label: 'Hardware-Verifiable' },
        ],
    },
]);

const sectionRef = ref<HTMLElement | null>(null);
const active = ref(false);

const s = reactive({
    mark: 0,
    draw: 0,
    orbit: 0,
    hlPods: 0,
    hlLeaves: 0,
    cPods: 0,
    cLeaves: 0,
    sun: 0,
    track: 0,
    storm: 0,
    b0: 0,
    b0out: 0,
    b1: 0,
    b1out: 0,
    b2: 0,
});

let timeline: gsap.core.Timeline | null = null;
let visibility: ScrollTrigger | null = null;

onMounted(() => {
    visibility = ScrollTrigger.create({
        trigger: sectionRef.value,
        start: 'top bottom',
        end: 'bottom top',
        onToggle: (self) => (active.value = self.isActive),
    });

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
        .to(s, { orbit: 1, duration: 10, ease: 'sine.inOut' }, 0)
        // beat 0 · build the tree, highlight turbines & leaves
        .to(s, { mark: 1, duration: 0.4 }, 0)
        .to(s, { draw: 1, duration: 1.6 }, 0)
        .to(s, { b0: 1, duration: 1 }, 0.2)
        .to(s, { hlPods: 1, cPods: 1, duration: 0.4 }, 1.5)
        .to(s, { hlPods: 0, cPods: 0, duration: 0.4 }, 2.5)
        .to(s, { hlLeaves: 1, cLeaves: 1, duration: 0.4 }, 2.6)
        .to(s, { hlLeaves: 0, cLeaves: 0, duration: 0.4 }, 3.7)
        .to(s, { b0out: 1, duration: 0.4, ease: 'power1.in' }, 3.8)
        // beat 1 · sun crosses sky, branches follow
        .to(s, { b1: 1, duration: 1 }, 4.3)
        .to(s, { sun: 1, duration: 0.4 }, 4.2)
        .to(s, { track: 1, duration: 2.8, ease: 'sine.inOut' }, 4.4)
        .to(s, { b1out: 1, duration: 0.4, ease: 'power1.in' }, 7.2)
        // beat 2 · storm stow, 24/7 wind generation
        .to(s, { sun: 0, duration: 0.4 }, 7.4)
        .to(s, { b2: 1, duration: 1 }, 7.7)
        .to(s, { storm: 1, duration: 0.9, ease: 'power2.inOut' }, 7.7)
        .to({}, { duration: 1 }, 9);

    requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
    visibility?.kill();
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
});
</script>
