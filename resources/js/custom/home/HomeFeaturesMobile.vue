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
                                >Funkce</span
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
                            Treetino je chytrý strom, který na 1 m² kombinuje
                            solární a větrnou energii. Jeho 49 kW dokáže napájet
                            až 60 domácností.
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
                                >Funkce</span
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
                            Zabere pouhý 1 m², přesto nahradí 400 m² solárních
                            panelů. Treetino mění parkoviště, firemní areály a
                            ulice v efektivní zdroje energie.
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
                                >Funkce</span
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
                            Patentovaný AI systém plynule sleduje slunce, čímž
                            zvyšuje výkon o 30 %. Před bouří navíc inteligentně
                            složí své listy pro maximální bezpečnost.
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
                                >Funkce</span
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
                            Korunu tvoří 300 solárních listů prémiové české
                            výroby. Plně přizpůsobitelný design a barvy dokonale
                            sladíte se svou značkou či architekturou.
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
                                >Funkce</span
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
                            Transparentní turbíny 2. generace vyrábí energii 24
                            hodin denně i při slabém větru. Nerušivý výkon
                            stvořený pro města.
                        </div>
                    </div>
                </swiper-slide>
            </swiper>

            <!-- Custom Navigation Buttons Below -->
            <div class="mt-6 flex justify-center gap-2">
                <button
                    @click="swiperInstance.slidePrev()"
                    class="group flex aspect-square cursor-pointer gap-0 rounded-xl border border-primary/15 bg-primary/5 px-3 transition-all duration-300 hover:gap-2"
                >
                    <FastArrowLeft class="my-auto h-5 w-5" />
                </button>
                <button
                    @click="swiperInstance.slideNext()"
                    class="group flex aspect-square cursor-pointer gap-0 rounded-xl border border-primary/15 bg-primary/5 px-3 transition-all duration-300 hover:gap-2"
                >
                    <FastArrowRight class="mx-auto my-auto h-5 w-5" />
                </button>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
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
const swiperInstance = ref(null);

const onSwiper = (swiper: null) => {
    swiperInstance.value = swiper;
};
</script>

<style scoped>
/* Optional: improve fade transition smoothness */
.swiper-slide {
    transition-timing-function: linear;
}
</style>
