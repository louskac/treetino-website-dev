<script setup lang="ts">
import { Form, usePage } from '@inertiajs/vue3';
import { AlertTriangle, RefreshCw } from 'lucide-vue-next';
import { computed } from 'vue';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/layouts/AdminLayout.vue';

defineProps<{
    stats: { keys: number; values: number; locales: number };
    translationStatus: { unsynchronizedValues: number; unsynchronizedKeys: number };
}>();

const page = usePage();
const success = computed(() => page.props.flash.success);
</script>

<template>
    <AdminLayout title="Dashboard">
        <h1 class="text-3xl font-semibold">Dashboard</h1>
        <p class="mt-2 text-slate-500">Manage website content without access to the customer backend.</p>

        <div v-if="translationStatus.unsynchronizedValues > 0" class="mt-8 flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950">
            <AlertTriangle class="mt-0.5 size-5 shrink-0" />
            <div>
                <div class="font-semibold">Unsynchronized translation changes</div>
                <p class="mt-1 text-sm">
                    {{ translationStatus.unsynchronizedValues }} values across {{ translationStatus.unsynchronizedKeys }} keys changed
                    since the last translation synchronization.
                </p>
            </div>
        </div>

        <div v-if="success" class="mt-8 rounded-xl bg-emerald-100 px-4 py-3 text-sm text-emerald-800">{{ success }}</div>

        <div class="mt-8 grid gap-4 sm:grid-cols-3">
            <div v-for="(value, label) in stats" :key="label" class="rounded-xl border bg-white p-6 shadow-sm">
                <div class="text-sm capitalize text-slate-500">{{ label }}</div>
                <div class="mt-2 text-3xl font-semibold">{{ value }}</div>
            </div>
        </div>

        <div class="mt-8 rounded-xl border bg-white p-6 shadow-sm">
            <h2 class="text-lg font-semibold">Translation synchronization</h2>
            <p class="mt-1 text-sm text-slate-500">Add missing catalog values and mark the current live translations as synchronized. Existing admin edits are preserved.</p>
            <Form action="/admin/translations/sync" method="post" v-slot="{ processing }" class="mt-4">
                <Button :disabled="processing">
                    <RefreshCw class="size-4" :class="{ 'animate-spin': processing }" />
                    {{ processing ? 'Synchronizing…' : 'Synchronize catalog' }}
                </Button>
            </Form>
        </div>
    </AdminLayout>
</template>
