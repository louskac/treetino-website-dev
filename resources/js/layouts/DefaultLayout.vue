<template>
    <div class="min-h-screen bg-background flex flex-col">
        <Header />

        <main>
            <slot />
        </main>

        <Footer class="mt-auto"/>
    </div>
</template>

<script setup lang="ts">
import Footer from '@/custom/Footer.vue';
import Header from '@/custom/Header.vue';
</script>
