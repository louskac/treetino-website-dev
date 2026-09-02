<template>
    <ConfiguratorColorPicker
        :step-label="`${formatStep(stepNumber)} — ${$t('configurator.steps.color')}`"
        :colors="colors"
        :model-value="modelValue"
        :custom-hex="customHex"
        default-custom-hex="#FF6B00"
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
    const priceText = isV2 ? '+25 000 Kč' : '+45 000 Kč';
    const priceKey = isV2
        ? 'configurator.price.plus_25k'
        : 'configurator.price.plus_45k';

    return [
        {
            id: 'white',
            label: 'Bílá',
            labelKey: 'configurator.color.white',
            hex: '#F0F0F0',
            price: null,
            isCustom: false,
        },
        {
            id: 'silver',
            label: 'Stříbrná',
            labelKey: 'configurator.color.silver',
            hex: '#A8A9AD',
            price: priceText,
            priceKey: priceKey,
            isCustom: false,
        },
        {
            id: 'brown',
            label: 'Hnědá',
            labelKey: 'configurator.color.brown',
            hex: '#7B4B2A',
            price: priceText,
            priceKey: priceKey,
            isCustom: false,
        },
        {
            id: 'green',
            label: 'Lesní zelená',
            labelKey: 'configurator.color.green',
            hex: '#3A5F3A',
            price: priceText,
            priceKey: priceKey,
            isCustom: false,
        },
        {
            id: 'custom',
            label: 'Barva na míru',
            labelKey: 'configurator.color.custom',
            hex: null,
            price: 'Individuální',
            priceKey: 'configurator.price.individual',
            isCustom: true,
        },
    ];
});
</script>
