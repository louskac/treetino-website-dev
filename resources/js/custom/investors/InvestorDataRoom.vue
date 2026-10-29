<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import InvestorChapterMark from './InvestorChapterMark.vue';
import { CONTAINER, DATABOOK_CS, DATABOOK_EN, HEADLINE } from './tokens';

interface DocLink {
    label: string;
    href: string;
    external?: boolean;
}

const documents: { title: string; meta: string; links: DocLink[] }[] = [
    {
        title: 'Pitch deck',
        meta: 'Company, market, traction, round',
        links: [
            { label: 'Interactive', href: '/pitch' },
            { label: 'PDF', href: '/treetino-pitchdeck.pdf', external: true },
        ],
    },
    {
        title: 'Technical databook',
        meta: 'Datasheets for V1, V2, Aero and TreeApp',
        links: [
            { label: 'EN', href: DATABOOK_EN, external: true },
            { label: 'CZ', href: DATABOOK_CS, external: true },
        ],
    },
    {
        title: 'Investment memorandum',
        meta: 'Unit economics, pipeline, rollout',
        links: [{ label: 'PDF', href: '/docs/Treetino_Investment_Memorandum_2026.pdf', external: true }],
    },
    {
        title: 'Patents',
        meta: 'EP 4 664 750 A1 · WO 2025/256678',
        links: [
            { label: 'EP', href: '/docs/patent-ep-4664750.pdf', external: true },
            { label: 'WO', href: '/docs/patent-wo-2025256678.pdf', external: true },
        ],
    },
    {
        title: 'Site wind data',
        meta: 'Measurements from the MKovo V1 site',
        links: [
            { label: 'Report', href: '/docs/treetino_mkovo_wind_measurement_report.pdf', external: true },
            { label: 'Archive', href: '/docs/treetino_mkovo_complete_data_archive.pdf', external: true },
        ],
    },
];
</script>

<template>
    <section id="data-room" data-chapter="06" class="relative overflow-hidden bg-zinc-950 pt-16 pb-24 text-white sm:pt-20 sm:pb-28">
        <!-- Subtle blueprint grid & ambient glow so the dark canvas feels architectural rather than blank -->
        <div class="dataroom-glow pointer-events-none absolute inset-0"></div>
        <div class="dataroom-grid pointer-events-none absolute inset-0"></div>

        <div :class="CONTAINER" class="relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div class="flex flex-col justify-between lg:col-span-5">
                <div>
                    <InvestorChapterMark index="06" label="Data room" />
                    <h2 class="mt-6" :class="HEADLINE">
                        Everything else,<br />
                        <span class="text-[#8ec5ff] [text-shadow:0_0_40px_rgba(77,141,255,0.45)]">in writing.</span>
                    </h2>
                </div>

                <div class="mt-10 border-t border-white/10 pt-5 lg:mt-0">
                    <p class="text-sm text-white/50 sm:text-base">
                        Questions?
                        <a
                            href="mailto:info@treetino.eu"
                            class="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-[#8ec5ff]"
                        >
                            info@treetino.eu
                        </a>
                    </p>
                </div>
            </div>

            <ul class="border-t border-white/12 lg:col-span-7 lg:mt-1">
                <li
                    v-for="(doc, i) in documents"
                    :key="doc.title"
                    class="group flex items-center gap-4 border-b border-white/12 py-5 sm:gap-6 sm:py-6"
                >
                    <span class="w-6 shrink-0 text-xs text-white/30 tabular-nums sm:text-sm">{{ String(i + 1).padStart(2, '0') }}</span>
                    <div class="min-w-0 flex-1">
                        <p class="text-base font-medium tracking-[-0.01em] text-white sm:text-xl">{{ doc.title }}</p>
                        <p class="mt-1 text-xs text-white/40 sm:text-sm">{{ doc.meta }}</p>
                    </div>
                    <div class="flex shrink-0 gap-2">
                        <a
                            v-for="link in doc.links"
                            :key="link.label"
                            :href="link.href"
                            :target="link.external ? '_blank' : undefined"
                            :rel="link.external ? 'noopener' : undefined"
                            class="inline-flex items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-[#8ec5ff]/60 hover:text-white sm:px-4 sm:py-2 sm:text-sm"
                        >
                            {{ link.label }}
                            <ArrowUpRight class="h-3.5 w-3.5 text-white/40" />
                        </a>
                    </div>
                </li>
            </ul>
        </div>
    </section>
</template>

<style scoped>
.dataroom-glow {
    background: radial-gradient(48% 58% at 22% 56%, rgba(47, 95, 208, 0.16) 0%, rgba(47, 95, 208, 0.04) 52%, transparent 100%);
}

.dataroom-grid {
    background-image:
        linear-gradient(to right, rgba(77, 141, 255, 0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(77, 141, 255, 0.08) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(50% 62% at 24% 62%, #000 0%, rgba(0, 0, 0, 0.45) 50%, transparent 100%);
}
</style>
