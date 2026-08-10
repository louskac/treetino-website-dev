<template>
    <section class="hero h-screen w-full bg-zinc-950 relative">
        <HomeHeroBackground
            ref="backgroundRef"
            class=""
            :active-index="activeIndex"
            @autoplay-blocked="videoAutoplayBlocked = $event"
        />
        <!--        <HomeHeroBackgroundSm class="block lg:hidden" :active-index="activeIndex" />-->

        <div
            class="pointer-events-none absolute bottom-0 h-100 w-full bg-linear-to-b from-transparent to-black"
        ></div>

        <!--        <div-->
        <!--            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-white/20 border-l-white/20 sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"-->
        <!--        ></div>-->

        <HomeHeroCarousel ref="carouselRef" />

        <button
            v-if="videoAutoplayBlocked"
            type="button"
            class="absolute top-1/2 left-1/2 z-30 -translate-x-1/2 -translate-y-1/2"
            aria-label="Play background video"
            @click="playBackgroundVideo"
        >
            <div class="h-20 w-20 bg-t rounded-full bg-white/10 backdrop-blur-lg border border-white/20 flex hover:scale-105 transition-all cursor-pointer">
                <Play class="h-12 w-12 text-white m-auto pl-1" />
            </div>
        </button>

        <HomeHeroCarouselControls @next="next" @prev="prev" />
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import 'swiper/css';

import HomeHeroBackground from '@/custom/home/hero/HomeHeroBackground.vue';
import HomeHeroCarousel from '@/custom/home/hero/HomeHeroCarousel.vue';
import HomeHeroCarouselControls from '@/custom/home/hero/HomeHeroCarouselControls.vue';

import { Play } from '@iconoir/vue';

type CarouselExpose = {
    swiper: any;
    activeIndex: number;
    progress: number;
    localProgress: number;
    next: () => void;
    prev: () => void;
    goTo: (index: number) => void;
};

const carouselRef = ref<CarouselExpose | null>(null);

// active Index
const activeIndex = computed(() => {
    return carouselRef.value?.activeIndex ?? 0;
});

const next = () => carouselRef.value?.next();
const prev = () => carouselRef.value?.prev();
type HomeHeroBackgroundInstance = InstanceType<typeof HomeHeroBackground>;

const backgroundRef = ref<HomeHeroBackgroundInstance | null>(null);
const videoAutoplayBlocked = ref(false);

const playBackgroundVideo = async () => {
    await backgroundRef.value?.playVideo();
};
</script>
