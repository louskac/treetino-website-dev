<template>
    <component
        :is="href ? Link : 'button'"
        class="inline-block rounded-xl bg-zinc-950 px-5 text-white dark:text-t-blue"
        :class="variant === 'slim' ? 'py-2' : 'py-3'"
        :href="href"
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
        validator: (value: unknown) => ['regular', 'slim'].includes(value as string),
    },
    href: {
        type: String,
        default: undefined,
    },
});
</script>
