<template>
    <Head title="Configurator" />

    <div class="md:flex md:h-screen md:overflow-hidden">

        <div
            class="sticky top-0 h-[40vh] bg-white md:static md:h-auto md:w-4/5 flex items-center justify-center overflow-hidden"
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
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { ref, computed } from 'vue';
import ConfiguratorModelSelect from '@/custom/configurator/ConfiguratorModelSelect.vue';
import ConfiguratorProductHeader from '@/custom/configurator/ConfiguratorProductHeader.vue';
import ConfiguratorColorStep from '@/custom/configurator/ConfiguratorColorStep.vue';
import ConfiguratorLeafColorStep from '@/custom/configurator/ConfiguratorLeafColorStep.vue';

const products = [
    { id: 'strom-v1', label: 'Strom V1', params: { power: '800 W',  dailyProduction: '3,2 kWh', roi: '7 let' } },
    { id: 'strom-v2', label: 'Strom V2', params: { power: '1200 W', dailyProduction: '4,8 kWh', roi: '6 let' } },
    { id: 'turbina',  label: 'Turbína',  params: { power: '600 W',  dailyProduction: '2,4 kWh', roi: '8 let' } },
];

const selectedProductId = ref('strom-v1');
const selectedColorId = ref('white');
const selectedLeafColorId = ref('green');

const selectedProduct = computed(() => products.find(p => p.id === selectedProductId.value)!);

const configuratorPanel = ref<HTMLElement | null>(null);

function scrollConfigurator(event: WheelEvent) {
    if (configuratorPanel.value) {
        configuratorPanel.value.scrollTop += event.deltaY;
    }
}
</script>