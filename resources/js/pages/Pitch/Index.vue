<script setup lang="ts">
import { Head, Link } from '@inertiajs/vue3';
import { ref } from 'vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import { Download, ArrowRight, ExternalLink } from 'lucide-vue-next';

const pdfUrl = '/pitch_disrupt.pdf';
const isFullscreen = ref(false);
const copied = ref(false);

const toggleFullscreen = () => {
    const elem = document.getElementById('pitchdeck-frame-container');
    if (!elem) return;

    if (!document.fullscreenElement) {
        elem.requestFullscreen().then(() => {
            isFullscreen.value = true;
        }).catch((err) => {
            console.error(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen().then(() => {
            isFullscreen.value = false;
        });
    }
};

const copyShareLink = async () => {
    try {
        await navigator.clipboard.writeText(window.location.href);
        copied.value = true;
        setTimeout(() => {
            copied.value = false;
        }, 2000);
    } catch (e) {
        console.error('Failed to copy link', e);
    }
};
</script>

<template>
    <DefaultLayout>
        <Head title="Pitch Deck | Treetino Disrupt" />

        <div class="relative min-h-screen bg-stone-950 text-white pt-28 pb-20 selection:bg-t-blue selection:text-white">
            <!-- Background Glow -->
            <div class="pointer-events-none absolute inset-0 overflow-hidden">
                <div class="absolute -top-40 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-t-blue/15 via-t-blue/5 to-transparent blur-3xl opacity-60"></div>
            </div>

            <div class="relative mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
                <!-- Top Header Bar -->
                <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/10">
                    <div>
                        <div class="inline-flex items-center gap-2 rounded-full border border-t-blue/30 bg-t-blue/10 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-t-blue mb-3">
                            <span class="h-1.5 w-1.5 rounded-full bg-t-blue animate-pulse"></span>
                            Investor & Partner Presentation
                        </div>
                        <h1 class="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight">
                            Treetino <span class="text-t-blue">Pitch Deck</span>
                        </h1>
                        <p class="mt-2 text-base sm:text-lg text-white/60 max-w-2xl">
                            Next-generation hybrid kinetic solar trees & microturbines for clean urban and industrial energy autonomy.
                        </p>
                    </div>

                    <!-- Action Toolbar -->
                    <div class="flex flex-wrap items-center gap-3">
                        <button
                            @click="copyShareLink"
                            type="button"
                            class="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 hover:border-white/20 active:scale-95 cursor-pointer"
                        >
                            <span>{{ copied ? 'Odkaz zkopírován!' : 'Sdílet / Share' }}</span>
                        </button>

                        <button
                            @click="toggleFullscreen"
                            type="button"
                            class="hidden sm:inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10 hover:border-white/20 active:scale-95 cursor-pointer"
                        >
                            <span>Celá obrazovka / Fullscreen</span>
                        </button>

                        <a
                            :href="pdfUrl"
                            download="treetino_pitch_disrupt.pdf"
                            class="inline-flex items-center gap-2 rounded-xl bg-t-blue px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-t-blue/20 transition hover:bg-t-blue/90 active:scale-95"
                        >
                            <Download class="h-4 w-4" />
                            <span>Stáhnout PDF (4.1 MB)</span>
                        </a>
                    </div>
                </div>

                <!-- Main PDF Presentation Viewport -->
                <div
                    id="pitchdeck-frame-container"
                    class="mt-8 relative w-full aspect-[16/10] min-h-[600px] lg:min-h-[750px] rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 bg-stone-900 shadow-2xl"
                >
                    <iframe
                        :src="`${pdfUrl}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`"
                        title="Treetino Pitch Deck"
                        class="h-full w-full border-0 bg-stone-900"
                    >
                        <div class="flex h-full flex-col items-center justify-center p-8 text-center text-white">
                            <p class="text-lg font-medium">Váš prohlížeč nepodporuje přímé zobrazení PDF.</p>
                            <a
                                :href="pdfUrl"
                                target="_blank"
                                class="mt-4 inline-flex items-center gap-2 rounded-xl bg-t-blue px-6 py-3 font-semibold text-white"
                            >
                                <ExternalLink class="h-4 w-4" />
                                Otevřít PDF v nové záložce
                            </a>
                        </div>
                    </iframe>
                </div>

                <!-- Footer Quick Links / IR Contact -->
                <div class="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xs">
                        <div class="text-xs font-semibold uppercase tracking-wider text-t-blue">Prodejní aplikace</div>
                        <h3 class="mt-2 text-xl font-medium">Partnerský CRM Portál</h3>
                        <p class="mt-2 text-sm text-white/60">
                            Vyzkoušejte interaktivní kalkulačku, ROI modelování a 3D konfiguraci.
                        </p>
                        <Link
                            :href="route('sales.index')"
                            class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-t-blue hover:underline"
                        >
                            Otevřít portál
                            <ArrowRight class="h-4 w-4" />
                        </Link>
                    </div>

                    <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xs">
                        <div class="text-xs font-semibold uppercase tracking-wider text-t-blue">3D Konfigurátor</div>
                        <h3 class="mt-2 text-xl font-medium">Navrhněte vlastní strom</h3>
                        <p class="mt-2 text-sm text-white/60">
                            Konfigurujte V1, V2 nebo Turbínu v reálném čase s okamžitým přehledem ceny.
                        </p>
                        <Link
                            :href="route('configurator')"
                            class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-t-blue hover:underline"
                        >
                            Spustit konfigurátor
                            <ArrowRight class="h-4 w-4" />
                        </Link>
                    </div>

                    <div class="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-xs">
                        <div class="text-xs font-semibold uppercase tracking-wider text-t-blue">Kontakt pro investory</div>
                        <h3 class="mt-2 text-xl font-medium">Máte dotaz k prezentaci?</h3>
                        <p class="mt-2 text-sm text-white/60">
                            Náš tým vám rád poskytne detailní finanční data a domluví osobní schůzku.
                        </p>
                        <Link
                            :href="route('contact.index')"
                            class="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-t-blue hover:underline"
                        >
                            Kontaktovat tým
                            <ArrowRight class="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>
