<template>
    <Head title="Home" />

    <DefaultLayout>
        <HomeHero/>

        <HomeCtaTop/>
        
        <HomeFeatures/>

        <HomeCtaGeneric/>

        <DefaultConfig/>
    </DefaultLayout>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import DefaultConfig from '@/custom/config/DefaultConfig.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import HomeHero from '@/custom/home/HomeHero.vue';
import HomeCtaTop from '@/custom/home/HomeCtaTop.vue';
import HomeFeatures from '@/custom/home/HomeFeatures.vue';
import HomeCtaGeneric from '@/custom/home/HomeCtaGeneric.vue';
</script>
