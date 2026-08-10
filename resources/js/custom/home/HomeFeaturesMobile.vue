<template>
    <section class="pt-12">
        <div
            class="relative mx-auto w-full max-w-[1400px] px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <!-- Swiper Carousel -->
            <swiper
                :fade-effect="{ crossFade: true }"
                :loop="true"
                :modules="modules"
                :slides-per-view="1"
                effect="fade"
                @swiper="onSwiper"
            >
                <swiper-slide>
                    <div
                        class="mt-1 aspect-square overflow-clip rounded-2xl border"
                    >
                        <div class="h-full w-full">
                            <img
                                src="/img/features-frames/features_frame_0001.webp"
                                alt=""
                            />
                        </div>
                    </div>

                    <div class="mt-6">
                        <div class="flex items-center justify-between">
                            <span
                                class="text-xs font-semibold tracking-[0.2em] text-black/70 uppercase"
                                >{{ $t('home.features.title_tag') }}</span
                            >
                            <span
                                class="text-xs font-medium tracking-widest text-black/70"
                            >
                                01/05
                            </span>
                        </div>
                    </div>

                    <div class="mt-5">
                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-xl bg-t-blue"
                        >
                            <Tree
                                class="h-6 w-6 text-white"
                                stroke-width="1.5"
                            />
                        </div>
                    </div>

                    <div class="mt-4">
                        <div class="text-2xl">
                            {{ $t('home.features.design.text') }}
                        </div>
                    </div>
                </swiper-slide>

                <swiper-slide>
                    <div
                        class="mt-1 aspect-square overflow-clip rounded-2xl border"
                    >
                        <div class="h-full w-full">
                            <img
                                src="/img/features-frames/features_frame_0046.webp"
                                alt=""
                            />
                        </div>
                    </div>

                    <div class="mt-6">
                        <div class="flex items-center justify-between">
                            <span
                                class="text-xs font-semibold tracking-[0.2em] text-black/70 uppercase"
                                >{{ $t('home.features.title_tag') }}</span
                            >
                            <span
                                class="text-xs font-medium tracking-widest text-black/70"
                            >
                                02/05
                            </span>
                        </div>
                    </div>

                    <div class="mt-5">
                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-xl bg-t-blue"
                        >
                            <RulerCombine
                                class="h-6 w-6 text-white"
                                stroke-width="1.5"
                            />
                        </div>
                    </div>

                    <div class="mt-4">
                        <div class="text-2xl">
                            {{ $t('home.features.space.text') }}
                        </div>
                    </div>
                </swiper-slide>

                <swiper-slide>
                    <div
                        class="mt-1 aspect-square overflow-clip rounded-2xl border"
                    >
                        <div class="h-full w-full">
                            <img
                                src="/img/features-frames/features_frame_0112.webp"
                                alt=""
                            />
                        </div>
                    </div>

                    <div class="mt-6">
                        <div class="flex items-center justify-between">
                            <span
                                class="text-xs font-semibold tracking-[0.2em] text-black/70 uppercase"
                                >{{ $t('home.features.title_tag') }}</span
                            >
                            <span
                                class="text-xs font-medium tracking-widest text-black/70"
                            >
                                03/05
                            </span>
                        </div>
                    </div>

                    <div class="mt-5">
                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-xl bg-t-blue"
                        >
                            <SunLight
                                class="h-6 w-6 text-white"
                                stroke-width="1.5"
                            />
                        </div>
                    </div>

                    <div class="mt-4">
                        <div class="text-2xl">
                            {{ $t('home.features.performance.text') }}
                        </div>
                    </div>
                </swiper-slide>

                <swiper-slide>
                    <div
                        class="mt-1 aspect-square overflow-clip rounded-2xl border"
                    >
                        <div class="h-full w-full">
                            <img
                                src="/img/features-frames/features_frame_0168.webp"
                                alt=""
                            />
                        </div>
                    </div>

                    <div class="mt-6">
                        <div class="flex items-center justify-between">
                            <span
                                class="text-xs font-semibold tracking-[0.2em] text-black/70 uppercase"
                                >{{ $t('home.features.title_tag') }}</span
                            >
                            <span
                                class="text-xs font-medium tracking-widest text-black/70"
                            >
                                04/05
                            </span>
                        </div>
                    </div>

                    <div class="mt-5">
                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-xl bg-t-blue"
                        >
                            <Leaf
                                class="h-6 w-6 text-white"
                                stroke-width="1.5"
                            />
                        </div>
                    </div>

                    <div class="mt-4">
                        <div class="text-2xl">
                            {{ $t('home.features.premium.text') }}
                        </div>
                    </div>
                </swiper-slide>

                <swiper-slide>
                    <div
                        class="mt-1 aspect-square overflow-clip rounded-2xl border"
                    >
                        <div class="h-full w-full">
                            <img
                                src="/img/features-frames/features_frame_0224.webp"
                                alt=""
                            />
                        </div>
                    </div>

                    <div class="mt-6">
                        <div class="flex items-center justify-between">
                            <span
                                class="text-xs font-semibold tracking-[0.2em] text-black/70 uppercase"
                                >{{ $t('home.features.title_tag') }}</span
                            >
                            <span
                                class="text-xs font-medium tracking-widest text-black/70"
                            >
                                05/05
                            </span>
                        </div>
                    </div>

                    <div class="mt-5">
                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-xl bg-t-blue"
                        >
                            <Wind
                                class="h-6 w-6 text-white"
                                stroke-width="1.5"
                            />
                        </div>
                    </div>

                    <div class="mt-4">
                        <div class="text-2xl">
                            {{ $t('home.features.balance.text') }}
                        </div>
                    </div>
                </swiper-slide>
            </swiper>

            <!-- Custom Navigation Buttons Below -->
            <div class="mt-6 flex justify-center gap-2">
                <button
                    @click="swiperInstance?.slidePrev()"
                    class="group flex aspect-square cursor-pointer gap-0 rounded-xl border border-primary/15 bg-primary/5 px-3 transition-all duration-300 hover:gap-2"
                >
                    <FastArrowLeft class="my-auto h-5 w-5" />
                </button>
                <button
                    @click="swiperInstance?.slideNext()"
                    class="group flex aspect-square cursor-pointer gap-0 rounded-xl border border-primary/15 bg-primary/5 px-3 transition-all duration-300 hover:gap-2"
                >
                    <FastArrowRight class="mx-auto my-auto h-5 w-5" />
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import type { Swiper as SwiperInstance } from 'swiper';
import { EffectFade } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref } from 'vue';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import {
    FastArrowLeft,
    FastArrowRight,
    SunLight,
    Leaf,
    Tree,
    RulerCombine,
    Wind,
} from '@iconoir/vue';

const modules = [EffectFade];

// Store the swiper instance
const swiperInstance = ref<SwiperInstance | null>(null);

const onSwiper = (swiper: SwiperInstance) => {
    swiperInstance.value = swiper;
};
</script>

<style scoped>
/* Optional: improve fade transition smoothness */
.swiper-slide {
    transition-timing-function: linear;
}
</style>
