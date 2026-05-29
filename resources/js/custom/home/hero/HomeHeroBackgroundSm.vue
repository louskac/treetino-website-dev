<template>
    <div
        class="bg absolute top-0 left-0 h-full w-full overflow-hidden bg-t-dark"
    >
        <video
            ref="videoRef"
            :key="currentVideo"
            class="absolute top-0 left-0 h-full w-full object-cover"
            muted
            loop
            playsinline
            webkit-playsinline
            autoplay
            preload="auto"
            style="pointer-events: none"
        >
            <source :src="currentVideo" type="video/mp4" />
        </video>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps<{
    activeIndex: number;
}>();

const videos = [
    '/video/hero-v1-cine-sm.mp4',
    '/video/hero-v2-cine-sm.mp4',
    '/video/hero-turbine-cine-sm.mp4',
];

const videoRef = ref<HTMLVideoElement | null>(null);

const currentVideo = computed(() => videos[props.activeIndex]);

const playVideo = async () => {
    await nextTick();

    const video = videoRef.value;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.autoplay = true;

    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    video.setAttribute('autoplay', '');

    try {
        video.load();
        await video.play();
    } catch (error) {
        console.warn('Video autoplay failed:', error);
    }
};

onMounted(() => {
    playVideo();
});

watch(
    () => props.activeIndex,
    () => {
        playVideo();
    },
);
</script>
