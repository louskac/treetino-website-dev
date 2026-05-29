<template>
    <section class="hero h-screen w-full bg-zinc-950">
        <HomeHeroBackground class="hidden lg:block" :active-index="activeIndex" />
        <HomeHeroBackgroundSm class="block lg:hidden" :active-index="activeIndex" />

        <div
            class="absolute bottom-0 h-100 w-full bg-linear-to-b from-transparent to-black"
        ></div>

<!--        <div-->
<!--            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-white/20 border-l-white/20 sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"-->
<!--        ></div>-->

        <HomeHeroCarousel ref="carouselRef" />

        <HomeHeroCarouselControls @next="next" @prev="prev" @goTo="goTo" />
    </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import 'swiper/css';

import HomeHeroBackground from '@/custom/home/hero/HomeHeroBackground.vue';
import HomeHeroBackgroundSm from '@/custom/home/hero/HomeHeroBackgroundSm.vue';
import HomeHeroCarousel from '@/custom/home/hero/HomeHeroCarousel.vue';
import HomeHeroCarouselControls from '@/custom/home/hero/HomeHeroCarouselControls.vue';

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
const goTo = (i: number) => carouselRef.value?.goTo(i);
</script>
