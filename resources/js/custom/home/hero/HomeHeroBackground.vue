<template>
    <div class="bg absolute top-0 left-0 h-full w-full bg-t-dark">
        <video
            v-for="(src, index) in videos"
            :key="src"
            :ref="
                (el) => {
                    if (el) videoRefs[index] = el as HTMLVideoElement;
                }
            "
            class="absolute top-0 left-0 h-full w-full object-cover transition-opacity ease-in-out"
            :class="activeIndex === index ? 'opacity-100' : 'opacity-0'"
            :style="{
                pointerEvents: 'none',
                transitionDuration: `${fadeDurationMs}ms`,
            }"
            muted
            loop
            playsinline
            preload="auto"
        >
            <source :src="src" type="video/mp4" />
        </video>
    </div>

    <div
        class="bg absolute top-0 left-0 h-full w-full"
        style="
            background-position: center;
            background-image: url('/video/hero-v1-cine.mp4');
            background-size: cover;
        "
    ></div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const props = defineProps<{
    activeIndex: number;
}>();

const fadeDurationMs = 700;
const videos = [
    '/video/hero-v1-cine.mp4',
    '/video/hero-home-1.mp4',
    '/video/hero-warehouse-1.mp4',
];

// Using a standard array to store refs (more reliable than ref<[]> in v-for)
const videoRefs = ref<HTMLVideoElement[]>([]);

onMounted(async () => {
    // Wait for the next DOM update to ensure refs are filled
    await nextTick();

    videoRefs.value.forEach((video) => {
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
});
</script>
