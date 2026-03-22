<template>
    <Head title="Home" />

    <DefaultLayout>
        <HomeHero/>

        <HomeCtaTop/>
    </DefaultLayout>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import HomeHero from '@/custom/home/HomeHero.vue';
import HomeCtaTop from '@/custom/home/HomeCtaTop.vue';
</script>
