<template>
    <!-- Chapter 01 · the tree explains itself: layout, sun tracking, storm stow -->
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
                label="The tree"
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
import InvestorTreeScene from './InvestorTreeScene.vue';
import { CONTAINER, VISUAL_AREA } from './tokens';

gsap.registerPlugin(ScrollTrigger);

const beats: Beat[] = [
    {
        segments: [{ text: 'Wind above.', break: true }, { text: 'Sun below.', tone: 'accent' }],
        sub: 'Turbines catch the stronger wind up high. Solar leaves fan out underneath.',
        stats: [
            { value: '36 kW', label: 'Wind' },
            { value: '13.8 kWp', label: 'Solar' },
            { value: '1 m²', label: 'Footprint' },
        ],
    },
    {
        segments: [{ text: 'Every branch', break: true }, { text: 'follows the sun.', tone: 'accent' }],
        sub: 'AI steers each branch on two axes, all day long.',
        stats: [
            { value: '+29%', label: 'Yield from tracking' },
            { value: '2-axis', label: 'Servo control' },
            { value: 'Patented', label: 'EP 4 664 750' },
        ],
    },
    {
        segments: [{ text: 'Hail or storm?', break: true }, { text: 'Leaves flip 180°.', tone: 'accent' }],
        sub: 'Every branch rotates upside-down so the armored leaf backs shield the solar panels.',
        stats: [
            { value: '180°', label: 'Dorsal hail shield' },
            { value: '144 km/h', label: 'Gale resistance' },
            { value: '<35 dB', label: 'Turbine noise' },
        ],
    },
];

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
        // beat 0 · build the tree, then point at the turbines and the leaves
        .to(s, { mark: 1, duration: 0.4 }, 0)
        .to(s, { draw: 1, duration: 1.6 }, 0)
        .to(s, { b0: 1, duration: 1 }, 0.2)
        .to(s, { hlPods: 1, cPods: 1, duration: 0.4 }, 1.5)
        .to(s, { hlPods: 0, cPods: 0, duration: 0.4 }, 2.5)
        .to(s, { hlLeaves: 1, cLeaves: 1, duration: 0.4 }, 2.6)
        .to(s, { hlLeaves: 0, cLeaves: 0, duration: 0.4 }, 3.7)
        .to(s, { b0out: 1, duration: 0.4, ease: 'power1.in' }, 3.8)
        // beat 1 · a sun crosses the sky and every branch rolls with it
        .to(s, { b1: 1, duration: 1 }, 4.3)
        .to(s, { sun: 1, duration: 0.4 }, 4.2)
        .to(s, { track: 1, duration: 2.8, ease: 'sine.inOut' }, 4.4)
        .to(s, { b1out: 1, duration: 0.4, ease: 'power1.in' }, 7.2)
        // beat 2 · wind picks up, branches stow
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
