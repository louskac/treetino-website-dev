<script setup lang="ts">
import {
    Play,
    ExternalLink,
    X,
    ChevronLeft,
    ChevronRight,
    Maximize2,
    Instagram,
    Globe,
    Youtube,
} from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

export interface MediaPhoto {
    src: string;
    caption: { cs: string; en: string };
    alt: { cs: string; en: string };
}

export interface MediaVideo {
    src: string;
    poster?: string;
    type: 'mp4' | 'youtube';
    duration?: string;
    title?: { cs: string; en: string };
}

export interface AppearanceLink {
    url: string;
    label: { cs: string; en: string };
    type?: 'instagram' | 'web' | 'youtube' | 'article' | 'external';
}

export interface AppearanceItem {
    id: string;
    date: { cs: string; en: string };
    year: string;
    outlet: string;
    category: 'tv' | 'press' | 'interview' | 'conference';
    title: { cs: string; en: string };
    description: { cs: string; en: string };
    link?: AppearanceLink;
    secondaryLink?: AppearanceLink;
    video?: MediaVideo;
    photos?: MediaPhoto[]; // 0, 1, or 2 photos
}

const appearances: AppearanceItem[] = [
    {
        id: 'praha-tv-sep-2026',
        date: { cs: 'Září 2026', en: 'September 2026' },
        year: '2026',
        outlet: 'Praha TV',
        category: 'tv',
        title: {
            cs: 'Praha TV: Reportáž o vývoji a budoucnosti energetického stromu Treetino',
            en: 'Praha TV: Feature on Treetino Smart Energy Tree & Urban Clean Tech',
        },
        description: {
            cs: 'Televizní štáb Praha TV navštívil vývojové centrum Treetino. Exkluzivní reportáž o funkčním prototypu, patentovaném systému natáčení větví a plánech na pilotní instalace.',
            en: 'The Praha TV crew visited Treetino R&D for an exclusive feature covering the working prototype, patented multi-axis branch articulation, and upcoming pilot installations.',
        },
        video: {
            src: '/video/media/praha-tv-september-2026.mp4',
            poster: '/img/media/praha-tv-poster.jpg',
            type: 'mp4',
            duration: '3:00',
            title: {
                cs: 'Praha TV: Oficiální televizní reportáž Treetino (Září 2026)',
                en: 'Praha TV: Official Treetino Television Feature (September 2026)',
            },
        },
        photos: [
            {
                src: '/img/media/praha-tv-bts-1.jpg',
                caption: {
                    cs: 'Rozhovor zakladatele před funkčním modelem energetického stromu Treetino v R&D centru',
                    en: 'Founder interview in front of the functional Treetino prototype in R&D',
                },
                alt: {
                    cs: 'Rozhovor pro Praha TV před prototypem Treetino',
                    en: 'Praha TV shoot in front of Treetino prototype',
                },
            },
            {
                src: '/img/media/praha-tv-bts-2.jpg',
                caption: {
                    cs: 'Příprava televizního štábu Praha TV a moderátorky na natáčení ve vývojovém centru',
                    en: 'Behind the scenes: Praha TV crew and anchor preparing on set',
                },
                alt: {
                    cs: 'Zákulisí natáčení Praha TV v R&D centru Treetino',
                    en: 'Behind the scenes at Treetino R&D during TV filming',
                },
            },
        ],
    },
    {
        id: 'vlada-cr-mpo-aug-2026',
        date: { cs: 'Srpen 2026', en: 'August 2026' },
        year: '2026',
        outlet: 'Úřad vlády ČR & MPO',
        category: 'conference',
        title: {
            cs: 'Vláda ČR: Představení Treetino premiérovi na Dnech MPO ve Strakově akademii',
            en: 'Government of the Czech Republic: Presenting Treetino to the Prime Minister at Straka Academy',
        },
        description: {
            cs: 'Osobní setkání a prezentace funkčního prototypu energetického stromu premiérovi ČR a vedení MPO během technologické výstavy v zahradě Úřadu vlády.',
            en: 'Personal meeting and prototype demonstration with the Prime Minister of the Czech Republic and MPO leadership in the gardens of the Straka Academy.',
        },
        photos: [
            {
                src: '/img/media/strakova-akademie-vlada-premier.jpg',
                caption: {
                    cs: 'Setkání a představení energetického stromu Treetino premiérovi ČR v zahradě Strakovy akademie na Dnech MPO',
                    en: 'Presenting Treetino smart energy tree to the Prime Minister in the gardens of Straka Academy during MPO Days',
                },
                alt: {
                    cs: 'Představení Treetino premiérovi ČR ve Strakově akademii',
                    en: 'Meeting with the Czech Prime Minister at Straka Academy',
                },
            },
            {
                src: '/img/media/strakova-akademie-vlada-premier-2.jpg',
                caption: {
                    cs: 'Ukázka funkce fotovoltaických listů a větrných mikroturbín prototypu Treetino premiérovi ČR',
                    en: 'Demonstrating the photovoltaic foliage and micro wind turbines of Treetino prototype to the Prime Minister',
                },
                alt: {
                    cs: 'Ukázka prototypu Treetino premiérovi ČR',
                    en: 'Demonstrating Treetino prototype to the Prime Minister',
                },
            },
        ],
        link: {
            url: 'https://vlada.gov.cz/cz/media-centrum/aktualne/od-tradicniho-remesla-po-vesmirne-technologie-do-zahrady-strakovy-akademie-dorazilo-na-dny-mpo-1578-navstevniku-228531/',
            label: {
                cs: 'Tisková zpráva Vlády ČR',
                en: 'Government Press Release',
            },
            type: 'web',
        },
        secondaryLink: {
            url: 'https://www.instagram.com/reel/Dcol8T2tSOo/?igsi=aHlmYXN2OGc2aWU3',
            label: {
                cs: 'Instagram Reel premiéra',
                en: 'Prime Minister Reel',
            },
            type: 'instagram',
        },
    },
    {
        id: 'urbis-brno-jun-2026',
        date: { cs: 'Červen 2026', en: 'June 2026' },
        year: '2026',
        outlet: 'URBIS Smart Cities',
        category: 'conference',
        title: {
            cs: 'URBIS The Smart Cities Meetup: Prezentace decentralizované čisté energie pro chytrá města',
            en: 'URBIS The Smart Cities Meetup: Decentralized Clean Energy for Smart Municipalities',
        },
        description: {
            cs: 'Představení funkčního prototypu energetického stromu a hybridních větrných technologií pro zástupce měst a municipalit na veletrhu v Brně.',
            en: 'Demonstrating the functional energy tree prototype and hybrid micro-wind technology to municipality leaders at the Smart Cities exhibition in Brno.',
        },
        photos: [
            {
                src: '/img/media/urbis-brno-june-2026.jpg',
                caption: {
                    cs: 'Expozice Treetino s funkčním modelem energetického stromu a vertikální turbíny na veletrhu URBIS na Výstavišti Brno',
                    en: 'Treetino exhibition booth with functional smart energy tree and vertical turbine at URBIS Smart Cities Meetup in Brno',
                },
                alt: {
                    cs: 'Expozice Treetino na veletrhu URBIS Brno',
                    en: 'Treetino booth at URBIS Smart Cities Brno',
                },
            },
        ],
        link: {
            url: 'https://www.bvv.cz/urbis',
            label: {
                cs: 'Web URBIS Brno',
                en: 'URBIS Brno Website',
            },
            type: 'web',
        },
    },
    {
        id: 'innovations-united-prague-castle-jun-2026',
        date: { cs: 'Červen 2026', en: 'June 2026' },
        year: '2026',
        outlet: 'Startup Disrupt',
        category: 'conference',
        title: {
            cs: 'Innovations United na Pražském hradě: Prezentace Treetino a postup do Top 5 startupů',
            en: 'Innovations United at Prague Castle: Treetino Keynote & Top 5 Pitch Contest Finalist',
        },
        description: {
            cs: 'Prezentace vize decentralizované čisté energie na mezinárodní konferenci Startup Disrupt na Pražském hradě spojená s úspěchem v pitch contestu mezi Top 5 startupy.',
            en: 'Keynote presentation on the future of micro-energy at the Startup Disrupt conference at Prague Castle and reaching the Top 5 finalist ranking in the global pitch contest.',
        },
        photos: [
            {
                src: '/img/media/innovations-united-prague-castle-2026.jpg',
                caption: {
                    cs: 'Keynote prezentace zakladatele Treetino na konferenci Innovations United na Pražském hradě',
                    en: 'Treetino founder delivering keynote presentation at Innovations United conference at Prague Castle',
                },
                alt: {
                    cs: 'Prezentace Treetino na Pražském hradě',
                    en: 'Treetino presentation at Prague Castle',
                },
            },
        ],
        link: {
            url: 'https://startupdisrupt.com/main-event/innovations-united-2025-prague-castle/',
            label: {
                cs: 'Web Innovations United',
                en: 'Innovations United Event',
            },
            type: 'web',
        },
    },
];

// Active Filter
const activeCategory = ref<'all' | 'tv' | 'press' | 'interview' | 'conference'>(
    'all',
);

const filteredAppearances = computed(() => {
    if (activeCategory.value === 'all') {
        return appearances;
    }

    return appearances.filter((item) => item.category === activeCategory.value);
});

// Group appearances into pairs of 2 for the 2-column timeline path
const appearancePairs = computed(() => {
    const list = filteredAppearances.value;
    const pairs: AppearanceItem[][] = [];
    for (let i = 0; i < list.length; i += 2) {
        pairs.push(list.slice(i, i + 2));
    }
    return pairs;
});

const categoryCounts = computed(() => {
    const counts: Record<string, number> = { all: appearances.length };
    appearances.forEach((item) => {
        counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return counts;
});

// Localization helper
const getLocalized = (obj?: { cs: string; en: string }) => {
    if (!obj) {
        return '';
    }

    const l = (locale.value || 'cs') as 'cs' | 'en';

    return obj[l] || obj.cs;
};

// Card-level active photo index tracking for smooth full-width slider
const cardPhotoIndices = ref<Record<string, number>>({});

const getCardPhotoIndex = (id: string) => cardPhotoIndices.value[id] || 0;

const setCardPhotoIndex = (id: string, index: number) => {
    cardPhotoIndices.value[id] = index;
};

const nextCardPhoto = (id: string, total: number) => {
    const current = getCardPhotoIndex(id);
    cardPhotoIndices.value[id] = (current + 1) % total;
};

const prevCardPhoto = (id: string, total: number) => {
    const current = getCardPhotoIndex(id);
    cardPhotoIndices.value[id] = (current - 1 + total) % total;
};

// Icon resolver helper for action links
const getLinkIcon = (type?: string, url?: string) => {
    if (type === 'instagram' || url?.includes('instagram.com')) {
        return Instagram;
    }
    if (type === 'youtube' || url?.includes('youtube.com') || url?.includes('youtu.be')) {
        return Youtube;
    }
    return Globe;
};

// Aggregate links for each card item
const getItemLinks = (item: AppearanceItem): AppearanceLink[] => {
    const links: AppearanceLink[] = [];
    if (item.secondaryLink) {
        links.push(item.secondaryLink);
    }
    if (item.link) {
        links.push(item.link);
    }
    return links;
};

// Fullscreen Video Modal state
const activeVideo = ref<MediaVideo | null>(null);
const videoPlayerRef = ref<HTMLVideoElement | null>(null);

const openVideoModal = (video: MediaVideo) => {
    activeVideo.value = video;
};

const closeVideoModal = () => {
    if (videoPlayerRef.value) {
        videoPlayerRef.value.pause();
    }

    activeVideo.value = null;
};

// Fullscreen Lightbox state
interface LightboxState {
    photos: MediaPhoto[];
    index: number;
    title: string;
}

const lightbox = ref<LightboxState | null>(null);

const openLightbox = (photos: MediaPhoto[], index: number, title: string) => {
    lightbox.value = {
        photos,
        index,
        title,
    };
};

const closeLightbox = () => {
    lightbox.value = null;
};

const nextLightboxPhoto = () => {
    if (!lightbox.value) {
        return;
    }

    lightbox.value.index =
        (lightbox.value.index + 1) % lightbox.value.photos.length;
};

const prevLightboxPhoto = () => {
    if (!lightbox.value) {
        return;
    }

    lightbox.value.index =
        (lightbox.value.index - 1 + lightbox.value.photos.length) %
        lightbox.value.photos.length;
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
        if (activeVideo.value) {
            closeVideoModal();
        }

        if (lightbox.value) {
            closeLightbox();
        }
    } else if (lightbox.value) {
        if (e.key === 'ArrowRight') {
            nextLightboxPhoto();
        } else if (e.key === 'ArrowLeft') {
            prevLightboxPhoto();
        }
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
        id="appearances"
        class="scroll-mt-32 border-t border-black/10 py-24 lg:py-36"
    >
        <!-- Section Header -->
        <div
            class="flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
            <div class="max-w-xl">
                <span
                    class="text-[10px] font-semibold tracking-[0.25em] text-t-blue uppercase"
                >
                    {{ $t('media.appearances_tag') }}
                </span>
                <h2
                    class="mt-2 text-2xl font-normal tracking-tight text-black sm:text-3xl"
                >
                    {{ $t('media.appearances_title') }}
                </h2>
                <p
                    class="mt-2 text-xs sm:text-sm leading-relaxed text-black/60"
                >
                    {{ $t('media.appearances_desc') }}
                </p>
            </div>

            <!-- Total count indicator -->
            <div class="hidden text-[11px] font-mono text-black/40 md:block">
                {{ appearances.length }} {{ $t('media.appearances_count') }}
            </div>
        </div>

        <!-- Minimalist Category Filter Tabs -->
        <div
            class="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-black/10 text-xs"
        >
            <button
                type="button"
                @click="activeCategory = 'all'"
                class="cursor-pointer pb-2.5 font-medium transition-colors"
                :class="
                    activeCategory === 'all'
                        ? '-mb-px border-b border-t-blue font-semibold text-black'
                        : 'text-black/45 hover:text-black'
                "
            >
                {{ $t('media.filter_all') }}
                <span class="text-[10px] opacity-60">({{ categoryCounts.all }})</span>
            </button>

            <button
                v-if="categoryCounts.tv"
                type="button"
                @click="activeCategory = 'tv'"
                class="cursor-pointer pb-2.5 font-medium transition-colors"
                :class="
                    activeCategory === 'tv'
                        ? '-mb-px border-b border-t-blue font-semibold text-black'
                        : 'text-black/45 hover:text-black'
                "
            >
                {{ $t('media.filter_tv') }}
                <span class="text-[10px] opacity-60">({{ categoryCounts.tv }})</span>
            </button>

            <button
                v-if="categoryCounts.press"
                type="button"
                @click="activeCategory = 'press'"
                class="cursor-pointer pb-2.5 font-medium transition-colors"
                :class="
                    activeCategory === 'press'
                        ? '-mb-px border-b border-t-blue font-semibold text-black'
                        : 'text-black/45 hover:text-black'
                "
            >
                {{ $t('media.filter_press') }}
                <span class="text-[10px] opacity-60">({{ categoryCounts.press }})</span>
            </button>

            <button
                v-if="categoryCounts.interview"
                type="button"
                @click="activeCategory = 'interview'"
                class="cursor-pointer pb-2.5 font-medium transition-colors"
                :class="
                    activeCategory === 'interview'
                        ? '-mb-px border-b border-t-blue font-semibold text-black'
                        : 'text-black/45 hover:text-black'
                "
            >
                {{ $t('media.filter_interview') }}
                <span class="text-[10px] opacity-60">({{ categoryCounts.interview }})</span>
            </button>

            <button
                v-if="categoryCounts.conference"
                type="button"
                @click="activeCategory = 'conference'"
                class="cursor-pointer pb-2.5 font-medium transition-colors"
                :class="
                    activeCategory === 'conference'
                        ? '-mb-px border-b border-t-blue font-semibold text-black'
                        : 'text-black/45 hover:text-black'
                "
            >
                {{ $t('media.filter_conference') }}
                <span class="text-[10px] opacity-60">({{ categoryCounts.conference }})</span>
            </button>
        </div>

        <!-- 2-COLUMN SEAMLESS SERPENTINE TIMELINE -->
        <div class="mt-16 px-4 sm:px-6 md:px-8 space-y-24 lg:space-y-32">
            <div
                v-for="(pair, pairIdx) in appearancePairs"
                :key="'pair-' + pairIdx"
                class="relative"
            >
                <!-- 1. DESKTOP EXACT HORIZONTAL TRACK ACROSS CARDS -->
                <div
                    class="hidden md:block absolute top-0 left-0 right-0 h-px bg-t-blue/35 pointer-events-none"
                ></div>

                <!-- 2. DESKTOP DEDICATED U-TURN SIDE BRACKETS (NO OVERLAYS OR DOUBLE LINES) -->
                <!-- Even Row (0, 2, 4): Drop loop on RIGHT side connecting down to next row -->
                <div
                    v-if="pairIdx % 2 === 0 && pairIdx < appearancePairs.length - 1"
                    class="hidden md:block absolute top-0 -right-8 lg:-right-10 w-8 lg:w-10 h-[calc(100%+6rem)] lg:h-[calc(100%+8rem)] border-t border-r border-b border-t-blue/35 rounded-r-2xl pointer-events-none"
                ></div>

                <!-- Odd Row (1, 3): Drop loop on LEFT side connecting down to next row -->
                <div
                    v-else-if="pairIdx % 2 === 1 && pairIdx < appearancePairs.length - 1"
                    class="hidden md:block absolute top-0 -left-8 lg:-left-10 w-8 lg:w-10 h-[calc(100%+6rem)] lg:h-[calc(100%+8rem)] border-t border-l border-b border-t-blue/35 rounded-l-2xl pointer-events-none"
                ></div>

                <!-- 3. MOBILE CONTINUOUS LEFT TIMELINE LINE -->
                <div
                    class="md:hidden absolute top-0 bottom-0 left-0 w-px bg-t-blue/35 pointer-events-none"
                ></div>

                <!-- 2 Media Appearances Side by Side -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-x-14 lg:gap-x-20 gap-y-12">
                    <article
                        v-for="item in pair"
                        :key="item.id"
                        class="relative flex flex-col justify-between pt-5 pl-5 md:pl-0"
                    >
                        <!-- Timeline Node Pip directly on the continuous blue path -->
                        <div
                            class="absolute top-[-3.5px] -left-[3.5px] md:left-0 flex h-2 w-2 items-center justify-center rounded-full bg-t-blue ring-2 ring-white z-10"
                        ></div>

                        <div>
                            <!-- Date & Outlet Row -->
                            <div class="flex items-center justify-between text-[11px] tracking-wide">
                                <span class="font-semibold uppercase text-black/85">
                                    {{ item.outlet }}
                                </span>
                                <span class="font-mono text-[10px] text-t-blue font-medium">
                                    {{ getLocalized(item.date) }}
                                </span>
                            </div>

                            <!-- Title -->
                            <h3 class="mt-2 text-sm sm:text-base font-medium leading-snug tracking-tight text-black transition-colors hover:text-t-blue">
                                {{ getLocalized(item.title) }}
                            </h3>

                            <!-- Excerpt Description (Fully displayed, concise and calibrated) -->
                            <p class="mt-2 text-xs leading-relaxed text-black/60">
                                {{ getLocalized(item.description) }}
                            </p>

                            <!-- Visual Media Assets (Proportional Full-Width 16:9 Displays for 1, 2, or 3 assets) -->
                            <div
                                v-if="item.video || (item.photos && item.photos.length > 0)"
                                class="mt-4 space-y-2"
                            >
                                <!-- Video Player Preview (if item has video) -->
                                <div
                                    v-if="item.video"
                                    @click="openVideoModal(item.video)"
                                    class="group/vid relative aspect-16/9 w-full cursor-pointer overflow-hidden bg-zinc-950"
                                >
                                    <img
                                        v-if="item.video.poster"
                                        :src="item.video.poster"
                                        :alt="getLocalized(item.title)"
                                        class="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover/vid:scale-103"
                                        loading="lazy"
                                    />
                                    <div class="absolute inset-0 bg-black/15 transition-opacity group-hover/vid:bg-black/5"></div>
                                    <div class="absolute inset-0 flex items-center justify-center">
                                        <div class="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-black shadow-sm transition-transform duration-200 group-hover/vid:scale-110 group-hover/vid:bg-t-blue group-hover/vid:text-white">
                                            <Play class="ml-0.5 h-3.5 w-3.5 fill-current" />
                                        </div>
                                    </div>
                                    <div
                                        v-if="item.video.duration"
                                        class="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 font-mono text-[9px] text-white"
                                    >
                                        {{ item.video.duration }}
                                    </div>
                                </div>

                                <!-- Supporting Photos Duo below Video (e.g. Praha TV BTS photos) -->
                                <div
                                    v-if="item.video && item.photos && item.photos.length > 0"
                                    class="grid grid-cols-2 gap-2"
                                >
                                    <div
                                        v-for="(photo, photoIdx) in item.photos"
                                        :key="photo.src"
                                        @click="openLightbox(item.photos!, photoIdx, getLocalized(item.title))"
                                        class="group/photo relative aspect-16/9 cursor-pointer overflow-hidden bg-zinc-900"
                                    >
                                        <img
                                            :src="photo.src"
                                            :alt="getLocalized(photo.alt)"
                                            class="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover/photo:scale-103"
                                            loading="lazy"
                                        />
                                        <div class="absolute inset-0 bg-black/0 transition-colors group-hover/photo:bg-black/15"></div>
                                        <div class="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover/photo:opacity-100">
                                            <Maximize2 class="h-2.5 w-2.5" />
                                        </div>
                                    </div>
                                </div>

                                <!-- Full-Width Photo Carousel (For items without video: 1 or 2+ photos) -->
                                <div
                                    v-else-if="item.photos && item.photos.length > 0"
                                    class="group/photo relative aspect-16/9 w-full cursor-pointer overflow-hidden bg-zinc-900 select-none"
                                    @click="openLightbox(item.photos!, getCardPhotoIndex(item.id), getLocalized(item.title))"
                                >
                                    <img
                                        :src="item.photos[getCardPhotoIndex(item.id)].src"
                                        :alt="getLocalized(item.photos[getCardPhotoIndex(item.id)].alt)"
                                        class="h-full w-full object-cover opacity-90 transition-all duration-300 group-hover/photo:scale-103"
                                        loading="lazy"
                                    />
                                    <div class="absolute inset-0 bg-black/0 transition-colors group-hover/photo:bg-black/10"></div>

                                    <!-- Maximize icon badge -->
                                    <div class="absolute top-2 right-2 flex h-5 w-5 items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover/photo:opacity-100">
                                        <Maximize2 class="h-3 w-3" />
                                    </div>

                                    <!-- Multi-photo controls (when 2+ photos) -->
                                    <template v-if="item.photos.length > 1">
                                        <!-- Prev Arrow -->
                                        <button
                                            type="button"
                                            @click.stop="prevCardPhoto(item.id, item.photos.length)"
                                            class="absolute top-1/2 left-2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-xs transition-all hover:bg-black/90 hover:scale-105 group-hover/photo:opacity-100 cursor-pointer"
                                            aria-label="Previous photo"
                                        >
                                            <ChevronLeft class="h-4 w-4" />
                                        </button>

                                        <!-- Next Arrow -->
                                        <button
                                            type="button"
                                            @click.stop="nextCardPhoto(item.id, item.photos.length)"
                                            class="absolute top-1/2 right-2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-xs transition-all hover:bg-black/90 hover:scale-105 group-hover/photo:opacity-100 cursor-pointer"
                                            aria-label="Next photo"
                                        >
                                            <ChevronRight class="h-4 w-4" />
                                        </button>

                                        <!-- Bottom Dots Indicator / Photo Counter -->
                                        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-xs">
                                            <button
                                                v-for="(_, dotIdx) in item.photos"
                                                :key="dotIdx"
                                                type="button"
                                                @click.stop="setCardPhotoIndex(item.id, dotIdx)"
                                                class="h-1.5 rounded-full transition-all cursor-pointer"
                                                :class="getCardPhotoIndex(item.id) === dotIdx ? 'w-3.5 bg-white' : 'w-1.5 bg-white/40 hover:bg-white/70'"
                                            ></button>
                                        </div>

                                        <!-- Photo count pill -->
                                        <div class="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 font-mono text-[9px] text-white/90">
                                            {{ getCardPhotoIndex(item.id) + 1 }} / {{ item.photos.length }}
                                        </div>
                                    </template>
                                </div>
                            </div>
                        </div>

                        <!-- Action Links Row with Enhanced Visibility & Icons -->
                        <div class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-3 text-xs">
                            <div class="flex items-center gap-3">
                                <button
                                    v-if="item.video"
                                    type="button"
                                    @click="openVideoModal(item.video)"
                                    class="inline-flex cursor-pointer items-center gap-1.5 font-medium text-t-blue hover:text-t-blue/80 hover:underline text-[11px]"
                                >
                                    <Play class="h-3 w-3 fill-current" />
                                    <span>{{ $t('media.play_reportage') }}</span>
                                </button>
                                <button
                                    v-else-if="item.photos && item.photos.length > 0"
                                    type="button"
                                    @click="openLightbox(item.photos, getCardPhotoIndex(item.id), getLocalized(item.title))"
                                    class="inline-flex cursor-pointer items-center gap-1.5 font-medium text-black/75 hover:text-black hover:underline text-[11px]"
                                >
                                    <Maximize2 class="h-3 w-3" />
                                    <span>{{ locale === 'cs' ? 'Zobrazit fotografie' : 'View Photos' }}</span>
                                </button>
                            </div>

                            <!-- External Links & Social Pills with Distinct Icons -->
                            <div class="flex flex-wrap items-center gap-1.5">
                                <a
                                    v-for="(lnk, lIdx) in getItemLinks(item)"
                                    :key="lIdx"
                                    :href="lnk.url"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    class="group/lnk inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.04] px-2.5 py-1 text-[11px] font-medium text-black/80 transition-all hover:border-black/20 hover:bg-black/[0.08] hover:text-black"
                                >
                                    <component
                                        :is="getLinkIcon(lnk.type, lnk.url)"
                                        class="h-3 w-3 transition-transform duration-200 group-hover/lnk:scale-110"
                                        :class="
                                            lnk.type === 'instagram' || lnk.url.includes('instagram.com')
                                                ? 'text-pink-600'
                                                : lnk.type === 'youtube' || lnk.url.includes('youtube.com')
                                                  ? 'text-red-600'
                                                  : 'text-t-blue'
                                        "
                                    />
                                    <span>{{ getLocalized(lnk.label) }}</span>
                                    <ExternalLink class="h-2.5 w-2.5 opacity-40 transition-opacity group-hover/lnk:opacity-90" />
                                </a>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </div>

        <!-- FULLSCREEN VIDEO PLAYER MODAL -->
        <Transition name="modal-fade">
            <div
                v-if="activeVideo"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-md sm:p-8"
                @click.self="closeVideoModal"
            >
                <div class="relative flex w-full max-w-5xl flex-col overflow-hidden bg-zinc-950 text-white shadow-2xl">
                    <!-- Modal Header Bar -->
                    <div class="flex items-center justify-between border-b border-white/10 bg-zinc-900/90 px-6 py-4">
                        <div class="flex items-center gap-3">
                            <span class="bg-t-blue px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
                                VIDEO
                            </span>
                            <h4 class="max-w-[280px] truncate text-sm font-medium text-white sm:max-w-lg sm:text-base">
                                {{ getLocalized(activeVideo.title) || $t('media.play_reportage') }}
                            </h4>
                        </div>
                        <button
                            type="button"
                            @click="closeVideoModal"
                            class="cursor-pointer p-2 text-white/70 transition hover:text-white"
                            :title="$t('media.close_video')"
                        >
                            <X class="h-5 w-5" />
                        </button>
                    </div>

                    <!-- Local MP4 Video Player -->
                    <div
                        v-if="activeVideo.type === 'mp4'"
                        class="relative aspect-16/9 w-full bg-black"
                    >
                        <video
                            ref="videoPlayerRef"
                            :src="activeVideo.src"
                            :poster="activeVideo.poster"
                            controls
                            autoplay
                            playsinline
                            class="h-full w-full object-contain"
                        ></video>
                    </div>

                    <!-- YouTube Video Embed -->
                    <div
                        v-else
                        class="relative aspect-16/9 w-full bg-black"
                    >
                        <iframe
                            :src="`https://www.youtube.com/embed/${activeVideo.src}?autoplay=1&rel=0&modestbranding=1`"
                            :title="getLocalized(activeVideo.title)"
                            class="absolute inset-0 h-full w-full border-0"
                            allow="
                                accelerometer;
                                autoplay;
                                clipboard-write;
                                encrypted-media;
                                gyroscope;
                                picture-in-picture;
                                web-share;
                            "
                            allowfullscreen
                        ></iframe>
                    </div>

                    <!-- Modal Footer Bar -->
                    <div class="flex items-center justify-between border-t border-white/10 bg-zinc-900/90 px-6 py-3 text-xs text-white/70">
                        <span>Treetino Media Coverage</span>
                        <a
                            v-if="activeVideo.type === 'mp4'"
                            :href="activeVideo.src"
                            download
                            class="inline-flex items-center gap-1.5 font-medium text-t-blue transition hover:underline"
                        >
                            <span>Stáhnout video (MP4)</span>
                        </a>
                        <a
                            v-else
                            :href="`https://www.youtube.com/watch?v=${activeVideo.src}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 font-medium text-t-blue transition hover:underline"
                        >
                            <span>{{ $t('media.open_on_youtube') }}</span>
                            <ExternalLink class="h-3.5 w-3.5" />
                        </a>
                    </div>
                </div>
            </div>
        </Transition>

        <!-- FULLSCREEN PHOTO LIGHTBOX MODAL -->
        <Transition name="modal-fade">
            <div
                v-if="lightbox"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/92 p-4 backdrop-blur-md sm:p-8"
                @click.self="closeLightbox"
            >
                <div class="relative flex max-h-[92vh] w-full max-w-5xl flex-col items-center justify-center">
                    <!-- Close button Top Right -->
                    <button
                        type="button"
                        @click="closeLightbox"
                        class="absolute -top-12 right-0 z-10 flex h-10 w-10 cursor-pointer items-center justify-center text-white/80 transition hover:text-white"
                        :title="$t('media.close_lightbox')"
                    >
                        <X class="h-6 w-6" />
                    </button>

                    <!-- Image Display Area -->
                    <div class="relative flex max-h-[78vh] w-full items-center justify-center overflow-hidden bg-zinc-950 shadow-2xl">
                        <Transition name="slide-fade" mode="out-in">
                            <img
                                :key="lightbox.photos[lightbox.index].src"
                                :src="lightbox.photos[lightbox.index].src"
                                :alt="getLocalized(lightbox.photos[lightbox.index].alt)"
                                class="max-h-[78vh] w-auto max-w-full object-contain"
                            />
                        </Transition>

                        <!-- Prev Button Left -->
                        <button
                            v-if="lightbox.photos.length > 1"
                            type="button"
                            @click.stop="prevLightboxPhoto"
                            class="absolute top-1/2 left-3 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-black/70 text-white shadow-lg backdrop-blur-xs transition hover:bg-black"
                            aria-label="Previous photo"
                        >
                            <ChevronLeft class="h-6 w-6" />
                        </button>

                        <!-- Next Button Right -->
                        <button
                            v-if="lightbox.photos.length > 1"
                            type="button"
                            @click.stop="nextLightboxPhoto"
                            class="absolute top-1/2 right-3 z-20 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center bg-black/70 text-white shadow-lg backdrop-blur-xs transition hover:bg-black"
                            aria-label="Next photo"
                        >
                            <ChevronRight class="h-6 w-6" />
                        </button>
                    </div>

                    <!-- Caption & Counter Bar Below Image -->
                    <div class="mt-4 flex w-full flex-col items-center justify-between gap-2 px-2 text-center sm:flex-row sm:text-left">
                        <p class="text-sm font-medium text-white/90">
                            {{ getLocalized(lightbox.photos[lightbox.index].caption) }}
                        </p>
                        <div
                            v-if="lightbox.photos.length > 1"
                            class="font-mono text-xs text-white/60"
                        >
                            {{ lightbox.index + 1 }} / {{ lightbox.photos.length }}
                        </div>
                    </div>
                </div>
            </div>
        </Transition>
    </section>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
    transition: opacity 0.25s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
    opacity: 0;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.slide-fade-enter-from {
    opacity: 0;
    transform: scale(0.98);
}

.slide-fade-leave-to {
    opacity: 0;
    transform: scale(1.02);
}
</style>
