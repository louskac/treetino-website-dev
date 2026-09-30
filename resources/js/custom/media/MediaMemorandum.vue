<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import {
    Download,
    Maximize2,
    Minimize2,
    ChevronLeft,
    ChevronRight,
    FileText,
    ShieldCheck,
    Lock,
    ExternalLink,
    Check,
    Share2,
    FileCheck2,
    Building2,
    Sparkles,
    TrendingUp,
} from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { route } from 'ziggy-js';

const { t, locale } = useI18n();

interface PageItem {
    pageNumber: number;
    src: string;
    title: {
        cs: string;
        en: string;
    };
    category: {
        cs: string;
        en: string;
    };
}

const pages: PageItem[] = [
    {
        pageNumber: 1,
        src: '/img/im/preview/im_page_01.png',
        title: {
            cs: 'Titulní strana • Exekutivní přehled',
            en: 'Cover Page • Executive Overview',
        },
        category: { cs: 'Úvod', en: 'Introduction' },
    },
    {
        pageNumber: 2,
        src: '/img/im/preview/im_page_02.png',
        title: {
            cs: 'Exekutivní souhrn & Investiční nabídka',
            en: 'Executive Summary & Capital Allocation',
        },
        category: { cs: 'Strategie', en: 'Strategy' },
    },
    {
        pageNumber: 3,
        src: '/img/im/preview/im_page_03.png',
        title: {
            cs: 'Energetický kontext & Výzva trhu',
            en: 'Energy Market Disruption & Space Constraints',
        },
        category: { cs: 'Trh', en: 'Market' },
    },
    {
        pageNumber: 4,
        src: '/img/im/preview/im_page_04.png',
        title: {
            cs: 'Vize & Architektonická integrace',
            en: 'Architectural Vision & Dual Value Creation',
        },
        category: { cs: 'Vize', en: 'Vision' },
    },
    {
        pageNumber: 5,
        src: '/img/im/preview/im_page_05.png',
        title: {
            cs: 'Hardwarová & Mechanická architektura',
            en: 'Patented Hardware & Articulation Engineering',
        },
        category: { cs: 'Technologie', en: 'Technology' },
    },
    {
        pageNumber: 6,
        src: '/img/im/preview/im_page_06.png',
        title: {
            cs: 'Fotovoltaické TopCon listy & Aerodynamika',
            en: 'TopCon BIPV Foliage & Computational Aerodynamics',
        },
        category: { cs: 'Technologie', en: 'Technology' },
    },
    {
        pageNumber: 7,
        src: '/img/im/preview/im_page_07.png',
        title: {
            cs: 'B2B Komerční validace • Reference MKovo',
            en: 'B2B Commercial Proof • MKovo Case Study (€705k)',
        },
        category: { cs: 'Trakce', en: 'Traction' },
    },
    {
        pageNumber: 8,
        src: '/img/im/preview/im_page_08.png',
        title: {
            cs: 'Veřejná infrastruktura & Smart Cities',
            en: 'Municipal Infrastructure & Urban Microgrids',
        },
        category: { cs: 'Trakce', en: 'Traction' },
    },
    {
        pageNumber: 9,
        src: '/img/im/preview/im_page_09.png',
        title: {
            cs: 'Produktový ekosystém • Přehled modelů',
            en: 'Flagship Product Portfolio & Model Range',
        },
        category: { cs: 'Produkty', en: 'Products' },
    },
    {
        pageNumber: 10,
        src: '/img/im/preview/im_page_10.png',
        title: {
            cs: 'Mezinárodní expanze & Strategie Go-To-South',
            en: 'International GTM • High-Solar & Coastal Corridors',
        },
        category: { cs: 'Expanze', en: 'Expansion' },
    },
    {
        pageNumber: 11,
        src: '/img/im/preview/im_page_11.png',
        title: {
            cs: 'Finanční plán & Projekce výnosů 2026–2030',
            en: '5-Year Financial Model & Revenue Projections',
        },
        category: { cs: 'Finance', en: 'Financials' },
    },
    {
        pageNumber: 12,
        src: '/img/im/preview/im_page_12.png',
        title: {
            cs: 'Výrobní zázemí, Dodavatelský řetězec & Marže',
            en: 'Manufacturing Operations & 40.4% Hardware Margin',
        },
        category: { cs: 'Výroba', en: 'Operations' },
    },
    {
        pageNumber: 13,
        src: '/img/im/preview/im_page_13.png',
        title: {
            cs: 'Web3 & DePIN Protokol • Certino & RWA financování',
            en: 'Web3 & DePIN Architecture • Certino & RWA Vaults',
        },
        category: { cs: 'Inovace', en: 'Innovation' },
    },
    {
        pageNumber: 14,
        src: '/img/im/preview/im_page_14.png',
        title: {
            cs: 'Tým zakladatelů & Institucionální partnerství',
            en: 'Founding Team & Institutional R&D Network',
        },
        category: { cs: 'Tým', en: 'Team' },
    },
    {
        pageNumber: 15,
        src: '/img/im/preview/im_page_15.png',
        title: {
            cs: 'Řízení rizik & Regulační certifikace',
            en: 'Risk Mitigation & Regulatory Compliance',
        },
        category: { cs: 'Rizika', en: 'Governance' },
    },
    {
        pageNumber: 16,
        src: '/img/im/preview/im_page_16.png',
        title: {
            cs: 'Katalog ověřovacích dokumentů & Data Room (NDA)',
            en: 'Due Diligence Data Room & Asset Index (NDA)',
        },
        category: { cs: 'Data Room', en: 'Data Room' },
    },
];

const currentPage = ref(0);
const pdfUrl = '/docs/Treetino_Investment_Memorandum_2026.pdf';
const copied = ref(false);
const isFullscreen = ref(false);
const thumbnailStripRef = ref<HTMLDivElement | null>(null);

const activePage = computed(() => pages[currentPage.value]);

const nextPage = () => {
    currentPage.value = (currentPage.value + 1) % pages.length;
    scrollActiveThumbnailIntoView();
};

const prevPage = () => {
    currentPage.value = (currentPage.value - 1 + pages.length) % pages.length;
    scrollActiveThumbnailIntoView();
};

const goToPage = (index: number) => {
    currentPage.value = index;
    scrollActiveThumbnailIntoView();
};

const scrollActiveThumbnailIntoView = () => {
    if (!thumbnailStripRef.value) return;
    const activeEl = thumbnailStripRef.value.children[currentPage.value] as HTMLElement;
    if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
};

const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value;
};

const copyShareLink = async () => {
    try {
        const shareUrl = `${window.location.origin}/media#memorandum`;
        await navigator.clipboard.writeText(shareUrl);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch (e) {
        console.error('Failed to copy memorandum link', e);
    }
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isFullscreen.value) {
        isFullscreen.value = false;
        return;
    }

    const target = e.target as HTMLElement;
    if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) {
        return;
    }

    if (e.key === 'ArrowRight') {
        nextPage();
    } else if (e.key === 'ArrowLeft') {
        prevPage();
    }
};

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
    <section
        id="memorandum"
        class="scroll-mt-32 border-b border-black/10 py-16 lg:py-24"
    >
        <!-- Section Header -->
        <div
            class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
        >
            <div class="max-w-2xl">
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

            <!-- Action Controls -->
            <div class="flex shrink-0 flex-wrap items-center gap-3">
                <button
                    type="button"
                    @click="copyShareLink"
                    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-xs font-medium whitespace-nowrap text-black/80 shadow-xs transition hover:border-black/30 hover:bg-black/5"
                    :title="$t('media.pitch_share')"
                >
                    <Check v-if="copied" class="h-3.5 w-3.5 text-green-600" />
                    <Share2 v-else class="h-3.5 w-3.5 text-black/70" />
                    <span>{{
                        copied
                            ? $t('media.pitch_copied')
                            : $t('media.pitch_share')
                    }}</span>
                </button>

                <button
                    type="button"
                    @click="toggleFullscreen"
                    class="hidden cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-2.5 text-xs font-medium whitespace-nowrap text-black/80 shadow-xs transition hover:border-black/30 hover:bg-black/5 sm:inline-flex"
                    :title="$t('media.im_fullscreen')"
                >
                    <Maximize2 class="h-3.5 w-3.5 text-black/70" />
                    <span>{{ $t('media.im_fullscreen') }}</span>
                </button>

                <a
                    :href="pdfUrl"
                    download="Treetino_Investment_Memorandum_2026.pdf"
                    target="_blank"
                    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-t-blue px-4 py-2.5 text-xs font-medium whitespace-nowrap text-white shadow-sm transition hover:bg-t-blue/90"
                >
                    <Download class="h-3.5 w-3.5" />
                    <span>{{ $t('media.im_download_btn') }}</span>
                </a>
            </div>
        </div>

        <!-- 4 Key Institutional Diligence Metrics -->
        <div class="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
                class="flex flex-col justify-between border-l-2 border-t-blue bg-zinc-50/80 p-5 transition hover:bg-zinc-50"
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
                class="flex flex-col justify-between border-l-2 border-black/20 bg-zinc-50/80 p-5 transition hover:bg-zinc-50"
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
                class="flex flex-col justify-between border-l-2 border-black/20 bg-zinc-50/80 p-5 transition hover:bg-zinc-50"
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
                class="flex flex-col justify-between border-l-2 border-black/20 bg-zinc-50/80 p-5 transition hover:bg-zinc-50"
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

        <!-- Interactive Document Viewer Frame -->
        <div
            class="group relative mt-10 overflow-hidden rounded-3xl border border-black/10 bg-zinc-950 shadow-2xl select-none"
        >
            <!-- Progress Line Top -->
            <div class="absolute top-0 right-0 left-0 z-30 h-1 bg-white/10">
                <div
                    class="h-full bg-t-blue transition-all duration-300 ease-out"
                    :style="{
                        width: `${((currentPage + 1) / pages.length) * 100}%`,
                    }"
                ></div>
            </div>

            <!-- Header inside viewer -->
            <div
                class="relative z-20 flex items-center justify-between border-b border-white/10 bg-zinc-950/90 px-5 py-3.5 backdrop-blur-md"
            >
                <div class="flex items-center gap-3">
                    <span
                        class="rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-white/90"
                    >
                        {{ String(currentPage + 1).padStart(2, '0') }} / 16
                    </span>
                    <span
                        class="hidden text-xs font-medium text-white/80 sm:inline"
                    >
                        {{
                            locale === 'cs'
                                ? activePage.title.cs
                                : activePage.title.en
                        }}
                    </span>
                </div>

                <div class="flex items-center gap-2">
                    <span
                        class="hidden text-[11px] tracking-wider text-white/40 uppercase md:inline"
                    >
                        {{ $t('media.im_badge_confidential') }}
                    </span>
                    <button
                        type="button"
                        @click="toggleFullscreen"
                        class="cursor-pointer rounded-lg border border-white/15 bg-white/5 p-1.5 text-white/80 transition hover:bg-white/15 hover:text-white"
                        :title="$t('media.im_fullscreen')"
                    >
                        <Maximize2 class="h-4 w-4" />
                    </button>
                </div>
            </div>

            <!-- Main Document Page Stage -->
            <div
                class="relative flex aspect-[1123/794] w-full items-center justify-center overflow-hidden bg-zinc-950 p-2 sm:p-4 lg:p-6"
            >
                <Transition name="page-fade" mode="out-in">
                    <div
                        :key="currentPage"
                        class="relative flex h-full w-full items-center justify-center"
                    >
                        <img
                            :src="activePage.src"
                            :alt="activePage.title.en"
                            class="pointer-events-none max-h-full max-w-full rounded-sm object-contain shadow-2xl"
                            loading="eager"
                        />
                    </div>
                </Transition>

                <!-- Prev Page Button -->
                <button
                    type="button"
                    @click.stop="prevPage"
                    class="absolute top-1/2 left-3 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-xl backdrop-blur-md transition hover:scale-110 hover:bg-black/90 sm:left-6"
                    :aria-label="$t('media.im_prev_page')"
                >
                    <ChevronLeft class="h-6 w-6" />
                </button>

                <!-- Next Page Button -->
                <button
                    type="button"
                    @click.stop="nextPage"
                    class="absolute top-1/2 right-3 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/60 text-white shadow-xl backdrop-blur-md transition hover:scale-110 hover:bg-black/90 sm:right-6"
                    :aria-label="$t('media.im_next_page')"
                >
                    <ChevronRight class="h-6 w-6" />
                </button>
            </div>

            <!-- Thumbnail Strip & Navigation Bar -->
            <div
                class="relative z-20 border-t border-white/10 bg-zinc-950/95 px-4 py-4 backdrop-blur-md sm:px-6"
            >
                <!-- Thumbnail Rail -->
                <div
                    ref="thumbnailStripRef"
                    class="no-scrollbar flex items-center gap-2.5 overflow-x-auto pb-2"
                >
                    <button
                        v-for="(page, idx) in pages"
                        :key="page.pageNumber"
                        type="button"
                        @click="goToPage(idx)"
                        class="group/thumb relative shrink-0 cursor-pointer overflow-hidden rounded-md border transition-all duration-200"
                        :class="
                            idx === currentPage
                                ? 'scale-105 border-white ring-2 ring-t-blue ring-offset-1 ring-offset-black'
                                : 'border-white/20 opacity-50 hover:border-white/50 hover:opacity-100'
                        "
                    >
                        <img
                            :src="page.src"
                            :alt="page.title.en"
                            class="h-12 w-auto object-cover sm:h-14"
                        />
                        <div
                            class="absolute inset-0 flex items-center justify-center bg-black/40 text-[10px] font-bold text-white opacity-0 transition group-hover/thumb:opacity-100"
                            :class="{ '!opacity-100': idx === currentPage }"
                        >
                            {{ page.pageNumber }}
                        </div>
                    </button>
                </div>

                <!-- Bottom Bar Summary Controls -->
                <div
                    class="mt-3 flex flex-col items-center justify-between gap-3 pt-2 text-xs text-white/60 sm:flex-row"
                >
                    <div class="truncate text-center sm:text-left">
                        <span class="font-semibold text-white">
                            {{ $t('media.im_page_label') }}
                            {{ currentPage + 1 }}
                            {{ $t('media.im_of') }} 16:
                        </span>
                        <span class="ml-1 text-white/80">
                            {{
                                locale === 'cs'
                                ? activePage.title.cs
                                : activePage.title.en
                            }}
                        </span>
                    </div>

                    <div class="flex items-center gap-2">
                        <button
                            type="button"
                            @click="prevPage"
                            class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/15 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                            <ChevronLeft class="h-3.5 w-3.5" />
                            <span>{{ $t('media.im_prev_page') }}</span>
                        </button>
                        <button
                            type="button"
                            @click="nextPage"
                            class="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/15 px-3 py-1 text-xs text-white/80 transition hover:bg-white/10 hover:text-white"
                        >
                            <span>{{ $t('media.im_next_page') }}</span>
                            <ChevronRight class="h-3.5 w-3.5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Data Room & Institutional Diligence Access Banner -->
        <div
            class="mt-10 rounded-2xl border border-black/10 bg-zinc-50 p-6 sm:p-8"
        >
            <div
                class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between"
            >
                <div class="max-w-2xl">
                    <div class="flex items-center gap-2 text-t-blue">
                        <ShieldCheck class="h-4 w-4" />
                        <span
                            class="text-xs font-semibold tracking-wider uppercase"
                        >
                            Institutional Data Room
                        </span>
                    </div>
                    <h3 class="mt-2 text-xl font-medium text-black sm:text-2xl">
                        {{
                            locale === 'cs'
                                ? '10 klíčových ověřovacích dokumentů pod NDA'
                                : '10 Core Due Diligence Assets Under NDA'
                        }}
                    </h3>
                    <p class="mt-2 text-sm leading-relaxed text-black/70">
                        {{ $t('media.im_nda_note') }}
                    </p>
                </div>

                <div class="flex shrink-0 flex-wrap items-center gap-3">
                    <a
                        :href="pdfUrl"
                        download="Treetino_Investment_Memorandum_2026.pdf"
                        target="_blank"
                        class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-black px-5 py-3 text-xs font-semibold text-white shadow-xs transition hover:bg-black/85"
                    >
                        <Download class="h-4 w-4" />
                        <span>{{ $t('media.im_download_btn') }}</span>
                    </a>

                    <Link
                        :href="route('contact.index')"
                        class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-black/20 bg-white px-5 py-3 text-xs font-semibold text-black shadow-xs transition hover:border-black/40 hover:bg-black/5"
                    >
                        <Lock class="h-4 w-4 text-black/60" />
                        <span>{{ $t('media.im_nda_btn') }}</span>
                    </Link>
                </div>
            </div>
        </div>

        <!-- Fullscreen Overlay Lightbox Modal (For reading high resolution anywhere) -->
        <Teleport to="body">
            <div
                v-if="isFullscreen"
                class="fixed inset-0 z-50 flex flex-col bg-zinc-950/98 p-4 backdrop-blur-2xl sm:p-6"
                tabindex="-1"
            >
                <!-- Modal Top Navigation -->
                <div
                    class="flex items-center justify-between border-b border-white/10 pb-4"
                >
                    <div class="flex items-center gap-3">
                        <span
                            class="rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs font-bold text-white"
                        >
                            {{ currentPage + 1 }} / 16
                        </span>
                        <div class="text-sm font-medium text-white">
                            {{
                                locale === 'cs'
                                    ? activePage.title.cs
                                    : activePage.title.en
                            }}
                        </div>
                    </div>

                    <div class="flex items-center gap-3">
                        <a
                            :href="pdfUrl"
                            download="Treetino_Investment_Memorandum_2026.pdf"
                            target="_blank"
                            class="inline-flex items-center gap-1.5 rounded-lg bg-t-blue px-3 py-1.5 text-xs font-medium text-white transition hover:bg-t-blue/90"
                        >
                            <Download class="h-3.5 w-3.5" />
                            <span class="hidden sm:inline">{{
                                $t('media.im_download_btn')
                            }}</span>
                        </a>

                        <button
                            type="button"
                            @click="toggleFullscreen"
                            class="cursor-pointer rounded-lg border border-white/20 bg-white/10 p-2 text-white transition hover:bg-white/20"
                            :title="$t('media.im_close')"
                        >
                            <Minimize2 class="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <!-- Modal Main Viewer Stage -->
                <div
                    class="relative flex flex-1 items-center justify-center overflow-hidden p-2 sm:p-4"
                >
                    <img
                        :src="activePage.src"
                        :alt="activePage.title.en"
                        class="max-h-full max-w-full rounded-sm object-contain shadow-2xl"
                    />

                    <!-- Prev Modal Button -->
                    <button
                        type="button"
                        @click="prevPage"
                        class="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-black/70 p-3 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black"
                    >
                        <ChevronLeft class="h-6 w-6" />
                    </button>

                    <!-- Next Modal Button -->
                    <button
                        type="button"
                        @click="nextPage"
                        class="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer rounded-full border border-white/20 bg-black/70 p-3 text-white backdrop-blur-md transition hover:scale-110 hover:bg-black"
                    >
                        <ChevronRight class="h-6 w-6" />
                    </button>
                </div>

                <!-- Modal Bottom Thumbnail Strip -->
                <div class="border-t border-white/10 pt-3">
                    <div
                        class="no-scrollbar flex items-center justify-center gap-2 overflow-x-auto pb-2"
                    >
                        <button
                            v-for="(page, idx) in pages"
                            :key="page.pageNumber"
                            type="button"
                            @click="goToPage(idx)"
                            class="shrink-0 cursor-pointer overflow-hidden rounded border transition-all"
                            :class="
                                idx === currentPage
                                    ? 'border-white ring-2 ring-t-blue'
                                    : 'border-white/20 opacity-40 hover:opacity-90'
                            "
                        >
                            <img
                                :src="page.src"
                                :alt="page.title.en"
                                class="h-10 w-auto object-cover"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </Teleport>
    </section>
</template>

<style scoped>
.page-fade-enter-active,
.page-fade-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.page-fade-enter-from {
    opacity: 0;
    transform: scale(0.99);
}

.page-fade-leave-to {
    opacity: 0;
    transform: scale(1.01);
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
