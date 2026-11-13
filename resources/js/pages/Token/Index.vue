<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import TokenAllocation from '@/custom/token/TokenAllocation.vue';
import TokenChapterRail from '@/custom/token/TokenChapterRail.vue';
import TokenDataRoom from '@/custom/token/TokenDataRoom.vue';
import TokenEcosystemStory from '@/custom/token/TokenEcosystemStory.vue';
import TokenGovernmentMoat from '@/custom/token/TokenGovernmentMoat.vue';
import TokenHero from '@/custom/token/TokenHero.vue';
import TokenPaymentStory from '@/custom/token/TokenPaymentStory.vue';
import TokenSimulator from '@/custom/token/TokenSimulator.vue';
import TokenSystemStory from '@/custom/token/TokenSystemStory.vue';
import TokenTreeStory from '@/custom/token/TokenTreeStory.vue';
import TokenWalletStory from '@/custom/token/TokenWalletStory.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const props = defineProps<{
    partner?: string | null;
}>();

const pageTitle = computed(() => {
    return props.partner
        ? `$TREE Tokenomics · ${props.partner} Strategic Brief | Treetino`
        : '$TREE Tokenomics · Solana DePIN & Energy RWA Protocol | Treetino';
});
</script>

<template>
    <Head :title="pageTitle">
        <meta
            name="description"
            content="Treetino $TREE tokenomics and institutional launch overview: 10% hardware sales buybacks, 0.1% EV charging transaction skim, 1% RWA tokenization revenue, 20% grid arbitrage alpha, B2G partnerships, Czech banking rails, and EU grant backing."
        />
        <meta name="robots" content="noindex, nofollow" />
    </Head>

    <DefaultLayout :scroll="true" :dark="true">
        <!-- 00 · Europe map dives into CZ: Strategic intro & core tokenomics pillars -->
        <TokenHero :partner="props.partner" />

        <!-- 01 · 3D Tree hardware: 10% of every hardware sale routed to $TREE buybacks -->
        <TokenTreeStory />

        <!-- 02 · 3D Contactless EV Charger payment gate: 0.1% volume skim on all charging sessions -->
        <TokenPaymentStory />

        <!-- 03 · 3D Microgrid & Utility BESS: 1% RWA tokenization protocol fee + 20% spot arbitrage alpha -->
        <TokenSystemStory />

        <!-- 04 · 3D Phone Wallet: DePIN telemetry proofs (Certino), veTREE staking & 50,000 node bonding -->
        <TokenWalletStory />

        <!-- 05 · Complete 3D Closed-Loop Flywheel: Physical energy generation drives programmatic token scarcity -->
        <TokenEcosystemStory />

        <!-- 06 · Tokenomics: pinned chapter (supply ledger → vesting timeline → buyback 50/50 split) -->
        <TokenAllocation />

        <!-- 07 · Buyback model: data-room layout with /pitch-fintech sliders -->
        <TokenSimulator />

        <!-- 08 · Why Trust Us (B2G & Institutional Backing: PM Fiala, Moldova, EU Grant, ČNB banking & MiCA) -->
        <TokenGovernmentMoat />

        <!-- 09 · Data Room, Technical Databook, Patents & Direct Founder Access -->
        <TokenDataRoom :partner="props.partner" />

        <!-- Floating chapter rail navigation -->
        <TokenChapterRail />
    </DefaultLayout>
</template>

<style>
/* Pinned chapters fade out as they release, so photos and stats never slide under the floating navbar */
@supports (animation-timeline: view()) {
    section[data-chapter] > .sticky {
        animation: token-stage-exit linear both;
        animation-timeline: view();
        animation-range: exit 0% exit 55%;
    }
}

@keyframes token-stage-exit {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
