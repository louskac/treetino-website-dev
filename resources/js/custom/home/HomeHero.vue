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
            <div class="flex h-full w-full flex-col p-6 pb-12">
                <div class="mt-auto text-white">
                    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div class="mt-auto">
                            <h1
                                class="mb-6 text-6xl leading-13 lg:text-8xl lg:leading-20"
                            >
                                The Future <br />
                                of Energy
                            </h1>
                            <div class="flex gap-2">
                                <div class="opacity-70">
                                    <Leaf class="h-8 w-8 mt-0.5" stroke-width="1.5"/>
                                </div>
                                <div class="text-3xl opacity-70 leading-8">
                                    Eco-Friendly <br />
                                    with modern design
                                </div>
                            </div>
                        </div>

                        <div class="hidden lg:flex lg:justify-end">
                            <div class="mt-auto">
                                <div
                                    class="w-100 rounded-2xl border border-blue-500/30 bg-black/40 p-6 backdrop-blur-2xl"
                                >
                                    <h2 class="mb-3 text-4xl">Treetino App</h2>
                                    <div class="mb-4 text-sm opacity-70">
                                        Install the Treetino App for the
                                        Ultimate Control of your Products
                                    </div>

                                    <div class="">
                                        <ButtonPrimary class="w-full"
                                            >About the App</ButtonPrimary
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { Leaf } from '@iconoir/vue';
import { ref, onMounted } from 'vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';

const video = ref<HTMLVideoElement | null>(null);

onMounted(() => {
    video.value?.play();
});
</script>
