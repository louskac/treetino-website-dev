<template>
    <Head title="Treetino V1" />

    <DefaultLayout :scroll="false" class="relative">
        <div class="absolute h-90 w-full bg-blue-50">
            <div
                class="absolute bottom-0 h-30 w-full bg-linear-to-b from-transparent to-white"
            ></div>
        </div>

        <div class="buffer h-40 pb-12"></div>

        <section class="page relative pb-12">
            <!--            <div-->
            <!--                class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 [mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"-->
            <!--            ></div>-->

            <div
                class="relative mx-auto h-full w-full max-w-[1400px] sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div class="">
                        <img
                            class="rounded-2xl"
                            src="/img/stills/Still_Strom-v1.png"
                            alt=""
                        />
                    </div>

                    <div class="lg:ml-6">
                        <div class="mt-6 lg:mt-24">
                            <div
                                class="text-xs font-semibold tracking-[0.2em] text-black/70 uppercase"
                            >
                                Pro firmy a města
                            </div>

                            <div class="mt-2 text-6xl">Treetino v1</div>

                            <div class="mt-4 text-2xl opacity-70">
                                Udělejte ze svého sídla symbol budoucnosti,
                                který vyrábí čistou energii ze slunce i větru na
                                jednom metru čtverečním.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="relative h-80">
            <div
                class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 [mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
            ></div>

            <div
                class="relative mx-auto h-full w-full max-w-[1400px] px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="flex h-full w-full lg:px-20">
                    <div class="mx-auto my-auto">
                        <div class="text-6xl text-t-blue">Coming Soon</div>
                    </div>
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>
