<template>
    <a
        class="inline-block rounded-2xl bg-t-blue px-5 text-white dark:bg-white dark:text-t-blue"
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
