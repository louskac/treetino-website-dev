<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import Web3AppShowcase from '@/custom/web3/Web3AppShowcase.vue';
import Web3DroneStory from '@/custom/web3/Web3DroneStory.vue';
import Web3HeroStory from '@/custom/web3/Web3HeroStory.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>

<template>
    <Head :title="$t('web3.meta.title')">
        <meta
            name="description"
            :content="$t('web3.meta.description')"
        />
        <meta name="robots" content="noindex, nofollow" />
    </Head>

    <DefaultLayout :scroll="true" :dark="true">
        <!-- 1. CINEMATIC 5-ACT STORY HERO (EUROPE MAP -> BESS -> WALLET -> SCADA -> ECOSYSTEM) -->
        <Web3HeroStory />

        <!-- 2. IN-BETWEEN APP SHOWCASE: 3 SIMPLE STEPS & APP VIDEO -->
        <Web3AppShowcase />

        <!-- 3. REAL-WORLD PHYSICAL PROOF & DRONE SHOT SCROLL FLIGHT -->
        <Web3DroneStory />
    </DefaultLayout>
</template>
