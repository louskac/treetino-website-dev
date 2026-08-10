<template>
    <Head title="Větrná Turbína | Treetino" />

    <DefaultLayout :scroll="true">
        <!-- Hero Section - Clean & Minimalist (Identical structure to Homepage Hero) -->
        <section class="hero relative h-screen w-full bg-zinc-950">
            <div class="pointer-events-none absolute inset-0">
                <video
                    poster="/img/hero-images/poster-turbine_2.1.1.webp"
                    class="h-full w-full object-cover"
                    muted
                    loop
                    playsinline
                    webkit-playsinline
                    autoplay
                    preload="auto"
                >
                    <source
                        src="/video/hero-turbine-cine-noaudio.webm"
                        type="video/webm"
                    />
                </video>
            </div>

            <!-- Soft Bottom Gradient Overlay for Text Contrast & Smooth Transition -->
            <div
                class="pointer-events-none absolute bottom-0 h-100 w-full bg-linear-to-b from-transparent to-black"
            ></div>

            <div
                class="relative mx-auto flex h-full w-full max-w-[1400px] flex-col px-6 pb-28 text-white sm:w-[500px] sm:pb-24 sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="mt-auto">
                    <div
                        class="text-sm font-semibold tracking-[0.25em] text-white/70 uppercase lg:text-base"
                    >
                        {{ $t('products.turbine.audience') }}
                    </div>

                    <h1
                        class="mt-2 text-6xl font-medium tracking-tight text-white sm:text-7xl lg:text-8xl"
                    >
                        {{ $t('products.turbine.title') }}
                    </h1>

                    <p
                        class="mt-4 max-w-2xl text-base text-white/80 sm:text-lg lg:text-xl"
                    >
                        {{ $t('products.turbine.lead') }}
                    </p>

                    <div class="mt-8 flex items-center gap-4">
                        <ButtonPrimary
                            :href="route('configurator.product', 'turbina')"
                            class="px-7 py-3 text-sm font-semibold sm:text-base"
                        >
                            {{ $t('common.actions.configure') }}
                        </ButtonPrimary>
                        <ButtonWhite
                            href="#numbers"
                            class="px-6 py-3 text-sm font-medium sm:text-base"
                        >
                            {{ $t('home.numbers.title') }}
                        </ButtonWhite>
                    </div>
                </div>
            </div>
        </section>

        <!-- Informace & čísla (Databook Stats Grid) -->
        <section
            id="numbers"
            class="relative bg-white py-20 text-black dark:bg-zinc-950 dark:text-white scroll-mt-24"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <!-- Stats Grid -->
                <div
                    class="grid grid-cols-1 gap-12 pt-4 lg:grid-cols-3 2xl:grid-cols-4"
                >
                    <div class="col-span-1 flex flex-col">
                        <span
                            class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                            >{{ $t('home.features.key_parameters', 'Klíčové Parametry') }}</span
                        >
                        <h2
                            class="mt-3 text-4xl font-medium leading-tight lg:text-5xl"
                        >
                            {{ $t('products.turbine.numbers_title') }}
                        </h2>
                        <p class="mt-4 text-sm text-black/70 dark:text-white/70">
                            {{ $t('products.turbine.numbers_description') }}
                        </p>
                        <div class="mt-auto pt-6">
                            <ButtonPrimary
                                :href="route('configurator.product', 'turbina')"
                                class="w-full text-center"
                            >
                                {{ $t('products.turbine.configure_label') }}
                            </ButtonPrimary>
                        </div>
                    </div>

                    <div
                        class="col-span-1 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-2 lg:border-l lg:border-black/10 lg:pl-12 2xl:col-span-3 dark:lg:border-white/10"
                    >
                        <div
                            v-for="stat in productStats"
                            :key="stat.label + stat.value"
                        >
                            <div class="mb-2 flex items-center gap-3">
                                <div
                                    class="flex aspect-square h-12 w-12 shrink-0 rounded-xl bg-t-blue/10 text-t-blue dark:bg-white/10 dark:text-white"
                                >
                                    <component
                                        :is="stat.icon"
                                        class="m-auto h-6 w-6"
                                        stroke-width="1.5"
                                    />
                                </div>
                                <div
                                    class="text-2xl font-medium text-black whitespace-nowrap dark:text-white sm:text-3xl lg:text-3xl xl:text-4xl"
                                >
                                    {{ stat.valueKey ? $t(stat.valueKey, stat.value) : stat.value }}
                                </div>
                            </div>
                            <div class="text-sm opacity-75">
                                {{ $t(stat.descriptionKey, stat.description) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Design 3: Borderless Minimalist List Highlights Section -->
        <section class="border-y border-black/10 bg-stone-50/50 py-20 text-black dark:border-white/10 dark:bg-stone-900/40 dark:text-white">
            <div class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]">
                <div class="mb-14 text-center">
                    <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">{{ $t('products.turbine.tech.tag') }}</span>
                    <h2 class="mt-2 text-3xl font-medium sm:text-4xl lg:text-5xl">{{ $t('products.turbine.tech.title') }}</h2>
                </div>

                <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
                    <div class="border-l border-black/15 pl-6 dark:border-white/15">
                        <div class="text-3xl font-semibold tracking-tight text-black dark:text-white lg:text-4xl">1.8 m/s</div>
                        <h3 class="mt-2 text-base font-semibold text-black dark:text-white">{{ $t('products.turbine.tech.item1_title') }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65">{{ $t('products.turbine.tech.item1_text') }}</p>
                    </div>

                    <div class="border-l border-black/15 pl-6 dark:border-white/15">
                        <div class="text-3xl font-semibold tracking-tight text-black dark:text-white lg:text-4xl">{{ $t('products.turbine.stats_val.4') }}</div>
                        <h3 class="mt-2 text-base font-semibold text-black dark:text-white">{{ $t('products.turbine.tech.item2_title') }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65">{{ $t('products.turbine.tech.item2_text') }}</p>
                    </div>

                    <div class="border-l border-black/15 pl-6 dark:border-white/15">
                        <div class="text-3xl font-semibold tracking-tight text-black dark:text-white lg:text-4xl">{{ $t('products.turbine.stats_val.2') }}</div>
                        <h3 class="mt-2 text-base font-semibold text-black dark:text-white">{{ $t('products.turbine.tech.item3_title') }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65">{{ $t('products.turbine.tech.item3_text') }}</p>
                    </div>

                    <div class="border-l border-black/15 pl-6 dark:border-white/15">
                        <div class="text-3xl font-semibold tracking-tight text-black dark:text-white lg:text-4xl">2 {{ $t('products.datasheet.val_months') }}</div>
                        <h3 class="mt-2 text-base font-semibold text-black dark:text-white">{{ $t('products.turbine.tech.item4_title') }}</h3>
                        <p class="mt-2 text-sm leading-relaxed text-black/65 dark:text-white/65">{{ $t('products.turbine.tech.item4_text') }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Feature Showcase 1: Picture Section (No Border) -->
        <section
            class="relative bg-white py-24 text-black dark:bg-black dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="relative overflow-hidden rounded-3xl bg-black shadow-2xl">
                    <div class="relative h-[500px] w-full overflow-hidden">
                        <img
                            src="/img/stills/Still_Turbina.png"
                            alt="Turbína"
                            class="h-full w-full object-cover object-center transition-transform duration-1000 ease-out hover:scale-105"
                        />
                        <div class="absolute inset-0 bg-linear-to-r from-black/90 via-black/45 to-transparent"></div>
                    </div>

                    <div class="absolute inset-y-0 left-0 flex items-center p-8 sm:p-14 lg:w-7/12">
                        <div class="max-w-xl">
                            <span class="inline-block rounded-full bg-white/10 px-4 py-1 text-xs font-semibold tracking-[0.2em] text-white uppercase backdrop-blur-md">
                                {{ $t('products.turbine.showcase1.tag') }}
                            </span>
                            <h3 class="mt-4 text-3xl font-medium text-white sm:text-4xl lg:text-5xl">
                                {{ $t('products.turbine.showcase1.title') }}
                            </h3>
                            <p class="mt-4 text-base leading-relaxed text-white/85 sm:text-lg">
                                {{ $t('products.turbine.showcase1.lead') }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Feature Showcase 2: Signature V2 Design Element -->
        <section
            class="relative bg-stone-50 py-24 text-black dark:bg-stone-900/50 dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div
                    class="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-center"
                >
                    <!-- Signature Design Element -->
                    <div class="relative overflow-hidden border-t-4 border-l-4 border-t-t-blue border-l-t-blue bg-black shadow-2xl">
                        <div class="relative aspect-4/3 overflow-hidden">
                            <img
                                src="/img/info/info-turbine-w.webp"
                                alt="Turbína"
                                class="h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                            />
                            <!-- 2-Line Stacked Typography Overlay (AERO / 24/7) -->
                            <div class="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 bg-linear-to-t from-black/85 via-black/20 to-transparent">
                                <span class="text-5xl font-black tracking-tight text-white leading-none uppercase sm:text-7xl lg:text-8xl drop-shadow-2xl">
                                    AERO
                                </span>
                                <span class="text-5xl font-black tracking-tight text-white leading-none uppercase sm:text-7xl lg:text-8xl drop-shadow-2xl mt-1">
                                    24/7
                                </span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span
                            class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                            >{{ $t('products.turbine.showcase2.tag') }}</span
                        >
                        <h2
                            class="mt-3 text-4xl font-medium text-black dark:text-white sm:text-5xl"
                        >
                            {{ $t('products.turbine.showcase2.title') }}
                        </h2>
                        <p
                            class="mt-6 text-lg leading-relaxed text-black/75 dark:text-white/75"
                        >
                            {{ $t('products.turbine.showcase2.text') }}
                        </p>
                        <div class="mt-8 grid grid-cols-3 gap-4">
                            <div
                                class="border-l-2 border-t-blue pl-4 bg-white/60 p-4 shadow-xs dark:bg-white/5"
                            >
                                <div class="font-bold text-t-blue">{{ $t('products.turbine.showcase2.pole') }}</div>
                                <div
                                    class="mt-1 text-xs text-black/70 dark:text-white/70"
                                >
                                    {{ $t('products.turbine.showcase2.pole_sub') }}
                                </div>
                            </div>
                            <div
                                class="border-l-2 border-t-blue pl-4 bg-white/60 p-4 shadow-xs dark:bg-white/5"
                            >
                                <div class="font-bold text-t-blue">{{ $t('products.turbine.showcase2.wall') }}</div>
                                <div
                                    class="mt-1 text-xs text-black/70 dark:text-white/70"
                                >
                                    {{ $t('products.turbine.showcase2.wall_sub') }}
                                </div>
                            </div>
                            <div
                                class="border-l-2 border-t-blue pl-4 bg-white/60 p-4 shadow-xs dark:bg-white/5"
                            >
                                <div class="font-bold text-t-blue">{{ $t('products.turbine.showcase2.roof') }}</div>
                                <div
                                    class="mt-1 text-xs text-black/70 dark:text-white/70"
                                >
                                    {{ $t('products.turbine.showcase2.roof_sub') }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Technical Specifications Datasheet Table Section -->
        <section
            id="specifications"
            class="scroll-mt-24 border-t border-black/10 bg-white py-24 text-black dark:bg-black dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="mb-12">
                    <span
                        class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                        >{{ $t('products.datasheet.tag') }}</span
                    >
                    <h2 class="mt-2 text-4xl font-medium">
                        {{ $t('products.turbine.numbers_title') }} (1 – 3 kW)
                    </h2>
                </div>

                <div
                    class="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10"
                >
                    <table class="w-full text-left text-sm">
                        <tbody
                            class="divide-y divide-black/10 dark:divide-white/10"
                        >
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">{{ $t('products.datasheet.model') }}</td>
                                <td class="px-6 py-4 opacity-80">
                                    Treetino Wind Turbine (Aero Series)
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.turbine.stats.1') }}
                                </td>
                                <td class="px-6 py-4 opacity-80 font-bold text-t-blue">
                                    1.0 kW / 1.5 kW / 3.0 kW
                                </td>
                            </tr>
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">
                                    48 V
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    1 kW (20.83 A) / 1.5 kW (31.25 A) / 3 kW (62.50 A)
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.dimensions') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    1 kW (36 kg) / 1.5 kW (48 kg) / 3 kW (73 kg)
                                </td>
                            </tr>
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.dimensions') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    2,80 m / 0,90 m / 0,35 m
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.wind_speed') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    1,8 m/s / 13,8 m/s (21 %)
                                </td>
                            </tr>
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.turbine.showcase2.title') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    {{ $t('products.turbine.stats.5') }}
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.turbine.tech.item4_title') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    {{ $t('products.datasheet.val_2months') }}
                                </td>
                            </tr>
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.turbine.stats.6') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    {{ $t('products.datasheet.val_turbine_warranty') }}
                                </td>
                            </tr>
                            <tr>
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.warranty_elec') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    {{ $t('products.datasheet.val_elec_warranty') }}
                                </td>
                            </tr>
                            <tr class="bg-black/5 dark:bg-white/5">
                                <td class="px-6 py-4 font-semibold">
                                    {{ $t('products.datasheet.cert') }}
                                </td>
                                <td class="px-6 py-4 opacity-80">
                                    ČSN EN 1991-1-4, ČSN EN 61400-2, ČSN EN 1993-1-1, ČSN EN 62305, ČSN EN 61215, ČSN EN 61730
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>

        <!-- Product Redirect / Navigation Section (Placed at the bottom) -->
        <section
            class="border-t border-black/10 bg-stone-50 py-20 text-black dark:border-white/10 dark:bg-zinc-950 dark:text-white"
        >
            <div
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="mb-8 text-center">
                    <span
                        class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                        >{{ $t('products.portfolio.tag') }}</span
                    >
                    <h2 class="mt-2 text-3xl font-medium sm:text-4xl">
                        {{ $t('products.portfolio.title') }}
                    </h2>
                    <p class="mt-2 text-sm opacity-70">
                        {{ $t('products.portfolio.description') }}
                    </p>
                </div>

                <!-- Preview Image Container with rounded-3xl & border -->
                <div
                    class="relative aspect-3/2 overflow-hidden rounded-3xl border border-black/10 bg-stone-100 shadow-2xl lg:aspect-3/1 dark:border-white/10 dark:bg-stone-900"
                >
                    <img
                        :src="previewImage"
                        alt="Portfolio Treetino Větrná Turbína"
                        class="h-full w-full object-cover transition-all duration-500"
                    />

                    <!-- Floating Navigation Pills -->
                    <div
                        class="absolute inset-x-0 bottom-6 flex justify-center px-6"
                    >
                        <div
                            class="inline-flex gap-2 rounded-full border border-black/10 bg-white/90 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90"
                        >
                            <Link
                                :href="route('products.treeV1')"
                                @mouseenter="hoveredProduct = 'v1'"
                                @mouseleave="hoveredProduct = null"
                                class="flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium text-black/70 transition-all hover:bg-black/5 hover:text-black sm:text-sm dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                <span>{{ $t('products.v1.title') }}</span>
                                <ArrowRight class="h-3.5 w-3.5" />
                            </Link>

                            <Link
                                :href="route('products.treeV2')"
                                @mouseenter="hoveredProduct = 'v2'"
                                @mouseleave="hoveredProduct = null"
                                class="flex items-center gap-2 rounded-full px-5 py-2 text-xs font-medium text-black/70 transition-all hover:bg-black/5 hover:text-black sm:text-sm dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
                            >
                                <span>{{ $t('products.v2.title') }}</span>
                                <ArrowRight class="h-3.5 w-3.5" />
                            </Link>

                            <Link
                                :href="route('products.turbine')"
                                @mouseenter="hoveredProduct = 'turbine'"
                                @mouseleave="hoveredProduct = null"
                                class="flex items-center gap-2 rounded-full bg-t-blue px-5 py-2 text-xs font-medium text-white shadow-md sm:text-sm"
                            >
                                <span>{{ $t('products.turbine.title') }}</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Reused Shared HomeCtaGeneric Component with Prominent Configurator CTA Button -->
        <HomeCtaGeneric
            :title="$t('products.turbine.cta_title')"
            :buttonText="$t('products.turbine.configure_label')"
            :buttonHref="route('configurator.product', 'turbina')"
            image1="/img/stills/Still_Turbina.png"
            image2="/img/info/info-turbine-w.webp"
        />
    </DefaultLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {
    ArrowRight,
    Clock,
    Cube,
    Flash,
    MapPin,
    ShieldCheck,
    Wind,
} from '@iconoir/vue';
import { Head, Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';
import HomeCtaGeneric from '@/custom/home/HomeCtaGeneric.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const hoveredProduct = ref<string | null>(null);

const previewImage = computed(() => {
    const p = hoveredProduct.value || 'turbine';
    if (p === 'v1') return '/img/info/night-detail-w.jpg';
    if (p === 'v2') return '/img/info/info-strom-v2-w.webp';
    return '/img/info/info-turbine-w.webp';
});

const productStats = [
    {
        icon: Flash,
        value: '1 – 3 kW',
        valueKey: 'products.turbine.stats_val.1',
        label: 'Výkonové varianty',
        description: 'Max. výkon jedné turbíny',
        descriptionKey: 'products.turbine.stats.1',
    },
    {
        icon: MapPin,
        value: '3 varianty',
        valueKey: 'products.turbine.stats_val.2',
        label: 'Montáž',
        description: 'Tichý provoz s nízkým startem',
        descriptionKey: 'products.turbine.stats.2',
    },
    {
        icon: Wind,
        value: '1,8 m/s',
        valueKey: 'products.turbine.stats_val.3',
        label: 'Startovací vítr',
        description: 'Odolnost vůči větru až 45 m/s',
        descriptionKey: 'products.turbine.stats.3',
    },
    {
        icon: ShieldCheck,
        value: 'Bezpečné',
        valueKey: 'products.turbine.stats_val.4',
        label: 'Ochrana ptactva',
        description: 'Transparentní polymerový design',
        descriptionKey: 'products.turbine.stats.4',
    },
    {
        icon: Clock,
        value: '2 měsíce',
        valueKey: 'products.turbine.stats_val.5',
        label: 'Rychlost výstavby',
        description: 'Snadná montáž na stožár i střechu',
        descriptionKey: 'products.turbine.stats.5',
    },
    {
        icon: Cube,
        value: '3 roky',
        valueKey: 'products.turbine.stats_val.6',
        label: 'Záruka turbíny',
        description: 'Bezúdržbový provoz s životností 20 let',
        descriptionKey: 'products.turbine.stats.6',
    },
];
</script>
