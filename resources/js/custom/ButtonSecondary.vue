<template>
    <a
        class="inline-block rounded-xl bg-zinc-950 px-5 text-white dark:bg-zinc-800 dark:text-white"
        :class="variant === 'slim' ? 'py-2' : 'py-3'"
        href=""
    >
        <slot />
    </a>
</template>

<script setup lang="ts">
const props = defineProps({
    variant: {
        type: String,
        default: 'regular',
        validator: (value) => ['regular', 'slim'].includes(value),
    },
});
</script>
