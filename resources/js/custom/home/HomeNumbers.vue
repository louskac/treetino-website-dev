<template>
    <section
        class="claims relative mx-auto max-w-[1400px] pb-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
    >
        <div class="mx-6 aspect-3/1 overflow-hidden rounded-2xl sm:mx-0 shadow-lg">
            <img
                class="h-full w-full object-cover"
                src="https://picsum.photos/1500/500"
                alt=""
            />
        </div>

        <div class="mx-6 grid grid-cols-1 gap-12 pt-12 sm:mx-0 lg:grid-cols-3 2xl:grid-cols-4">
            <div class="col-span-1 flex flex-col">
                <div class="relative z-10 flex items-center justify-between">
                    <span
                        class="text-xs font-semibold tracking-[0.2em] text-black/60 uppercase"
                        >Treetino v1</span
                    >
                </div>

                <h2 class="text-4xl 2xl:text-6xl mt-3 leading-9 2xl:leading-14">
                    Information &&nbsp;Numbers
                </h2>

                <div class="mt-auto pt-6">
                    <ButtonPrimary class="w-full">Configure</ButtonPrimary>
                </div>
            </div>

            <div
                class="col-span-1 grid grid-cols-2 gap-6 lg:border-l lg:pl-12 lg:col-span-2 lg:grid-cols-2 2xl:grid-cols-3 2xl:col-span-3"
            >
                <div class="">
                    <div class="mb-2 flex gap-3">
                        <div
                            class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                        >
                            <Leaf
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                        <div class="my-auto text-4xl">300</div>
                    </div>

                    <div class="pt-1 opacity-70">
                        Of our State of the Art Solar Leaves
                    </div>
                </div>

                <div class="">
                    <div class="mb-2 flex gap-3">
                        <div
                            class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                        >
                            <Wind
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                        <div class="my-auto text-4xl">12</div>
                    </div>

                    <div class="pt-1 opacity-70">
                        Transparent Wind Turbines Generating Electricity Even at
                        Nights
                    </div>
                </div>

                <div class="">
                    <div class="mb-2 flex gap-3">
                        <div
                            class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                        >
                            <Asterisk
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                        <div class="my-auto text-4xl">49 kW</div>
                    </div>

                    <div class="pt-1 opacity-70">
                        Perfectly Tuned Output to Match Government Subsidy
                        Regulations
                    </div>
                </div>

                <div class="">
                    <div class="mb-2 flex gap-3">
                        <div
                            class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                        >
                            <Cube
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                        <div class="my-auto text-4xl">
                            300 m<sup class="font-semibold">2</sup>
                        </div>
                    </div>

                    <div class="pt-1 opacity-70">
                        Average Space Saved by Our Energy Solutions
                    </div>
                </div>

                <div class="">
                    <div class="mb-2 flex gap-3">
                        <div
                            class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                        >
                            <two-points-circle
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                        <div class="my-auto text-4xl">
                            1 m<sup class="font-semibold">2</sup>
                        </div>
                    </div>

                    <div class="pt-1 opacity-70">
                        Space Efficient &mdash; Picked to Fit European
                        no-license construction requirement
                    </div>
                </div>

                <div class="">
                    <div class="mb-2 flex gap-3">
                        <div
                            class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                        >
                            <Home
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                        <div class="my-auto text-4xl">60</div>
                    </div>

                    <div class="pt-1 opacity-70">
                        One Fixture powers up to 60 modern homes
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {
    Asterisk,
    Cube,
    Home,
    InfoCircle,
    Leaf,
    Sparks,
    TwoPointsCircle,
    Wind,
} from '@iconoir/vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
</script>
