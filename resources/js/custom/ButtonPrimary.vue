<template>
    <a
        v-if="href"
        :href="href"
        class="inline-flex cursor-pointer items-center justify-center rounded-xl bg-t-blue px-2 text-center font-medium text-white transition-all hover:bg-t-blue/90 sm:px-3 lg:px-4"
        :class="
            variant === 'slim'
                ? 'min-h-9 py-1.5 text-xs sm:text-sm'
                : 'min-h-11 py-2.5 text-xs sm:text-sm lg:text-base'
        "
    >
        <span
            class="pointer-events-none w-full truncate text-center leading-snug"
        >
            <slot />
        </span>
    </a>
    <button
        v-else
        type="button"
        class="inline-flex cursor-pointer items-center justify-center rounded-xl bg-t-blue px-2 text-center font-medium text-white transition-all hover:bg-t-blue/90 sm:px-3 lg:px-4"
        :class="
            variant === 'slim'
                ? 'min-h-9 py-1.5 text-xs sm:text-sm'
                : 'min-h-11 py-2.5 text-xs sm:text-sm lg:text-base'
        "
    >
        <span
            class="pointer-events-none w-full truncate text-center leading-snug"
        >
            <slot />
        </span>
    </button>
</template>

<script setup lang="ts">
defineProps({
    variant: {
        type: String,
        default: 'regular',
        validator: (value: unknown) =>
            ['regular', 'slim'].includes(value as string),
    },
    href: {
        type: String,
        default: undefined,
    },
});
</script>
