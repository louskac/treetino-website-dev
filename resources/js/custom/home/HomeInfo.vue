<template>
    <section class="keypoints relative">
        <div
            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
        ></div>

        <div
            class="relative mx-auto max-w-[1400px] px-6 py-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:hidden">
                <div
                    class="relative col-span-2 aspect-square overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900"
                >
                    <img
                        src="/img/treetino-v1-isometric.png"
                        class="absolute bottom-0 h-full w-full object-cover"
                        alt=""
                    />
                </div>

                <div
                    class="col-span-2 w-full rounded-3xl bg-gradient-to-br from-[#0c1f44] via-[#0f2858] to-[#14377a] p-8 text-white shadow-xl"
                >
                    <h3
                        class="text-2xl font-normal leading-snug text-white sm:text-3xl"
                    >
                        {{ $t('home.info.card.1') }}
                    </h3>
                </div>

                <div
                    class="col-span-2 flex w-full flex-col rounded-3xl border border-black/5 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900"
                >
                    <div class="mb-4 flex aspect-square h-12 w-12 rounded-xl bg-t-blue text-white shadow-sm">
                        <DesignPencil
                            stroke-width="1.5"
                            class="mx-auto my-auto h-6 w-6"
                        />
                    </div>
                    <h2 class="text-3xl font-medium tracking-tight text-black sm:text-4xl dark:text-white">
                        {{ $t('home.info.design.title') }}
                    </h2>
                    <p class="mt-3 text-sm leading-relaxed text-black/70 sm:text-base dark:text-white/70">
                        {{ $t('home.info.design.text') }}
                    </p>
                </div>

                <div
                    class="reveal reveal-right col-span-2 flex w-full flex-col rounded-3xl border border-black/5 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900"
                >
                    <div class="mb-4 flex aspect-square h-12 w-12 rounded-xl bg-t-blue text-white shadow-sm">
                        <Network
                            stroke-width="1.5"
                            class="mx-auto my-auto h-6 w-6"
                        />
                    </div>
                    <h2 class="text-3xl font-medium tracking-tight text-black sm:text-4xl dark:text-white">
                        {{ $t('home.info.forest.title') }}
                    </h2>
                    <p class="mt-3 text-sm leading-relaxed text-black/70 sm:text-base dark:text-white/70">
                        {{ $t('home.info.forest.text') }}
                    </p>
                </div>
            </div>

            <div class="hidden grid-cols-3 gap-6 lg:grid">
                <div
                    ref="leftCardEl"
                    :style="{
                        transform: 'translateY(' + leftTranslateY + 'px)',
                    }"
                    class="mt-26"
                >
                    <div
                        class="w-full rounded-3xl border border-black/5 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900"
                    >
                        <div class="mb-4 flex aspect-square h-12 w-12 rounded-xl bg-t-blue text-white shadow-sm">
                            <DesignPencil
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                        <h2 class="text-3xl font-medium tracking-tight text-black sm:text-4xl dark:text-white">
                            {{ $t('home.info.design.title') }}
                        </h2>
                        <p class="mt-3 text-sm leading-relaxed text-black/70 sm:text-base dark:text-white/70">
                            {{ $t('home.info.design.text') }}
                        </p>
                    </div>
                </div>

                <div class="flex flex-col gap-6">
                    <div
                        class="w-full rounded-3xl bg-gradient-to-br from-[#0c1f44] via-[#0f2858] to-[#14377a] p-8 text-white shadow-xl"
                    >
                        <h3
                            class="text-2xl font-normal leading-snug text-white sm:text-3xl"
                        >
                            {{ $t('home.info.card.1') }}
                        </h3>
                    </div>

                    <div
                        class="relative aspect-square overflow-hidden rounded-3xl border border-black/5 bg-white shadow-xl dark:border-white/10 dark:bg-zinc-900"
                    >
                        <img
                            src="/img/treetino-v1-isometric.png"
                            class="absolute bottom-0 h-full w-full object-cover"
                            alt=""
                        />
                    </div>
                </div>

                <div
                    ref="rightCardEl"
                    :style="{
                        transform: 'translateY(' + rightTranslateY + 'px)',
                    }"
                    class="mt-26"
                >
                    <div
                        class="reveal reveal-right w-full rounded-3xl border border-black/5 bg-white p-8 shadow-xl dark:border-white/10 dark:bg-zinc-900"
                    >
                        <div class="mb-4 flex aspect-square h-12 w-12 rounded-xl bg-t-blue text-white shadow-sm">
                            <Network
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                        <h2 class="text-3xl font-medium tracking-tight text-black sm:text-4xl dark:text-white">
                            {{ $t('home.info.forest.title') }}
                        </h2>
                        <p class="mt-3 text-sm leading-relaxed text-black/70 sm:text-base dark:text-white/70">
                            {{ $t('home.info.forest.text') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { DesignPencil, Network } from '@iconoir/vue';

import { useParallax } from '@/composables/useAnimations';

const { el: leftCardEl, translateY: leftTranslateY } = useParallax(0.3);
const { el: rightCardEl, translateY: rightTranslateY } = useParallax(0.3);
</script>
