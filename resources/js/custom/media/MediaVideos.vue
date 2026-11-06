<script setup lang="ts">
import { Play, ArrowUpRight } from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();

interface VideoItem {
    id: string;
    duration: string;
    title: { cs: string; en: string };
    description: { cs: string; en: string };
    thumbnail: string;
}

const videos: VideoItem[] = [
    {
        id: 'MZepKKBw56E',
        duration: '3:11',
        title: {
            cs: 'Treetino Overview Demo — YC W27',
            en: 'Treetino Overview Demo — YC W27',
        },
        description: {
            cs: 'Přehledová ukázka funkčního prototypu, telemetrie a škálování sítě Treetino pro Y Combinator W27.',
            en: 'Overview demo of the working prototype, telemetry, and network scaling for Y Combinator W27.',
        },
        thumbnail: 'https://i.ytimg.com/vi/MZepKKBw56E/maxresdefault.jpg',
    },
    {
        id: 'INPvpfISPP0',
        duration: '0:45',
        title: {
            cs: 'Představení zakladatelů — YC W27',
            en: 'Founder Video — YC W27',
        },
        description: {
            cs: 'Krátké představení zakladatelů Treetino připravené pro zimní kohortu Y Combinator W27.',
            en: 'Updated founder introduction recorded for the Y Combinator Winter 2027 batch.',
        },
        thumbnail: 'https://i.ytimg.com/vi/INPvpfISPP0/maxresdefault.jpg',
    },
    {
        id: 'U7MgxSLgZIs',
        duration: '2:18',
        title: {
            cs: 'Představení projektu Treetino',
            en: 'Treetino — Project Intro',
        },
        description: {
            cs: 'Seznámení s konceptem energetického stromu, architekturou a technickými parametry.',
            en: 'Introduction to the energy tree concept, system architecture, and technical specifications.',
        },
        thumbnail: 'https://i.ytimg.com/vi/U7MgxSLgZIs/maxresdefault.jpg',
    },
    {
        id: 'op-x_kbH-WI',
        duration: '3:31',
        title: {
            cs: 'Treetino Pitch & Vize',
            en: 'Treetino Pitch & Vision',
        },
        description: {
            cs: 'Investorský pitch a vize čisté decentralizované energetiky.',
            en: 'Investor pitch and vision for clean decentralized energy.',
        },
        thumbnail: 'https://i.ytimg.com/vi/op-x_kbH-WI/maxresdefault.jpg',
    },
    {
        id: 'cDNJvIpPDak',
        duration: '1:05',
        title: {
            cs: 'Příběh zakladatelů',
            en: "Founders' Story",
        },
        description: {
            cs: 'Zákulisí vzniku projektu, vývoj hardwaru a cesta od prvního návrhu k prototypu.',
            en: 'Behind the scenes of hardware R&D and the journey from first sketch to prototype.',
        },
        thumbnail: 'https://i.ytimg.com/vi/cDNJvIpPDak/sddefault.jpg',
    },
    {
        id: '1At_hR_c3d8',
        duration: '2:26',
        title: {
            cs: 'Mantle Hackathon — RWA',
            en: 'RWA Mantle Hackathon',
        },
        description: {
            cs: 'Tokenizace reálné energetické infrastruktury a on-chain atestace výroby.',
            en: 'Real-world energy infrastructure tokenization and on-chain production attestation.',
        },
        thumbnail: 'https://i.ytimg.com/vi/1At_hR_c3d8/sddefault.jpg',
    },
];

const activeIndex = ref(0);
const isPlaying = ref(false);

const activeVideo = computed(() => videos[activeIndex.value] || videos[0]);
const currentLocale = computed(() => (locale.value || 'cs') as 'cs' | 'en');

const pad = (n: number) => String(n).padStart(2, '0');

const getTitle = (video: VideoItem) =>
    video.title[currentLocale.value] || video.title.cs;

const getDesc = (video: VideoItem) =>
    video.description[currentLocale.value] || video.description.cs;

const selectVideo = (index: number, autoplay = true) => {
    activeIndex.value = index;
    isPlaying.value = autoplay;
};
</script>

<template>
    <section
        id="videos"
        class="scroll-mt-32 border-b border-black/10 py-16 lg:py-24"
    >
        <!-- Header -->
        <div
            class="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
        >
            <div class="max-w-2xl">
                <h2
                    class="text-3xl font-medium tracking-[-0.03em] text-black sm:text-4xl lg:text-5xl"
                >
                    {{ $t('media.videos_title') }}
                </h2>
                <p
                    class="mt-3 text-base leading-relaxed text-black/60 sm:text-lg"
                >
                    {{ $t('media.videos_desc') }}
                </p>
            </div>

            <a
                href="https://www.youtube.com/@treetino_corp"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-black/70 transition-colors hover:text-black"
            >
                <span>@treetino_corp</span>
                <ArrowUpRight
                    class="h-4 w-4 text-black/40"
                    aria-hidden="true"
                />
            </a>
        </div>

        <!-- Stage (Left 7 Cols) + Scalable Queue List (Right 5 Cols) -->
        <div
            class="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-10"
        >
            <!-- Active Video Stage -->
            <div class="lg:col-span-7">
                <div
                    class="video-frame relative w-full overflow-clip rounded-2xl border border-black/10 bg-zinc-950"
                >
                    <iframe
                        v-if="isPlaying"
                        :key="activeVideo.id"
                        :src="`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=0&iv_load_policy=3`"
                        :title="getTitle(activeVideo)"
                        class="absolute inset-0 block h-full w-full border-0"
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

                    <button
                        v-else
                        type="button"
                        @click="isPlaying = true"
                        class="group absolute inset-0 block h-full w-full cursor-pointer text-left focus:outline-none"
                        :aria-label="`${$t('media.watch_video')}: ${getTitle(activeVideo)}`"
                    >
                        <img
                            :src="activeVideo.thumbnail"
                            :alt="getTitle(activeVideo)"
                            width="1280"
                            height="720"
                            fetchpriority="high"
                            class="absolute inset-0 block h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                        />
                        <div
                            class="absolute inset-0 bg-black/15 transition-colors duration-300 group-hover:bg-black/25"
                        ></div>

                        <div
                            class="absolute inset-0 flex items-center justify-center"
                        >
                            <div
                                class="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 text-black shadow-lg transition-transform duration-300 group-hover:scale-105"
                            >
                                <Play
                                    class="ml-0.5 h-5 w-5 fill-current"
                                    aria-hidden="true"
                                />
                            </div>
                        </div>
                    </button>
                </div>

                <!-- Active Video Caption -->
                <div
                    class="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-start"
                >
                    <div class="max-w-xl">
                        <div
                            class="flex items-center gap-3 text-xs text-black/40 tabular-nums"
                        >
                            <span>{{ pad(activeIndex + 1) }}</span>
                            <span class="h-px w-6 bg-black/15"></span>
                            <span>{{ activeVideo.duration }}</span>
                        </div>

                        <h3
                            class="mt-2 text-xl leading-snug font-medium tracking-[-0.02em] text-black sm:text-2xl"
                        >
                            {{ getTitle(activeVideo) }}
                        </h3>

                        <p class="mt-1.5 text-sm leading-relaxed text-black/60">
                            {{ getDesc(activeVideo) }}
                        </p>
                    </div>

                    <a
                        :href="`https://www.youtube.com/watch?v=${activeVideo.id}`"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="inline-flex shrink-0 items-center gap-1 text-xs font-medium text-black/50 transition-colors hover:text-black sm:mt-1"
                    >
                        <span>YouTube</span>
                        <ArrowUpRight class="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                </div>
            </div>

            <!-- Scalable Hairline Video List (Works for 5, 6, 10+ Videos) -->
            <div class="lg:col-span-5">
                <ul class="video-list border-t border-black/10">
                    <li
                        v-for="(video, idx) in videos"
                        :key="video.id"
                        class="border-b border-black/10"
                    >
                        <button
                            type="button"
                            @click="selectVideo(idx, true)"
                            class="group flex w-full cursor-pointer items-center gap-3.5 py-3 text-left transition-colors focus:outline-none sm:gap-4"
                        >
                            <span
                                class="w-5 shrink-0 text-xs tabular-nums transition-colors"
                                :class="
                                    idx === activeIndex
                                        ? 'font-semibold text-black'
                                        : 'text-black/35 group-hover:text-black/60'
                                "
                            >
                                {{ pad(idx + 1) }}
                            </span>

                            <!-- Locked 16:9 Mini Thumbnail -->
                            <div
                                class="video-frame relative w-24 shrink-0 overflow-clip rounded-lg border bg-zinc-950 transition-all sm:w-28"
                                :class="
                                    idx === activeIndex
                                        ? 'border-black/40 ring-1 ring-black/20'
                                        : 'border-black/10'
                                "
                            >
                                <img
                                    :src="video.thumbnail"
                                    :alt="getTitle(video)"
                                    width="320"
                                    height="180"
                                    loading="lazy"
                                    class="absolute inset-0 block h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                                />
                                <div
                                    class="absolute inset-0 flex items-center justify-center transition-colors"
                                    :class="
                                        idx === activeIndex
                                            ? 'bg-black/30'
                                            : 'bg-black/10 group-hover:bg-black/25'
                                    "
                                >
                                    <div
                                        class="flex h-6 w-6 items-center justify-center rounded-full bg-white/95 text-black shadow-xs transition-transform duration-200 group-hover:scale-105"
                                    >
                                        <Play
                                            class="ml-0.5 h-2.5 w-2.5 fill-current"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div class="min-w-0 flex-1">
                                <p
                                    class="truncate text-sm font-medium tracking-[-0.01em] transition-colors"
                                    :class="
                                        idx === activeIndex
                                            ? 'text-black'
                                            : 'text-black/75 group-hover:text-black'
                                    "
                                >
                                    {{ getTitle(video) }}
                                </p>
                                <p
                                    class="mt-0.5 truncate text-xs text-black/45"
                                >
                                    {{ getDesc(video) }}
                                </p>
                            </div>

                            <span
                                class="shrink-0 text-xs text-black/40 tabular-nums"
                            >
                                {{ video.duration }}
                            </span>
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    </section>
</template>

<style scoped>
.video-frame {
    aspect-ratio: 16 / 9;
}

.video-list {
    max-block-size: 30rem;
    overflow-y: auto;
    scrollbar-gutter: stable;
    overscroll-behavior: contain;
}
</style>
