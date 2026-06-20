<script setup lang="ts">
import { router, useForm, usePage } from '@inertiajs/vue3';
import { computed, reactive } from 'vue';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/layouts/AdminLayout.vue';

type TranslationRow = {
    id: number;
    group: string;
    key: string;
    description: string | null;
    translations: Record<string, string>;
};

const props = defineProps<{
    keys: { data: TranslationRow[]; links: Array<{ url: string | null; label: string; active: boolean }> };
    locales: string[];
    groups: string[];
    filters: { search: string; group: string };
}>();

const filters = reactive({ ...props.filters });
const drafts = reactive<Record<number, Record<string, string>>>(
    Object.fromEntries(props.keys.data.map((row) => [row.id, { ...row.translations }])),
);
const saving = reactive<Record<number, boolean>>({});
const page = usePage();
const success = computed(() => page.props.flash.success);

const applyFilters = () => router.get('/admin/translations', filters, { preserveState: true, replace: true });
const save = (row: TranslationRow) => {
    saving[row.id] = true;
    useForm({ translations: drafts[row.id] }).put(`/admin/translations/${row.id}`, {
        preserveScroll: true,
        onFinish: () => { saving[row.id] = false; },
    });
};
</script>

<template>
    <AdminLayout title="Translations">
        <div class="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
                <h1 class="text-3xl font-semibold">Translations</h1>
                <p class="mt-2 text-slate-500">Edit public website copy. Keys stay fixed so code references remain safe.</p>
            </div>
            <div v-if="success" class="rounded-lg bg-emerald-100 px-4 py-2 text-sm text-emerald-800">{{ success }}</div>
        </div>

        <form class="mt-8 grid gap-3 rounded-xl border bg-white p-4 sm:grid-cols-[1fr_220px_auto]" @submit.prevent="applyFilters">
            <Input v-model="filters.search" placeholder="Search key or text…" />
            <select v-model="filters.group" class="rounded-md border bg-white px-3 text-sm">
                <option value="">All groups</option>
                <option v-for="group in groups" :key="group" :value="group">{{ group }}</option>
            </select>
            <Button type="submit">Filter</Button>
        </form>

        <div class="mt-5 space-y-4">
            <article v-for="row in keys.data" :key="row.id" class="rounded-xl border bg-white p-5 shadow-sm">
                <div class="flex flex-wrap items-start justify-between gap-3">
                    <div>
                        <div class="font-mono text-sm font-semibold">{{ row.group }}.{{ row.key }}</div>
                        <div v-if="row.description" class="mt-1 text-xs text-slate-500">{{ row.description }}</div>
                    </div>
                    <Button size="sm" :disabled="saving[row.id]" @click="save(row)">{{ saving[row.id] ? 'Saving…' : 'Save' }}</Button>
                </div>
                <div class="mt-4 grid gap-4 lg:grid-cols-2">
                    <label v-for="locale in locales" :key="locale" class="block">
                        <span class="mb-1 block text-xs font-semibold uppercase text-slate-500">{{ locale }}</span>
                        <textarea v-model="drafts[row.id][locale]" rows="3" class="w-full rounded-lg border px-3 py-2 text-sm focus:border-slate-500 focus:outline-none" />
                    </label>
                </div>
            </article>
        </div>

        <div class="mt-6 flex flex-wrap gap-2">
            <a v-for="link in keys.links" :key="link.label" :href="link.url || undefined" v-html="link.label" class="rounded-md border bg-white px-3 py-2 text-sm" :class="{ 'bg-slate-900 text-white': link.active, 'pointer-events-none opacity-40': !link.url }" />
        </div>
    </AdminLayout>
</template>
