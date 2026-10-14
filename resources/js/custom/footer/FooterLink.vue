<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

defineProps({
    href: {
        type: String,
        default: undefined,
    },
});
</script>

<template>
    <Link
        class="group relative w-fit cursor-pointer text-inherit opacity-75 transition-opacity duration-300 hover:opacity-100"
        :href="href"
    >
        <div class="relative">
            <slot />
        </div>
        <div
            class="absolute bottom-0 left-0 h-[1px] w-0 bg-current transition-all duration-300 group-hover:w-full"
        ></div>
    </Link>
</template>
