<template>
    <component
        :is="href ? Link : 'button'"
        class="inline-block rounded-xl bg-white px-5 text-black"
        :class="variant === 'slim' ? 'py-2' : 'py-3'"
        href=""
    >
        <slot />
    </component>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

const props = defineProps({
    variant: {
        type: String,
        default: 'regular',
        validator: (value) => ['regular', 'slim'].includes(value),
    },
    href: {
        type: String,
        default: undefined,
    },
});
</script>
