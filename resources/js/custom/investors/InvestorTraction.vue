<template>
    <!-- Chapter 05 · real hardware, signed contracts and institutional backing (replaces the wind-turbine drone flight) -->
    <section ref="sectionRef" data-chapter="05" class="relative bg-zinc-950 text-white" style="height: 420vh">
        <div class="sticky top-0 h-screen h-dvh w-full overflow-hidden">
            <div class="pointer-events-none absolute inset-0">
                <div :class="CONTAINER" class="relative h-full">
                    <div :class="VISUAL_AREA" class="lg:top-[14vh]! lg:bottom-[10vh]!">
                        <div
                            v-for="(group, i) in photoBeats"
                            :key="i"
                            class="absolute inset-0 flex items-center justify-center"
                            :style="groupStyle(i)"
                        >
                            <div class="relative h-full max-h-[540px] w-full max-w-[680px]">
                                <!-- Primary frame -->
                                <figure
                                    class="photo-frame absolute top-0 left-0 w-[74%] overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.85)] sm:w-[70%]"
                                    :style="{ transform: `translate3d(0, ${(0.5 - s.drift) * 18}px, 0)` }"
                                >
                                    <div class="relative aspect-[4/3] w-full overflow-hidden">
                                        <img
                                            :src="group.primary.src"
                                            :alt="group.primary.alt"
                                            :width="group.primary.w"
                                            :height="group.primary.h"
                                            loading="lazy"
                                            decoding="async"
                                            class="h-full w-full object-cover"
                                        />
                                        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
                                    </div>
                                    <figcaption class="relative flex items-center justify-between gap-3 px-4 py-2.5 text-[11px] text-white/70 sm:text-xs">
                                        <span class="truncate font-medium text-white/90">{{ group.primary.caption }}</span>
                                        <span class="shrink-0 text-white/40 tabular-nums">{{ group.primary.place }}</span>
                                    </figcaption>
                                </figure>

                                <!-- Secondary offset frame -->
                                <figure
                                    class="photo-frame absolute right-0 bottom-0 w-[56%] overflow-hidden rounded-2xl border border-white/18 bg-zinc-900 shadow-[0_28px_70px_rgba(0,0,0,0.9)] sm:w-[52%]"
                                    :style="{ transform: `translate3d(0, ${(s.drift - 0.5) * 26}px, 0)` }"
                                >
                                    <div class="relative aspect-[4/3] w-full overflow-hidden">
                                        <img
                                            :src="group.secondary.src"
                                            :alt="group.secondary.alt"
                                            :width="group.secondary.w"
                                            :height="group.secondary.h"
                                            loading="lazy"
                                            decoding="async"
                                            class="h-full w-full object-cover"
                                        />
                                        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
                                    </div>
                                    <figcaption class="relative flex items-center justify-between gap-3 px-3.5 py-2 text-[11px] text-white/70 sm:text-xs">
                                        <span class="truncate font-medium text-white/90">{{ group.secondary.caption }}</span>
                                        <span class="shrink-0 text-white/40 tabular-nums">{{ group.secondary.place }}</span>
                                    </figcaption>
                                </figure>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <InvestorChapterText
                index="05"
                label="Traction"
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
import { clamp01, CONTAINER, VISUAL_AREA } from './tokens';

gsap.registerPlugin(ScrollTrigger);

const photoBeats = [
    {
        primary: {
            src: '/img/im/industrial-3d-printer-production.jpg',
            alt: 'In-house industrial production of Treetino turbine and leaf parts',
            caption: 'In-house turbine & leaf production',
            place: 'CZ · 2026',
            w: 768,
            h: 1024,
        },
        secondary: {
            src: '/img/im/prague-high-school-v2-site.jpg',
            alt: 'Construction site for two Treetino V2 trees at a Prague high school',
            caption: '2 × V2 site groundworks',
            place: 'Prague',
            w: 768,
            h: 1024,
        },
    },
    {
        primary: {
            src: '/img/pitch/sic-tier1-render.jpg',
            alt: 'Commercial deployment visualization at SIC Smíchov in Prague',
            caption: 'Commercial site visualization',
            place: 'Prague',
            w: 1600,
            h: 893,
        },
        secondary: {
            src: '/img/im/mkovo-site-measurement.jpg',
            alt: 'Wind mast measurement at the MKovo site for the first three V1 trees',
            caption: 'MKovo site wind campaign · 3 × V1',
            place: 'CZ · Q1',
            w: 768,
            h: 1024,
        },
    },
    {
        primary: {
            src: '/img/media/innovations-united-prague-castle-2026.jpg',
            alt: 'Treetino keynote on stage at Prague Castle Innovations United',
            caption: 'Prague Castle · Top 5 finalist',
            place: 'Prague',
            w: 1024,
            h: 768,
        },
        secondary: {
            src: '/img/media/strakova-akademie-vlada-premier-2.jpg',
            alt: 'Presenting the Treetino prototype to the Czech Prime Minister at Straka Academy',
            caption: 'Straka Academy · Czech Prime Minister',
            place: 'MPO Days',
            w: 1024,
            h: 768,
        },
    },
];

const beats: Beat[] = [
    {
        segments: [{ text: 'R&D is done.', break: true }, { text: 'Now we build.', tone: 'accent' }],
        sub: 'Developed with FZU and CTU Prague. Manufactured in the Czech Republic.',
        stats: [
            { value: '2', label: 'Patents' },
            { value: '2 × V2', label: 'In construction' },
            { value: '€200k', label: 'EU grant' },
        ],
    },
    {
        segments: [{ text: '€705k signed.', break: true }, { text: '€3.4M in LOIs.', tone: 'accent' }],
        sub: 'The first three V1 trees for MKovo deliver in Q1.',
        stats: [
            { value: '3 × V1', label: 'In delivery' },
            { value: '€10M', label: 'Bond underwriting' },
            { value: '2.5–4.5', label: 'Years customer payback' },
        ],
    },
    {
        segments: [{ text: 'Backed at home.', break: true }, { text: 'Shown abroad.', tone: 'accent' }],
        sub: 'Presented at the Office of the Czech Government, on the US trade mission at SXSW, and at Prague Castle.',
        stats: [
            { value: 'Top 5', label: 'Prague Castle pitch' },
            { value: 'SXSW', label: 'Czech House Austin' },
            { value: 'ČSOB', label: 'Start it accelerator' },
        ],
    },
];

const sectionRef = ref<HTMLElement | null>(null);

const s = reactive({
    mark: 0,
    drift: 0,
    p0: 0,
    p1: 0,
    p2: 0,
    b0: 0,
    b0out: 0,
    b1: 0,
    b1out: 0,
    b2: 0,
});

function groupStyle(i: number) {
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
        .to(s, { drift: 1, duration: 6.9 }, 0)
        .to(s, { mark: 1, duration: 0.4 }, 0)
        .to(s, { p0: 1, duration: 0.8 }, 0)
        .to(s, { b0: 1, duration: 1 }, 0.1)
        .to(s, { b0out: 1, duration: 0.4, ease: 'power1.in' }, 2.0)
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
