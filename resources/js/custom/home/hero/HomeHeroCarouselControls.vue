<script setup lang="ts">
const emit = defineEmits<{
    (e: 'prev'): void;
    (e: 'next'): void;
    (e: 'goTo'): void;
}>();
</script>

<template>
    <!-- Controls -->
    <div class="absolute bottom-10 left-10 z-50 flex gap-4 text-white">
        <button @click="emit('prev')">Prev</button>
        <button @click="emit('next')">Next</button>
    </div>
</template>
