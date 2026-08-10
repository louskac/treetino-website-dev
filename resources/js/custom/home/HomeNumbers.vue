<template>
    <section
        class="claims relative mx-auto max-w-[1400px] pb-20 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
    >
        <!-- Image with product toggle overlay -->
        <div
            class="relative mx-6 aspect-3/2 overflow-hidden rounded-3xl border border-black/10 bg-stone-100 shadow-2xl sm:mx-0 lg:aspect-3/1 dark:border-white/10 dark:bg-stone-900"
        >
            <!-- Strom V1 -->
            <div v-if="selectedProductId === ProductId.StromV1" class="h-full w-full">
                <img
                    class="hidden h-full w-full object-cover lg:block"
                    src="/img/info/night-detail-w.jpg"
                    alt="Strom V1"
                />
                <img
                    class="block h-full w-full object-cover lg:hidden"
                    src="/img/info/night-detail-l.jpg"
                    alt="Strom V1"
                />
            </div>

            <!-- Strom V2 -->
            <div v-else-if="selectedProductId === ProductId.StromV2" class="h-full w-full">
                <img
                    class="hidden h-full w-full object-cover lg:block"
                    src="/img/info/info-strom-v2-w.webp"
                    alt="Strom V2"
                />
                <img
                    class="block h-full w-full object-cover lg:hidden"
                    src="/img/info/info-strom-v2-l.webp"
                    alt="Strom V2"
                />
            </div>

            <!-- Turbine -->
            <div v-else class="h-full w-full">
                <img
                    class="hidden h-full w-full object-cover lg:block"
                    src="/img/info/info-turbine-w.webp"
                    alt="Větrná turbína"
                />
                <img
                    class="block h-full w-full object-cover lg:hidden"
                    src="/img/info/info-turbine-l.webp"
                    alt="Větrná turbína"
                />
            </div>

            <!-- Product toggle pills -->
            <div class="absolute inset-x-0 bottom-6 flex justify-center px-6">
                <div
                    class="inline-flex gap-2 rounded-full border border-black/10 bg-white/90 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/90"
                >
                    <button
                        v-for="product in PRODUCTS"
                        :key="product.id"
                        class="rounded-full px-5 py-2 text-xs font-medium transition-all sm:text-sm cursor-pointer"
                        :class="
                            selectedProductId === product.id
                                ? 'bg-t-blue text-white shadow-md'
                                : 'text-black/70 hover:bg-black/5 hover:text-black dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white'
                        "
                        @click="selectedProductId = product.id"
                    >
                        {{ $t(product.labelKey, product.label) }}
                    </button>
                </div>
            </div>
        </div>

        <!-- 6 Stats Grid (Dual CTAs: Details + Configurator) -->
        <div
            class="mx-6 grid grid-cols-1 gap-12 pt-12 sm:mx-0 lg:grid-cols-3 2xl:grid-cols-4"
        >
            <div class="col-span-1 flex flex-col">
                <span
                    class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase"
                    >{{ $t('home.features.key_parameters', 'Klíčové Parametry') }}</span
                >
                <h2
                    class="mt-3 text-4xl font-medium leading-tight text-black lg:text-5xl"
                >
                    {{ $t(selectedProduct.numbersTitleKey, selectedProduct.numbersTitle) }}
                </h2>
                <p class="mt-4 text-sm text-black/70">
                    {{ $t(selectedProduct.numbersDescriptionKey, selectedProduct.numbersDescription) }}
                </p>
                <div class="mt-auto pt-6 flex flex-col gap-2.5 sm:flex-row">
                    <ButtonSecondary
                        :href="`/products/${selectedProduct.detail}`"
                        class="w-full text-center sm:w-1/2"
                    >
                        {{ $t('common.actions.info') }}
                    </ButtonSecondary>
                    <ButtonPrimary
                        :href="route('configurator.product', selectedProduct.id)"
                        class="w-full text-center sm:w-1/2"
                    >
                        {{ $t(selectedProduct.configureLabelKey, selectedProduct.configureLabel) }}
                    </ButtonPrimary>
                </div>
            </div>

            <div
                class="col-span-1 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:col-span-2 lg:border-l lg:border-black/10 lg:pl-12 2xl:col-span-3"
            >
                <div
                    v-for="stat in selectedProduct.stats"
                    :key="stat.icon + stat.value"
                >
                    <div class="mb-2 flex items-center gap-3">
                        <div
                            class="flex aspect-square h-12 w-12 shrink-0 rounded-xl bg-t-blue/10 text-t-blue"
                        >
                            <component
                                :is="ICON_MAP[stat.icon] || Flash"
                                stroke-width="1.5"
                                class="m-auto h-6 w-6"
                            />
                        </div>
                        <div
                            class="text-2xl font-medium text-black whitespace-nowrap sm:text-3xl lg:text-3xl xl:text-4xl"
                        >
                            {{ stat.value }}
                        </div>
                    </div>
                    <div class="text-sm text-black/70">
                        {{ $t(stat.descriptionKey, stat.description) }}
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import {
    Asterisk,
    Clock,
    Cube,
    Flash,
    Home,
    Leaf,
    MapPin,
    Palette,
    ShieldCheck,
    TwoPointsCircle,
    Wind,
} from '@iconoir/vue';
import { computed, ref } from 'vue';
import type { Component } from 'vue';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
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
    'shield-check': ShieldCheck,
    clock: Clock,
};

const selectedProductId = ref<string>(ProductId.StromV1);

const selectedProduct = computed(
    () => PRODUCTS.find((p) => p.id === selectedProductId.value) ?? PRODUCTS[0],
);
</script>
