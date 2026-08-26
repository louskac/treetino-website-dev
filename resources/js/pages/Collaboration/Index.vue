<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
import HomeCtaGeneric from '@/custom/home/HomeCtaGeneric.vue';
import { Download, ArrowRight } from 'lucide-vue-next';

const partners = [
    {
        name: 'CzechInvest',
        logo: '/partners/CzechInvest.png',
        url: 'https://www.czechinvest.org',
    },
    {
        name: 'ČVUT v Praze',
        logo: '/partners/cvut.svg',
        url: 'https://www.cvut.cz',
    },
    {
        name: 'Fyzikální ústav AV ČR',
        logo: '/partners/fzu.svg',
        url: 'https://www.fzu.cz',
    },
    {
        name: 'Středočeské inovační centrum',
        logo: '/partners/Sic.png',
        url: 'https://s-ic.cz',
    },
    {
        name: 'Start It @ ČSOB',
        logo: '/partners/startit.svg',
        url: 'https://startit.csob.cz',
    },
    {
        name: 'Make-it-on',
        logo: '/partners/Makeiton.png',
        url: 'https://make-it-on.cz',
    },
];
</script>

<template>
    <Head :title="$t('collaboration.title')" />

    <DefaultLayout :inverted="true">
        <div
            class="relative overflow-hidden bg-white pt-36 text-black selection:bg-t-blue selection:text-white sm:pt-44"
        >
            <!-- Ambient Boundary Lines Matching Site Layout -->
            <div
                class="pointer-events-none absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/10 border-l-black/10 sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            ></div>

            <main
                class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <!-- Hero Title Section -->
                <div class="border-b border-black/10 pb-16 sm:pb-20">
                    <span
                        class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                    >
                        {{ $t('collaboration.tag') }}
                    </span>
                    <h1
                        class="mt-3 text-4xl font-medium tracking-tight text-black sm:text-5xl lg:text-6xl"
                    >
                        {{ $t('collaboration.title') }}
                    </h1>
                    <p
                        class="mt-4 max-w-3xl text-lg leading-relaxed text-black/70 sm:text-xl"
                    >
                        {{ $t('collaboration.subtitle') }}
                    </p>
                </div>

                <!-- 1. FEATURED EDITORIAL STORY: Technologická inkubace & CzechInvest Grant (Split Layout matching HomeApp) -->
                <section class="border-b border-black/10 py-20 lg:py-28">
                    <div
                        class="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16"
                    >
                        <!-- Left Column: High-end Publicity Graphic -->
                        <div class="lg:col-span-5">
                            <div
                                class="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-8 text-white shadow-2xl sm:p-10"
                            >
                                <!-- Subtle Ambient Glow -->
                                <div
                                    class="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-t-blue/30 blur-3xl"
                                ></div>

                                <div
                                    class="relative z-10 flex min-h-[300px] flex-col justify-between"
                                >
                                    <div>
                                        <span
                                            class="inline-block rounded-full bg-t-blue px-3.5 py-1 text-xs font-semibold tracking-wider text-white uppercase"
                                        >
                                            EcoTech 2025
                                        </span>
                                        <div
                                            class="mt-6 text-3xl font-bold tracking-tight text-white sm:text-4xl"
                                        >
                                            {{
                                                $t(
                                                    'collaboration.grant_stat1_title',
                                                )
                                            }}
                                        </div>
                                        <div
                                            class="mt-1 text-sm font-medium text-white/70"
                                        >
                                            {{
                                                $t(
                                                    'collaboration.grant_card_subtitle',
                                                )
                                            }}
                                        </div>
                                    </div>

                                    <!-- Official CzechInvest Publicity Sticker Display -->
                                    <div
                                        class="mt-10 flex items-center justify-center rounded-2xl bg-white p-4 shadow-lg"
                                    >
                                        <img
                                            src="/partners/image.png"
                                            alt="Technologická inkubace | CzechInvest"
                                            class="h-auto max-h-16 w-full object-contain"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Typographic Details & Actions -->
                        <div class="lg:col-span-7">
                            <span
                                class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                            >
                                {{ $t('collaboration.grant_tag') }}
                            </span>
                            <h2
                                class="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl lg:text-5xl"
                            >
                                {{ $t('collaboration.grant_title') }}
                            </h2>
                            <p
                                class="mt-6 text-base leading-relaxed text-black/75 sm:text-lg"
                            >
                                {{ $t('collaboration.grant_desc') }}
                            </p>

                            <!-- Key Information Dividers (matching website design) -->
                            <div
                                class="mt-8 grid grid-cols-1 gap-6 border-t border-black/10 pt-8 sm:grid-cols-2"
                            >
                                <div class="border-l-2 border-t-blue pl-4">
                                    <div class="text-xl font-bold text-black">
                                        {{
                                            $t(
                                                'collaboration.grant_stat1_title',
                                            )
                                        }}
                                    </div>
                                    <div class="mt-1 text-sm text-black/70">
                                        {{
                                            $t('collaboration.grant_stat1_desc')
                                        }}
                                    </div>
                                </div>
                                <div class="border-l-2 border-black/20 pl-4">
                                    <div class="text-xl font-bold text-black">
                                        {{
                                            $t(
                                                'collaboration.grant_stat2_title',
                                            )
                                        }}
                                    </div>
                                    <div class="mt-1 text-sm text-black/70">
                                        {{
                                            $t('collaboration.grant_stat2_desc')
                                        }}
                                    </div>
                                </div>
                            </div>

                            <!-- CTA Actions -->
                            <div
                                class="mt-10 flex flex-wrap items-center gap-4"
                            >
                                <ButtonPrimary
                                    href="/grant.pdf"
                                    download="treetino-grant-technologicka-inkubace.pdf"
                                    target="_blank"
                                    class="text-center"
                                >
                                    <div class="flex items-center gap-2">
                                        <Download class="h-4 w-4" />
                                        <span>{{
                                            $t('collaboration.grant_download')
                                        }}</span>
                                    </div>
                                </ButtonPrimary>

                                <ButtonSecondary
                                    :href="route('contact.index')"
                                    class="text-center"
                                >
                                    <div class="flex items-center gap-2">
                                        <span>{{
                                            $t(
                                                'collaboration.grant_investors_btn',
                                            )
                                        }}</span>
                                        <ArrowRight class="h-4 w-4" />
                                    </div>
                                </ButtonSecondary>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- 2. PARTNERS & INNOVATION ECOSYSTEM (Clean Editorial Logo Strip matching Czech R&D) -->
                <section class="border-b border-black/10 py-20">
                    <div class="mx-auto max-w-2xl text-center">
                        <span
                            class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                        >
                            {{ $t('collaboration.partners_tag') }}
                        </span>
                        <h2
                            class="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl"
                        >
                            {{ $t('collaboration.partners_title') }}
                        </h2>
                        <p class="mt-3 text-base text-black/70">
                            {{ $t('collaboration.partners_desc') }}
                        </p>
                    </div>

                    <!-- Clean Logo Grid without bubble boxes -->
                    <div
                        class="mt-12 grid grid-cols-2 items-center justify-items-center gap-8 sm:grid-cols-3 lg:grid-cols-6"
                    >
                        <a
                            v-for="partner in partners"
                            :key="partner.name"
                            :href="partner.url"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="group flex h-24 w-full items-center justify-center p-3 transition-transform duration-300 hover:scale-105"
                            :title="partner.name"
                        >
                            <img
                                :src="partner.logo"
                                :alt="partner.name"
                                class="max-h-12 max-w-[130px] object-contain transition-all duration-300"
                            />
                        </a>
                    </div>
                </section>

                <!-- 3. COLLABORATION PILLARS (Clean Columns with Vertical Dividers matching Czech R&D) -->
                <section class="py-20 lg:py-28">
                    <div class="mb-14">
                        <span
                            class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                        >
                            {{ $t('collaboration.pillars_tag') }}
                        </span>
                        <h2
                            class="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl lg:text-5xl"
                        >
                            {{ $t('collaboration.pillars_title') }}
                        </h2>
                    </div>

                    <div
                        class="grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-10"
                    >
                        <!-- Column 1: Client Subsidies -->
                        <div
                            class="flex flex-col justify-between border-l-2 border-black/10 pl-6 lg:pl-8"
                        >
                            <div>
                                <div
                                    class="text-3xl font-bold tracking-tight text-black sm:text-4xl"
                                >
                                    {{ $t('collaboration.client_grants_stat') }}
                                </div>
                                <h3 class="mt-3 text-xl font-medium text-black">
                                    {{
                                        $t('collaboration.client_grants_title')
                                    }}
                                </h3>
                                <p
                                    class="mt-3 text-sm leading-relaxed text-black/70 sm:text-base"
                                >
                                    {{ $t('collaboration.client_grants_desc') }}
                                </p>
                            </div>
                            <div class="mt-8">
                                <ButtonSecondary
                                    :href="route('contact.index')"
                                    class="w-full text-center"
                                >
                                    {{
                                        $t('collaboration.client_grants_action')
                                    }}
                                </ButtonSecondary>
                            </div>
                        </div>

                        <!-- Column 2: Engineering & R&D -->
                        <div
                            class="flex flex-col justify-between border-l-2 border-black/10 pl-6 lg:pl-8"
                        >
                            <div>
                                <div
                                    class="text-3xl font-bold tracking-tight text-black sm:text-4xl"
                                >
                                    {{ $t('collaboration.engineering_stat') }}
                                </div>
                                <h3 class="mt-3 text-xl font-medium text-black">
                                    {{ $t('collaboration.engineering_title') }}
                                </h3>
                                <p
                                    class="mt-3 text-sm leading-relaxed text-black/70 sm:text-base"
                                >
                                    {{ $t('collaboration.engineering_desc') }}
                                </p>
                            </div>
                            <div class="mt-8">
                                <ButtonSecondary
                                    :href="route('contact.index')"
                                    class="w-full text-center"
                                >
                                    {{ $t('collaboration.engineering_action') }}
                                </ButtonSecondary>
                            </div>
                        </div>

                        <!-- Column 3: Sales Partners -->
                        <div
                            class="flex flex-col justify-between border-l-2 border-t-blue pl-6 lg:pl-8"
                        >
                            <div>
                                <div
                                    class="text-3xl font-bold tracking-tight text-t-blue sm:text-4xl"
                                >
                                    {{ $t('collaboration.sales_stat') }}
                                </div>
                                <h3 class="mt-3 text-xl font-medium text-black">
                                    {{ $t('collaboration.sales_title') }}
                                </h3>
                                <p
                                    class="mt-3 text-sm leading-relaxed text-black/70 sm:text-base"
                                >
                                    {{ $t('collaboration.sales_desc') }}
                                </p>
                            </div>
                            <div class="mt-8">
                                <ButtonPrimary
                                    :href="route('sales.index')"
                                    class="w-full text-center"
                                >
                                    {{ $t('collaboration.sales_action') }}
                                </ButtonPrimary>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Final CTA Banner -->
            <HomeCtaGeneric />
        </div>
    </DefaultLayout>
</template>
