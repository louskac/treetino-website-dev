<template>
    <section
        id="opportunities"
        class="relative scroll-mt-24 border-b border-black/10 bg-stone-50 py-20 text-black dark:border-white/10 dark:bg-stone-900/50 dark:text-white"
    >
        <div
            class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <!-- Section Header -->
            <div class="mb-12 text-center">
                <span
                    class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                >
                    {{ $t('sales.ideas.badge') }}
                </span>
                <h2
                    class="mt-2 text-3xl font-medium tracking-tight sm:text-4xl lg:text-5xl"
                >
                    {{ $t('sales.ideas.title') }}
                </h2>
                <p
                    class="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-black/70 sm:text-lg dark:text-white/70"
                >
                    {{ $t('sales.ideas.subtitle') }}
                </p>
            </div>

            <!-- Signature Split Carousel Showcase (Exact match to V2.vue Feature Showcase 2) -->
            <div
                class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center lg:gap-16"
            >
                <!-- Left Column: Realistic Architectural Visualization with Signature Corner Accent -->
                <div
                    class="relative overflow-hidden border-t-4 border-l-4 border-t-t-blue border-l-t-blue bg-black shadow-2xl"
                >
                    <div class="relative aspect-4/3 overflow-hidden">
                        <Transition name="fade" mode="out-in">
                            <img
                                :key="currentOpp.id"
                                :src="currentOpp.imageSrc"
                                :alt="$t(currentOpp.titleKey)"
                                class="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                            />
                        </Transition>

                        <!-- 2-Line Stacked Bold Typography Overlay in corner (Max 2 lines guaranteed) -->
                        <div
                            class="pointer-events-none absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/85 via-black/20 to-transparent p-6 sm:p-10"
                        >
                            <span
                                class="text-3xl leading-none font-black tracking-tight whitespace-nowrap text-white uppercase drop-shadow-2xl sm:text-5xl lg:text-6xl"
                            >
                                {{ currentOpp.overlayLine1 }}
                            </span>
                            <span
                                class="mt-1.5 text-3xl leading-none font-black tracking-tight whitespace-nowrap text-white uppercase drop-shadow-2xl sm:text-5xl lg:text-6xl"
                            >
                                {{ currentOpp.overlayLine2 }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Editorial Details, Pricing Cards, & Navigation -->
                <div class="flex flex-col justify-between">
                    <div>
                        <!-- Segment Tag -->
                        <span
                            class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                        >
                            {{ $t(currentOpp.segmentKey) }}
                        </span>

                        <!-- Main Title -->
                        <h3
                            class="mt-3 text-3xl font-medium text-black sm:text-4xl dark:text-white"
                        >
                            {{ $t(currentOpp.titleKey) }}
                        </h3>

                        <!-- Description -->
                        <p
                            class="mt-5 text-base leading-relaxed text-black/75 sm:text-lg dark:text-white/75"
                        >
                            {{ $t(currentOpp.descKey) }}
                        </p>

                        <!-- Two Bottom Highlight Cards with vertical left blue line -->
                        <div class="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div
                                class="border-l-2 border-t-blue bg-white/70 p-4 pl-4 shadow-xs dark:bg-white/5"
                            >
                                <div
                                    class="text-xs font-semibold tracking-wider text-black/55 uppercase dark:text-white/55"
                                >
                                    {{ $t('sales.ideas.commission_label') }}
                                </div>
                                <div
                                    class="mt-1 font-mono text-xl font-bold whitespace-nowrap text-t-blue"
                                >
                                    {{ $t(currentOpp.payoutKey) }}
                                </div>
                            </div>
                            <div
                                class="border-l-2 border-t-blue bg-white/70 p-4 pl-4 shadow-xs dark:bg-white/5"
                            >
                                <div
                                    class="text-xs font-semibold tracking-wider text-black/55 uppercase dark:text-white/55"
                                >
                                    {{ $t('sales.ideas.recommended_model') }}
                                </div>
                                <div
                                    class="mt-1 text-base font-bold text-black dark:text-white"
                                >
                                    {{ $t(currentOpp.modelKey) }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Carousel Controls (Previous / Next & Index indicator) -->
                    <div
                        class="mt-8 flex items-center justify-between border-t border-black/10 pt-6 dark:border-white/10"
                    >
                        <div
                            class="font-mono text-xs font-semibold text-black/50 dark:text-white/50"
                        >
                            {{ currentOpp.tag }} / {{ String(opportunities.length).padStart(2, '0') }}
                        </div>

                        <div class="flex items-center gap-2">
                            <button
                                type="button"
                                @click="prev"
                                class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-black transition-all hover:bg-black hover:text-white dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:bg-white dark:hover:text-black"
                                aria-label="Previous opportunity"
                            >
                                <ChevronLeft class="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                @click="next"
                                class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-black/10 bg-white text-black transition-all hover:bg-black hover:text-white dark:border-white/10 dark:bg-zinc-800 dark:text-white dark:hover:bg-white dark:hover:text-black"
                                aria-label="Next opportunity"
                            >
                                <ChevronRight class="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { SALES_OPPORTUNITIES } from '@/types/sales';

const opportunities = SALES_OPPORTUNITIES;
const currentIndex = ref(0);
const currentOpp = computed(() => opportunities[currentIndex.value]);

function prev() {
    currentIndex.value =
        (currentIndex.value - 1 + opportunities.length) % opportunities.length;
}

function next() {
    currentIndex.value = (currentIndex.value + 1) % opportunities.length;
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.35s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
