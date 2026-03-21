<script setup lang="ts">
import AppLogoIcon from '@/components/AppLogoIcon.vue';
</script>

<template>
    <div
        class="flex aspect-square size-8 items-center justify-center rounded-md bg-t-blue dark:bg-white text-sidebar-primary-foreground"
    >
        <AppLogoIcon class="size-5 fill-current text-white dark:text-t-blue" />
    </div>
    <div class="ml-1 grid flex-1 text-left text-sm">
        <div class="truncate leading-tight font-semibold">Treetino Corp.</div>
        <div class="truncate text-xs leading-tight opacity-70">
            CLIENT DASHBOARD
        </div>
    </div>
</template>
