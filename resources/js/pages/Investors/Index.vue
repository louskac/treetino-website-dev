<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import InvestorChapterRail from '@/custom/investors/InvestorChapterRail.vue';
import InvestorDataRoom from '@/custom/investors/InvestorDataRoom.vue';
import InvestorHero from '@/custom/investors/InvestorHero.vue';
import InvestorPaymentStory from '@/custom/investors/InvestorPaymentStory.vue';
import InvestorProducts from '@/custom/investors/InvestorProducts.vue';
import InvestorSystemStory from '@/custom/investors/InvestorSystemStory.vue';
import InvestorTraction from '@/custom/investors/InvestorTraction.vue';
import InvestorTreeStory from '@/custom/investors/InvestorTreeStory.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>

<template>
    <Head title="Investors | Treetino">
        <meta
            name="description"
            content="Treetino investor brief: 49.8 kW hybrid solar-wind trees with dual-axis sun tracking and automatic storm stow, Victron power core, optional LiFePO4 storage, hardware EV charger payment gate and TreeApp control."
        />
        <meta name="robots" content="noindex, nofollow" />
    </Head>

    <DefaultLayout :scroll="true" :dark="true">
        <!-- 00 · Europe map dives into CZ: one headline, pitch deck + databook -->
        <InvestorHero />

        <!-- 01 · Line-drawn V1: leaf/turbine layout, sun tracking, storm stow -->
        <InvestorTreeStory />

        <!-- 02 · 3D microgrid: solar + wind → Victron core → EV, building, grid; TreeApp on top -->
        <InvestorSystemStory />

        <!-- 03 · V1, V2 and Aero renders on one stage -->
        <InvestorProducts />

        <!-- 04 · Hardware EV charger payment gate: card tap → <2 s metered payout -->
        <InvestorPaymentStory />

        <!-- 05 · Real hardware, signed contracts, institutional recognition -->
        <InvestorTraction />

        <!-- 06 · Founder pitch video, CTAs and documents -->
        <InvestorDataRoom />

        <InvestorChapterRail />
    </DefaultLayout>
</template>

<style>
/* Pinned chapters fade out as they release, so photos and stats never slide under the floating navbar */
@supports (animation-timeline: view()) {
    section[data-chapter] > .sticky {
        animation: investor-stage-exit linear both;
        animation-timeline: view();
        animation-range: exit 0% exit 55%;
    }
}

@keyframes investor-stage-exit {
    from {
        opacity: 1;
    }
    to {
        opacity: 0;
    }
}
</style>
