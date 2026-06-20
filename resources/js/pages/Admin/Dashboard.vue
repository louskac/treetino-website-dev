<script setup lang="ts">
import AdminLayout from '@/layouts/AdminLayout.vue';

defineProps<{ stats: { keys: number; values: number; locales: number } }>();
</script>

<template>
    <AdminLayout title="Dashboard">
        <h1 class="text-3xl font-semibold">Dashboard</h1>
        <p class="mt-2 text-slate-500">Manage website content without access to the customer backend.</p>
        <div class="mt-8 grid gap-4 sm:grid-cols-3">
            <div v-for="(value, label) in stats" :key="label" class="rounded-xl border bg-white p-6 shadow-sm">
                <div class="text-sm capitalize text-slate-500">{{ label }}</div>
                <div class="mt-2 text-3xl font-semibold">{{ value }}</div>
            </div>
        </div>
    </AdminLayout>
</template>
