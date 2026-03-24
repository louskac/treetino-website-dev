<template>
    <section
        class="claims relative mx-auto max-w-[1400px] pb-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
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

            <div class="col-span-1 flex w-full grid-cols-3 gap-6 lg:col-span-3">
                <div class="col-span-1 flex w-full flex-col">
                    <div class="w-full border-t border-t-primary py-4">
                        <div class="number flex gap-1 text-6xl">
                            <Leaf stroke-width="2" class="my-auto h-12 w-12" />
                            <div class="my-auto">300</div>
                        </div>
                        <div class="pt-1">
                            Of our State of the Art Solar Leaves
                        </div>
                    </div>

                    <div class="w-full border-t border-t-primary py-4">
                        <div class="number flex gap-1 text-6xl">
                            <Wind stroke-width="2" class="my-auto h-12 w-12" />
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
                            Perfectly Tuned Output to Match Government Subsidy
                            Regulations
                        </div>
                    </div>

                    <div class="w-full border-t border-t-primary py-4">
                        <div class="number flex gap-1 text-6xl">
                            <Cube stroke-width="2" class="my-auto h-12 w-12" />
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
                            <Home stroke-width="2" class="my-auto h-12 w-12" />
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
</template>

<script setup lang="ts">
import {
    Asterisk,
    Cube,
    Home,
    Leaf,
    TwoPointsCircle,
    Wind,
} from '@iconoir/vue';
</script>
