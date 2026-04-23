<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
    activeIndex: number;
}>();

// --- 1. Isolate the duration variable here (in milliseconds) ---
const fadeDurationMs = 700;

// --- 2. Define your 3 video sources ---
const videos = [
    '/video/hero-office-2.mp4', // index 0
    '/video/hero-home-1.mp4', // index 1
    '/video/hero-warehouse-1.mp4', // index 2
];

// array of videos
const videoRefs = ref<HTMLVideoElement[]>([]);

watch(
    () => props.activeIndex,
    (newIndex) => {
        if (newIndex !== undefined) console.log('Current slide:', newIndex);
    },
);

onMounted(() => {
    // Programmatically play all videos concurrently to ensure mobile compatibility
    videoRefs.value.forEach((video) => {
        if (video) {
            video
                .play()
                .catch((err) => console.warn('Video play blocked:', err));
        }
    });
});

// const video = ref<HTMLVideoElement | null>(null);
//
// onMounted(() => {
//     video.value?.play();
// });
</script>

<template>
    <div class="bg absolute top-0 left-0 h-full w-full bg-t-dark">
        <!-- Loop through videos, stacking them concurrently -->
        <video
            v-for="(src, index) in videos"
            :key="index"
            ref="videoRefs"
            class="absolute top-0 left-0 h-full w-full object-cover transition-opacity ease-in-out"
            :class="props.activeIndex === index ? 'opacity-100' : 'opacity-0'"
            :style="{
                pointerEvents: 'none',
                objectFit: 'cover',
                minHeight: '100%',
                transitionDuration: `${fadeDurationMs}ms` /* Dynamically applied duration */,
            }"
            muted
            loop
            playsinline
            autoplay
        >
            <source :src="src" type="video/mp4" />
        </video>
    </div>
</template>
