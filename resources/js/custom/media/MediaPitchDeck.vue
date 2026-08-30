<script setup lang="ts">
import {
    Download,
    Maximize2,
    Share2,
    ChevronLeft,
    ChevronRight,
    Check,
} from 'lucide-vue-next';
import { computed, onMounted, onUnmounted, ref } from 'vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';

const slides = [
    {
        src: '/img/pitch/slide-01.webp',
        title: 'Treetino — Rooted in Sustainability',
    },
    {
        src: '/img/pitch/slide-02.webp',
        title: 'The Problem & Energy Market Disruption',
    },
    {
        src: '/img/pitch/slide-03.webp',
        title: 'The Solution — Smart Solar & Wind Trees',
    },
    {
        src: '/img/pitch/slide-04.webp',
        title: 'Product Architecture & Technology',
    },
    {
        src: '/img/pitch/slide-05.webp',
        title: 'Business Model & Unit Economics',
    },
    {
        src: '/img/pitch/slide-06.webp',
        title: 'Market Opportunity & Expansion',
    },
    {
        src: '/img/pitch/slide-07.webp',
        title: 'Innovation Ecosystem & Traction',
    },
    {
        src: '/img/pitch/slide-08.webp',
        title: 'Join the Revolution — Contact & Investment',
    },
];

const currentSlide = ref(0);
const pdfUrl = '/pitch_disrupt.pdf';
const copied = ref(false);
const isFullscreen = ref(false);

const nextSlide = () => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
};

const prevSlide = () => {
    currentSlide.value =
        (currentSlide.value - 1 + slides.length) % slides.length;
};

const goToSlide = (index: number) => {
    currentSlide.value = index;
};

const toggleFullscreen = () => {
    const elem = document.getElementById('media-pitchdeck-container');

    if (!elem) {
        return;
    }

    if (!document.fullscreenElement) {
        elem.requestFullscreen()
            .then(() => {
                isFullscreen.value = true;
            })
            .catch((err) => {
                console.error(
                    `Error attempting to enable fullscreen: ${err.message}`,
                );
            });
    } else {
        document.exitFullscreen().then(() => {
            isFullscreen.value = false;
        });
    }
};

const handleFullscreenChange = () => {
    isFullscreen.value = !!document.fullscreenElement;
};

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'Space') {
        const target = e.target as HTMLElement;

        if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) {
            return;
        }

        if (
            document.fullscreenElement ||
            isElementInViewport(
                document.getElementById('media-pitchdeck-container'),
            )
        ) {
            nextSlide();
        }
    } else if (e.key === 'ArrowLeft') {
        const target = e.target as HTMLElement;

        if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) {
            return;
        }

        if (
            document.fullscreenElement ||
            isElementInViewport(
                document.getElementById('media-pitchdeck-container'),
            )
        ) {
            prevSlide();
        }
    }
};

const isElementInViewport = (el: HTMLElement | null) => {
    if (!el) {
        return false;
    }

    const rect = el.getBoundingClientRect();

    return (
        rect.top >= -100 &&
        rect.top <=
            (window.innerHeight || document.documentElement.clientHeight) * 0.75
    );
};

const copyShareLink = async () => {
    try {
        const shareUrl = `${window.location.origin}/media#pitchdeck`;
        await navigator.clipboard.writeText(shareUrl);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch (e) {
        console.error('Failed to copy link', e);
    }
};

onMounted(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('keydown', handleKeyDown);
});

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    window.removeEventListener('keydown', handleKeyDown);
});

const progressPercent = computed(() => {
    return ((currentSlide.value + 1) / slides.length) * 100;
});
</script>

<template>
    <section
        id="pitchdeck"
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
                    {{ $t('media.pitch_tag') }}
                </span>
                <h2
                    class="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl lg:text-5xl"
                >
                    {{ $t('media.pitch_title') }}
                </h2>
                <p
                    class="mt-4 text-base leading-relaxed text-black/70 sm:text-lg"
                >
                    {{ $t('media.pitch_desc') }}
                </p>
            </div>

            <!-- Header Action Controls -->
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
                    :title="$t('media.pitch_fullscreen')"
                >
                    <Maximize2 class="h-3.5 w-3.5 text-black/70" />
                    <span>{{ $t('media.pitch_fullscreen') }}</span>
                </button>

                <a
                    :href="pdfUrl"
                    download="treetino-pitchdeck.pdf"
                    target="_blank"
                    class="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-t-blue px-4 py-2.5 text-xs font-medium whitespace-nowrap text-white shadow-sm transition hover:bg-t-blue/90"
                >
                    <Download class="h-3.5 w-3.5" />
                    <span>{{ $t('media.pitch_download') }}</span>
                </a>
            </div>
        </div>

        <!-- Interactive Slide Container -->
        <div
            id="media-pitchdeck-container"
            class="group relative mt-10 overflow-hidden rounded-3xl border border-black/10 bg-zinc-950 shadow-2xl transition-all duration-300 select-none"
            :class="
                isFullscreen
                    ? 'flex h-screen w-screen flex-col items-center justify-center p-4 sm:p-8'
                    : 'w-full'
            "
        >
            <!-- Progress Bar -->
            <div class="absolute top-0 right-0 left-0 z-30 h-1 bg-white/10">
                <div
                    class="h-full bg-t-blue transition-all duration-300 ease-out"
                    :style="{ width: `${progressPercent}%` }"
                ></div>
            </div>

            <!-- Main Slide Image Area -->
            <div
                class="relative flex aspect-[16/9] max-h-[82vh] w-full items-center justify-center overflow-hidden bg-zinc-950"
            >
                <Transition name="slide-fade" mode="out-in">
                    <img
                        :key="currentSlide"
                        :src="slides[currentSlide].src"
                        :alt="slides[currentSlide].title"
                        class="pointer-events-none h-full w-full object-contain"
                        loading="eager"
                    />
                </Transition>

                <!-- Current Slide Tag & Indicator Top Left -->
                <div class="absolute top-6 left-6 z-20 flex items-center gap-3">
                    <div
                        class="rounded-full border border-white/15 bg-black/60 px-3.5 py-1 text-xs font-semibold tracking-wider text-white/90 backdrop-blur-md"
                    >
                        {{ String(currentSlide + 1).padStart(2, '0') }} /
                        {{ String(slides.length).padStart(2, '0') }}
                    </div>
                </div>

                <!-- Fullscreen Toggle inside Player Top Right -->
                <div
                    class="absolute top-6 right-6 z-20 flex items-center gap-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                >
                    <button
                        type="button"
                        @click="toggleFullscreen"
                        class="cursor-pointer rounded-full border border-white/15 bg-black/60 p-2.5 text-white/80 backdrop-blur-md transition hover:scale-105 hover:text-white"
                        :title="$t('media.pitch_fullscreen')"
                    >
                        <Maximize2 class="h-4 w-4" />
                    </button>
                </div>

                <!-- Prev Button Left -->
                <button
                    type="button"
                    @click.stop="prevSlide"
                    class="absolute top-1/2 left-4 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/50 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/80"
                    aria-label="Previous slide"
                >
                    <ChevronLeft class="h-6 w-6" />
                </button>

                <!-- Next Button Right -->
                <button
                    type="button"
                    @click.stop="nextSlide"
                    class="absolute top-1/2 right-4 z-20 flex h-12 w-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/50 text-white shadow-lg backdrop-blur-md transition-all duration-200 hover:scale-110 hover:bg-black/80"
                    aria-label="Next slide"
                >
                    <ChevronRight class="h-6 w-6" />
                </button>
            </div>

            <!-- Bottom Navigation Bar & Dots -->
            <div
                class="relative z-20 flex w-full items-center justify-between border-t border-white/10 bg-zinc-950/95 px-6 py-4 backdrop-blur-md"
            >
                <div class="hidden text-xs font-medium text-white/60 sm:block">
                    {{ slides[currentSlide].title }}
                </div>

                <!-- Bullet Pagination Dots -->
                <div class="mx-auto flex items-center gap-2 sm:mx-0">
                    <button
                        v-for="(_, idx) in slides"
                        :key="idx"
                        type="button"
                        @click="goToSlide(idx)"
                        class="h-2 cursor-pointer rounded-full transition-all duration-300"
                        :class="
                            idx === currentSlide
                                ? 'w-8 bg-white'
                                : 'w-2 bg-white/30 hover:bg-white/60'
                        "
                        :aria-label="`Go to slide ${idx + 1}`"
                    />
                </div>

                <div class="font-mono text-xs text-white/60">
                    {{ currentSlide + 1 }} / {{ slides.length }}
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
    transition:
        opacity 0.25s ease,
        transform 0.25s ease;
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
