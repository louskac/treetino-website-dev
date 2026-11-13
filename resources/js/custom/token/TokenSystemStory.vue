<template>
    <!-- Chapter 03 · 1% RWA Protocol Fee & 20% Spot Arbitrage: 3D Microgrid & Utility BESS -->
    <section ref="sectionRef" data-chapter="03" class="relative bg-zinc-950 text-white" style="height: 460vh">
        <div class="sticky top-0 h-screen h-dvh w-full overflow-hidden">
            <div class="pointer-events-none absolute inset-0">
                <div :class="CONTAINER" class="relative h-full">
                    <div :class="VISUAL_AREA">
                        <InvestorSystemScene
                            :sources="s.sources"
                            :loads="s.loads"
                            :brain="s.brain"
                            :orbit="s.orbit"
                            :active="active"
                        />
                    </div>
                </div>
            </div>

            <InvestorChapterText
                index="03"
                label="03 · 1% RWA PROTOCOL & 20% ARBITRAGE"
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
import InvestorSystemScene from '@/custom/investors/InvestorSystemScene.vue';
import { CONTAINER, VISUAL_AREA } from '@/custom/investors/tokens';

gsap.registerPlugin(ScrollTrigger);

const beats = computed<Beat[]>(() => [
    {
        segments: [
            { text: '1% of all revenue generated ', break: true },
            { text: 'by the RWA tokenization protocol.', tone: 'accent' },
        ],
        sub: 'Institutional funds and private investors tokenize utility-scale battery energy storage systems (BESS). 1% of all asset issuance and management volume is dedicated to open-market $TREE purchases.',
        stats: [
            { value: '1%', label: 'RWA Protocol Fee' },
            { value: '8.6 MW', label: 'Přeštice BESS Facility' },
            { value: '22 kV', label: 'ČEZ Grid Interconnect' },
        ],
    },
    {
        segments: [
            { text: '20% of algorithmic spot arbitrage ', break: true },
            { text: 'captured across 15-minute OTE cycles.', tone: 'accent' },
        ],
        sub: 'Our WATTINO AI brain charges batteries when wholesale electricity prices turn zero or negative, discharging at peak evening spreads. 20% of net arbitrage profit buys and locks $TREE.',
        stats: [
            { value: '20%', label: 'Arbitrage Profit Share' },
            { value: '15 min', label: 'OTE Spot Energy Bidding' },
            { value: '€180/MWh', label: 'Peak Spread Arbitrage' },
        ],
    },
    {
        segments: [
            { text: 'Institutional cashflow ', break: true },
            { text: 'ring-fenced from crypto market volatility.', tone: 'accent' },
        ],
        sub: 'Physical kilowatt-hours are settled in Euros with Czech national transmission and distribution operators (ČEZ, PRE, E.ON), creating non-cyclical, tangible real-world backing.',
        stats: [
            { value: 'AAA', label: 'Utility Off-Takers' },
            { value: 'Regulated', label: 'EU Energy Framework' },
            { value: 'MiCA', label: 'Compliant Structure' },
        ],
    },
]);

const sectionRef = ref<HTMLElement | null>(null);
const active = ref(false);

const s = reactive({
    mark: 0,
    sources: 0,
    loads: 0,
    brain: 0,
    orbit: 0,
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
        // beat 0 · solar & wind sources illuminate
        .to(s, { mark: 1, duration: 0.4 }, 0)
        .to(s, { b0: 1, duration: 1 }, 0.2)
        .to(s, { sources: 1, duration: 1.6, ease: 'power1.out' }, 0.4)
        .to(s, { b0out: 1, duration: 0.4, ease: 'power1.in' }, 3.2)
        // beat 1 · storage & arbitrage brain engage
        .to(s, { b1: 1, duration: 1 }, 3.6)
        .to(s, { brain: 1, duration: 1.8, ease: 'power1.out' }, 3.6)
        .to(s, { b1out: 1, duration: 0.4, ease: 'power1.in' }, 6.6)
        // beat 2 · full grid & consumer loads connected
        .to(s, { b2: 1, duration: 1 }, 7.0)
        .to(s, { loads: 1, duration: 1.8, ease: 'power1.out' }, 7.0)
        .to({}, { duration: 0.6 }, 9.4);

    requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
    visibility?.kill();
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
});
</script>
