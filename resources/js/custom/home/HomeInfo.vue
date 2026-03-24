<template>
    <section class="keypoints relative">
        <div
            class="absolute left-1/2 h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
        ></div>

        <div
            class="relative mx-auto max-w-[1400px] py-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] px-6"
        >
            <div class="grid grid-cols-3 gap-6">
                <div
                    ref="leftCardEl"
                    :style="{
                        transform: 'translateY(' + leftTranslateY + 'px)',
                    }"
                    class="mt-26"
                >
                    <div
                        class="w-full rounded-2xl border border-black/20 p-6 shadow-xl"
                    >
                        <div class="">
                            <Tree class="h-8 w-8" stroke-width="2" />
                        </div>
                        <h2 class="mt-2 text-4xl">World-class design</h2>
                        <p class="mt-2 mb-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Integer at tortor est. Sed malesuada at lorem
                            id finibus. Sed mollis sodales hendrerit. Etiam ut
                            ligula at ante laoreet blandit.
                        </p>

                        <p>
                            Vivamus at convallis quam. Etiam pellentesque augue
                            nec lectus pulvinar accumsan. Duis volutpat
                            ullamcorper dignissim. Donec mattis, enim a
                            malesuada
                        </p>
                    </div>
                </div>

                <div class="flex flex-col gap-6">
                    <div
                        class="w-full rounded-2xl border border-black bg-zinc-800 p-6 shadow-xl dark:border-white dark:bg-zinc-200"
                    >
                        <p class="text-2xl text-secondary">
                            In a world increasingly dependent on electricity,
                            we’re developing a new way to integrate sustainable
                            power
                        </p>
                    </div>

                    <div
                        class="aspect-square overflow-hidden rounded-2xl shadow-xl"
                    >
                        <img
                            src="https://picsum.photos/600"
                            class="h-full w-full object-cover"
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
                        class="reveal reveal-right w-full rounded-2xl border border-black/20 p-6 shadow-xl"
                    >
                        <div class="">
                            <Tree class="h-8 w-8" stroke-width="2" />
                        </div>
                        <h2 class="mt-2 text-4xl">U I U A A</h2>
                        <p class="mt-2 mb-3">
                            Lorem ipsum dolor sit amet, consectetur adipiscing
                            elit. Integer at tortor est. Sed malesuada at lorem
                            id finibus. Sed mollis sodales hendrerit. Etiam ut
                            ligula at ante laoreet blandit.
                        </p>

                        <p>
                            Vivamus at convallis quam. Etiam pellentesque augue
                            nec lectus pulvinar accumsan. Duis volutpat
                            ullamcorper dignissim. Donec mattis, enim a
                            malesuada
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Tree } from '@iconoir/vue';

import { useParallax } from '@/composables/useAnimations';

const { el: leftCardEl, translateY: leftTranslateY } = useParallax(0.3);
const { el: rightCardEl, translateY: rightTranslateY } = useParallax(0.3);
</script>
