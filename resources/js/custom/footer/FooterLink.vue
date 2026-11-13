<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed } from 'vue';

const props = defineProps<{
    href?: string;
    target?: string;
    download?: boolean | string;
}>();

const isExternalOrPdf = computed(() => {
    if (!props.href) return false;
    return (
        props.href.startsWith('http://') ||
        props.href.startsWith('https://') ||
        props.href.startsWith('mailto:') ||
        props.href.endsWith('.pdf') ||
        props.target === '_blank'
    );
});
</script>

<template>
    <a
        v-if="isExternalOrPdf"
        :href="href"
        :target="target ?? (href?.endsWith('.pdf') ? '_blank' : undefined)"
        :rel="target === '_blank' || href?.endsWith('.pdf') ? 'noopener noreferrer' : undefined"
        :download="download"
        class="group relative w-fit cursor-pointer text-inherit opacity-75 transition-opacity duration-300 hover:opacity-100"
    >
        <div class="relative">
            <slot />
        </div>
        <div
            class="absolute bottom-0 left-0 h-[1px] w-0 bg-current transition-all duration-300 group-hover:w-full"
        ></div>
    </a>
    <Link
        v-else
        class="group relative w-fit cursor-pointer text-inherit opacity-75 transition-opacity duration-300 hover:opacity-100"
        :href="href || '#'"
    >
        <div class="relative">
            <slot />
        </div>
        <div
            class="absolute bottom-0 left-0 h-[1px] w-0 bg-current transition-all duration-300 group-hover:w-full"
        ></div>
    </Link>
</template>
