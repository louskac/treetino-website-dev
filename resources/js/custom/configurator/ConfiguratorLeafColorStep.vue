<template>
    <ConfiguratorColorPicker
        :step-label="`${formatStep(stepNumber)} — ${$t('configurator.steps.leaf_color')}`"
        :colors="colors"
        :model-value="modelValue"
        :custom-hex="customHex"
        default-custom-hex="#00D2FF"
        @update:model-value="$emit('update:modelValue', $event)"
        @update:custom-hex="$emit('update:customHex', $event)"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useStepFormatter } from '@/composables/useStepFormatter';
import { ProductId } from '@/types/products';
import ConfiguratorColorPicker from './ConfiguratorColorPicker.vue';
import type { ColorOption } from './ConfiguratorColorPicker.vue';

const { formatStep } = useStepFormatter();

const props = withDefaults(
    defineProps<{
        modelValue: string;
        stepNumber: number;
        customHex?: string;
        productId?: string;
    }>(),
    {
        productId: ProductId.StromV1,
    },
);

defineEmits<{
    'update:modelValue': [value: string];
    'update:customHex': [value: string];
}>();

const colors = computed<ColorOption[]>(() => {
    const isV2 = props.productId === ProductId.StromV2;
    const priceText = isV2 ? '+24 990 Kč' : '+57 990 Kč';
    const priceKey = isV2
        ? 'configurator.price.plus_25k'
        : 'configurator.price.plus_58k';

    return [
        {
            id: 'green',
            label: 'Zelená',
            labelKey: 'configurator.color.green',
            hex: '#4A7C3F',
            price: null,
            isCustom: false,
        },
        {
            id: 'orange',
            label: 'Oranžová',
            labelKey: 'configurator.color.orange',
            hex: '#C1541A',
            price: priceText,
            priceKey: priceKey,
            isCustom: false,
        },
        {
            id: 'grey',
            label: 'Šedá',
            labelKey: 'configurator.color.grey',
            hex: '#8A8A8A',
            price: priceText,
            priceKey: priceKey,
            isCustom: false,
        },
        {
            id: 'custom',
            label: 'Na míru',
            labelKey: 'configurator.color.custom_short',
            hex: null,
            price: 'Individuální',
            priceKey: 'configurator.price.individual',
            isCustom: true,
        },
    ];
});
</script>
