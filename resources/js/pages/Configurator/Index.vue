<template>
    <Head title="Configurator" />

    <div class="md:flex md:h-screen md:overflow-hidden">

        <div
            class="sticky top-0 z-10 h-[30vh] bg-white md:static md:z-auto md:h-auto md:w-4/5 flex items-center justify-center overflow-hidden"
            @wheel.prevent="scrollConfigurator"
        >
            <div class="relative w-full h-full flex items-center justify-center">
                <img
                    v-for="(img, i) in sectionImages"
                    :key="selectedProductId + '-' + i + '-' + img"
                    :src="img"
                    class="absolute max-h-full max-w-full object-contain transition-opacity duration-700"
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
                
                <div 
                    v-for="step in selectedProduct.steps" 
                    :key="step.id" 
                    :ref="setSectionRef" 
                    @click="forceActiveSection(step.id)"
                    class="border-t border-t-blue/10 dark:border-white/10 pt-7"
                >
                    <ConfiguratorColorStep v-if="step.id === 'color'" v-model="selectedColorId" />
                    <ConfiguratorLeafColorStep v-else-if="step.id === 'leaf'" v-model="selectedLeafColorId" />
                    <ConfiguratorConnectivityStep v-else-if="step.id === 'connectivity'" v-model="selectedConnectivity" />
                    <ConfiguratorBatteryStep v-else-if="step.id === 'battery'" v-model="selectedBattery" />
                    <ConfiguratorAddonsStep v-else-if="step.id === 'addons'" v-model:ev-charger-count="evChargerCount" v-model:bike-charger-requested="bikeChargerRequested" />
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
import { ref, computed, onMounted, onUnmounted, nextTick, watch, ComponentPublicInstance } from 'vue';
import { PRODUCTS, ProductId } from '@/types/products';
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
let removePanelScrollListener: (() => void) | null = null;

onMounted(() => {
    const panel = configuratorPanel.value;
    if (panel) {
        panel.addEventListener('scroll', updateActiveSection, { passive: true });
        removePanelScrollListener = () => panel.removeEventListener('scroll', updateActiveSection);
    }

    window.addEventListener('scroll', updateActiveSection, { passive: true });
    window.addEventListener('resize', updateActiveSection, { passive: true });

    nextTick(updateActiveSection);
});

onUnmounted(() => {
    removePanelScrollListener?.();
    window.removeEventListener('scroll', updateActiveSection);
    window.removeEventListener('resize', updateActiveSection);
});

const selectedColorId = ref('white');
const selectedLeafColorId = ref('green');
const selectedConnectivity = ref('none');
const selectedBattery = ref('none');
const evChargerCount = ref(0);
const bikeChargerRequested = ref(false);

const selectedProduct = computed(() => products.find(p => p.id === selectedProductId.value)!);

const basePrice = computed(() => selectedProduct.value.basePrice ?? 0);

const configuratorPanel = ref<HTMLElement | null>(null);

let focusTimeout: ReturnType<typeof setTimeout> | null = null;
let isForcedFocus = false;

function scrollConfigurator(event: WheelEvent) {
    if (configuratorPanel.value) {
        configuratorPanel.value.scrollTop += event.deltaY;
    }
}

/* Scroll based image switching */
const sectionsRefs = ref<HTMLElement[]>([]);
const currentSectionIndex = ref(0);

const sectionImages = computed(() => {
    if (!selectedProduct.value.steps) return [];

    return selectedProduct.value.steps.map(step => {
        const prodId = selectedProductId.value;
        
        switch (step.id) {
            case 'color':
                return `/img/config-images/${prodId}/color/color_${selectedColorId.value}.webp`;
            case 'leaf':
                return `/img/config-images/${prodId}/leaf-color/leaf_${selectedLeafColorId.value}.webp`;
            case 'connectivity':
                return `/img/config-images/${prodId}/connectivity/connectivity_${selectedConnectivity.value}.webp`;
            case 'battery':
                return `/img/config-images/${prodId}/battery/battery_${selectedBattery.value}.webp`;
            case 'addons':
                return `/img/config-images/${prodId}/addons.webp`;
            default:
                return `/img/config-images/${prodId}/default.webp`;
        }
    });
});

// when product is changed, reset watched DOM elements and reset section index
watch(selectedProductId, async () => {
    sectionsRefs.value = [];
    currentSectionIndex.value = 0;
    
    // wait for re-render and reset scroll
    await nextTick();
    updateActiveSection();
});

function setSectionRef(
    el: Element | ComponentPublicInstance | null
) {
    if (el instanceof HTMLElement && !sectionsRefs.value.includes(el)) {
        sectionsRefs.value.push(el);
    }
}

function updateActiveSection() {
    // forced focus is used to prevent instantly switching back from selected option to section when clicked and scrolled
    if (isForcedFocus) return; 

    const panel = configuratorPanel.value;

    const usePanelTrigger = !!panel && window.matchMedia('(min-width: 768px)').matches;
    const triggerY = usePanelTrigger
        ? panel.getBoundingClientRect().top + panel.getBoundingClientRect().height * 0.5
        : window.innerHeight * 0.65;

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

function forceActiveSection(stepId: string) {
    if (!selectedProduct.value.steps) return;
    
    const index = selectedProduct.value.steps.findIndex(s => s.id === stepId);
    
    if (index !== -1 && currentSectionIndex.value !== index) {
        currentSectionIndex.value = index;
        
        isForcedFocus = true;
        
        if (focusTimeout) clearTimeout(focusTimeout);
        
        focusTimeout = setTimeout(() => {
            isForcedFocus = false;
        }, 400);
    }
}
</script>