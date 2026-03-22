<template>
    <Head title="Home" />

    <DefaultLayout>
        <section class="hero h-screen w-full bg-zinc-950"></section>

        <section class="top-cta w-full">
            <div class="py-12">
                <div class="flex flex-col gap-6">
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
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>
