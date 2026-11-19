<script setup lang="ts">
import {
    Download,
    Maximize2,
    Share2,
    Check,
    ArrowUpRight,
} from 'lucide-vue-next';
import { onMounted, onUnmounted, ref } from 'vue';

const pdfUrl = '/treetino-pitchdeck.pdf';
const copied = ref(false);
const isFullscreen = ref(false);

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
});

onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
});
</script>

<template>
    <section
        id="pitchdeck"
        class="scroll-mt-32 border-b border-black/10 py-16 lg:py-24"
    >
        <!-- Section Header -->
        <div class="flex flex-col gap-6">
            <div class="max-w-2xl">
                <h2
                    class="text-3xl font-medium tracking-[-0.03em] text-black sm:text-4xl lg:text-5xl"
                >
                    {{ $t('media.pitch_title') }}
                </h2>
                <p
                    class="mt-3 text-base leading-relaxed text-black/60 sm:text-lg"
                >
                    {{ $t('media.pitch_desc') }}
                </p>
            </div>

            <!-- Header Action Controls -->
            <div class="pitch-actions-bar flex flex-wrap items-center gap-2">
                <a
                    href="/pitch"
                    class="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3.5 py-2 text-xs font-medium whitespace-nowrap text-black/75 transition-colors hover:border-black/40 hover:text-black"
                >
                    <span>12-Slide Deck</span>
                    <ArrowUpRight
                        class="h-3.5 w-3.5 text-black/40"
                        aria-hidden="true"
                    />
                </a>

                <a
                    href="/pitch-fintech"
                    class="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3.5 py-2 text-xs font-medium whitespace-nowrap text-black/75 transition-colors hover:border-black/40 hover:text-black"
                >
                    <span>Fintech × Tapaya</span>
                    <ArrowUpRight
                        class="h-3.5 w-3.5 text-black/40"
                        aria-hidden="true"
                    />
                </a>

                <a
                    href="/pitch-hackathon"
                    class="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3.5 py-2 text-xs font-medium whitespace-nowrap text-black/75 transition-colors hover:border-black/40 hover:text-black"
                >
                    <span>Hackathon Deck</span>
                    <ArrowUpRight
                        class="h-3.5 w-3.5 text-black/40"
                        aria-hidden="true"
                    />
                </a>

                <a
                    href="/pitch-refract"
                    class="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3.5 py-2 text-xs font-medium whitespace-nowrap text-black/75 transition-colors hover:border-black/40 hover:text-black"
                >
                    <span>Refract Deck</span>
                    <ArrowUpRight
                        class="h-3.5 w-3.5 text-black/40"
                        aria-hidden="true"
                    />
                </a>

                <a
                    href="/pitch_disrupt.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="inline-flex items-center gap-1.5 rounded-full border border-black/15 px-3.5 py-2 text-xs font-medium whitespace-nowrap text-black/75 transition-colors hover:border-black/40 hover:text-black"
                >
                    <span>Historic Deck</span>
                    <ArrowUpRight
                        class="h-3.5 w-3.5 text-black/40"
                        aria-hidden="true"
                    />
                </a>

                <button
                    type="button"
                    @click="copyShareLink"
                    class="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-black/15 px-3.5 py-2 text-xs font-medium whitespace-nowrap text-black/75 transition-colors hover:border-black/40 hover:text-black"
                    :title="$t('media.pitch_share')"
                >
                    <Check
                        v-if="copied"
                        class="h-3.5 w-3.5 text-black"
                        aria-hidden="true"
                    />
                    <Share2
                        v-else
                        class="h-3.5 w-3.5 text-black/45"
                        aria-hidden="true"
                    />
                    <span>{{
                        copied
                            ? $t('media.pitch_copied')
                            : $t('media.pitch_share')
                    }}</span>
                </button>

                <button
                    type="button"
                    @click="toggleFullscreen"
                    class="hidden cursor-pointer items-center gap-1.5 rounded-full border border-black/15 px-3.5 py-2 text-xs font-medium whitespace-nowrap text-black/75 transition-colors hover:border-black/40 hover:text-black sm:inline-flex"
                    :title="$t('media.pitch_fullscreen')"
                >
                    <Maximize2
                        class="h-3.5 w-3.5 text-black/45"
                        aria-hidden="true"
                    />
                    <span>{{ $t('media.pitch_fullscreen') }}</span>
                </button>

                <a
                    :href="pdfUrl"
                    download="treetino-pitchdeck.pdf"
                    target="_blank"
                    class="inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-black px-4 py-2 text-xs font-medium whitespace-nowrap text-white transition-opacity hover:opacity-85"
                >
                    <Download class="h-3.5 w-3.5" aria-hidden="true" />
                    <span>PDF</span>
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
            <!-- Embedded 12-Slide Pitch Deck -->
            <div
                class="relative aspect-[16/9] max-h-[82vh] w-full overflow-hidden bg-zinc-950"
            >
                <iframe
                    src="/pitch"
                    :title="$t('media.pitch_title')"
                    class="h-full w-full border-0"
                    allowfullscreen
                    loading="lazy"
                ></iframe>
            </div>
        </div>
    </section>
</template>

<style scoped>
.pitch-actions-bar {
    flex-wrap: wrap;
    flex-wrap: balance;
}
</style>
