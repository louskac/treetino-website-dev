<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Play, X, ExternalLink, Youtube } from 'lucide-vue-next';

const { locale } = useI18n();

interface VideoItem {
    id: string;
    tag: string;
    title: { cs: string; en: string };
    description: { cs: string; en: string };
    thumbnail: string;
}

const videos: VideoItem[] = [
    {
        id: 'U7MgxSLgZIs',
        tag: 'Overview',
        title: {
            cs: 'Představení projektu Treetino',
            en: 'Treetino — Project Intro',
        },
        description: {
            cs: 'Kompletní seznámení s konceptem energetického stromu Treetino, architekturou a technickými specifikacemi.',
            en: 'Complete introduction to the Treetino energy tree concept, architecture, and technical specifications.',
        },
        thumbnail: 'https://i.ytimg.com/vi/U7MgxSLgZIs/hqdefault.jpg',
    },
    {
        id: 'op-x_kbH-WI',
        tag: 'Pitch',
        title: {
            cs: 'Treetino Pitch & Vize',
            en: 'Treetino Pitch & Vision',
        },
        description: {
            cs: 'Oficiální investorský pitch a vize čisté decentralizované energie budoucnosti.',
            en: 'Official investor pitch and the vision of clean decentralized energy for the future.',
        },
        thumbnail: 'https://i.ytimg.com/vi/op-x_kbH-WI/hqdefault.jpg',
    },
    {
        id: 'cDNJvIpPDak',
        tag: 'Story',
        title: {
            cs: 'Příběh zakladatelů Treetino',
            en: "Treetino Founders' Story",
        },
        description: {
            cs: 'Nahlédnutí do zákulisí vzniku projektu Treetino, výzvy při vývoji a technologická cesta.',
            en: "Behind the scenes of Treetino creation, R&D challenges, and the technological journey.",
        },
        thumbnail: 'https://i.ytimg.com/vi/cDNJvIpPDak/hqdefault.jpg',
    },
    {
        id: '1At_hR_c3d8',
        tag: 'Hackathon',
        title: {
            cs: 'Mantle Hackathon Submission (RWA)',
            en: 'RWA Mantle Hackathon Submission',
        },
        description: {
            cs: 'Prezentace tokenizace a reálných aktiv (RWA) v kontextu distribuované energetické infrastruktury.',
            en: 'Presentation of real-world asset (RWA) tokenization in the context of distributed energy infrastructure.',
        },
        thumbnail: 'https://i.ytimg.com/vi/1At_hR_c3d8/hqdefault.jpg',
    },
];

const activeVideo = ref<VideoItem | null>(null);

const getVideoTitle = (video: VideoItem) => {
    const l = (locale.value || 'cs') as 'cs' | 'en';
    return video.title[l] || video.title.cs;
};

const getVideoDesc = (video: VideoItem) => {
    const l = (locale.value || 'cs') as 'cs' | 'en';
    return video.description[l] || video.description.cs;
};

const openVideo = (video: VideoItem) => {
    activeVideo.value = video;
};

const closeVideo = () => {
    activeVideo.value = null;
};
</script>

<template>
    <section id="videos" class="scroll-mt-32 py-16 lg:py-24 border-b border-black/10">
        <!-- Section Header -->
        <div class="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div class="max-w-2xl">
                <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                    {{ $t('media.videos_tag') }}
                </span>
                <h2 class="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl lg:text-5xl">
                    {{ $t('media.videos_title') }}
                </h2>
                <p class="mt-4 text-base sm:text-lg text-black/70 leading-relaxed">
                    {{ $t('media.videos_desc') }}
                </p>
            </div>

            <!-- YouTube Channel Link (Clean neutral style) -->
            <div>
                <a
                    href="https://www.youtube.com/@treetino_corp"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-2 rounded-full border border-black/15 bg-white px-5 py-2.5 text-xs font-semibold text-black/80 shadow-xs transition hover:bg-black/5 hover:border-black/30"
                >
                    <Youtube class="h-4 w-4 text-black/70" />
                    <span>{{ $t('media.youtube_channel_btn') }}</span>
                    <ExternalLink class="h-3.5 w-3.5 opacity-50" />
                </a>
            </div>
        </div>

        <!-- 4 Video Grid (Clean Minimalist Cards) -->
        <div class="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div
                v-for="video in videos"
                :key="video.id"
                @click="openVideo(video)"
                class="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-black/10 bg-white transition-all duration-300 hover:border-black/30 hover:shadow-xl cursor-pointer"
            >
                <div>
                    <!-- Thumbnail Container with Play Overlay -->
                    <div class="relative aspect-16/9 w-full overflow-hidden bg-zinc-950">
                        <img
                            :src="video.thumbnail"
                            :alt="getVideoTitle(video)"
                            class="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        <div class="absolute inset-0 bg-black/25 transition-opacity group-hover:bg-black/15"></div>

                        <!-- Tag Badge Top Left -->
                        <span class="absolute top-3 left-3 rounded-full bg-black/70 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
                            {{ video.tag }}
                        </span>

                        <!-- Play Button Center -->
                        <div class="absolute inset-0 flex items-center justify-center">
                            <div class="flex h-11 w-11 items-center justify-center rounded-full bg-white/95 text-black shadow-lg backdrop-blur transition-all duration-300 group-hover:scale-115 group-hover:bg-t-blue group-hover:text-white">
                                <Play class="h-4 w-4 fill-current ml-0.5" />
                            </div>
                        </div>
                    </div>

                    <!-- Content -->
                    <div class="p-6">
                        <h3 class="text-base font-semibold text-black group-hover:text-t-blue transition-colors leading-snug">
                            {{ getVideoTitle(video) }}
                        </h3>
                        <p class="mt-2 text-xs sm:text-sm text-black/65 leading-relaxed line-clamp-2">
                            {{ getVideoDesc(video) }}
                        </p>
                    </div>
                </div>

                <!-- Footer Action -->
                <div class="border-t border-black/5 px-6 py-3 flex items-center justify-between text-xs font-semibold text-t-blue">
                    <span>{{ $t('media.watch_video') }}</span>
                    <Play class="h-3 w-3 fill-current transition-transform group-hover:translate-x-0.5" />
                </div>
            </div>
        </div>

        <!-- Video Player Modal (Clean Light Mode) -->
        <Transition name="modal-fade">
            <div
                v-if="activeVideo"
                class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6 backdrop-blur-sm"
                @click.self="closeVideo"
            >
                <div class="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-black/10 text-black">
                    <!-- Modal Top Bar -->
                    <div class="flex items-center justify-between border-b border-black/10 px-6 py-4 bg-white">
                        <div class="flex items-center gap-3">
                            <span class="rounded-full bg-t-blue/10 text-t-blue px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">
                                {{ activeVideo.tag }}
                            </span>
                            <h4 class="text-sm sm:text-base font-semibold text-black truncate max-w-[280px] sm:max-w-md">
                                {{ getVideoTitle(activeVideo) }}
                            </h4>
                        </div>
                        <button
                            type="button"
                            @click="closeVideo"
                            class="rounded-full bg-black/5 p-2 text-black/60 transition hover:bg-black/10 hover:text-black cursor-pointer"
                            :title="$t('media.close_video')"
                        >
                            <X class="h-4 w-4" />
                        </button>
                    </div>

                    <!-- Video Iframe (Subtitles disabled) -->
                    <div class="relative aspect-16/9 w-full bg-black">
                        <iframe
                            :src="`https://www.youtube.com/embed/${activeVideo.id}?autoplay=1&rel=0&modestbranding=1&cc_load_policy=0&iv_load_policy=3`"
                            :title="getVideoTitle(activeVideo)"
                            class="absolute inset-0 h-full w-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowfullscreen
                        ></iframe>
                    </div>

                    <!-- Modal Description Bar -->
                    <div class="px-6 py-4 bg-zinc-50 border-t border-black/5 text-black/75 text-xs sm:text-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <p class="leading-relaxed max-w-2xl">
                            {{ getVideoDesc(activeVideo) }}
                        </p>
                        <a
                            :href="`https://www.youtube.com/watch?v=${activeVideo.id}`"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="inline-flex items-center gap-1.5 text-xs font-semibold text-t-blue hover:text-t-blue/80 shrink-0 transition-colors"
                        >
                            <span>{{ $t('media.open_on_youtube') }}</span>
                            <ExternalLink class="h-3.5 w-3.5" />
                        </a>
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
</style>
