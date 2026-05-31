<template>
    <section
        class="claims relative mx-auto max-w-[1400px] pb-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
    >
        <!-- Image with product toggle overlay -->
        <div
            class="relative mx-6 aspect-3/2 overflow-hidden rounded-2xl bg-stone-100 shadow-lg sm:mx-0 lg:aspect-3/1 dark:bg-stone-900"
        >
            <img
                v-if="selectedProductId === ProductId.StromV1"
                class="h-full w-full object-contain p-6 lg:p-12"
                src="/img/stills/Still_Strom-v1.png"
                alt="Strom V1"
            />
            <img
                v-else-if="selectedProductId === ProductId.StromV2"
                class="h-full w-full object-contain p-6 lg:p-12"
                src="/img/stills/Still_Strom-v2.png"
                alt="Strom V2"
            />
            <img
                v-else
                class="h-full w-full object-contain p-6 lg:p-12"
                src="/img/stills/Still_Turbina.png"
                alt="Větrná turbína"
            />

            <!-- Product toggle -->
            <div class="absolute inset-x-0 bottom-4 flex justify-start px-4">
                <div
                    class="inline-flex gap-0.5 rounded-full border border-black/10 bg-white/80 p-1 shadow-lg backdrop-blur-md"
                >
                    <button
                        v-for="product in PRODUCTS"
                        :key="product.id"
                        class="rounded-full px-5 py-1.5 text-sm font-medium transition-all"
                        :class="
                            selectedProductId === product.id
                                ? 'bg-primary text-white shadow-sm'
                                : 'text-black/60 hover:text-black'
                        "
                        @click="selectedProductId = product.id"
                    >
                        {{ product.label }}
                    </button>
                </div>
            </div>
        </div>

        <div
            class="mx-6 grid grid-cols-1 gap-12 pt-12 sm:mx-0 lg:grid-cols-3 2xl:grid-cols-4"
        >
            <div class="col-span-1 flex flex-col">
                <div class="relative z-10 flex items-center justify-between">
                    <span
                        class="text-xs font-semibold tracking-[0.2em] text-black/60 uppercase"
                        >{{ selectedProduct.label }}</span
                    >
                </div>

                <h2 class="mt-3 text-4xl leading-9 2xl:text-6xl 2xl:leading-14">
                    Informace &&nbsp;Čísla
                </h2>

                <div class="mt-auto pt-6">
                    <ButtonPrimary
                        :href="route('configurator')"
                        class="w-full text-center"
                        >Configure</ButtonPrimary
                    >
                </div>
            </div>

            <div
                class="col-span-1 grid gap-6 lg:col-span-2 lg:border-l lg:pl-12 2xl:col-span-3"
                :class="
                    selectedProduct.stats.length <= 3
                        ? 'grid-cols-1 sm:grid-cols-3'
                        : 'grid-cols-2 2xl:grid-cols-3'
                "
            >
                <div v-for="stat in selectedProduct.stats" :key="stat.icon + stat.value">
                    <div class="mb-2 flex gap-3">
                        <div
                            class="flex aspect-square h-12 w-12 shrink-0 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                        >
                            <component
                                :is="ICON_MAP[stat.icon]"
                                stroke-width="1.5"
                                class="mx-auto my-auto h-6 w-6"
                            />
                        </div>
                        <div class="my-auto text-4xl">{{ stat.value }}</div>
                    </div>

                    <div class="pt-1 opacity-70">{{ stat.description }}</div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import type { Component } from 'vue';
import {
    Asterisk,
    Cube,
    Flash,
    Home,
    Leaf,
    MapPin,
    Palette,
    TwoPointsCircle,
    Wind,
} from '@iconoir/vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import { route } from 'ziggy-js';
import { PRODUCTS, ProductId } from '@/types/products';

const ICON_MAP: Record<string, Component> = {
    leaf: Leaf,
    wind: Wind,
    asterisk: Asterisk,
    cube: Cube,
    'two-points-circle': TwoPointsCircle,
    home: Home,
    flash: Flash,
    'map-pin': MapPin,
    palette: Palette,
};

const selectedProductId = ref<string>(ProductId.StromV1);

const selectedProduct = computed(
    () => PRODUCTS.find((p) => p.id === selectedProductId.value) ?? PRODUCTS[0],
);
</script>
