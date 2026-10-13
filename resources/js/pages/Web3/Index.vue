<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Web3AppShowcase from '@/custom/web3/Web3AppShowcase.vue';
import Web3DroneStory from '@/custom/web3/Web3DroneStory.vue';
import Web3HeroStory from '@/custom/web3/Web3HeroStory.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>

<template>
    <Head title="Web3 &amp; RWA Tokenizace na Solana | Treetino Colosseum">
        <meta
            name="description"
            content="Oficiální pitch pro Colosseum Hackathon: Tokenizace fyzické energetické infrastruktury na Solana. Od kinetických stromů Treetino V1 přes bateriová úložiště (35 % APY) až po průmyslové větrné parky."
        />
        <meta name="robots" content="noindex, nofollow" />
    </Head>

    <DefaultLayout :scroll="true">
        <!-- 1. CINEMATIC 5-ACT STORY HERO (EUROPE MAP -> BESS -> WALLET -> SCADA -> ECOSYSTEM) -->
        <Web3HeroStory />

        <!-- 2. IN-BETWEEN APP SHOWCASE: 3 SIMPLE STEPS & APP VIDEO -->
        <Web3AppShowcase />

        <!-- 3. REAL-WORLD PHYSICAL PROOF & DRONE SHOT SCROLL FLIGHT -->
        <Web3DroneStory />
    </DefaultLayout>
</template>
