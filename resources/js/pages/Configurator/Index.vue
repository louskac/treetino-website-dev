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
                {{ $t('configurator.back') }}
            </Link>
            <div
                class="relative flex h-full w-full items-center justify-center"
            >
                <div
                    v-for="preview in visibleSectionPreviews"
                    :key="selectedProductId + '-' + preview.id"
                    class="absolute inset-0 transition-opacity duration-700"
                    :class="
                        preview.id === currentSectionId
                            ? 'opacity-100'
                            : 'opacity-0'
                    "
                >
                    <template v-if="preview.type === 'layers'">
                        <img
                            v-for="layer in preview.layers"
                            :key="
                                selectedProductId +
                                '-' +
                                preview.id +
                                '-' +
                                layer.src
                            "
                            :src="layer.src"
                            :alt="layer.alt"
                            class="absolute inset-0 h-full w-full object-contain"
                        />
                    </template>
                    <div
                        v-else
                        class="flex h-full w-full items-center justify-center px-5 sm:px-8 md:px-10"
                    >
                        <div
                            class="grid w-full items-end justify-center gap-3 sm:gap-5 md:gap-8"
                            :class="
                                preview.items.length === 1
                                    ? 'max-w-[min(72vw,72vh,560px)] grid-cols-1'
                                    : 'max-w-4xl grid-cols-3'
                            "
                        >
                            <div
                                v-for="item in preview.items"
                                :key="
                                    selectedProductId +
                                    '-' +
                                    preview.id +
                                    '-' +
                                    item.src
                                "
                                class="flex min-w-0 flex-col items-center gap-3"
                            >
                                <img
                                    :src="item.src"
                                    :alt="item.alt"
                                    class="w-full translate-y-6 object-contain transition-opacity duration-300 md:translate-y-0"
                                    :class="[
                                        preview.items.length === 1
                                            ? 'h-[22vh] max-w-[min(72vw,72vh,560px)] md:h-auto md:aspect-square'
                                            : 'aspect-square max-w-[180px] md:max-w-[240px]',
                                        item.selected
                                            ? 'opacity-100'
                                            : 'opacity-50',
                                    ]"
                                />
                                <div
                                    class="flex h-9 items-center justify-center"
                                >
                                    <div
                                        v-if="item.selected"
                                        class="flex h-6 w-6 items-center justify-center rounded-full bg-black text-white shadow-sm"
                                        :aria-label="item.label + ' vybráno'"
                                    >
                                        <Check class="h-4 w-4" />
                                    </div>
                                </div>
                                <p
                                    class="hidden text-center text-sm leading-relaxed text-black/55 md:block dark:text-white/55"
                                    :class="
                                        preview.items.length === 1
                                            ? 'max-w-[34rem]'
                                            : 'max-w-[12rem]'
                                    "
                                >
                                    {{ $t(item.descriptionKey) }}
                                </p>
                            </div>
                        </div>
                    </div>
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
                    :ref="(el) => setSectionRef(step.id, el)"
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
                        v-model:custom-image="customFveLeafImage"
                        :step-number="index + 1"
                        :product-id="selectedProductId"
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
                    :ref="(el) => setSectionRef(FALLBACK_SECTION_ID, el)"
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
import { ArrowLeft } from '@iconoir/vue';
import { Head, router, Link } from '@inertiajs/vue3';
import { Check } from 'lucide-vue-next';
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
import { getConfiguratorPreview } from '@/custom/configurator/configuratorPreviewImages';
import type {
    ConfiguratorPreview,
    ConfiguratorPreviewSelection,
} from '@/custom/configurator/configuratorPreviewImages';
import ConfiguratorProductHeader from '@/custom/configurator/ConfiguratorProductHeader.vue';
import ConfiguratorTreeDesignStep from '@/custom/configurator/ConfiguratorTreeDesignStep.vue';
import ConfiguratorTurbinaMountStep from '@/custom/configurator/ConfiguratorTurbinaMountStep.vue';
import ConfiguratorTurbinaSizeStep from '@/custom/configurator/ConfiguratorTurbinaSizeStep.vue';
import ConfiguratorTurbineColorStep from '@/custom/configurator/ConfiguratorTurbineColorStep.vue';
import ConfiguratorWindTurbinesStep from '@/custom/configurator/ConfiguratorWindTurbinesStep.vue';
import { PRODUCTS, ProductId } from '@/types/products';
import type {
    ConfigurationField,
    ProductId as ProductIdType,
} from '@/types/products';

const FALLBACK_SECTION_ID = '__fallback__';

type SectionPreview = ConfiguratorPreview & {
    id: string;
};

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
        panel.addEventListener('scroll', handleScrollActiveSection, {
            passive: true,
        });
        removePanelScrollListener = () =>
            panel.removeEventListener('scroll', handleScrollActiveSection);
    }

    window.addEventListener('scroll', handleScrollActiveSection, {
        passive: true,
    });
    window.addEventListener('resize', updateActiveSection, { passive: true });

    nextTick(updateActiveSection);
});

onUnmounted(() => {
    removePanelScrollListener?.();
    window.removeEventListener('scroll', handleScrollActiveSection);
    window.removeEventListener('resize', updateActiveSection);
});

// Update URL when product changes without page reload
watch(selectedProductId, (newProductId) => {
    const newUrl = route('configurator.product', newProductId);
    window.history.replaceState({}, '', newUrl);
});

const selectedColorId = ref('white');
const selectedLeafColorId = ref('green');
const selectedFveLeafDesign = ref('spring');
const customFveLeafImage = ref<string | null>(null);
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

    if (!configField) {
        return Object.values(variants)[0];
    }

    const getter = configFieldValues[configField];
    const key = getter ? getter() : '';

    return variants[key] ?? Object.values(variants)[0];
});

const basePrice = computed(() => selectedProduct.value.basePrice ?? 0);

const configuratorPanel = ref<HTMLElement | null>(null);

let isForcedFocus = false;

function scrollConfigurator(event: WheelEvent) {
    if (configuratorPanel.value) {
        configuratorPanel.value.scrollTop += event.deltaY;
    }
}

/* Scroll based image switching */
const sectionElements = new Map<string, HTMLElement>();
const currentSectionId = ref(getFirstSectionId());

const previewSelection = computed<ConfiguratorPreviewSelection>(() => ({
    color: selectedColorId.value,
    leafColor: selectedLeafColorId.value,
    fveLeafDesign: selectedFveLeafDesign.value,
    customFveLeafImage: customFveLeafImage.value,
    connectivity: selectedConnectivity.value,
    battery: selectedBattery.value,
    evChargerCount: evChargerCount.value,
    bikeChargerRequested: bikeChargerRequested.value,
    windTurbines: selectedWindTurbines.value,
    turbineSize: selectedTurbineSize.value,
    turbineMount: selectedTurbineMount.value,
    treeDesign: selectedTreeDesign.value,
}));

const sectionPreviews = computed<SectionPreview[]>(() => {
    return [
        ...selectedProduct.value.steps.map((step) =>
            getPreviewForSection(step.id),
        ),
        getPreviewForSection(FALLBACK_SECTION_ID),
    ];
});

const visibleSectionPreviews = ref<SectionPreview[]>(sectionPreviews.value);
let previewPreloadVersion = 0;

watch(
    sectionPreviews,
    async (previews) => {
        const version = ++previewPreloadVersion;

        await preloadPreviewImages(previews);

        if (version === previewPreloadVersion) {
            visibleSectionPreviews.value = previews;
        }
    },
    { immediate: true },
);

async function selectProduct(productId: string) {
    if (!Object.values(ProductId).includes(productId as ProductIdType)) {
        return;
    }

    if (selectedProductId.value === productId) {
        return;
    }

    selectedProductId.value = productId as ProductIdType;
    clearForcedFocus();
    sectionElements.clear();
    currentSectionId.value = getFirstSectionId();

    resetConfiguration();

    // wait for re-render and reset scroll
    await nextTick();
    resetConfiguratorScroll();
    currentSectionId.value = getFirstSectionId();
    updateActiveSection();
}

function getFirstSectionId() {
    return selectedProduct.value.steps[0]?.id ?? FALLBACK_SECTION_ID;
}

function getPreviewForSection(sectionId: string): SectionPreview {
    return {
        id: sectionId,
        ...getConfiguratorPreview(
            selectedProductId.value,
            sectionId,
            previewSelection.value,
        ),
    };
}

async function preloadPreviewImages(previews: SectionPreview[]) {
    if (typeof Image === 'undefined') {
        return;
    }

    const sources = [
        ...new Set(previews.flatMap((preview) => getPreviewSources(preview))),
    ];

    await Promise.all(sources.map(loadImage));
}

function getPreviewSources(preview: SectionPreview) {
    return preview.type === 'layers'
        ? preview.layers.map((layer) => layer.src)
        : preview.items.map((item) => item.src);
}

function loadImage(src: string) {
    return new Promise<void>((resolve) => {
        const image = new Image();

        image.onload = () => resolve();
        image.onerror = () => resolve();
        image.src = src;
    });
}

function resetConfiguratorScroll() {
    if (configuratorPanel.value) {
        configuratorPanel.value.scrollTop = 0;
    }

    if (!window.matchMedia('(min-width: 768px)').matches) {
        window.scrollTo({ top: 0 });
    }
}

function clearForcedFocus() {
    isForcedFocus = false;
}

function setSectionRef(
    sectionId: string,
    el: Element | ComponentPublicInstance | null,
) {
    if (el instanceof HTMLElement) {
        sectionElements.set(sectionId, el);

        return;
    }

    sectionElements.delete(sectionId);
}

function resetConfiguration() {
    selectedColorId.value = 'white';
    selectedLeafColorId.value = 'green';
    selectedFveLeafDesign.value = 'spring';
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
    if (isForcedFocus) {
        return;
    }

    const panel = configuratorPanel.value;

    const usePanelTrigger =
        !!panel && window.matchMedia('(min-width: 768px)').matches;
    const triggerY = usePanelTrigger
        ? panel.getBoundingClientRect().top +
          panel.getBoundingClientRect().height * 0.5
        : window.innerHeight * 0.65;

    let activeSectionId = getFirstSectionId();

    selectedProduct.value.steps.forEach((step) => {
        const el = sectionElements.get(step.id);

        if (el && isPastTrigger(el, triggerY)) {
            activeSectionId = step.id;
        }
    });

    const fallbackEl = sectionElements.get(FALLBACK_SECTION_ID);

    if (fallbackEl && isPastTrigger(fallbackEl, triggerY)) {
        activeSectionId = FALLBACK_SECTION_ID;
    }

    currentSectionId.value = activeSectionId;
}

function isPastTrigger(el: HTMLElement, triggerY: number) {
    const rect = el.getBoundingClientRect();

    return rect.top + rect.height / 2 <= triggerY;
}

function handleScrollActiveSection() {
    if (isForcedFocus) {
        clearForcedFocus();
    }

    updateActiveSection();
}

function forceActiveSection(stepId: string) {
    if (!selectedProduct.value.steps.some((step) => step.id === stepId)) {
        return;
    }

    if (currentSectionId.value !== stepId) {
        currentSectionId.value = stepId;

        clearForcedFocus();
        isForcedFocus = true;
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
