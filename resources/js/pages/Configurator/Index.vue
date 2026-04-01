<template>
    <Head title="Configurator" />

    <div class="md:flex md:h-screen md:overflow-hidden">

        <div
            class="sticky top-0 z-10 h-[30vh] bg-white md:static md:z-auto md:h-auto md:w-4/5 flex items-center justify-center overflow-hidden"
            @wheel.prevent="scrollConfigurator"
        >
            <img src="/img/features-2.png" class="max-h-full max-w-full object-contain">
        </div>

        <div
            ref="configuratorPanel"
            class="md:w-1/5 md:h-full border-l border-t-blue/10 dark:border-white/10 md:overflow-y-auto bg-white dark:bg-black"
        >
            <div class="p-6 flex flex-col gap-7">
                <ConfiguratorModelSelect
                    v-model="selectedProductId"
                    :products="products"
                />
                <ConfiguratorProductHeader :product="selectedProduct" />
                <div class="border-t border-t-blue/10 dark:border-white/10 pt-7">
                    <ConfiguratorColorStep v-model="selectedColorId" />
                </div>
                <div class="border-t border-t-blue/10 dark:border-white/10 pt-7">
                    <ConfiguratorLeafColorStep v-model="selectedLeafColorId" />
                </div>
                <div class="border-t border-t-blue/10 dark:border-white/10 pt-7">
                    <ConfiguratorConnectivityStep v-model="selectedConnectivity" />
                </div>
                <div class="border-t border-t-blue/10 dark:border-white/10 pt-7">
                    <ConfiguratorBatteryStep v-model="selectedBattery" />
                </div>
                <div class="border-t border-t-blue/10 dark:border-white/10 pt-7">
                    <ConfiguratorAddonsStep v-model:ev-charger-count="evChargerCount" v-model:bike-charger-requested="bikeChargerRequested" />
                </div>
                <div class="border-t border-t-blue/10 dark:border-white/10 pt-7 pb-2">
                    <ConfiguratorCheckout :base-price="basePrice" />
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref, computed, onMounted } from 'vue';
import { PRODUCTS, BASE_PRICES, ProductId } from '@/types/products';
import ConfiguratorModelSelect from '@/custom/configurator/ConfiguratorModelSelect.vue';
import ConfiguratorProductHeader from '@/custom/configurator/ConfiguratorProductHeader.vue';
import ConfiguratorColorStep from '@/custom/configurator/ConfiguratorColorStep.vue';
import ConfiguratorLeafColorStep from '@/custom/configurator/ConfiguratorLeafColorStep.vue';
import ConfiguratorConnectivityStep from '@/custom/configurator/ConfiguratorConnectivityStep.vue';
import ConfiguratorBatteryStep from '@/custom/configurator/ConfiguratorBatteryStep.vue';
import ConfiguratorAddonsStep from '@/custom/configurator/ConfiguratorAddonsStep.vue';
import ConfiguratorCheckout from '@/custom/configurator/ConfiguratorCheckout.vue';

const products = PRODUCTS;

const selectedProductId = ref<ProductId>(ProductId.StromV2);

onMounted(() => {
    const param = new URLSearchParams(window.location.search).get('product') as ProductId | null;
    if (param && PRODUCTS.some(p => p.id === param)) {
        selectedProductId.value = param;
    }
});
const selectedColorId = ref('white');
const selectedLeafColorId = ref('green');
const selectedConnectivity = ref('none');
const selectedBattery = ref('none');
const evChargerCount = ref(0);
const bikeChargerRequested = ref(false);

const selectedProduct = computed(() => products.find(p => p.id === selectedProductId.value)!);

const basePrice = computed(() => BASE_PRICES[selectedProductId.value] ?? 0);

const configuratorPanel = ref<HTMLElement | null>(null);

function scrollConfigurator(event: WheelEvent) {
    if (configuratorPanel.value) {
        configuratorPanel.value.scrollTop += event.deltaY;
    }
}
</script>