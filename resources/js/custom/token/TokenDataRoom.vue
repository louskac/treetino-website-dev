<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import { computed } from 'vue';
import InvestorChapterMark from '@/custom/investors/InvestorChapterMark.vue';
import { CONTAINER, DATABOOK_CS, DATABOOK_EN, HEADLINE } from '@/custom/investors/tokens';

const props = defineProps<{
    partner?: string | null;
}>();

interface DocLink {
    label: string;
    href: string;
    external?: boolean;
}

const documents = computed<{ title: string; meta: string; links: DocLink[] }[]>(() => [
    {
        title: '$TREE Strategic Tokenomics & Buyback Framework',
        meta: 'Mechanics of 10% hardware sales, 0.1% EV volume skim, 1% RWA fee, and veTREE staking.',
        links: [
            { label: 'Pitch Deck', href: '/pitch' },
            { label: 'PDF Deck', href: '/treetino-pitchdeck.pdf', external: true },
        ],
    },
    {
        title: 'Official Moldovan Government Invitation & Endorsement',
        meta: 'Formal state invitation (AVIZ_ATAS_NORD.pdf) designating Treetino for national microgrid resilience.',
        links: [
            { label: 'Investment Memo', href: '/docs/Treetino_Investment_Memorandum_2026.pdf', external: true },
        ],
    },
    {
        title: '€200,000 CzechInvest EU Technology Incubation Grant',
        meta: 'Sovereign grant award from CzechInvest under the Ministry of Industry and Trade.',
        links: [
            { label: 'Grant PDF', href: '/treetino-grant-technologicka-inkubace.pdf', external: true },
        ],
    },
    {
        title: 'Treetino Technical Databook 2026',
        meta: 'Full electrical schematics, TopCon solar leaf specs, vertical-axis wind turbines, and Victron microgrid core.',
        links: [
            { label: 'EN', href: DATABOOK_EN, external: true },
            { label: 'CZ', href: DATABOOK_CS, external: true },
        ],
    },
    {
        title: 'European Patent EP 4664750 A1 & PCT WO 2025256678',
        meta: 'Granted IP protection for actuated bionic solar leaves, helical wind integration, and storm stowage.',
        links: [
            { label: 'EP', href: '/docs/patent-ep-4664750.pdf', external: true },
            { label: 'WO', href: '/docs/patent-wo-2025256678.pdf', external: true },
        ],
    },
    {
        title: 'M-Kovo Commercial Delivery & Wind Measurement Report',
        meta: 'Production contract for 5 units (€705k) and 12-month anemometer wind data.',
        links: [
            { label: 'Report', href: '/docs/treetino_mkovo_wind_measurement_report.pdf', external: true },
            { label: 'Archive', href: '/docs/treetino_mkovo_complete_data_archive.pdf', external: true },
        ],
    },
    {
        title: 'Strategic Accelerator & Founder Channels',
        meta: props.partner
            ? `Dedicated co-investment, advisory & launch channel for ${props.partner}.`
            : 'Direct access to founders Dominik Mašek & Jakub Lustyk for accelerator and lead allocation.',
        links: [
            { label: 'Calendly', href: 'https://calendly.com', external: true },
            { label: 'Email Founders', href: 'mailto:info@treetino.eu', external: true },
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
                        :label="partner ? `${partner.toUpperCase()} · STRATEGIC ALLOCATION` : '$TREE DATA ROOM & DOCUMENTS'"
                    />
                    <h2 class="mt-6" :class="HEADLINE">
                        Institutional data room &<br />
                        <span class="text-[#8ec5ff] [text-shadow:0_0_40px_rgba(77,141,255,0.45)]">verified execution proofs.</span>
                    </h2>
                </div>

                <div class="mt-10 border-t border-white/10 pt-5 lg:mt-0">
                    <p class="text-sm text-white/50 sm:text-base">
                        Questions on tokenomics, accelerator terms, or lead investment?
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
