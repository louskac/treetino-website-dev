<template>
    <!-- Chapter 05 · established hardware & R&D, commercial B2B pipeline, and government/international backing -->
    <section ref="sectionRef" data-chapter="05" class="relative bg-zinc-950 text-white" style="height: 440vh">
        <div class="sticky top-0 h-screen h-dvh w-full overflow-hidden">
            <div class="pointer-events-none absolute inset-0">
                <div :class="CONTAINER" class="relative h-full">
                    <div :class="VISUAL_AREA" class="lg:top-[14vh]! lg:bottom-[10vh]!">
                        <div
                            v-for="(group, i) in photoBeats"
                            :key="i"
                            class="absolute inset-0 flex items-center justify-end"
                            :style="groupStyle(i)"
                        >
                            <div class="relative h-full max-h-[520px] w-full max-w-[560px]">
                                <!-- Primary frame -->
                                <figure
                                    class="photo-frame absolute top-0 left-0 w-[80%] overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.85)] sm:w-[78%]"
                                    :style="{ transform: `translate3d(0, ${(0.5 - s.drift) * 18}px, 0)` }"
                                >
                                    <div class="relative aspect-[16/10] w-full overflow-hidden">
                                        <img
                                            :src="group.primary.src"
                                            :alt="group.primary.alt"
                                            :width="group.primary.w"
                                            :height="group.primary.h"
                                            loading="lazy"
                                            decoding="async"
                                            class="h-full w-full object-cover"
                                            :class="group.primary.imgClass"
                                        />
                                        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
                                    </div>
                                    <figcaption class="relative flex items-center justify-between gap-3 px-4 py-2.5 pr-[46%] text-[11px] text-white/70 sm:text-xs">
                                        <span class="truncate font-medium text-white/90">{{ group.primary.caption }}</span>
                                    </figcaption>
                                </figure>

                                <!-- Secondary offset frame -->
                                <figure
                                    class="photo-frame absolute right-0 bottom-0 z-10 w-[54%] overflow-hidden rounded-2xl border border-white/18 bg-zinc-900 shadow-[0_28px_70px_rgba(0,0,0,0.92)] sm:w-[52%]"
                                    :style="{ transform: `translate3d(0, ${(s.drift - 0.5) * 24}px, 0)` }"
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
                                            :class="group.secondary.imgClass"
                                        />
                                        <div class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
                                    </div>
                                    <figcaption class="relative flex items-center justify-between gap-2 px-3.5 py-2 text-[11px] text-white/70 sm:text-xs">
                                        <span class="truncate font-medium text-white/90">{{ group.secondary.caption }}</span>
                                        <span class="hidden shrink-0 text-white/40 tabular-nums sm:inline">{{ group.secondary.place }}</span>
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

interface PhotoFrame {
    src: string;
    alt: string;
    caption: string;
    place?: string;
    w: number;
    h: number;
    imgClass?: string;
}

const photoBeats: {
    primary: PhotoFrame;
    secondary: PhotoFrame;
}[] = [
    {
        primary: {
            src: '/img/team/founders-leaf.jpg',
            alt: 'Founders Dominik Mašek and Jakub Lustyk with a full-scale Treetino TopCon solar leaf',
            caption: 'Mašek & Lustyk',
            w: 1280,
            h: 853,
        },
        secondary: {
            src: '/img/info/night-detail-w.jpg',
            alt: 'Bionic TopCon solar leaves and vertical Treetino Aero turbine rotor detail',
            caption: 'Leaf & Aero rotor',
            place: 'EP 4 664 750',
            w: 1920,
            h: 820,
        },
    },
    {
        primary: {
            src: '/img/media/smart-energy-forum-2026-2.jpg',
            alt: 'Treetino commercial exhibition booth and physical prototype at Smart Energy Forum',
            caption: 'Smart Energy Forum',
            w: 1600,
            h: 1066,
        },
        secondary: {
            src: '/img/im/mkovo-site-measurement.jpg',
            alt: 'Wind mast measurement at the MKovo site for the first three V1 trees',
            caption: 'MKovo site',
            place: 'Q1 delivery',
            w: 768,
            h: 1024,
            imgClass: 'object-[center_65%]',
        },
    },
    {
        primary: {
            src: '/img/media/innovations-united-prague-castle-2026.jpg',
            alt: 'Treetino keynote on stage at Prague Castle Innovations United',
            caption: 'Prague Castle · Top 5',
            w: 1024,
            h: 768,
            imgClass: 'scale-[1.16] origin-top-right',
        },
        secondary: {
            src: '/img/media/strakova-akademie-vlada-premier-2.jpg',
            alt: 'Presenting the Treetino prototype to the Czech Prime Minister at Straka Academy',
            caption: 'Straka Academy',
            place: 'Prime Minister',
            w: 1024,
            h: 768,
        },
    },
];

const beats: Beat[] = [
    {
        segments: [{ text: 'Patented hardware.', break: true }, { text: 'Proven builders.', tone: 'accent' }],
        sub: 'Developed with FZU and CTU Prague by founders who already delivered 8.6 MW of grid storage.',
        stats: [
            { value: '2 Patents', label: 'EP & PCT protection' },
            { value: '8.6 MW', label: 'Founder BESS track record' },
            { value: '€200k', label: 'EU CzechInvest grant' },
        ],
    },
    {
        segments: [{ text: '€705k signed.', break: true }, { text: '€3.4M in LOIs.', tone: 'accent' }],
        sub: 'Three flagship V1 trees contracted for MKovo (Q1 delivery) and two V2 trees building in Prague.',
        stats: [
            { value: '3 × V1', label: 'Signed MKovo contract' },
            { value: '2 × V2', label: 'Prague site in build' },
            { value: '€10M', label: 'Bond underwriting' },
        ],
    },
    {
        segments: [{ text: 'Backed at home.', break: true }, { text: 'Shown abroad.', tone: 'accent' }],
        sub: 'Presented at the Office of the Czech Government, on the U.S. mission at SXSW, and at Prague Castle.',
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
