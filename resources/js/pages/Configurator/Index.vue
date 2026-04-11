<template>
    <Head title="Configurator" />

    <div class="md:flex md:h-screen md:overflow-hidden">

        <div
            class="sticky top-0 z-10 h-[30vh] bg-white md:static md:z-auto md:h-auto md:w-4/5 flex items-center justify-center overflow-hidden"
            @wheel.prevent="scrollConfigurator"
        >
            <div class="relative w-full h-full">
                <img
                    v-for="(img, i) in sectionImages"
                    :key="i"
                    :src="img"
                    class="absolute inset-0 max-h-full max-w-full object-contain transition-opacity duration-700"
                    :class="i === currentSectionIndex ? 'opacity-100' : 'opacity-0'"
                />
            </div>
        </div>

        <div
            ref="configuratorPanel"
            class="md:w-5/9 lg:w-3/7 xl:w-1/3 2xl:w-3/13 md:h-full border-l border-t-blue/10 dark:border-white/10 md:overflow-y-auto bg-white dark:bg-black"
        >
            <div class="p-6 flex flex-col gap-7">
                <ConfiguratorModelSelect
                    v-model="selectedProductId"
                    :products="products"
                />
                <ConfiguratorProductHeader :product="selectedProduct" />
                <div :ref="setSectionRef" class="border-t border-t-blue/10 dark:border-white/10 pt-7">
                    <ConfiguratorColorStep v-model="selectedColorId" />
                </div>
                <div :ref="setSectionRef" class="border-t border-t-blue/10 dark:border-white/10 pt-7">
                    <ConfiguratorLeafColorStep v-model="selectedLeafColorId" />
                </div>
                <div :ref="setSectionRef" class="border-t border-t-blue/10 dark:border-white/10 pt-7">
                    <ConfiguratorConnectivityStep v-model="selectedConnectivity" />
                </div>
                <div :ref="setSectionRef" class="border-t border-t-blue/10 dark:border-white/10 pt-7">
                    <ConfiguratorBatteryStep v-model="selectedBattery" />
                </div>
                <div :ref="setSectionRef" class="border-t border-t-blue/10 dark:border-white/10 pt-7">
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
import { ref, computed, onMounted, ComponentPublicInstance } from 'vue';
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

    configuratorPanel.value?.addEventListener('scroll', updateActiveSection);
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

/* Scroll based image switching */
const sectionsRefs = ref<HTMLElement[]>([]);
const currentSectionIndex = ref(0);

const sectionImages = [
    '/img/features-frames/features_frame_0001.webp',
    '/img/features-frames/features_frame_0058.webp',
    '/img/features-frames/features_frame_0114.webp',
    '/img/features-frames/features_frame_0171.webp',
    '/img/features-frames/features_frame_0228.webp',
];

function setSectionRef(
    el: Element | ComponentPublicInstance | null
) {
    if (el instanceof HTMLElement && !sectionsRefs.value.includes(el)) {
        sectionsRefs.value.push(el);
    }
}

function updateActiveSection() {
    const container = configuratorPanel.value;
    if (!container) return;

    const containerRect = container.getBoundingClientRect();

    const triggerY = containerRect.top + containerRect.height * 1/2;

    let activeIndex = 0;

    sectionsRefs.value.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        const elCenter = rect.top + rect.height / 2;

        // if center is above trigger point
        if (elCenter <= triggerY) {
            activeIndex = index;
        }
    });

    currentSectionIndex.value = activeIndex;
}

</script>