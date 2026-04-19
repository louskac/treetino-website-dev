<template>
    <Head title="Configurator" />

    <div class="md:flex md:h-screen md:overflow-hidden">
        <div
            class="sticky top-0 z-10 flex h-[30vh] items-center justify-center overflow-hidden bg-white md:static md:z-auto md:h-auto md:w-4/5"
            @wheel.prevent="scrollConfigurator"
        >
            <div
                class="relative flex h-full w-full items-center justify-center"
            >
                <img
                    v-for="(img, i) in sectionImages"
                    :key="selectedProductId + '-' + i + '-' + img"
                    :src="img"
                    class="absolute max-h-full max-w-full object-contain transition-opacity duration-700"
                    :class="
                        i === currentSectionIndex ? 'opacity-100' : 'opacity-0'
                    "
                />
            </div>
        </div>

        <div
            ref="configuratorPanel"
            class="border-l border-t-blue/10 bg-white md:h-full md:w-5/9 md:overflow-y-auto lg:w-3/7 xl:w-1/3 2xl:w-3/13 dark:border-white/10 dark:bg-black"
        >
            <div class="flex flex-col gap-7 p-6">
                <ConfiguratorModelSelect
                    v-model="selectedProductId"
                    :products="products"
                />
                <ConfiguratorProductHeader :product="selectedProduct" />

                <div
                    v-for="(step, index) in selectedProduct.steps"
                    :key="step.id"
                    :ref="setSectionRef"
                    @click="forceActiveSection(step.id)"
                    class="border-t border-t-blue/10 pt-7 dark:border-white/10"
                >
                    <ConfiguratorColorStep
                        v-if="step.id === 'color'"
                        v-model="selectedColorId"
                        :step-number="index + 1"
                    />
                    <ConfiguratorLeafColorStep
                        v-else-if="step.id === 'leaf'"
                        v-model="selectedLeafColorId"
                        :step-number="index + 1"
                    />
                    <ConfiguratorFveLeafStep
                        v-else-if="step.id === 'fve-leaf'"
                        v-model="selectedFveLeafDesign"
                        :step-number="index + 1"
                    />
                    <ConfiguratorConnectivityStep
                        v-else-if="step.id === 'connectivity'"
                        v-model="selectedConnectivity"
                        :step-number="index + 1"
                    />
                    <ConfiguratorBatteryStep
                        v-else-if="step.id === 'battery'"
                        v-model="selectedBattery"
                        :step-number="index + 1"
                    />
                    <ConfiguratorAddonsStep
                        v-else-if="step.id === 'addons'"
                        v-model:ev-charger-count="evChargerCount"
                        v-model:bike-charger-requested="bikeChargerRequested"
                        :step-number="index + 1"
                    />
                </div>

                <!-- Financing / Grant section – shared across all products -->
                <div class="border-t-2 border-black/12 pt-7 dark:border-white/12">
                    <ConfiguratorGrantSection
                        v-model="selectedGrant"
                    />
                </div>

                <div
                    class="border-t border-t-blue/10 pt-7 pb-2 dark:border-white/10"
                >
                    <ConfiguratorCheckout
                        :base-price="basePrice"
                        @checkout="modalCheckoutOpen"
                        @info="modalInfoOpen"
                    />
                </div>
            </div>
        </div>
    </div>

    <!--  MODALS  -->
    <!--  Checkout  -->
    <Transition>
        <ConfiguratorModalCheckout
            v-if="modalCheckout"
            :product-id="selectedProductId"
            :configuration="buildConfiguration()"
            @close="modalCheckoutClose"
            @success="paymentSuccess"
        />
    </Transition>

    <!--  Info  -->
    <Transition>
        <ConfiguratorModalInfo v-if="modalInfo" @close="modalInfoClose" />
    </Transition>
</template>

<script setup lang="ts">
import { Head, router } from '@inertiajs/vue3';
import type { ComponentPublicInstance } from 'vue';
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { route } from 'ziggy-js';
import ConfiguratorAddonsStep from '@/custom/configurator/ConfiguratorAddonsStep.vue';
import ConfiguratorBatteryStep from '@/custom/configurator/ConfiguratorBatteryStep.vue';
import ConfiguratorCheckout from '@/custom/configurator/ConfiguratorCheckout.vue';
import ConfiguratorColorStep from '@/custom/configurator/ConfiguratorColorStep.vue';
import ConfiguratorConnectivityStep from '@/custom/configurator/ConfiguratorConnectivityStep.vue';
import ConfiguratorFveLeafStep from '@/custom/configurator/ConfiguratorFveLeafStep.vue';
import ConfiguratorGrantSection from '@/custom/configurator/ConfiguratorGrantSection.vue';
import ConfiguratorLeafColorStep from '@/custom/configurator/ConfiguratorLeafColorStep.vue';
import ConfiguratorModalCheckout from '@/custom/configurator/ConfiguratorModalCheckout.vue';
import ConfiguratorModalInfo from '@/custom/configurator/ConfiguratorModalInfo.vue';
import ConfiguratorModelSelect from '@/custom/configurator/ConfiguratorModelSelect.vue';
import ConfiguratorProductHeader from '@/custom/configurator/ConfiguratorProductHeader.vue';
import { PRODUCTS, ProductId  } from '@/types/products';
import type {ConfigurationField} from '@/types/products';

// modals

const modalCheckout = ref(false);
const modalInfo = ref(false);

function modalCheckoutOpen() {
    modalCheckout.value = true;
}

function modalCheckoutClose() {
    modalCheckout.value = false;
}

function modalInfoOpen() {
    modalInfo.value = true;
}

function modalInfoClose() {
    modalInfo.value = false;
}

const products = PRODUCTS;

const selectedProductId = ref<ProductId>(ProductId.StromV2);
let removePanelScrollListener: (() => void) | null = null;

onMounted(() => {
    const panel = configuratorPanel.value;

    if (panel) {
        panel.addEventListener('scroll', updateActiveSection, {
            passive: true,
        });
        removePanelScrollListener = () =>
            panel.removeEventListener('scroll', updateActiveSection);
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
const selectedFveLeafDesign = ref('realistic');
const selectedConnectivity = ref('none');
const selectedBattery = ref('none');
const evChargerCount = ref(0);
const bikeChargerRequested = ref(false);
const selectedGrant = ref('none');

const selectedProduct = computed(
    () => products.find((p) => p.id === selectedProductId.value)!,
);

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

    return selectedProduct.value.steps.map((step) => {
        const prodId = selectedProductId.value;

        switch (step.id) {
            case 'color':
                return `/img/config-images/${prodId}/color/color_${selectedColorId.value}.webp`;
            case 'leaf':
                return `/img/config-images/${prodId}/leaf-color/leaf_${selectedLeafColorId.value}.webp`;
            case 'fve-leaf':
                return `/img/config-images/${prodId}/fve-leaf/fve-leaf_${selectedFveLeafDesign.value}.webp`;
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

    resetConfiguration();

    // wait for re-render and reset scroll
    await nextTick();
    updateActiveSection();
});

function setSectionRef(el: Element | ComponentPublicInstance | null) {
    if (el instanceof HTMLElement && !sectionsRefs.value.includes(el)) {
        sectionsRefs.value.push(el);
    }
}

function resetConfiguration() {
    selectedColorId.value = 'white';
    selectedLeafColorId.value = 'green';
    selectedFveLeafDesign.value = 'realistic';
    selectedConnectivity.value = 'none';
    selectedBattery.value = 'none';
    evChargerCount.value = 0;
    bikeChargerRequested.value = false;
    selectedGrant.value = 'none';
}

function updateActiveSection() {
    // forced focus is used to prevent instantly switching back from selected option to section when clicked and scrolled
    if (isForcedFocus) return;

    const panel = configuratorPanel.value;

    const usePanelTrigger =
        !!panel && window.matchMedia('(min-width: 768px)').matches;
    const triggerY = usePanelTrigger
        ? panel.getBoundingClientRect().top +
          panel.getBoundingClientRect().height * 0.5
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

    const index = selectedProduct.value.steps.findIndex((s) => s.id === stepId);

    if (index !== -1 && currentSectionIndex.value !== index) {
        currentSectionIndex.value = index;

        isForcedFocus = true;

        if (focusTimeout) clearTimeout(focusTimeout);

        focusTimeout = setTimeout(() => {
            isForcedFocus = false;
        }, 400);
    }
}

// Build configuration object
function buildConfiguration() {
    const configurationValues: Record<
        ConfigurationField,
        string | number | boolean
    > = {
        color: selectedColorId.value,
        leafColor: selectedLeafColorId.value,
        fveLeafDesign: selectedFveLeafDesign.value,
        connectivity: selectedConnectivity.value,
        battery: selectedBattery.value,
        evChargerCount: evChargerCount.value,
        bikeChargerRequested: bikeChargerRequested.value,
        grant: selectedGrant.value,
    };

    const configuration = selectedProduct.value.steps.reduce<
        Partial<Record<ConfigurationField, string | number | boolean>>
    >((result, step) => {
        step.configurationFields.forEach((field) => {
            result[field] = configurationValues[field];
        });

        return result;
    }, {});

    // Grant is a shared field not tied to any product step – always append
    configuration.grant = selectedGrant.value;

    console.log('Selected configuration:', configuration);

    return configuration;
}

// Payment Success
function paymentSuccess(uuid: string) {
    console.log('Redirecting for UUID:', uuid);

    router.visit(route('preorders.success', { uuid: uuid }));
}
</script>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 200ms ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
