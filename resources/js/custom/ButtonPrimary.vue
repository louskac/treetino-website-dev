<template>
    <component
        :is="href ? Link : 'button'"
        class="flex flex-col rounded-xl bg-t-blue px-5 text-white dark:bg-white dark:text-t-blue"
        :class="variant === 'slim' ? 'py-2' : 'py-3'"
        :href="href"
    >
        <div class="my-auto">
            <slot />
        </div>
    </component>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';

const props = defineProps({
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
