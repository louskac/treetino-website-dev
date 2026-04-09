<script setup lang="ts">
import type { Swiper as SwiperType } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref, computed } from 'vue';

// SWIPER
// --- core state ---
const swiper = ref<SwiperType | null>(null);
const activeIndex = ref<number>(0);
const progress = ref<number>(0);

// --- handlers ---
const onSwiper = (instance: SwiperType): void => {
    swiper.value = instance;
};

const onSlideChange = (instance: SwiperType): void => {
    activeIndex.value = instance.activeIndex;
};

const onProgress = (_: SwiperType, prog: number): void => {
    progress.value = prog;
};

// --- derived (useful for animation systems) ---
const slideCount = computed(() => swiper.value?.slides.length ?? 0);

// normalized progress per slide (0 → 1 within current slide)
const localProgress = computed(() => {
    if (!swiper.value || slideCount.value <= 1) return 0;

    return (progress.value * (slideCount.value - 1)) % 1;
});

// --- controls (buttons / external drivers) ---
const next = (): void => {
    swiper.value?.slideNext();
};

const prev = (): void => {
    swiper.value?.slidePrev();
};

const goTo = (index: number): void => {
    swiper.value?.slideTo(index);
};

// --- expose to parent ---
defineExpose({
    swiper,
    activeIndex,
    progress,
    localProgress,
    next,
    prev,
    goTo,
});
</script>
<template>
    <div
        class="relative mx-auto h-full w-full max-w-[1400px] sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
    >
        <Swiper
            :slides-per-view="1"
            :allow-touch-move="false"
            :simulate-touch="false"
            :space-between="0"
            :on-slide-change="onSlideChange"
            :on-progress="onProgress"
            :keyboard="false"
            :mousewheel="false"
            :loop="true"
            @swiper="onSwiper"
            class="h-full"
        >
            <!-- Slide 1 -->
            <SwiperSlide>
                <div class="flex h-full flex-col p-6 pb-12 text-white">
                    <div class="mt-auto">
                        <h1 class="mb-6 text-6xl lg:text-8xl">Treetino v1</h1>

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
                        <h1 class="mb-6 text-6xl lg:text-8xl">Treetino v2</h1>
                    </div>
                </div>
            </SwiperSlide>

            <!-- Slide 2 -->
            <SwiperSlide>
                <div class="flex h-full flex-col p-6 pb-12 text-white">
                    <div class="mt-auto">
                        <h1 class="mb-6 text-6xl lg:text-8xl">Turbine</h1>
                    </div>
                </div>
            </SwiperSlide>
        </Swiper>
    </div>

    <!-- Controls -->
    <div class="absolute bottom-10 left-10 z-50 flex gap-4 text-white">
        <button @click="prev">Prev</button>
        <button @click="next">Next</button>
    </div>
</template>
