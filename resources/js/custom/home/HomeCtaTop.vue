<template>
    <section class="top-cta relative w-full">
        <div
            class="pointer-events-none absolute h-1/2 w-full bg-linear-to-b from-black to-transparent"
        ></div>

        <div
            class="relative mx-auto max-w-[1400px] px-6 pt-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <ProductCard
                    v-for="item in products"
                    :key="item.id"
                    :product="item"
                />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import ProductCard from '@/custom/ProductCard.vue';
import { PRODUCTS } from '@/types/products';

const products = PRODUCTS;
</script>
