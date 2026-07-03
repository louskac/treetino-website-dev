<template>
    <Head title="Configurator" />

    <div class="md:flex md:h-screen md:overflow-hidden">
        <div
            class="sticky top-0 z-10 flex h-[30vh] items-center justify-center overflow-hidden bg-white md:static md:z-auto md:h-auto md:w-4/5"
            @wheel.prevent="scrollConfigurator"
        >
            <Link
                :href="route('home')"
                class="text-md absolute top-4 left-4 z-10 flex items-center gap-1.5 text-black/35 transition-colors duration-200 hover:text-black/60"
            >
                <ArrowLeft class="h-4 w-4" />
                Zpět
            </Link>
            <div
                class="relative flex h-full w-full items-center justify-center"
            >
                <div
                    v-for="(layers, sectionIndex) in sectionLayerStacks"
                    :key="
                        selectedProductId +
                        '-' +
                        selectedProduct.steps[sectionIndex]?.id
                    "
                    class="absolute inset-0 transition-opacity duration-700"
                    :class="
                        sectionIndex === currentSectionIndex
                            ? 'opacity-100'
                            : 'opacity-0'
                    "
                >
                    <img
                        v-for="layer in layers"
                        :key="
                            selectedProductId +
                            '-' +
                            selectedProduct.steps[sectionIndex]?.id +
                            '-' +
                            layer.src
                        "
                        :src="layer.src"
                        :alt="layer.alt"
                        class="absolute inset-0 h-full w-full object-contain"
                    />
                </div>
            </div>
        </div>

        <div
            ref="configuratorPanel"
            class="border-l border-t-blue/10 bg-white md:h-full md:w-5/9 md:overflow-y-auto lg:w-3/7 xl:w-1/3 2xl:w-3/13 dark:border-white/10 dark:bg-black"
        >
            <div class="flex flex-col gap-7 p-6">
                <ConfiguratorModelSelect
                    :model-value="selectedProductId"
                    :products="products"
                    @update:model-value="selectProduct"
                />
                <ConfiguratorProductHeader
                    :product="selectedProduct"
                    :params="effectiveParams"
                />

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
                    <ConfiguratorTreeDesignStep
                        v-else-if="step.id === 'tree-design'"
                        v-model="selectedTreeDesign"
                        :step-number="index + 1"
                    />
                    <ConfiguratorWindTurbinesStep
                        v-else-if="step.id === 'wind-turbines'"
                        v-model="selectedWindTurbines"
                        :step-number="index + 1"
                    />
                    <ConfiguratorTurbinaSizeStep
                        v-else-if="step.id === 'turbine-size'"
                        v-model="selectedTurbineSize"
                        :step-number="index + 1"
                    />
                    <ConfiguratorTurbinaMountStep
                        v-else-if="step.id === 'turbine-mount'"
                        v-model="selectedTurbineMount"
                        :step-number="index + 1"
                    />
                    <ConfiguratorTurbineColorStep
                        v-else-if="step.id === 'color-turbine'"
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
                        :product-id="selectedProductId"
                    />
                    <ConfiguratorAddonsStep
                        v-else-if="step.id === 'addons'"
                        v-model:ev-charger-count="evChargerCount"
                        v-model:bike-charger-requested="bikeChargerRequested"
                        :step-number="index + 1"
                    />
                </div>

                <!-- Financing / Grant section – shared across all products -->
                <div
                    class="border-t-2 border-black/12 pt-7 dark:border-white/12"
                >
                    <ConfiguratorGrantSection v-model="selectedGrant" />
                </div>

                <div
                    class="border-t border-t-blue/10 pt-7 pb-2 dark:border-white/10"
                >
                    <ConfiguratorCheckout
                        :base-price="basePrice"
                        :grant="selectedGrant"
                        :monthly-savings="selectedProduct.monthlySavings"
                        :product-id="selectedProductId"
                        :reservation-price="selectedProduct.reservationPrice"
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
            :reservation-price="selectedProduct.reservationPrice"
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
import { Head, router, Link } from '@inertiajs/vue3';
import type { ComponentPublicInstance } from 'vue';
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { route } from 'ziggy-js';
import { ArrowLeft } from '@iconoir/vue';
import ConfiguratorAddonsStep from '@/custom/configurator/ConfiguratorAddonsStep.vue';
import ConfiguratorTreeDesignStep from '@/custom/configurator/ConfiguratorTreeDesignStep.vue';
import ConfiguratorBatteryStep from '@/custom/configurator/ConfiguratorBatteryStep.vue';
import ConfiguratorCheckout from '@/custom/configurator/ConfiguratorCheckout.vue';
import ConfiguratorColorStep from '@/custom/configurator/ConfiguratorColorStep.vue';
import ConfiguratorTurbineColorStep from '@/custom/configurator/ConfiguratorTurbineColorStep.vue';
import ConfiguratorConnectivityStep from '@/custom/configurator/ConfiguratorConnectivityStep.vue';
import ConfiguratorWindTurbinesStep from '@/custom/configurator/ConfiguratorWindTurbinesStep.vue';
import ConfiguratorTurbinaSizeStep from '@/custom/configurator/ConfiguratorTurbinaSizeStep.vue';
import ConfiguratorTurbinaMountStep from '@/custom/configurator/ConfiguratorTurbinaMountStep.vue';
import ConfiguratorFveLeafStep from '@/custom/configurator/ConfiguratorFveLeafStep.vue';
import ConfiguratorGrantSection from '@/custom/configurator/ConfiguratorGrantSection.vue';
import ConfiguratorLeafColorStep from '@/custom/configurator/ConfiguratorLeafColorStep.vue';
import ConfiguratorModalCheckout from '@/custom/configurator/ConfiguratorModalCheckout.vue';
import ConfiguratorModalInfo from '@/custom/configurator/ConfiguratorModalInfo.vue';
import ConfiguratorModelSelect from '@/custom/configurator/ConfiguratorModelSelect.vue';
import ConfiguratorProductHeader from '@/custom/configurator/ConfiguratorProductHeader.vue';
import {
    getConfiguratorPreviewLayers,
    type ConfiguratorPreviewSelection,
} from '@/custom/configurator/configuratorPreviewImages';
import { PRODUCTS, ProductId } from '@/types/products';
import type {
    ConfigurationField,
    ProductId as ProductIdType,
} from '@/types/products';

const props = defineProps({
    initialProduct: String,
});

// modals

const modalCheckout = ref(false);
const modalInfo = ref(false);

const selectedPaymentMode = ref('cash');

function modalCheckoutOpen(paymentMode: string) {
    selectedPaymentMode.value = paymentMode;
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

const getInitialProduct = (): ProductIdType => {
    if (
        props.initialProduct &&
        Object.values(ProductId).includes(props.initialProduct as ProductIdType)
    ) {
        return props.initialProduct as ProductIdType;
    }
    return ProductId.StromV1;
};

const selectedProductId = ref<ProductIdType>(getInitialProduct());
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

// Update URL when product changes without page reload
watch(selectedProductId, (newProductId) => {
    const newUrl = route('configurator.product', newProductId);
    window.history.replaceState({}, '', newUrl);
});

const selectedColorId = ref('white');
const selectedLeafColorId = ref('green');
const selectedFveLeafDesign = ref('realistic');
const selectedConnectivity = ref('none');
const selectedBattery = ref('none');
const selectedWindTurbines = ref('without-turbines');
const selectedTurbineSize = ref('large');
const selectedTurbineMount = ref('roof');
const evChargerCount = ref(0);
const bikeChargerRequested = ref(false);
const selectedGrant = ref('none');
const selectedTreeDesign = ref('standard');

const selectedProduct = computed(
    () => products.find((p) => p.id === selectedProductId.value)!,
);

const configFieldValues: Record<string, () => string> = {
    windTurbines: () => selectedWindTurbines.value,
    turbineSize: () => selectedTurbineSize.value,
};

const effectiveParams = computed(() => {
    const { configField, variants } = selectedProduct.value.params;
    if (!configField) return Object.values(variants)[0];
    const getter = configFieldValues[configField];
    const key = getter ? getter() : '';
    return variants[key] ?? Object.values(variants)[0];
});

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

const previewSelection = computed<ConfiguratorPreviewSelection>(() => ({
    color: selectedColorId.value,
    leafColor: selectedLeafColorId.value,
    fveLeafDesign: selectedFveLeafDesign.value,
    connectivity: selectedConnectivity.value,
    battery: selectedBattery.value,
    windTurbines: selectedWindTurbines.value,
    turbineSize: selectedTurbineSize.value,
    turbineMount: selectedTurbineMount.value,
    treeDesign: selectedTreeDesign.value,
}));

const sectionLayerStacks = computed(() => {
    if (!selectedProduct.value.steps) return [];

    return selectedProduct.value.steps.map((step) =>
        getConfiguratorPreviewLayers(
            selectedProductId.value,
            step.id,
            previewSelection.value,
        ),
    );
});

async function selectProduct(productId: string) {
    if (!Object.values(ProductId).includes(productId as ProductIdType)) {
        return;
    }

    if (selectedProductId.value === productId) {
        return;
    }

    selectedProductId.value = productId as ProductIdType;
    sectionsRefs.value = [];
    currentSectionIndex.value = 0;

    resetConfiguration();

    // wait for re-render and reset scroll
    await nextTick();
    updateActiveSection();
}

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
    selectedWindTurbines.value = 'without-turbines';
    selectedTurbineSize.value = 'large';
    selectedTurbineMount.value = 'roof';
    selectedGrant.value = 'none';
    selectedTreeDesign.value = 'standard';
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
        windTurbines: selectedWindTurbines.value,
        turbineSize: selectedTurbineSize.value,
        turbineMount: selectedTurbineMount.value,
        treeDesign: selectedTreeDesign.value,
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

    // Payment mode is a shared field not tied to any product step – always append
    (configuration as Record<string, string | number | boolean>).paymentMode =
        selectedPaymentMode.value;

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
