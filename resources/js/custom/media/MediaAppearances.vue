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
    Linkedin,
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
    youtubeId?: string;
    poster?: string;
    type: 'mp4' | 'youtube';
    duration?: string;
    tag?: string;
    title?: { cs: string; en: string };
    description?: { cs: string; en: string };
}

export interface AppearanceLink {
    url: string;
    label: { cs: string; en: string };
    type?: 'instagram' | 'web' | 'youtube' | 'article' | 'external' | 'linkedin';
}

export interface AppearanceItem {
    id: string;
    date: { cs: string; en: string };
    year: string;
    outlet: { cs: string; en: string } | string;
    category: 'tv' | 'press' | 'interview' | 'conference';
    title: { cs: string; en: string };
    description: { cs: string; en: string };
    link?: AppearanceLink;
    secondaryLink?: AppearanceLink;
    links?: AppearanceLink[];
    video?: MediaVideo;
    photos?: MediaPhoto[]; // 0, 1, 2, or 3 photos
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
            tag: 'TV REPORTÁŽ',
            duration: '3:00',
            title: {
                cs: 'Praha TV: Oficiální televizní reportáž Treetino',
                en: 'Praha TV: Official Treetino Television Feature',
            },
            description: {
                cs: 'Návštěva televizního štábu ve vývojovém centru Treetino, představení prototypu a plánu pilotních instalací.',
                en: 'Praha TV feature covering the working prototype, branch articulation mechanism, and pilot installations.',
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
        outlet: {
            cs: 'Úřad vlády ČR & MPO',
            en: 'Office of the Government & MIT',
        },
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
            {
                src: '/img/media/strakova-akademie-stanek-expozice.jpg',
                caption: {
                    cs: 'Výstavní expozice a stánek Treetino v zahradě Strakovy akademie (Úřad vlády ČR)',
                    en: 'Treetino outdoor exhibition booth in the gardens of the Straka Academy (Office of the Government)',
                },
                alt: {
                    cs: 'Výstavní stánek Treetino ve Strakově akademii',
                    en: 'Treetino exhibition booth at Straka Academy',
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
    {
        id: 'start-it-csob-apr-2026',
        date: { cs: 'Duben 2026', en: 'April 2026' },
        year: '2026',
        outlet: 'Start it @ČSOB',
        category: 'conference',
        title: {
            cs: 'Start it @ČSOB: Úspěšné zakončení 16. vlny prestižního startupového akcelerátoru',
            en: 'Start it @ČSOB: Successful Graduation from 16th Cohort of the Startup Accelerator',
        },
        description: {
            cs: 'Úspěšné absolvování 5měsíčního akceleračního programu ČSOB zaměřeného na škálování byznys modelu, bankovní validaci a finální Demo Day v Praze.',
            en: 'Graduation from the 5-month intensive ČSOB banking accelerator program focused on business model scaling, enterprise validation, and Demo Day in Prague.',
        },
        photos: [
            {
                src: '/img/media/start-it-csob-acceleration-2026.jpg',
                caption: {
                    cs: 'Tým Treetino s dalšími zakladateli a mentory na setkání 16. vlny akcelerátoru Start it @ČSOB v Praze',
                    en: 'Treetino founder with cohort founders and mentors during the 16th wave of Start it @ČSOB accelerator in Prague',
                },
                alt: {
                    cs: 'Akcelerátor Start it @ČSOB',
                    en: 'Start it @ČSOB Accelerator Cohort',
                },
            },
        ],
        link: {
            url: 'https://www.linkedin.com/posts/start-it-csob_akcelerace-activity-7455603853829238784-qrKc',
            label: {
                cs: 'Příspěvek na LinkedIn',
                en: 'LinkedIn Announcement',
            },
            type: 'linkedin',
        },
    },
    {
        id: 'sxsw-austin-mar-2026',
        date: { cs: 'Březen 2026', en: 'March 2026' },
        year: '2026',
        outlet: {
            cs: 'Czech House SXSW | Vládní mise USA',
            en: 'Czech House SXSW | US Trade Mission',
        },
        category: 'conference',
        title: {
            cs: 'SXSW Austin & Vládní mise USA: Expozice v Czech House a let vládním speciálem s ministrem',
            en: 'SXSW Austin & US Trade Mission: Czech House Showcase and Government Special Flight with Minister',
        },
        description: {
            cs: 'Účast na prestižním festivalu SXSW v Texasu v rámci české technologické delegace. Prezentace prototypu v Czech House a cesta vládním speciálem s ministrem průmyslu a obchodu.',
            en: 'Representing Czech innovation at the SXSW festival in Texas as part of the official trade delegation. Prototyping showcase at Czech House and flight aboard the government aircraft with the Minister.',
        },
        photos: [
            {
                src: '/img/media/sxsw-austin-czech-house-2026.jpg',
                caption: {
                    cs: 'Expozice Treetino s funkčním modelem v Czech House na festivalu SXSW 2026 v Austinu v Texasu',
                    en: 'Treetino exhibition with functional prototype at Czech House during SXSW 2026 in Austin, Texas',
                },
                alt: {
                    cs: 'Czech House SXSW Austin expozice Treetino',
                    en: 'Czech House SXSW Austin Treetino exhibition',
                },
            },
            {
                src: '/img/media/vladni-special-ministr-mpo-2026.jpg',
                caption: {
                    cs: 'Zakladatel Treetino na palubě vládního speciálu s ministrem průmyslu a obchodu během obchodní mise do USA',
                    en: 'Treetino founder aboard the Czech government aircraft with the Minister of Industry and Trade during US trade mission',
                },
                alt: {
                    cs: 'Let vládním speciálem s ministrem',
                    en: 'Flight on government aircraft with Minister',
                },
            },
            {
                src: '/img/media/treetino-washington-monument-2026.jpg',
                caption: {
                    cs: 'Prezentace konceptu Treetino před Washingtonovým monumentem ve Washingtonu D.C.',
                    en: 'Treetino concept showcase in front of the Washington Monument in Washington D.C.',
                },
                alt: {
                    cs: 'Treetino u Washingtonova monumentu ve Washingtonu D.C.',
                    en: 'Treetino at Washington Monument in Washington D.C.',
                },
            },
        ],
        link: {
            url: 'https://www.sxsw.com',
            label: {
                cs: 'Web SXSW',
                en: 'SXSW Website',
            },
            type: 'web',
        },
    },
    {
        id: 'protocol-labs-founders-forge-feb-2026',
        date: { cs: 'Únor 2026', en: 'February 2026' },
        year: '2026',
        outlet: 'Protocol Labs | Founders Forge',
        category: 'conference',
        title: {
            cs: 'Protocol Labs: Founders Forge Web3 akcelerátor & Demo Day v Dubaji',
            en: 'Protocol Labs: Founders Forge Web3 Accelerator & Demo Day in Dubai',
        },
        description: {
            cs: 'Prestižní globální Web3 & DePIN akcelerační program od Protocol Labs (IPFS, Filecoin). 8 vybraných týmů, Dubai Build Week a závěrečný Demo Day v Dubaji.',
            en: 'Prestigious global Web3 & DePIN accelerator by Protocol Labs (IPFS, Filecoin). 8 selected startups, Dubai Build Week, and mainstage Demo Day in Dubai.',
        },
        video: {
            src: '8L4wr9YIe88',
            youtubeId: '8L4wr9YIe88',
            poster: '/img/media/protocol-labs-founders-forge.webp',
            type: 'youtube',
            tag: 'WEB3 & DEPIN',
            duration: '12:07',
            title: {
                cs: 'Founders Forge: Dokumentární film (Cohort 1, Dubaj)',
                en: 'Founders Forge: The Documentary (Cohort 1, Dubai)',
            },
            description: {
                cs: 'Dokumentární film o globálním akcelerátoru Founders Forge v Dubaji od Protocol Labs. 8 vybraných týmů z celého světa, Dubai Build Week a Demo Day.',
                en: 'Documentary covering the Founders Forge accelerator in Dubai by Protocol Labs. 8 selected startups worldwide, Dubai Build Week, and mainstage Demo Day.',
            },
        },
        photos: [
            {
                src: '/img/media/protocol-labs-dubai-pitch-stage.jpg',
                caption: {
                    cs: 'Prezentace klíčových parametrů a výkonu stromu Treetino na Demo Day Protocol Labs v Dubaji',
                    en: 'Presenting Treetino key energy specs and footprint metrics on stage at Protocol Labs Demo Day in Dubai',
                },
                alt: {
                    cs: 'Prezentace Treetino na Protocol Labs Demo Day v Dubaji',
                    en: 'Treetino presentation at Protocol Labs Demo Day in Dubai',
                },
            },
            {
                src: '/img/media/protocol-labs-dubai-founder.jpg',
                caption: {
                    cs: 'Zakladatel Treetino během globálního akceleračního programu Founders Forge v Dubaji',
                    en: 'Treetino founder during the Founders Forge global accelerator program in Dubai',
                },
                alt: {
                    cs: 'Zakladatel Treetino na akcelerátoru v Dubaji',
                    en: 'Treetino founder at Dubai accelerator',
                },
            },
        ],
        link: {
            url: 'https://www.youtube.com/watch?v=8L4wr9YIe88',
            label: {
                cs: 'Dokument na YouTube (12:07)',
                en: 'Watch Documentary on YouTube',
            },
            type: 'youtube',
        },
    },
    {
        id: 'make-iton-hw-inkubace',
        date: { cs: 'Prosinec 2025', en: 'December 2025' },
        year: '2025',
        outlet: 'Make-iton | Maker Institute',
        category: 'tv',
        title: {
            cs: 'Make-iton: Hardwarová inkubace prototypu, 3D tisk v HWLabu a cesta ke klientům',
            en: 'Make-iton: Hardware Prototyping in HWLab & Scaling to Real-World Clients',
        },
        description: {
            cs: 'Kompletní dokumentace z hardwarového inkubátoru Make-iton: stavba funkčního prototypu a 3D tisk v HWLabu a Next Zone, mentoring a posun projektu k reálným klientům.',
            en: 'Full video coverage from the Make-iton hardware incubator: functional prototype fabrication and 3D printing in HWLab & Next Zone, mentoring, and scaling to infrastructure deployments.',
        },
        video: {
            src: 'oA5reK7ao-4',
            youtubeId: 'oA5reK7ao-4',
            poster: '/img/media/make-iton-epizoda-3.webp',
            type: 'youtube',
            tag: 'HW INKUBACE',
            duration: '8:27',
            title: {
                cs: 'Make-iton | Epizoda 3: Tohle není projekt do šuplíku (8:27)',
                en: 'Make-iton | Episode 3: This is not a project for the drawer (8:27)',
            },
            description: {
                cs: 'Epizoda 3: Zákulisí stavby a 3D tisku prototypu energetického stromu v HWLabu a Next Zone během akcelerace Make-iton.',
                en: 'Episode 3: Inside the fabrication and 3D prototyping of Treetino smart energy tree in HWLab & Next Zone during Make-iton incubation.',
            },
        },
        links: [
            {
                url: 'https://www.youtube.com/watch?v=oA5reK7ao-4',
                label: {
                    cs: 'Epizoda #3 na YouTube (8:27)',
                    en: 'Episode #3 on YouTube (8:27)',
                },
                type: 'youtube',
            },
            {
                url: 'https://www.youtube.com/shorts/YhcpdJfqPzc',
                label: {
                    cs: 'YouTube Short #2',
                    en: 'YouTube Short #2',
                },
                type: 'youtube',
            },
            {
                url: 'https://www.youtube.com/shorts/rJZwoj4hXgo',
                label: {
                    cs: 'YouTube Short #1',
                    en: 'YouTube Short #1',
                },
                type: 'youtube',
            },
            {
                url: 'https://www.makerinstitute.cz',
                label: {
                    cs: 'Web Maker Institute',
                    en: 'Maker Institute Web',
                },
                type: 'web',
            },
        ],
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
const getLocalized = (obj?: { cs: string; en: string } | string) => {
    if (!obj) {
        return '';
    }
    if (typeof obj === 'string') {
        return obj;
    }

    const l = (locale.value || 'cs') as 'cs' | 'en';

    return obj[l] || obj.cs;
};

// UI Label helpers
const playReportageLabel = computed(() =>
    locale.value === 'cs' ? 'Přehrát reportáž' : 'Play Feature'
);
const viewPhotosLabel = computed(() =>
    locale.value === 'cs' ? 'Zobrazit fotografie' : 'View Photos'
);
const closeVideoLabel = computed(() =>
    locale.value === 'cs' ? 'Zavřít video' : 'Close Video'
);
const closeLightboxLabel = computed(() =>
    locale.value === 'cs' ? 'Zavřít' : 'Close'
);
const openOnYoutubeLabel = computed(() =>
    locale.value === 'cs' ? 'Otevřít na YouTube' : 'Open on YouTube'
);

// Icon resolver helper for action links
const getLinkIcon = (type?: string, url?: string) => {
    if (type === 'linkedin' || url?.includes('linkedin.com')) {
        return Linkedin;
    }
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
    if (item.links && item.links.length > 0) {
        return item.links;
    }
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
                    {{ locale === 'cs' ? 'Časová osa & Výstupy' : 'Timeline & Coverage' }}
                </span>
                <h2
                    class="mt-2 text-2xl font-normal tracking-tight text-black sm:text-3xl"
                >
                    {{ locale === 'cs' ? 'Mediální výstupy & Vystoupení' : 'Media Appearances & Coverage' }}
                </h2>
                <p
                    class="mt-2 text-xs sm:text-sm leading-relaxed text-black/60"
                >
                    {{ locale === 'cs' ? 'Přehled televizních reportáží, tiskových zpráv, rozhovorů a vystoupení zakladatelů projektu Treetino v médiích.' : 'A curated timeline of television features, press coverage, interviews, and public appearances by the Treetino founders.' }}
                </p>
            </div>

            <!-- Total count indicator -->
            <div class="hidden text-[11px] font-mono text-black/40 md:block">
                {{ appearances.length }} {{ locale === 'cs' ? 'mediálních záznamů' : 'media entries' }}
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
                {{ locale === 'cs' ? 'Všechny výstupy' : 'All Appearances' }}
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
                {{ locale === 'cs' ? 'TV & Video' : 'TV & Video' }}
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
                {{ locale === 'cs' ? 'Tisk & Články' : 'Press & Articles' }}
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
                {{ locale === 'cs' ? 'Rozhovory & Podcasty' : 'Interviews & Podcasts' }}
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
                {{ locale === 'cs' ? 'Eventy & Konference' : 'Events & Conferences' }}
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
                                    {{ getLocalized(item.outlet) }}
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

                                <!-- Supporting Photos Duo below Video (e.g. Praha TV BTS photos, Protocol Labs photos) -->
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

                                <!-- Photo-only cards (NO slideshow: 1 Main 16:9 Photo + Companion Thumbnails below) -->
                                <template v-else-if="item.photos && item.photos.length > 0">
                                    <!-- Primary Main Photo (16:9 full width) -->
                                    <div
                                        @click="openLightbox(item.photos!, 0, getLocalized(item.title))"
                                        class="group/photo relative aspect-16/9 w-full cursor-pointer overflow-hidden bg-zinc-900"
                                    >
                                        <img
                                            :src="item.photos[0].src"
                                            :alt="getLocalized(item.photos[0].alt)"
                                            class="h-full w-full object-cover opacity-90 transition-transform duration-300 group-hover/photo:scale-103"
                                            loading="lazy"
                                        />
                                        <div class="absolute inset-0 bg-black/0 transition-colors group-hover/photo:bg-black/10"></div>
                                        <div class="absolute top-2 right-2 flex h-5 w-5 items-center justify-center bg-black/60 text-white opacity-0 transition-opacity group-hover/photo:opacity-100">
                                            <Maximize2 class="h-3 w-3" />
                                        </div>
                                    </div>

                                    <!-- Companion Photos below (Photos 2 & 3 in 16:9 grid) -->
                                    <div
                                        v-if="item.photos.length > 1"
                                        class="grid grid-cols-2 gap-2"
                                    >
                                        <div
                                            v-for="(photo, photoIdx) in item.photos.slice(1)"
                                            :key="photo.src"
                                            @click="openLightbox(item.photos!, photoIdx + 1, getLocalized(item.title))"
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
                                </template>
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
                                    <span>{{ playReportageLabel }}</span>
                                </button>
                                <button
                                    v-else-if="item.photos && item.photos.length > 0"
                                    type="button"
                                    @click="openLightbox(item.photos, 0, getLocalized(item.title))"
                                    class="inline-flex cursor-pointer items-center gap-1.5 font-medium text-black/75 hover:text-black hover:underline text-[11px]"
                                >
                                    <Maximize2 class="h-3 w-3" />
                                    <span>{{ viewPhotosLabel }}</span>
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
                                            lnk.type === 'linkedin' || lnk.url.includes('linkedin.com')
                                                ? 'text-[#0a66c2]'
                                                : lnk.type === 'instagram' || lnk.url.includes('instagram.com')
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

        <!-- Video Player Modal (Clean Light Mode matching earlier Media section) -->
        <Transition name="modal-fade">
            <div
                v-if="activeVideo"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm sm:p-6"
                @click.self="closeVideoModal"
            >
                <div
                    class="relative w-full max-w-4xl overflow-hidden rounded-2xl border border-black/10 bg-white text-black shadow-2xl sm:rounded-3xl"
                >
                    <!-- Modal Top Bar -->
                    <div
                        class="flex items-center justify-between gap-3 border-b border-black/10 bg-white px-4 py-3 sm:px-6 sm:py-4"
                    >
                        <div
                            class="flex min-w-0 flex-1 items-center gap-2 sm:gap-3"
                        >
                            <span
                                class="shrink-0 whitespace-nowrap rounded-full bg-t-blue/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-t-blue uppercase sm:px-2.5 sm:text-[11px]"
                            >
                                {{ activeVideo.tag || 'VIDEO' }}
                            </span>
                            <h4
                                class="min-w-0 flex-1 truncate text-xs font-semibold text-black sm:text-base"
                            >
                                {{
                                    getLocalized(activeVideo.title) ||
                                    playReportageLabel
                                }}
                            </h4>
                        </div>
                        <button
                            type="button"
                            @click="closeVideoModal"
                            class="shrink-0 cursor-pointer rounded-full bg-black/5 p-2 text-black/60 transition hover:bg-black/10 hover:text-black"
                            :title="closeVideoLabel"
                        >
                            <X class="h-4 w-4 sm:h-5 sm:w-5" />
                        </button>
                    </div>

                    <!-- Video Container (16:9 Aspect Ratio with full controls) -->
                    <div class="relative aspect-16/9 w-full bg-black">
                        <!-- YouTube Embed with full playback & scrub controls -->
                        <iframe
                            v-if="activeVideo.type === 'youtube' || activeVideo.youtubeId"
                            :src="`https://www.youtube.com/embed/${activeVideo.youtubeId || activeVideo.src}?autoplay=1&rel=0&modestbranding=1&controls=1&enablejsapi=1`"
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

                        <!-- Local MP4 Player with native controls, scrubbing, pause -->
                        <video
                            v-else
                            ref="videoPlayerRef"
                            :src="activeVideo.src"
                            :poster="activeVideo.poster"
                            controls
                            autoplay
                            playsinline
                            class="h-full w-full object-contain"
                        ></video>
                    </div>

                    <!-- Modal Description & Action Bar -->
                    <div
                        class="flex flex-col items-start justify-between gap-4 border-t border-black/5 bg-zinc-50 px-6 py-4 text-xs text-black/75 sm:flex-row sm:items-center sm:text-sm"
                    >
                        <p class="max-w-2xl leading-relaxed text-black/70">
                            {{ getLocalized(activeVideo.description) || getLocalized(activeVideo.title) }}
                        </p>
                        <a
                            v-if="activeVideo.type === 'youtube' || activeVideo.youtubeId"
                            :href="`https://www.youtube.com/watch?v=${activeVideo.youtubeId || activeVideo.src}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-t-blue transition-colors hover:text-t-blue/80"
                        >
                            <span>{{ openOnYoutubeLabel }}</span>
                            <ExternalLink class="h-3.5 w-3.5" />
                        </a>
                        <a
                            v-else-if="activeVideo.src"
                            :href="activeVideo.src"
                            download
                            class="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-t-blue transition-colors hover:text-t-blue/80"
                        >
                            <span>{{ locale === 'cs' ? 'Stáhnout video (MP4)' : 'Download video (MP4)' }}</span>
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
                        :title="closeLightboxLabel"
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
