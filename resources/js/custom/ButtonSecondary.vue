<template>
    <a
        v-if="href"
        :href="href"
        class="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-2 text-center font-medium text-white transition-all hover:bg-black/90 cursor-pointer sm:px-3 lg:px-4"
        :class="
            variant === 'slim'
                ? 'min-h-9 py-1.5 text-xs sm:text-sm'
                : 'min-h-11 py-2.5 text-xs sm:text-sm lg:text-base'
        "
    >
        <span class="w-full text-center leading-snug truncate pointer-events-none">
            <slot />
        </span>
    </a>
    <button
        v-else
        type="button"
        class="inline-flex items-center justify-center rounded-xl bg-zinc-950 px-2 text-center font-medium text-white transition-all hover:bg-black/90 cursor-pointer sm:px-3 lg:px-4"
        :class="
            variant === 'slim'
                ? 'min-h-9 py-1.5 text-xs sm:text-sm'
                : 'min-h-11 py-2.5 text-xs sm:text-sm lg:text-base'
        "
    >
        <span class="w-full text-center leading-snug truncate pointer-events-none">
            <slot />
        </span>
    </button>
</template>

<script setup lang="ts">
defineProps({
    variant: {
        type: String,
        default: 'regular',
        validator: (value: unknown) => ['regular', 'slim'].includes(value as string),
    },
    href: {
        type: String,
        default: undefined,
    },
});
</script>
