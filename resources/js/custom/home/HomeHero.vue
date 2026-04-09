<template>
    <section class="hero h-screen w-full bg-zinc-950">
        <div class="bg absolute top-0 h-full w-full bg-t-dark">
            <video
                ref="video"
                class="h-full w-full object-cover"
                id="video"
                muted
                loop
                playsinline
                style="
                    pointer-events: none;
                    object-fit: cover;
                    min-height: 100%;
                "
            >
                <source src="/video/hero-test-2.mp4" type="video/mp4" />
            </video>
        </div>

        <div
            class="absolute bottom-0 h-100 w-full bg-linear-to-b from-transparent to-black"
        ></div>

        <div
            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-white/20 border-l-white/20 sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        ></div>

        <HomeHeroCarousel />
    </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import 'swiper/css';

import HomeHeroCarousel from '@/custom/home/hero/HomeHeroCarousel.vue';

const video = ref<HTMLVideoElement | null>(null);

onMounted(() => {
    video.value?.play();
});
</script>
