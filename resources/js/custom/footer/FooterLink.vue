<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

const props = defineProps({
    href: {
        type: String,
        default: undefined,
    },
});
</script>

<template>
    <Link
        class="group relative w-fit cursor-pointer opacity-70 transition-all duration-300 hover:opacity-100"
        :href="href"
    >
        <div class="relative">
            <slot/>
        </div>
        <div
            class="absolute w-0 border-b transition-all duration-300 group-hover:w-full group-hover:border-b group-hover:border-b-black"
        ></div>
    </Link>
</template>
