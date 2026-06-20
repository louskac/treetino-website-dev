<script setup lang="ts">
import { Head, Link, usePage } from '@inertiajs/vue3';
import { Languages, LayoutDashboard, LogOut } from 'lucide-vue-next';
import { computed } from 'vue';

defineProps<{ title: string }>();
const page = usePage();
const admin = computed(() => page.props.auth.admin);
</script>

<template>
    <Head :title="`${title} · Admin`" />
    <div class="min-h-screen bg-slate-50 text-slate-950">
        <header class="border-b bg-white">
            <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
                <div>
                    <div class="text-lg font-semibold">Treetino Admin</div>
                    <div class="text-xs text-slate-500">Independent administration</div>
                </div>
                <div class="flex items-center gap-4 text-sm">
                    <span class="hidden text-slate-500 sm:inline">{{ admin?.name }}</span>
                    <Link href="/admin/logout" method="post" as="button" class="flex items-center gap-2 text-slate-600 hover:text-slate-950">
                        <LogOut class="size-4" /> Log out
                    </Link>
                </div>
            </div>
        </header>
        <div class="mx-auto grid max-w-7xl gap-8 px-6 py-8 md:grid-cols-[220px_1fr]">
            <nav class="flex gap-2 md:flex-col">
                <Link href="/admin/dashboard" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white">
                    <LayoutDashboard class="size-4" /> Dashboard
                </Link>
                <Link href="/admin/translations" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-white">
                    <Languages class="size-4" /> Translations
                </Link>
            </nav>
            <main><slot /></main>
        </div>
    </div>
</template>
