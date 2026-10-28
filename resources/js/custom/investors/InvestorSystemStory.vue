<template>
    <!-- Chapter 02 · how solar, wind, storage and EV work together -->
    <section ref="sectionRef" data-chapter="02" class="relative bg-zinc-950 text-white" style="height: 460vh">
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
                index="02"
                label="The system"
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
import type { Beat } from './InvestorChapterText.vue';
import InvestorChapterText from './InvestorChapterText.vue';
import InvestorSystemScene from './InvestorSystemScene.vue';
import { CONTAINER, VISUAL_AREA } from './tokens';

gsap.registerPlugin(ScrollTrigger);

const beats: Beat[] = [
    {
        segments: [{ text: 'Sun and wind.', break: true }, { text: 'One power core.', tone: 'accent' }],
        sub: 'Both sources feed a single DC bus with Victron electronics.',
        stats: [
            { value: '49.8 kW', label: 'Combined peak' },
            { value: '1', label: 'DC bus' },
            { value: 'Victron', label: 'Power electronics' },
        ],
    },
    {
        segments: [{ text: 'Stored, used', break: true }, { text: 'or sold.', tone: 'accent' }],
        sub: 'Charge the battery and EVs, power the site, sell the surplus.',
        stats: [
            { value: '100 kWh', label: 'Optional LiFePO4' },
            { value: '22 kW', label: 'EV hub' },
            { value: '15 min', label: 'Peak shaving' },
        ],
    },
    {
        segments: [{ text: 'One app', break: true }, { text: 'runs it all.', tone: 'accent' }],
        sub: 'TreeApp tracks the sun, stows for storms and balances EV load in real time.',
        stats: [
            { value: 'AI', label: 'Power optimisation' },
            { value: 'Live', label: 'Telemetry' },
            { value: 'Remote', label: 'Diagnostics' },
        ],
    },
];

const sectionRef = ref<HTMLElement | null>(null);
const active = ref(false);

const s = reactive({
    mark: 0,
    orbit: 0,
    sources: 0,
    loads: 0,
    brain: 0,
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
        .to(s, { orbit: 1, duration: 7.6, ease: 'sine.inOut' }, 0)
        .to(s, { mark: 1, duration: 0.4 }, 0)
        .to(s, { b0: 1, duration: 1 }, 0.1)
        .to(s, { sources: 1, duration: 1.5 }, 0.15)
        .to(s, { b0out: 1, duration: 0.4, ease: 'power1.in' }, 2.3)
        .to(s, { b1: 1, duration: 1 }, 2.8)
        .to(s, { loads: 1, duration: 1.5 }, 2.75)
        .to(s, { b1out: 1, duration: 0.4, ease: 'power1.in' }, 5.0)
        .to(s, { b2: 1, duration: 1 }, 5.5)
        .to(s, { brain: 1, duration: 1.3 }, 5.45)
        .to({}, { duration: 1 }, 6.8);

    requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
    visibility?.kill();
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
});
</script>
