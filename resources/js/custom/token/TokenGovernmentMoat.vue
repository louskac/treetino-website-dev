<template>
    <!-- Chapter 08 · Trust: the whole B2G / regulatory story in one view (data-room rows left, traction photo frames right) -->
    <section data-chapter="08" class="relative overflow-hidden bg-zinc-950 pt-24 pb-28 text-white sm:pt-32 sm:pb-36">
        <div class="moat-glow pointer-events-none absolute inset-0"></div>
        <div class="moat-grid pointer-events-none absolute inset-0"></div>

        <div :class="CONTAINER" class="relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-10">
            <!-- Left: one headline, then every trust point as a numbered hairline row -->
            <div class="lg:col-span-6">
                <InvestorChapterMark index="08" label="08 · WHY TRUST US" />
                <h2 class="mt-6" :class="HEADLINE">
                    Still a startup.<br />
                    <span class="text-[#8ec5ff] [text-shadow:0_0_40px_rgba(77,141,255,0.45)]">Already backed by institutions.</span>
                </h2>
                <p class="mt-5 max-w-[40ch] text-sm leading-relaxed text-white/60 sm:text-lg">
                    We are a small team launching a token, but we work with governments, licensed banks and regulators, not around them.
                </p>

                <ul class="mt-10 border-t border-white/12">
                    <li v-for="(item, i) in items" :key="i" class="flex items-start gap-4 border-b border-white/12 py-4 sm:gap-6">
                        <span class="w-6 shrink-0 pt-0.5 text-xs text-white/30 tabular-nums sm:text-sm">{{ String(i + 1).padStart(2, '0') }}</span>
                        <div class="min-w-0 flex-1">
                            <p class="text-base font-medium tracking-[-0.01em] text-white sm:text-lg">{{ item.title }}</p>
                            <p class="mt-0.5 text-xs leading-relaxed text-white/40 sm:text-sm">{{ item.meta }}</p>
                        </div>
                        <a
                            v-if="item.href"
                            :href="item.href"
                            target="_blank"
                            rel="noopener"
                            class="mt-0.5 inline-flex shrink-0 items-center gap-1 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition-colors hover:border-[#8ec5ff]/60 hover:text-white"
                        >
                            {{ item.link }}
                            <ArrowUpRight class="h-3.5 w-3.5 text-white/40" />
                        </a>
                    </li>
                </ul>
            </div>

            <!-- Right: the same layered photo frames as the traction chapter, plus three numbers -->
            <div class="flex flex-col justify-between gap-12 lg:col-span-6 lg:pl-6">
                <div class="relative mx-auto aspect-[56/48] w-full max-w-[560px] lg:mt-20">
                    <figure
                        class="absolute top-0 left-0 w-[78%] overflow-hidden rounded-2xl border border-white/15 bg-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.85)]"
                    >
                        <div class="relative aspect-[16/10] w-full overflow-hidden">
                            <img
                                src="/img/media/strakova-akademie-vlada-premier-2.jpg"
                                alt="Presenting the Treetino prototype to Czech Prime Minister Petr Fiala"
                                width="1024"
                                height="768"
                                loading="lazy"
                                decoding="async"
                                class="h-full w-full object-cover"
                            />
                            <div class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
                        </div>
                        <figcaption class="flex items-center justify-between gap-2 px-4 py-2.5 text-xs text-white/70">
                            <span class="truncate font-medium text-white/90">Prime Minister Petr Fiala</span>
                            <span class="hidden shrink-0 text-white/40 sm:inline">Czech Government</span>
                        </figcaption>
                    </figure>

                    <figure
                        class="absolute right-0 bottom-0 z-10 w-[52%] overflow-hidden rounded-2xl border border-white/18 bg-zinc-900 shadow-[0_28px_70px_rgba(0,0,0,0.92)]"
                    >
                        <div class="relative aspect-[4/3] w-full overflow-hidden">
                            <img
                                src="/img/media/innovations-united-prague-castle-2026.jpg"
                                alt="Treetino keynote at Prague Castle, Innovations United"
                                width="1024"
                                height="768"
                                loading="lazy"
                                decoding="async"
                                class="h-full w-full origin-top-right scale-[1.16] object-cover"
                            />
                            <div class="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950/90 to-transparent"></div>
                        </div>
                        <figcaption class="flex items-center justify-between gap-2 px-3.5 py-2 text-[11px] text-white/70 sm:text-xs">
                            <span class="truncate font-medium text-white/90">Keynote at Prague Castle</span>
                            <span class="hidden shrink-0 text-white/40 sm:inline">Prague, CZ</span>
                        </figcaption>
                    </figure>
                </div>

                <InvestorStats
                    :stats="[
                        { value: '2', label: 'Governments engaged' },
                        { value: '€200k', label: 'EU funding received' },
                        { value: 'MiCA', label: 'Licensed partners' },
                    ]"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ArrowUpRight } from 'lucide-vue-next';
import InvestorChapterMark from '@/custom/investors/InvestorChapterMark.vue';
import InvestorStats from '@/custom/investors/InvestorStats.vue';
import { CONTAINER, HEADLINE } from '@/custom/investors/tokens';

const items = [
    {
        title: 'Strong ties to the Czech Government',
        meta: 'Prototype presented to Prime Minister Petr Fiala, keynote at Prague Castle.',
    },
    {
        title: 'EU funding',
        meta: '€200,000 non-dilutive grant from CzechInvest, Ministry of Industry and Trade.',
        href: '/treetino-grant-technologicka-inkubace.pdf',
        link: 'Grant',
    },
    {
        title: 'Fintech partners with banking licences',
        meta: 'Card payments on our chargers run through ČNB-regulated acquirers via Tapaya.',
    },
    {
        title: 'Connected with MiCA licence holders in Europe',
        meta: 'Token issuance and custody go through partners already licensed under MiCA.',
    },
    {
        title: 'A clear path to our own licences',
        meta: 'Hardware company and token protocol are kept separate, so we can license each one when needed.',
    },
    {
        title: 'Invited by the Government of Moldova',
        meta: 'Official invitation to deploy Treetino microgrids for national energy resilience.',
        href: '/docs/Treetino_Investment_Memorandum_2026.pdf',
        link: 'Memo',
    },
];
</script>

<style scoped>
.moat-glow {
    background: radial-gradient(48% 58% at 22% 56%, rgba(47, 95, 208, 0.16) 0%, rgba(47, 95, 208, 0.04) 52%, transparent 100%);
}
.moat-grid {
    background-image:
        linear-gradient(to right, rgba(77, 141, 255, 0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(77, 141, 255, 0.08) 1px, transparent 1px);
    background-size: 56px 56px;
    mask-image: radial-gradient(50% 62% at 24% 62%, #000 0%, rgba(0, 0, 0, 0.45) 50%, transparent 100%);
}
</style>
