<template>
    <section class="top-cta relative w-full">
        <div
            class="absolute h-1/2 w-full bg-linear-to-b from-black to-transparent"
        ></div>

        <div
            class="absolute left-1/2 h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-white/20 border-l-white/20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        ></div>

        <div
            class="relative mx-auto flex h-180 w-full max-w-[1400px] justify-end py-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="mt-auto flex flex-col gap-6 px-6">
                <h2 class="text-right text-6xl">
                    Turn your empty space <br />
                    into an asset.
                    <span class="text-t-blue">With Treetino</span>
                </h2>
                <div class="flex justify-end gap-3">
                    <div class="">
                        <ButtonPrimary>Předobjednat</ButtonPrimary>
                    </div>

                    <div class="">
                        <ButtonSecondary>Objevit technologie</ButtonSecondary>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
</script>
