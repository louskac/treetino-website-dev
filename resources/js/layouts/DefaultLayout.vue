<template>
    <div class="min-h-screen bg-background flex flex-col">
        <!-- Rendered only once globally to achieve better performance -->
        <LiquidGlassFilter/>

        <Header :scroll="props.scroll" />

        <main>
            <slot />
        </main>

        <Footer class="mt-auto"/>
    </div>
</template>

<script setup lang="ts">
import Footer from '@/custom/Footer.vue';
import Header from '@/custom/Header.vue';
import LiquidGlassFilter from '@/custom/LiquidGlassFilter.vue';

const props = defineProps({
    scroll: {
        type: Boolean,
        default: true,
    },
});
</script>
