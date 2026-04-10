<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const props = defineProps<{
    activeIndex: number;
}>();

watch(
    () => props.activeIndex,
    (newIndex) => {
        if (newIndex !== undefined) console.log('Current slide:', newIndex);
    },
);

const video = ref<HTMLVideoElement | null>(null);

onMounted(() => {
    video.value?.play();
});
</script>

<template>
    <div class="bg absolute top-0 h-full w-full bg-t-dark">
        <video
            ref="video"
            class="h-full w-full object-cover"
            id="video"
            muted
            loop
            playsinline
            style="pointer-events: none; object-fit: cover; min-height: 100%"
        >
            <source src="/video/hero-test-2.mp4" type="video/mp4" />
        </video>
    </div>
</template>
