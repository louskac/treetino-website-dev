<template>
    <a
        class="inline-block rounded-xl bg-white px-5 text-black"
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
