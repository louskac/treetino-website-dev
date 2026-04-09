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

        <div
            class="relative mx-auto h-full w-full max-w-[1400px] sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <Swiper
                :slides-per-view="1"
                :space-between="0"
                :on-slide-change="onSlideChange"
                :on-progress="onProgress"
                class="h-full"
            >
                <!-- Slide 1 -->
                <SwiperSlide>
                    <div class="flex h-full flex-col p-6 pb-12 text-white">
                        <div class="mt-auto">
                            <h1 class="mb-6 text-6xl lg:text-8xl">
                                The Future <br />
                                of Energy
                            </h1>

                            <div class="flex gap-2 opacity-70">
                                <div class="text-3xl">
                                    Eco-Friendly <br />
                                    with modern design
                                </div>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>

                <!-- Slide 2 -->
                <SwiperSlide>
                    <div class="flex h-full flex-col p-6 pb-12 text-white">
                        <div class="mt-auto">
                            <h1 class="mb-6 text-6xl lg:text-8xl">
                                Smart Systems
                            </h1>
                        </div>
                    </div>
                </SwiperSlide>
            </Swiper>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Leaf } from '@iconoir/vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import type { Swiper as SwiperType } from 'swiper';
import { ref, onMounted } from 'vue';
import 'swiper/css';

import ButtonPrimary from '@/custom/ButtonPrimary.vue';

const video = ref<HTMLVideoElement | null>(null);

onMounted(() => {
    video.value?.play();
});

const activeIndex = ref(0);
const progress = ref(0);

const onSlideChange = (swiper: SwiperType) => {
    activeIndex.value = swiper.activeIndex;
};

const onProgress = (swiper: SwiperType, prog: number) => {
    progress.value = prog;
};

// expose to parent if needed
defineExpose({
    activeIndex,
    progress,
});
</script>
