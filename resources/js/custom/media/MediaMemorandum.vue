<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    Download,
    FileText,
    Check,
    Lock,
    ShieldCheck,
    FileDown,
} from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { route } from 'ziggy-js';

const { t, locale } = useI18n();

const pdfUrl = '/docs/Treetino_Investment_Memorandum_2026.pdf';
</script>

<template>
    <section
        id="memorandum"
        class="scroll-mt-32 border-b border-black/10 py-16 lg:py-24"
    >
        <!-- Section Header -->
        <div class="max-w-3xl">
            <span
                class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
            >
                {{ $t('media.im_tag') }}
            </span>
            <h2
                class="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl lg:text-5xl"
            >
                {{ $t('media.im_title') }}
            </h2>
            <p
                class="mt-4 text-base leading-relaxed text-black/70 sm:text-lg"
            >
                {{ $t('media.im_desc') }}
            </p>
        </div>

        <!-- 4 Key Institutional Diligence Metrics (Clean light cards) -->
        <div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
                class="flex flex-col justify-between border-l-2 border-t-blue bg-zinc-50 p-5 transition hover:bg-zinc-100/70"
            >
                <div>
                    <span
                        class="text-[10px] font-semibold tracking-wider text-black/50 uppercase"
                    >
                        Commercial Proof
                    </span>
                    <div
                        class="mt-1 font-mono text-2xl font-bold tracking-tight text-black sm:text-3xl"
                    >
                        {{ $t('media.im_stat1_val') }}
                    </div>
                </div>
                <p class="mt-3 text-xs leading-relaxed text-black/70">
                    {{ $t('media.im_stat1_label') }}
                </p>
            </div>

            <div
                class="flex flex-col justify-between border-l-2 border-black/20 bg-zinc-50 p-5 transition hover:bg-zinc-100/70"
            >
                <div>
                    <span
                        class="text-[10px] font-semibold tracking-wider text-black/50 uppercase"
                    >
                        EU Blended Grant
                    </span>
                    <div
                        class="mt-1 font-mono text-2xl font-bold tracking-tight text-black sm:text-3xl"
                    >
                        {{ $t('media.im_stat2_val') }}
                    </div>
                </div>
                <p class="mt-3 text-xs leading-relaxed text-black/70">
                    {{ $t('media.im_stat2_label') }}
                </p>
            </div>

            <div
                class="flex flex-col justify-between border-l-2 border-black/20 bg-zinc-50 p-5 transition hover:bg-zinc-100/70"
            >
                <div>
                    <span
                        class="text-[10px] font-semibold tracking-wider text-black/50 uppercase"
                    >
                        Bond Facility
                    </span>
                    <div
                        class="mt-1 font-mono text-2xl font-bold tracking-tight text-black sm:text-3xl"
                    >
                        {{ $t('media.im_stat3_val') }}
                    </div>
                </div>
                <p class="mt-3 text-xs leading-relaxed text-black/70">
                    {{ $t('media.im_stat3_label') }}
                </p>
            </div>

            <div
                class="flex flex-col justify-between border-l-2 border-black/20 bg-zinc-50 p-5 transition hover:bg-zinc-100/70"
            >
                <div>
                    <span
                        class="text-[10px] font-semibold tracking-wider text-black/50 uppercase"
                    >
                        Unit Economics
                    </span>
                    <div
                        class="mt-1 font-mono text-2xl font-bold tracking-tight text-black sm:text-3xl"
                    >
                        {{ $t('media.im_stat4_val') }}
                    </div>
                </div>
                <p class="mt-3 text-xs leading-relaxed text-black/70">
                    {{ $t('media.im_stat4_label') }}
                </p>
            </div>
        </div>

        <!-- Single Light Teaser Card: Clean Document Showcase & Download -->
        <div
            class="mt-10 overflow-hidden rounded-3xl border border-black/10 bg-zinc-50 p-8 sm:p-10 lg:p-12"
        >
            <div
                class="grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-14"
            >
                <!-- Left: Scope, Highlights & Exactly ONE Button Set -->
                <div class="lg:col-span-7">
                    <div class="flex flex-wrap items-center gap-2.5">
                        <span
                            class="inline-flex items-center gap-1.5 rounded-full border border-black/15 bg-white px-3 py-1 text-xs font-medium text-black/80 shadow-xs"
                        >
                            <FileText class="h-3.5 w-3.5 text-black/60" />
                            <span>{{ $t('media.im_badge_pages') }}</span>
                        </span>
                        <span
                            class="inline-flex items-center rounded-full border border-t-blue/30 bg-t-blue/10 px-3 py-1 text-xs font-medium text-t-blue"
                        >
                            {{ $t('media.im_badge_confidential') }}
                        </span>
                    </div>

                    <h3
                        class="mt-5 text-2xl font-medium tracking-tight text-black sm:text-3xl"
                    >
                        {{
                            locale === 'cs'
                                ? 'Komplexní institucionální dokumentace projektu'
                                : 'Comprehensive Institutional Project Dossier'
                        }}
                    </h3>

                    <p class="mt-3 text-sm leading-relaxed text-black/70 sm:text-base">
                        {{
                            locale === 'cs'
                                ? 'Dokument slouží pro kvalifikované investory, instituce a strategické partnery. Poskytuje ucelený přehled o technologickém patentu, výrobních kapacitách, jednotkové ekonomice a expanzním plánu.'
                                : 'Prepared for qualified cleantech investors, financial institutions, and strategic partners. Provides a complete overview of the patent portfolio, production capacity, unit economics, and European expansion roadmap.'
                        }}
                    </p>

                    <!-- Scope checklist -->
                    <div class="mt-6 border-t border-black/10 pt-5">
                        <div
                            class="text-xs font-semibold tracking-wider text-black/50 uppercase"
                        >
                            {{ $t('media.im_scope_title') }}
                        </div>
                        <ul class="mt-3 space-y-2.5">
                            <li class="flex items-start gap-2.5 text-xs text-black/80 sm:text-sm">
                                <Check class="mt-0.5 h-4 w-4 shrink-0 text-t-blue" />
                                <span>{{ $t('media.im_feature1') }}</span>
                            </li>
                            <li class="flex items-start gap-2.5 text-xs text-black/80 sm:text-sm">
                                <Check class="mt-0.5 h-4 w-4 shrink-0 text-t-blue" />
                                <span>{{ $t('media.im_feature2') }}</span>
                            </li>
                            <li class="flex items-start gap-2.5 text-xs text-black/80 sm:text-sm">
                                <Check class="mt-0.5 h-4 w-4 shrink-0 text-t-blue" />
                                <span>{{ $t('media.im_feature3') }}</span>
                            </li>
                            <li class="flex items-start gap-2.5 text-xs text-black/80 sm:text-sm">
                                <Check class="mt-0.5 h-4 w-4 shrink-0 text-t-blue" />
                                <span>{{ $t('media.im_feature4') }}</span>
                            </li>
                            <li class="flex items-start gap-2.5 text-xs text-black/80 sm:text-sm">
                                <Check class="mt-0.5 h-4 w-4 shrink-0 text-t-blue" />
                                <span>{{ $t('media.im_feature5') }}</span>
                            </li>
                        </ul>
                    </div>

                    <!-- Exactly ONE Pair of Action Buttons (Identical dimensions & typography, side-by-side) -->
                    <div class="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <a
                            :href="pdfUrl"
                            download="Treetino_Investment_Memorandum_2026.pdf"
                            target="_blank"
                            class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-t-blue px-5 py-2.5 text-xs font-semibold whitespace-nowrap text-white shadow-sm transition hover:bg-t-blue/90"
                        >
                            <Download class="h-3.5 w-3.5" />
                            <span>{{ $t('media.im_download_btn') }}</span>
                        </a>

                        <Link
                            :href="route('contact.index')"
                            class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-5 py-2.5 text-xs font-semibold whitespace-nowrap text-black/80 shadow-xs transition hover:border-black/30 hover:bg-black/5"
                        >
                            <Lock class="h-3.5 w-3.5 text-black/60" />
                            <span>{{ $t('media.im_nda_btn') }}</span>
                        </Link>
                    </div>

                    <p class="mt-3 text-[11px] text-black/45">
                        {{ $t('media.im_preview_caption') }}
                    </p>
                </div>

                <!-- Right: Clean Document Preview Card & Integrated Data Room Note -->
                <div class="lg:col-span-5 flex flex-col gap-4">
                    <a
                        :href="pdfUrl"
                        download="Treetino_Investment_Memorandum_2026.pdf"
                        target="_blank"
                        class="group/card relative block overflow-hidden rounded-2xl border border-black/10 bg-white p-3 shadow-md transition duration-300 hover:-translate-y-1 hover:border-black/25 hover:shadow-xl"
                        :title="$t('media.im_download_btn')"
                    >
                        <!-- Cover Sheet Image Preview -->
                        <div
                            class="relative aspect-[1123/794] w-full overflow-hidden rounded-xl bg-black"
                        >
                            <img
                                src="/img/im/preview/im_page_01.png"
                                alt="Treetino Investment Memorandum Cover"
                                class="h-full w-full object-cover transition duration-300 group-hover/card:scale-[1.02]"
                                loading="eager"
                            />

                            <!-- Clean hover download overlay -->
                            <div
                                class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-xs transition duration-200 group-hover/card:opacity-100"
                            >
                                <div
                                    class="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-black shadow-lg"
                                >
                                    <FileDown class="h-4 w-4 text-t-blue" />
                                    <span>{{ $t('media.im_download_btn') }}</span>
                                </div>
                            </div>
                        </div>

                        <!-- Card Footer Details -->
                        <div
                            class="mt-3 flex items-center justify-between px-2 pb-1 text-xs text-black/60"
                        >
                            <div class="flex items-center gap-1.5 font-medium text-black">
                                <FileText class="h-3.5 w-3.5 text-t-blue" />
                                <span>Treetino Tree V1 Memorandum</span>
                            </div>
                            <span class="font-mono text-[11px] text-black/50">
                                16 Pages • 11.3 MB
                            </span>
                        </div>
                    </a>

                    <!-- Integrated Data Room NDA Note -->
                    <div class="flex items-start gap-3 rounded-xl border border-black/10 bg-white p-4">
                        <ShieldCheck class="mt-0.5 h-4 w-4 shrink-0 text-t-blue" />
                        <p class="text-xs leading-relaxed text-black/70">
                            {{ $t('media.im_nda_note') }}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
