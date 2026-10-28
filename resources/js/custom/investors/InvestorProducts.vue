<template>
    <!-- Chapter 03 · one stage, three products crossfading -->
    <section ref="sectionRef" data-chapter="03" class="relative bg-zinc-950 text-white" style="height: 400vh">
        <div class="sticky top-0 h-screen h-dvh w-full overflow-hidden">
            <div class="pointer-events-none absolute inset-0">
                <div :class="CONTAINER" class="relative h-full">
                    <div :class="VISUAL_AREA">
                        <img
                            v-for="(p, i) in products"
                            :key="p.name"
                            :src="p.image"
                            :alt="p.alt"
                            loading="lazy"
                            decoding="async"
                            class="product-img absolute inset-0 m-auto max-h-full max-w-full"
                            :class="p.imgClass"
                            :style="imageStyle(i)"
                        />
                        <!-- model index -->
                        <div class="absolute inset-x-0 -bottom-2 hidden justify-center gap-8 lg:flex">
                            <span
                                v-for="(p, i) in products"
                                :key="p.name"
                                class="relative pb-2 text-xs font-medium tracking-[0.16em] uppercase transition-colors duration-300"
                                :class="current === i ? 'text-white' : 'text-white/30'"
                            >
                                {{ p.name }}
                                <span
                                    class="absolute inset-x-0 bottom-0 h-px origin-left bg-[#8ec5ff] transition-transform duration-500"
                                    :class="current === i ? 'scale-x-100' : 'scale-x-0'"
                                ></span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <InvestorChapterText
                index="03"
                label="The products"
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
import type { Beat } from './InvestorChapterText.vue';
import InvestorChapterText from './InvestorChapterText.vue';
import { clamp01, CONTAINER, VISUAL_AREA } from './tokens';

gsap.registerPlugin(ScrollTrigger);

const products = [
    {
        name: 'V1',
        image: '/img/hero-images/poster-v1_1.1.1.webp',
        alt: 'Treetino V1 hybrid solar-wind tree render',
        imgClass: 'scale-[1.25] lg:scale-[1.35]',
    },
    {
        name: 'V2',
        image: '/img/hero-images/poster-v2_2.1.2.webp',
        alt: 'Treetino V2 compact solar tree render',
        imgClass: 'scale-[1.2] lg:scale-[1.3]',
    },
    {
        name: 'Aero',
        image: '/img/pitch/aero-updated-glass.jpg',
        alt: 'Treetino Aero vertical wind turbine render',
        imgClass: 'scale-[1.15] lg:scale-[1.25]',
    },
];

const beats: Beat[] = [
    {
        segments: [{ text: 'Treetino V1.', break: true }, { text: 'The flagship.', tone: 'accent' }],
        sub: 'An 11.5 m hybrid power plant for business parks, logistics hubs and squares.',
        stats: [
            { value: '49.8 kW', label: 'Peak output' },
            { value: '22 kW', label: 'EV hub' },
            { value: '3 months', label: 'Turnkey' },
        ],
    },
    {
        segments: [{ text: 'Treetino V2.', break: true }, { text: 'The compact one.', tone: 'accent' }],
        sub: '5 m tall, for villas, resorts and company HQs. Turbines optional.',
        stats: [
            { value: '6–12 kW', label: 'Output' },
            { value: '5.61 kWp', label: 'Solar' },
            { value: '0.5 m²', label: 'Footprint' },
        ],
    },
    {
        segments: [{ text: 'Treetino Aero.', break: true }, { text: 'Wind for any roof.', tone: 'accent' }],
        sub: 'A bird-safe vertical turbine for rooftops, parapets and halls.',
        stats: [
            { value: '1–3 kW', label: 'Three sizes' },
            { value: '1.8 m/s', label: 'Cut-in wind' },
            { value: '<35 dB', label: 'Noise' },
        ],
    },
];

const sectionRef = ref<HTMLElement | null>(null);

const s = reactive({
    mark: 0,
    p0: 0,
    p1: 0,
    p2: 0,
    b0: 0,
    b0out: 0,
    b1: 0,
    b1out: 0,
    b2: 0,
});

const current = computed(() => (s.p2 > 0.5 ? 2 : s.p1 > 0.5 ? 1 : 0));

function imageStyle(i: number) {
    const v = [s.p0 * (1 - s.p1), s.p1 * (1 - s.p2), s.p2][i];

    return {
        opacity: v,
        visibility: (v > 0.01 ? 'visible' : 'hidden') as 'visible' | 'hidden',
        translate: `0 ${(1 - clamp01(v)) * 3}%`,
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
        .to(s, { p0: 1, duration: 0.8 }, 0)
        .to(s, { b0: 1, duration: 1 }, 0.1)
        .to(s, { b0out: 1, duration: 0.4, ease: 'power1.in' }, 2)
        .to(s, { p1: 1, duration: 0.7 }, 2.1)
        .to(s, { b1: 1, duration: 1 }, 2.4)
        .to(s, { b1out: 1, duration: 0.4, ease: 'power1.in' }, 4.3)
        .to(s, { p2: 1, duration: 0.7 }, 4.4)
        .to(s, { b2: 1, duration: 1 }, 4.7)
        .to({}, { duration: 1 }, 5.9);

    requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
});
</script>

<style scoped>
/* dissolve the render edges into the page so no photo box is visible */
.product-img {
    mask-image: radial-gradient(closest-side, #000 62%, transparent 100%);
    mix-blend-mode: lighten;
}
</style>
