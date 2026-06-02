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
                                    class="h-full w-full object-cover scale-[.99]"
                                    src="/img/treetino-app.png"
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
                            class="absolute right-[5%] bottom-58 z-3 w-60 rounded-2xl border border-black/20 bg-white/20 p-3 shadow-lg backdrop-blur-xl"
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
                                        class="text-xs tracking-tight text-white opacity-70"
                                    >
                                        Performance
                                    </div>
                                    <div class="tracking-tight text-white">
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
                            class="absolute bottom-32 left-[5%] z-3 w-60 rounded-2xl border border-black/20 bg-white/20 p-3 shadow-lg backdrop-blur-xl"
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
                                        class="text-xs tracking-tight text-white opacity-70"
                                    >
                                        Weather Warning
                                    </div>
                                    <div class="tracking-tight text-white">
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
                            Treetino <br />
                            <span class="text-t-blue">Ve vaší kapse </span>
                        </h2>

                        <div class="mb-6">
                            <p class="opacity-70">
                                <!--                                Monitor live energy production, control the-->
                                <!--                                light show, recieve maintenance alerts and-->
                                <!--                                access detailed historical reports. All from our-->
                                <!--                                intuitive Treetino app for iOS and Android-->

                                Mějte dokonalý přehled. Sledujte výrobu energie
                                v reálném čase, ovládejte světelnou show,
                                přijímejte upozornění na údržbu a prohlížejte si
                                detailní historické reporty. To vše z naší
                                intuitivní aplikace Treetino pro iOS a Android.
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
                                        Živý přehled energie
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Aktuální výkon, denní součty a rozdělení
                                        podle zdrojů energie.
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
                                        Integrace počasí
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Předpověď produkce a automatická
                                        varování na základě lokálního počasí.
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
                                        Ovládání světelné show
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Navrhujte a plánujte vlastní barevné
                                        scény pro osvětlení stromu.
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
                                        Historické reporty
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Přehledné statistiky výkonu za měsíc,
                                        rok i celou dobu provozu.
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
                                        Chytrá upozornění
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Automatické připomínky údržby a
                                        notifikace o nestandardních stavech.
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
                                        Vzdálená konfigurace
                                    </div>
                                    <div
                                        class="text-xs tracking-tight opacity-70"
                                    >
                                        Upravujte úhly natáčení větví a další
                                        systémové předvolby na dálku.
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="hidden items-center lg:flex">
                            <span class="inline-block rounded-full border border-black/20 px-5 py-2 text-sm font-medium tracking-wide opacity-60">Coming Soon on App Store and Google Play</span>
                        </div>

                        <div class="mt-6 hidden text-xs opacity-70 lg:block">
                            Projected availability Q4 2026. Pre-registration and
                            beta is available for pre-ordered units
                        </div>

                        <div class="flex justify-center lg:hidden">
                            <span class="inline-block rounded-full border border-black/20 px-5 py-2 text-sm font-medium tracking-wide opacity-60">Coming Soon</span>
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
} from '@iconoir/vue';
import { useParallax } from '@/composables/useAnimations';

const { el: leftCard, translateY: leftTranslateY } = useParallax(0.05);
const { el: rightCard, translateY: rightTranslateY } = useParallax(0.1);
</script>
