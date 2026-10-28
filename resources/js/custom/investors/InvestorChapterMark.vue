<template>
    <p class="flex items-center gap-3 text-[11px] font-medium tracking-[0.2em] uppercase sm:text-xs">
        <span class="text-[#8ec5ff] tabular-nums">{{ index }}</span>
        <span class="h-px w-8 bg-white/20"></span>
        <span class="text-white/45">{{ label }}</span>
    </p>
</template>

<script setup lang="ts">
defineProps<{
    index: string;
    label: string;
}>();
</script>
