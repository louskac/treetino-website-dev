<template>
    <Head title="Home" />

    <DefaultLayout>
        <section class="hero relative h-220 w-full z-10">
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
                class="relative mx-auto flex h-full w-full flex-col border-r border-l border-r-white/20 border-l-white/20 sm:w-[500px] md:w-[700px] xl:w-[1400px]"
            >
                <div
                    class="mt-auto grid p-6 pb-6 lg:grid-cols-3 xl:grid-cols-2"
                >
                    <div
                        class="col-span-1 rounded-2xl bg-white/60 p-6 backdrop-blur-2xl transition-all lg:col-span-2 xl:col-span-1 dark:bg-black/60"
                    >
                        <div
                            class="font-heading w-fit pb-6 text-6xl text-black transition-all dark:text-white"
                        >
                            Future of Energy <br />
                            Rooted in Sustainability
                        </div>

                        <div class="flex w-1/2 gap-3">Test</div>
                    </div>
                </div>
            </div>
        </section>

        <section class="keypoints relative">
            <div
                class="absolute left-1/2 h-full -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 sm:w-[500px] md:w-[700px] xl:w-[1400px]"
            ></div>

            <div
                class="relative mx-auto px-6 py-12 sm:w-[500px] md:w-[700px] xl:w-[1400px]"
            >
                <div class="grid grid-cols-3 gap-6">
                    <div
                        ref="leftCardEl"
                        :style="{ transform: 'translateY(' + leftTranslateY + 'px)' }"
                        class="mt-26"
                    >
                        <div
                            class="w-full rounded-2xl border border-black/20 p-6 shadow-xl"
                        >
                            <div class="">
                                <Tree class="h-8 w-8" stroke-width="2" />
                            </div>
                            <h2 class="mt-2 text-4xl">
                                World-class design
                            </h2>
                            <p class="mt-2 mb-3">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Integer at tortor est. Sed
                                malesuada at lorem id finibus. Sed mollis
                                sodales hendrerit. Etiam ut ligula at ante
                                laoreet blandit.
                            </p>

                            <p>
                                Vivamus at convallis quam. Etiam
                                pellentesque augue nec lectus pulvinar
                                accumsan. Duis volutpat ullamcorper
                                dignissim. Donec mattis, enim a malesuada
                            </p>
                        </div>
                    </div>

                    <div class="flex flex-col gap-6">
                        <div
                            class="w-full rounded-2xl border border-black bg-zinc-800 p-6 shadow-xl dark:border-white dark:bg-zinc-200"
                        >
                            <p class="text-2xl text-secondary">
                                In a world increasingly dependent on
                                electricity, we’re developing a new way to
                                integrate sustainable power
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
                        :style="{ transform: 'translateY(' + rightTranslateY + 'px)' }"
                        class="mt-26"
                    >
                        <div
                            class="w-full rounded-2xl border border-black/20 p-6 shadow-xl reveal reveal-right"
                        >
                            <div class="">
                                <Tree class="h-8 w-8" stroke-width="2" />
                            </div>
                            <h2 class="mt-2 text-4xl">
                                U I U A A
                            </h2>
                            <p class="mt-2 mb-3">
                                Lorem ipsum dolor sit amet, consectetur
                                adipiscing elit. Integer at tortor est. Sed
                                malesuada at lorem id finibus. Sed mollis
                                sodales hendrerit. Etiam ut ligula at ante
                                laoreet blandit.
                            </p>

                            <p>
                                Vivamus at convallis quam. Etiam
                                pellentesque augue nec lectus pulvinar
                                accumsan. Duis volutpat ullamcorper
                                dignissim. Donec mattis, enim a malesuada
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="claims relative mx-auto flex h-full w-full flex-col py-12 sm:w-[500px] md:w-[700px] xl:w-[1400px]"
        >
            <div class="aspect-3/1 overflow-hidden rounded-2xl">
                <img
                    class="h-full w-full object-cover"
                    src="https://picsum.photos/1500/500"
                    alt=""
                />
            </div>

            <div class="grid grid-cols-1 gap-12 pt-12 lg:grid-cols-4">
                <div class="col-span-1">
                    <h2 class="text-6xl">Information &&nbsp;Numbers</h2>
                </div>

                <div
                    class="col-span-1 flex w-full grid-cols-3 gap-6 lg:col-span-3"
                >
                    <div class="col-span-1 flex w-full flex-col">
                        <div class="w-full border-t border-t-primary py-4">
                            <div class="number flex gap-1 text-6xl">
                                <Leaf
                                    stroke-width="2"
                                    class="my-auto h-12 w-12"
                                />
                                <div class="my-auto">300</div>
                            </div>
                            <div class="pt-1">
                                Of our State of the Art Solar Leaves
                            </div>
                        </div>

                        <div class="w-full border-t border-t-primary py-4">
                            <div class="number flex gap-1 text-6xl">
                                <Wind
                                    stroke-width="2"
                                    class="my-auto h-12 w-12"
                                />
                                <div class="my-auto">12</div>
                            </div>
                            <div class="pt-1">
                                Transparent Wind Turbines Generating Electricity
                                Even at Nights
                            </div>
                        </div>
                    </div>

                    <div class="col-span-1 flex w-full flex-col">
                        <div class="w-full border-t border-t-primary py-4">
                            <div class="number flex gap-1 text-6xl">
                                <Asterisk
                                    stroke-width="2"
                                    class="my-auto h-12 w-12"
                                />
                                <div class="my-auto">49 kW</div>
                            </div>
                            <div class="pt-1">
                                Perfectly Tuned Output to Match Government
                                Subsidy Regulations
                            </div>
                        </div>

                        <div class="w-full border-t border-t-primary py-4">
                            <div class="number flex gap-1 text-6xl">
                                <Cube
                                    stroke-width="2"
                                    class="my-auto h-12 w-12"
                                />
                                <div class="my-auto">
                                    300 m<sup
                                        class="relative -top-6 text-3xl font-bold"
                                        >2</sup
                                    >
                                </div>
                            </div>
                            <div class="pt-1">
                                Average Space Saved by Our Energy Solutions
                            </div>
                        </div>
                    </div>

                    <div class="col-span-1 flex w-full flex-col">
                        <div class="w-full border-t border-t-primary py-4">
                            <div class="number flex gap-1 text-6xl">
                                <two-points-circle
                                    stroke-width="2"
                                    class="my-auto h-12 w-12"
                                />
                                <div class="my-auto">
                                    1 m<sup
                                        class="relative -top-6 text-3xl font-bold"
                                        >2</sup
                                    >
                                </div>
                            </div>
                            <div class="pt-1">
                                Space Efficient &mdash; Picked to Fit European
                                no-license construction requirement
                            </div>
                        </div>

                        <div class="w-full border-t border-t-primary py-4">
                            <div class="number flex gap-1 text-6xl">
                                <Home
                                    stroke-width="2"
                                    class="my-auto h-12 w-12"
                                />
                                <div class="my-auto">60</div>
                            </div>
                            <div class="pt-1">
                                One Fixture powers up to 60 modern homes
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section
            class="relative mx-auto flex h-full w-full flex-col sm:w-[500px] md:w-[700px] xl:w-[1400px]"
        >
            <div class="my-12 grid w-full grid-cols-1 lg:grid-cols-3">
                <div class="border-l-4 border-l-t-accent bg-zinc-50 p-6">T</div>
            </div>
        </section>
    </DefaultLayout>
</template>

<script setup lang="ts">
import {
    Tree,
    Leaf,
    Wind,
    Asterisk,
    Cube,
    TwoPointsCircle,
    Home,
} from '@iconoir/vue';
import { Head } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { useParallax } from '@/composables/useAnimations';

const video = ref(null);

const { el: leftCardEl, translateY: leftTranslateY } = useParallax(1);
const { el: rightCardEl, translateY: rightTranslateY } = useParallax(1);

onMounted(() => {
    video.value?.play();
});
</script>
