<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import InvestorChapterMark from '@/custom/investors/InvestorChapterMark.vue';
import { CONTAINER, DATABOOK_CS, DATABOOK_EN, HEADLINE } from '@/custom/investors/tokens';

const props = defineProps<{
    partner?: string | null;
}>();

const { t } = useI18n();

interface DocLink {
    label: string;
    href: string;
    external?: boolean;
}

const documents = computed<{ title: string; meta: string; links: DocLink[] }[]>(() => [
    {
        title: t('token.c09.d_token_title'),
        meta: t('token.c09.d_token_meta'),
        links: [
            { label: t('token.c09.d_token_l0'), href: '/pitch' },
            { label: t('token.c09.d_token_l1'), href: '/treetino-pitchdeck.pdf', external: true },
        ],
    },
    {
        title: t('token.c09.d_moldova_title'),
        meta: t('token.c09.d_moldova_meta'),
        links: [
            { label: t('token.c09.d_moldova_l0'), href: '/docs/Treetino_Investment_Memorandum_2026.pdf', external: true },
        ],
    },
    {
        title: t('token.c09.d1_title'),
        meta: t('token.c09.d1_meta'),
        links: [
            { label: t('token.c09.d1_l0'), href: '/treetino-grant-technologicka-inkubace.pdf', external: true },
        ],
    },
    {
        title: t('token.c09.d2_title'),
        meta: t('token.c09.d2_meta'),
        links: [
            { label: 'EN', href: DATABOOK_EN, external: true },
            { label: 'CZ', href: DATABOOK_CS, external: true },
        ],
    },
    {
        title: t('token.c09.d3_title'),
        meta: t('token.c09.d3_meta'),
        links: [
            { label: 'EP', href: '/docs/patent-ep-4664750.pdf', external: true },
            { label: 'WO', href: '/docs/patent-wo-2025256678.pdf', external: true },
        ],
    },
    {
        title: t('token.c09.d4_title'),
        meta: t('token.c09.d4_meta'),
        links: [
            { label: t('token.c09.d4_l0'), href: '/docs/treetino_mkovo_wind_measurement_report.pdf', external: true },
            { label: t('token.c09.d4_l1'), href: '/docs/treetino_mkovo_complete_data_archive.pdf', external: true },
        ],
    },
    {
        title: t('token.c09.d5_title'),
        meta: props.partner
            ? t('token.c09.d5_meta_partner', { partner: props.partner })
            : t('token.c09.d5_meta'),
        links: [
            { label: t('token.c09.d5_l0'), href: 'https://x.com/treetino_corp', external: true },
            { label: t('token.c09.d5_l1'), href: 'mailto:info@treetino.eu', external: true },
        ],
    },
]);
</script>

<template>
    <section id="data-room" data-chapter="09" class="relative overflow-hidden bg-zinc-950 pt-20 pb-28 text-white sm:pt-28 sm:pb-36">
        <!-- Subtle blueprint grid & ambient glow so the dark canvas feels architectural rather than blank -->
        <div class="dataroom-glow pointer-events-none absolute inset-0"></div>
        <div class="dataroom-grid pointer-events-none absolute inset-0"></div>

        <div :class="CONTAINER" class="relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <div class="flex flex-col justify-between lg:col-span-5">
                <div>
                    <InvestorChapterMark
                        index="09"
                        :label="partner ? t('token.c09.partner_label', { partner: partner.toUpperCase() }) : t('token.c09.label')"
                    />
                    <h2 class="mt-6" :class="HEADLINE">
                        {{ t('token.c09.title_1') }}<br />
                        <span class="text-[#8ec5ff] [text-shadow:0_0_40px_rgba(77,141,255,0.45)]">{{ t('token.c09.title_2') }}</span>
                    </h2>
                </div>

                <div class="mt-10 border-t border-white/10 pt-5 lg:mt-0">
                    <p class="text-sm text-white/50 sm:text-base">
                        {{ t('token.c09.contact_prompt') }}
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
                    :key="i"
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
