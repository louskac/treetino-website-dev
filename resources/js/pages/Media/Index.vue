<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import { Download, ArrowRight, Mail, Video, Presentation, Palette, Award } from 'lucide-vue-next';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import HomeCtaGeneric from '@/custom/home/HomeCtaGeneric.vue';
import MediaVideos from '@/custom/media/MediaVideos.vue';
import MediaPitchDeck from '@/custom/media/MediaPitchDeck.vue';
import MediaPatent from '@/custom/media/MediaPatent.vue';
</script>

<template>
    <Head :title="$t('media.title')" />

    <DefaultLayout :inverted="true">
        <div class="relative overflow-hidden bg-white text-black selection:bg-t-blue selection:text-white pt-36 sm:pt-44">
            <!-- Ambient Boundary Lines Matching Site Layout -->
            <div
                class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/10 border-l-black/10 pointer-events-none sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            ></div>

            <main class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]">
                <!-- Page Hero Header -->
                <div class="pb-16 sm:pb-20 border-b border-black/10">
                    <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                        {{ $t('media.tag') }}
                    </span>
                    <h1 class="mt-3 text-4xl font-medium tracking-tight text-black sm:text-5xl lg:text-6xl">
                        {{ $t('media.title') }}
                    </h1>
                    <p class="mt-4 max-w-3xl text-lg sm:text-xl text-black/70 leading-relaxed">
                        {{ $t('media.subtitle') }}
                    </p>

                    <!-- Quick Navigation Anchors (Clean Neutral Pills) -->
                    <div class="mt-8 flex flex-wrap items-center gap-3">
                        <a
                            href="#videos"
                            class="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium text-black/80 shadow-xs transition hover:bg-black/5 hover:border-black/30"
                        >
                            <Video class="h-3.5 w-3.5 text-black/60" />
                            <span>{{ $t('media.nav_videos') }}</span>
                        </a>
                        <a
                            href="#patent"
                            class="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium text-black/80 shadow-xs transition hover:bg-black/5 hover:border-black/30"
                        >
                            <Award class="h-3.5 w-3.5 text-black/60" />
                            <span>{{ $t('media.nav_patent') }}</span>
                        </a>
                        <a
                            href="#pitchdeck"
                            class="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium text-black/80 shadow-xs transition hover:bg-black/5 hover:border-black/30"
                        >
                            <Presentation class="h-3.5 w-3.5 text-black/60" />
                            <span>{{ $t('media.nav_pitch') }}</span>
                        </a>
                        <a
                            href="#brandkit"
                            class="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-4 py-2 text-xs font-medium text-black/80 shadow-xs transition hover:bg-black/5 hover:border-black/30"
                        >
                            <Palette class="h-3.5 w-3.5 text-black/60" />
                            <span>{{ $t('media.nav_brand') }}</span>
                        </a>
                    </div>
                </div>

                <!-- 1. VIDEO SHOWCASE (4 Official YouTube Videos) -->
                <MediaVideos />

                <!-- 2. PATENTED TECHNOLOGY SECTION (Clean 3D Branch Sequence) -->
                <MediaPatent />

                <!-- 3. INTERACTIVE PITCH DECK -->
                <MediaPitchDeck />

                <!-- 4. BRAND KIT & PRESS RESOURCES (2 Editorial Columns) -->
                <section id="brandkit" class="scroll-mt-32 py-20 lg:py-28">
                    <div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                        <!-- Column 1: Brand Kit & Assets -->
                        <div class="border-l-2 border-t-blue pl-6 lg:pl-8 flex flex-col justify-between">
                            <div>
                                <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                                    {{ $t('media.brand_tag') }}
                                </span>
                                <h2 class="mt-3 text-2xl sm:text-3xl font-medium text-black">
                                    {{ $t('media.brand_title') }}
                                </h2>
                                <p class="mt-4 text-base text-black/70 leading-relaxed">
                                    {{ $t('media.brand_desc') }}
                                </p>

                                <!-- Logo Preview strip -->
                                <div class="mt-8 flex items-center gap-6 rounded-2xl border border-black/10 bg-zinc-50 p-6">
                                    <img
                                        src="/img/branding/logo-type.svg"
                                        alt="Treetino Logo"
                                        class="h-8 w-auto object-contain"
                                    />
                                    <div class="h-8 w-[1px] bg-black/10"></div>
                                    <img
                                        src="/img/branding/logo-icon.svg"
                                        alt="Treetino Icon"
                                        class="h-8 w-8 object-contain"
                                    />
                                </div>
                            </div>

                            <div class="mt-10">
                                <ButtonPrimary
                                    href="/downloads/treetino-brand-kit.zip"
                                    download="treetino-brand-kit.zip"
                                    class="text-center"
                                >
                                    <div class="flex items-center gap-2">
                                        <Download class="h-4 w-4" />
                                        <span>{{ $t('media.brand_download_btn') }}</span>
                                    </div>
                                </ButtonPrimary>
                            </div>
                        </div>

                        <!-- Column 2: Press Inquiries -->
                        <div class="border-l-2 border-black/15 pl-6 lg:pl-8 flex flex-col justify-between">
                            <div>
                                <span class="text-xs font-semibold tracking-[0.2em] text-black/50 uppercase">
                                    {{ $t('media.press_tag') }}
                                </span>
                                <h2 class="mt-3 text-2xl sm:text-3xl font-medium text-black">
                                    {{ $t('media.press_title') }}
                                </h2>
                                <p class="mt-4 text-base text-black/70 leading-relaxed">
                                    {{ $t('media.press_desc') }}
                                </p>

                                <div class="mt-8 space-y-3 rounded-2xl border border-black/10 bg-zinc-50 p-6">
                                    <div class="text-xs font-semibold uppercase tracking-wider text-black/50">
                                        {{ $t('media.direct_contact_tag') }}
                                    </div>
                                    <a
                                        href="mailto:info@treetino.com"
                                        class="text-lg font-medium text-black hover:text-t-blue transition-colors block"
                                    >
                                        info@treetino.com
                                    </a>
                                </div>
                            </div>

                            <div class="mt-10">
                                <Link
                                    :href="route('contact.index')"
                                    class="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 bg-white px-7 py-3.5 text-xs font-semibold text-black/80 shadow-xs transition hover:bg-black/5 hover:border-black/30"
                                >
                                    <Mail class="h-4 w-4 text-black/60" />
                                    <span>{{ $t('media.press_contact_btn') }}</span>
                                    <ArrowRight class="h-3.5 w-3.5 opacity-50" />
                                </Link>
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
