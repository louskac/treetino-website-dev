<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

// Use a single ref typed as an HTMLVideoElement
const videoRef = ref<HTMLVideoElement | null>(null);
const isSafari = ref(false);

onMounted(async () => {
    const ua = navigator.userAgent;
    isSafari.value = /^((?!chrome|android).)*safari/i.test(ua);

    // If it's Safari, stop here so we don't try to play a non-existent video
    if (isSafari.value) return;

    // Wait for the DOM to be ready
    await nextTick();

    const video = videoRef.value;

    if (video) {
        // CRITICAL: Explicitly set muted property to bypass mobile autoplay blocks
        video.muted = true;
        video.defaultMuted = true;

        // Start playing
        const playPromise = video.play();

        if (playPromise !== undefined) {
            playPromise.catch((error) => {
                console.warn('Autoplay was prevented:', error);
                // If blocked, try playing again on the first user interaction
                document.addEventListener('click', () => video.play(), {
                    once: true,
                });
            });
        }
    }
});
</script>
<template>
    <section class="cta-generic relative h-180 bg-t-blue">
        <div
            v-if="!isSafari"
            class="bg absolute top-0 left-0 h-full w-full bg-t-dark opacity-20 mix-blend-screen saturate-0"
        >
            <video
                ref="videoRef"
                class="absolute top-0 left-0 h-full w-full object-cover transition-opacity ease-in-out"
                muted
                loop
                playsinline
                preload="auto"
            >
                <source src="/video/office-corr.webm" type="video/webm" />
            </video>
        </div>

        <div
            v-if="isSafari"
            class="bg absolute top-0 left-0 h-full w-full bg-t-dark opacity-20"
            style="
                background-image: url('/video/office-corr.webm');
                background-size: cover;
                background-position: center;
            "
        ></div>

        <div
            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-white/20 border-l-white/20 [mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
        ></div>

        <div
            class="relative mx-auto h-full w-full max-w-[1200px] sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="flex h-full w-full p-6">
                <div class="mx-auto my-auto text-white">
                    <h1
                        class="text-center text-6xl leading-17"
                        v-html="$t('home.cta.generic')"
                    ></h1>
                </div>
            </div>
        </div>
    </section>
</template>
