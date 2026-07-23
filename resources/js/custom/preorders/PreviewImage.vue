<script setup lang="ts">
import { computed } from 'vue';
import { getConfiguratorPreview } from '@/custom/configurator/configuratorPreviewImages';
import type { ConfiguratorPreviewSelection } from '@/custom/configurator/configuratorPreviewImages';
import { ProductId } from '@/types/products';
import type { ProductId as ProductIdType } from '@/types/products';

const props = defineProps<{
    productType: string;
    configuration: Record<string, unknown> | null;
    alt?: string;
}>();

const defaultSelection: ConfiguratorPreviewSelection = {
    color: 'white',
    leafColor: 'green',
    fveLeafDesign: 'spring',
    connectivity: 'none',
    battery: 'none',
    evChargerCount: 0,
    bikeChargerRequested: false,
    windTurbines: 'with-turbines',
    turbineSize: 'large',
    turbineMount: 'roof',
    treeDesign: 'standard',
};

const productId = computed<ProductIdType | null>(() => {
    if (Object.values(ProductId).includes(props.productType as ProductIdType)) {
        return props.productType as ProductIdType;
    }

    return null;
});

const selection = computed<ConfiguratorPreviewSelection>(() => {
    const configuration = props.configuration ?? {};

    return {
        color: stringValue(configuration.color, defaultSelection.color),
        leafColor: stringValue(
            configuration.leafColor,
            defaultSelection.leafColor,
        ),
        fveLeafDesign: stringValue(
            configuration.fveLeafDesign,
            defaultSelection.fveLeafDesign,
        ),
        connectivity: stringValue(
            configuration.connectivity,
            defaultSelection.connectivity,
        ),
        battery: stringValue(configuration.battery, defaultSelection.battery),
        evChargerCount: numberValue(
            configuration.evChargerCount,
            defaultSelection.evChargerCount,
        ),
        bikeChargerRequested: booleanValue(
            configuration.bikeChargerRequested,
            defaultSelection.bikeChargerRequested,
        ),
        windTurbines: stringValue(
            configuration.windTurbines,
            defaultSelection.windTurbines,
        ),
        turbineSize: stringValue(
            configuration.turbineSize,
            defaultSelection.turbineSize,
        ),
        turbineMount: stringValue(
            configuration.turbineMount,
            defaultSelection.turbineMount,
        ),
        treeDesign: stringValue(
            configuration.treeDesign,
            defaultSelection.treeDesign,
        ),
    };
});

const layers = computed(() => {
    if (!productId.value) {
        return [];
    }

    const preview = getConfiguratorPreview(
        productId.value,
        '__preorder__',
        selection.value,
    );

    return preview.type === 'layers' ? preview.layers : [];
});

function stringValue(value: unknown, fallback: string): string {
    return typeof value === 'string' && value.length > 0 ? value : fallback;
}

function numberValue(value: unknown, fallback: number): number {
    return typeof value === 'number' && Number.isFinite(value)
        ? value
        : fallback;
}

function booleanValue(value: unknown, fallback: boolean): boolean {
    return typeof value === 'boolean' ? value : fallback;
}
</script>

<template>
    <div class="relative h-full w-full">
        <img
            v-for="layer in layers"
            :key="layer.src"
            :src="layer.src"
            :alt="alt ?? layer.alt"
            class="absolute inset-0 h-full w-full object-cover"
        />
    </div>
</template>
