<template>
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
</template>

<script setup lang="ts">
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
</script>