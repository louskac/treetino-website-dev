<template>
    <!-- Map of Europe dives into the Czech Republic while two short lines introduce the company -->
    <section ref="sectionRef" class="relative bg-zinc-950 text-white" style="height: 230vh">
        <div class="sticky top-0 h-screen h-dvh w-full overflow-hidden">
            <Web3EuropeMap :zoom="s.zoom" :dim="s.dim" />
            <Web3MapAssets :zoom="s.zoom" :fade="s.assets" />
            <div class="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-b from-transparent to-zinc-950"></div>
            <div
                class="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(9,9,11,0.85)_0%,rgba(9,9,11,0.78)_46%,transparent_85%)] max-sm:bg-[linear-gradient(to_bottom,rgba(9,9,11,0.7)_0%,rgba(9,9,11,0.35)_45%,transparent_70%)]"
            ></div>

            <div class="pointer-events-none absolute inset-0 z-10">
                <div :class="CONTAINER" class="relative h-full">
                    <div :class="TEXT_COLUMN" class="max-w-[44rem]!">
                        <div :style="fadeStyle(s.mark, 0, 8)">
                            <InvestorChapterMark index="00" label="Investor brief" />
                        </div>
                        <div class="mt-6 grid">
                            <!-- Beat 1 -->
                            <div class="col-start-1 row-start-1">
                                <Web3ScrollHeading
                                    tag="h1"
                                    :lead-class="HEADLINE"
                                    :segments="[
                                        { text: '49.8 kW of sun and wind', break: true },
                                        { text: 'on one square metre.', tone: 'accent' },
                                    ]"
                                    :progress="s.h1"
                                    :out="s.h1out"
                                />
                                <div class="mt-8 flex flex-wrap gap-3" :style="fadeStyle(s.cta, s.h1out, 12)">
                                    <a href="/pitch" :class="BTN_PRIMARY">
                                        Pitch deck
                                        <ArrowUpRight class="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                    </a>
                                    <a :href="DATABOOK_EN" target="_blank" rel="noopener" :class="BTN_SECONDARY">
                                        Technical databook
                                        <ArrowDown class="h-4 w-4 text-white/60" />
                                    </a>
                                </div>
                            </div>
                            <!-- Beat 2 -->
                            <Web3ScrollHeading
                                class="col-start-1 row-start-1"
                                :lead-class="HEADLINE"
                                :segments="[
                                    { text: 'Patented in Europe.', break: true },
                                    { text: 'Built in the Czech Republic.', tone: 'accent' },
                                ]"
                                :progress="s.h2"
                            />
                        </div>
                    </div>

                    <!-- Scroll cue -->
                    <div
                        class="absolute inset-x-0 bottom-8 flex items-center gap-3 text-xs tracking-[0.2em] text-white/40 uppercase sm:bottom-10"
                        :style="fadeStyle(s.cta, s.h1out, 0)"
                    >
                        <span class="relative block h-8 w-px overflow-hidden bg-white/15">
                            <span class="scroll-cue absolute inset-x-0 top-0 h-3 bg-[#8ec5ff]"></span>
                        </span>
                        Scroll
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, ArrowUpRight } from 'lucide-vue-next';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
import Web3EuropeMap from '@/custom/web3/Web3EuropeMap.vue';
import Web3MapAssets from '@/custom/web3/Web3MapAssets.vue';
import Web3ScrollHeading from '@/custom/web3/Web3ScrollHeading.vue';
import InvestorChapterMark from './InvestorChapterMark.vue';
import { BTN_PRIMARY, BTN_SECONDARY, CONTAINER, DATABOOK_EN, fadeStyle, HEADLINE, TEXT_COLUMN } from './tokens';

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);

const s = reactive({
    mark: 0,
    h1: 0,
    cta: 0,
    h1out: 0,
    zoom: 0,
    dim: 0,
    assets: 1,
    h2: 0,
});

let intro: gsap.core.Timeline | null = null;
let timeline: gsap.core.Timeline | null = null;

onMounted(() => {
    intro = gsap
        .timeline({ delay: 0.15 })
        .to(s, { mark: 1, duration: 0.6, ease: 'power2.out' }, 0)
        .to(s, { h1: 1, duration: 1.4, ease: 'power2.out' }, 0.1)
        .to(s, { cta: 1, duration: 0.8, ease: 'power2.out' }, 0.7);

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
        .to(s, { h1out: 1, duration: 0.6, ease: 'power1.in' }, 0.3)
        .to(s, { zoom: 1, duration: 3, ease: 'power1.inOut' }, 0)
        .to(s, { assets: 0, duration: 0.8 }, 2.4)
        .to(s, { h2: 1, duration: 1 }, 1.3)
        .to(s, { dim: 0.35, duration: 1 }, 2.2)
        .to({}, { duration: 0.6 }, 3);

    requestAnimationFrame(() => ScrollTrigger.refresh());
});

onUnmounted(() => {
    intro?.kill();
    timeline?.scrollTrigger?.kill();
    timeline?.kill();
});
</script>

<style scoped>
.scroll-cue {
    animation: cue 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes cue {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(300%);
    }
}
</style>
