<script setup lang="ts">
import { router, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const page = usePage();
const locale = computed(() => page.props.i18n.locale);
const locales = computed(() => page.props.i18n.locales);

const change = (event: Event) => {
    router.post('/locale', { locale: (event.target as HTMLSelectElement).value }, { preserveScroll: true });
};
</script>

<template>
    <select
        :value="locale"
        aria-label="Language"
        class="cursor-pointer rounded-md border border-current bg-transparent px-2 py-1 text-xs font-semibold uppercase"
        @change="change"
    >
        <option v-for="item in locales" :key="item" :value="item" class="text-black">{{ item }}</option>
    </select>
</template>
