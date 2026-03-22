<template>
    <Head title="Home" />

    <DefaultLayout>
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
                class="relative mx-auto h-full w-full max-w-[1200px] sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="flex h-full w-full flex-col p-6 pb-12">
                    <div class="mt-auto text-white">
                        <h1 class="text-6xl">
                            The Future <br />
                            of Energy
                        </h1>
                    </div>
                </div>
            </div>
        </section>

        <section class="top-cta w-full">
            <div
                class="relative mx-auto w-full max-w-[1200px] sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] py-12"
            >
                <div class="flex flex-col gap-6 px-6">
                    <h2 class="text-center text-6xl">
                        Turn your empty space into an asset. <br />
                        With Treetino
                    </h2>
                    <div class="flex justify-center gap-3">
                        <div class="">
                            <ButtonPrimary>Předobjednat</ButtonPrimary>
                        </div>

                        <div class="">
                            <ButtonSecondary
                                >Objevit technologie</ButtonSecondary
                            >
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const video = ref(null);

onMounted(() => {
    video.value?.play();
});
</script>
