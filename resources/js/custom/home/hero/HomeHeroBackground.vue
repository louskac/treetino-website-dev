<template>
    <div
        class="bg pointer-events-none absolute top-0 left-0 h-full w-full overflow-hidden bg-black"
    >
        <video
            ref="videoRef"
            :key="currentVideo"
            :poster="currentPoster"
            class="absolute top-0 left-0 h-full w-full object-cover"
            muted
            loop
            playsinline
            webkit-playsinline
            autoplay
            preload="auto"
            style="pointer-events: none"
        >
            <source :src="currentVideo" type="video/webm" />
        </video>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const props = defineProps<{
    activeIndex: number;
}>();

const emit = defineEmits<{
    autoplayBlocked: [blocked: boolean];
}>();

const videos = [
    '/video/hero-v1-cine-noaudio.webm',
    '/video/hero-v2-cine-noaudio.webm',
    '/video/hero-turbine-cine-noaudio.webm',
];

const posters = [
    '/img/hero-images/poster-v1_1.1.1.webp',
    '/img/hero-images/poster-v2_2.1.2.webp',
    '/img/hero-images/poster-turbine_2.1.1.webp',
];

const videoRef = ref<HTMLVideoElement | null>(null);

const currentVideo = computed(() => videos[props.activeIndex]);
const currentPoster = computed(() => posters[props.activeIndex]);

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

        emit('autoplayBlocked', false);
    } catch (error) {
        console.warn('Video autoplay failed:', error);

        emit('autoplayBlocked', true);
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

defineExpose({
    playVideo,
});
</script>

<style>
video::-webkit-media-controls {
    display: none !important;
}

video::-webkit-media-controls-enclosure {
    display: none !important;
}

video::-webkit-media-controls-panel {
    display: none !important;
}
</style>
