<script setup lang="ts">
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
</script>

<template>
    <section class="config relative">
        <div
            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
        ></div>

        <div
            class="relative mx-auto h-full w-full max-w-[1400px] px-6 py-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="pb-10 text-center text-6xl">
                <h2>
                    Configure
                    <span class="text-t-blue dark:text-t-accent">Treetino</span>
                </h2>
            </div>

            <div class="grid grid-cols-1 gap-6 xl:grid-cols-3">
                <div class="col-span-1 flex flex-col">
                    <h3 class="mb-6 text-3xl">Select Variant</h3>

                    <div class="mt-auto grid grid-cols-1 gap-3">
                        <div class="overflow-clip rounded-2xl border shadow-xl">
                            <div class="flex h-20 gap-0">
                                <div
                                    class="aspect-square h-full bg-t-purple"
                                ></div>

                                <div class="flex h-full p-4">
                                    <div class="my-auto">
                                        <h4 class="font-semibold">
                                            Treetino Turbine
                                        </h4>
                                        <div class="text-sm">
                                            From &euro; 12 000
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="overflow-clip rounded-2xl border shadow-xl">
                            <div class="flex h-20 gap-0">
                                <div
                                    class="aspect-square h-full bg-t-purple"
                                ></div>

                                <div class="flex h-full p-4">
                                    <div class="my-auto">
                                        <h4 class="font-semibold">
                                            Treetino V1
                                        </h4>
                                        <div class="text-sm">
                                            From &euro; 30 000
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="overflow-clip rounded-2xl border shadow-xl">
                            <div class="flex h-20 gap-0">
                                <div
                                    class="aspect-square h-full bg-t-purple"
                                ></div>

                                <div class="flex h-full p-4">
                                    <div class="my-auto">
                                        <h4 class="font-semibold">
                                            Treetino V2
                                        </h4>
                                        <div class="text-sm">
                                            From &euro; 55 000
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-1 flex xl:col-span-2">
                    <div
                        class="flex h-full w-full flex-col rounded-2xl border p-6 shadow-xl"
                    >
                        <div class="mt-auto">
                            <div class="mb-4">
                                <div class="grid grid-cols-1 md:grid-cols-2">
                                    <div class="">
                                        <div class="">Expected ROI</div>
                                        <div class="text-6xl">11 % p.a.</div>
                                    </div>

                                    <div class="">
                                        <div class="">
                                            Full Investment Return
                                        </div>
                                        <div class="text-6xl">10 years</div>
                                    </div>
                                </div>
                            </div>

                            <div class="w-full">
                                <ButtonPrimary class="w-full text-center"
                                    >Odeslat Poptávku</ButtonPrimary
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
