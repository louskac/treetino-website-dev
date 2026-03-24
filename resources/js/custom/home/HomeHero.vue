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
            class="hidden sm:block absolute left-1/2 h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-white/20 border-l-white/20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        ></div>

        <div
            class="relative mx-auto h-full w-full max-w-[1400px] sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="flex h-full w-full flex-col p-6 pb-12">
                <div class="mt-auto text-white">
                    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div class="">
                            <h1 class="text-6xl lg:text-8xl">
                                The Future <br />
                                of Energy
                            </h1>
                        </div>

                        <div class="flex lg:justify-end">
                            <div class="mt-auto">
                                <div class="p-4 rounded-2xl bg-black/40 backdrop-blur-2xl border border-white/30">
                                    Poptat nezávaznou kalkulaci
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
import { ref, onMounted } from 'vue';

const video = ref<HTMLVideoElement | null>(null);

onMounted(() => {
    video.value?.play();
});
</script>
