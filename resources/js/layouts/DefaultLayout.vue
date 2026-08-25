<template>
    <div class="min-h-screen bg-background text-foreground flex flex-col">
        <!-- Rendered only once globally to achieve better performance -->
        <LiquidGlassFilter/>

        <Header :scroll="props.scroll" :inverted="props.inverted" />

        <main>
            <slot />
        </main>

        <Footer class="mt-auto"/>

        <CookieBanner/>
    </div>
</template>

<script setup lang="ts">
import CookieBanner from '@/custom/CookieBanner.vue';
import Footer from '@/custom/Footer.vue';
import Header from '@/custom/Header.vue';
import LiquidGlassFilter from '@/custom/LiquidGlassFilter.vue';

const props = withDefaults(
    defineProps<{
        scroll?: boolean;
        inverted?: boolean;
    }>(),
    {
        scroll: true,
        inverted: false,
    },
);
</script>
