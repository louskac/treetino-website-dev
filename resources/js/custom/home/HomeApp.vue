<template>
    <section class="app-showcase relative">
        <div
            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 [mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
        ></div>

        <div
            class="relative mx-auto w-full max-w-[1400px] pt-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div
                class="grid grid-cols-1 gap-6 p-6 lg:grid-cols-2 xl:grid-cols-5 xl:gap-12"
            >
                <div class="col-span-1 flex flex-col xl:col-span-2">
                    <div class="relative my-auto w-full">
                        <div class="relative mx-auto w-[65%]">
                            <!-- App screenshot positioned to show through the frame's screen area -->
                            <div
                                class="absolute inset-x-[4%] top-[2%] bottom-[2%] z-1 overflow-hidden rounded-[6vw] sm:rounded-[5vw] md:rounded-[6vw] lg:rounded-[3vw] xl:rounded-[2vw]"
                            >
                                <img
                                    class="h-full w-full object-cover"
                                    src="/img/app-placeholder.jpg"
                                    alt=""
                                />
                            </div>
                            <!-- iPhone 17 frame overlay -->
                            <img
                                src="/img/iphone-17-frame.png"
                                class="relative z-2 w-full"
                                alt=""
                            />
                        </div>

                        <!-- RIGHT CARD -->
                        <!-- Vignette -->
                        <div
                            class="absolute right-[5%] bottom-58 z-3 w-60 p-3"
                            ref="rightVignette"
                            :style="{
                                transform:
                                    'translateY(' + rightTranslateY + 'px)',
                            }"
                        >
                            <div class="flex w-full gap-3">
                                <div
                                    class="flex aspect-square w-12 rounded-xl bg-green-600 text-white"
                                ></div>
                            </div>
                        </div>

                        <!-- Card -->
                        <div
                            class="absolute right-[5%] bottom-58 z-3 w-60 rounded-2xl border border-black/20 bg-white/30 p-3 shadow-lg backdrop-blur-xl"
                            ref="rightCard"
                            :style="{
                                transform:
                                    'translateY(' + rightTranslateY + 'px)',
                            }"
                        >
                            <div class="flex w-full gap-3">
                                <div
                                    class="flex aspect-square w-12 rounded-xl bg-green-600 text-white"
                                >
                                    <LightBulb
                                        stroke-width="2.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <div class="my-auto">
                                    <div
                                        class="text-xs tracking-tight text-black opacity-70"
                                    >
                                        Performance
                                    </div>
                                    <div class="tracking-tight text-black">
                                        44.1 kW at 90 %
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT CARD -->
                        <!-- Vignette -->
                        <div
                            class="absolute bottom-32 left-[5%] z-3 w-60 p-3"
                            ref="leftVignette"
                            :style="{
                                transform:
                                    'translateY(' + leftTranslateY + 'px)',
                            }"
                        >
                            <div class="flex w-full gap-3">
                                <div
                                    class="flex aspect-square w-12 rounded-xl bg-purple-700 text-white"
                                ></div>
                            </div>
                        </div>

                        <!-- Card -->
                        <div
                            class="absolute bottom-32 left-[5%] z-3 w-60 rounded-2xl border border-black/20 bg-white/30 p-3 shadow-lg backdrop-blur-xl"
                            ref="leftCard"
                            :style="{
                                transform:
                                    'translateY(' + leftTranslateY + 'px)',
                            }"
                        >
                            <div class="flex w-full gap-3">
                                <div
                                    class="flex aspect-square w-12 rounded-xl bg-purple-700 text-white"
                                >
                                    <Thunderstorm
                                        stroke-width="2.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <div class="my-auto">
                                    <div
                                        class="text-xs tracking-tight text-black opacity-70"
                                    >
                                        Weather Warning
                                    </div>
                                    <div class="tracking-tight text-black">
                                        Safe Mode Started
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="col-span-1 flex xl:col-span-3">
                    <div class="my-auto">
                        <h2 class="mb-6 text-6xl">
                            Your Treetino <br />
                            <span class="text-t-blue">In Your Pocket </span>
                        </h2>

                        <div class="mb-6">
                            <p class="opacity-70">
                                Monitor live energy production, control the
                                light show, recieve maintenance alerts and
                                access detailed historical reports. All from our
                                intuitive Treetino app for iOS and Android
                            </p>
                        </div>

                        <div
                            class="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-2"
                        >
                            <div class="flex h-fit w-full gap-3">
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                                >
                                    <Flash
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <div class="my-auto">
                                    <div class="mb-1 leading-5 tracking-tight">
                                        Live Energy Dashboard
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Real-time wattage, daily totals and
                                        source split
                                    </div>
                                </div>
                            </div>

                            <div class="flex h-fit w-full gap-3">
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                                >
                                    <CloudSunny
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <div class="my-auto">
                                    <div class="mb-1 leading-5 tracking-tight">
                                        Weather Integration
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Production forecast and warnings based
                                        on local weather
                                    </div>
                                </div>
                            </div>

                            <div class="flex h-fit w-full gap-3">
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                                >
                                    <Sparks
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <div class="my-auto">
                                    <div class="mb-1 leading-5 tracking-tight">
                                        Light Show Control
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Design and Schedule custom lighting
                                        scenes
                                    </div>
                                </div>
                            </div>

                            <div class="flex h-fit w-full gap-3">
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                                >
                                    <StatsReport
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <div class="my-auto">
                                    <div class="mb-1 leading-5 tracking-tight">
                                        Historical Reports
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Monthly, Yearly and lifetime performance
                                        reports
                                    </div>
                                </div>
                            </div>

                            <div class="flex h-fit w-full gap-3">
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                                >
                                    <BellNotification
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <div class="my-auto">
                                    <div class="mb-1 leading-5 tracking-tight">
                                        Smart Alerts
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Maintenance reminders and anomaly
                                        notifications
                                    </div>
                                </div>
                            </div>

                            <div class="flex h-fit w-full gap-3">
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                                >
                                    <DimmerSwitch
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <div class="my-auto">
                                    <div class="mb-1 leading-5 tracking-tight">
                                        Remote Configuration
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Adjust tracking angles and system
                                        preferences remotely
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="hidden gap-6 lg:flex">
                            <div
                                class="button-app flex gap-4 rounded-2xl bg-black p-4 text-white dark:bg-white dark:text-black"
                            >
                                <AppStore
                                    class="my-auto h-8 w-8"
                                    stroke-width="2"
                                />

                                <div class="my-auto">
                                    <div
                                        class="mb-0.5 text-xs leading-3 tracking-tight opacity-70"
                                    >
                                        Download on the
                                    </div>
                                    <div
                                        class="leading-4 font-semibold tracking-tight"
                                    >
                                        App Store
                                    </div>
                                </div>
                            </div>

                            <div
                                class="button-app flex gap-4 rounded-2xl bg-black p-4 text-white dark:bg-white dark:text-black"
                            >
                                <DownloadCircle
                                    class="my-auto h-8 w-8"
                                    stroke-width="2"
                                />

                                <div class="my-auto">
                                    <div
                                        class="mb-0.5 text-xs leading-3 tracking-tight opacity-70"
                                    >
                                        Download on the
                                    </div>
                                    <div
                                        class="leading-4 font-semibold tracking-tight"
                                    >
                                        Google Play Store
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="mt-6 hidden text-xs opacity-70 lg:block">
                            Projected availability Q4 2026. Pre-registration and
                            beta is available for pre-ordered units
                        </div>

                        <div class="grid gap-3 lg:hidden">
                            <div
                                class="button-app flex gap-4 rounded-2xl bg-black p-4 text-white dark:bg-white dark:text-black"
                            >
                                <AppStore
                                    class="my-auto h-8 w-8"
                                    stroke-width="2"
                                />

                                <div class="my-auto">
                                    <div
                                        class="mb-0.5 text-xs leading-3 tracking-tight opacity-70"
                                    >
                                        Download on the
                                    </div>
                                    <div
                                        class="leading-4 font-semibold tracking-tight"
                                    >
                                        App Store
                                    </div>
                                </div>
                            </div>

                            <div
                                class="button-app flex gap-4 rounded-2xl bg-black p-4 text-white dark:bg-white dark:text-black"
                            >
                                <DownloadCircle
                                    class="my-auto h-8 w-8"
                                    stroke-width="2"
                                />

                                <div class="my-auto">
                                    <div
                                        class="mb-0.5 text-xs leading-3 tracking-tight opacity-70"
                                    >
                                        Download on the
                                    </div>
                                    <div
                                        class="leading-4 font-semibold tracking-tight"
                                    >
                                        Google Play Store
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div
                            class="mt-6 block text-center text-xs opacity-70 lg:hidden"
                        >
                            Projected availability Q4 2026. Pre-registration and
                            beta is available for pre-ordered units
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {
    Thunderstorm,
    LightBulb,
    Flash,
    CloudSunny,
    Sparks,
    StatsReport,
    BellNotification,
    DimmerSwitch,
    AppStore,
    DownloadCircle,
} from '@iconoir/vue';
import { useParallax } from '@/composables/useAnimations';

const { el: leftCard, translateY: leftTranslateY } = useParallax(0.05);
const { el: rightCard, translateY: rightTranslateY } = useParallax(0.1);
</script>
