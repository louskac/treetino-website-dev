<template>
    <ConfiguratorColorPicker
        :step-label="`${formatStep(stepNumber)} — ${$t('configurator.steps.color')}`"
        :colors="colors"
        :model-value="modelValue"
        @update:model-value="$emit('update:modelValue', $event)"
    />
</template>

<script setup lang="ts">
import { useStepFormatter } from '@/composables/useStepFormatter';
import ConfiguratorColorPicker from './ConfiguratorColorPicker.vue';
import type { ColorOption } from './ConfiguratorColorPicker.vue';
const { formatStep } = useStepFormatter();

defineProps<{ modelValue: string; stepNumber: number }>();
defineEmits<{ 'update:modelValue': [value: string] }>();

const colors: ColorOption[] = [
    {
        id: 'white',
        label: 'Bílá',
        labelKey: 'configurator.color.white',
        hex: '#F0F0F0',
        price: null,
        isCustom: false,
    },
    {
        id: 'transparent',
        label: 'Průhledná',
        labelKey: 'configurator.color.transparent',
        hex: null,
        price: '+15 000 Kč',
        priceKey: 'configurator.price.plus_15k',
        isCustom: false,
        isTransparent: true,
    },
    {
        id: 'grey',
        label: 'Šedá',
        labelKey: 'configurator.color.grey',
        hex: '#8A8A8A',
        price: '+15 000 Kč',
        priceKey: 'configurator.price.plus_15k',
        isCustom: false,
    },
    {
        id: 'green',
        label: 'Tmavě zelená',
        labelKey: 'configurator.color.dark_green',
        hex: '#3A5F3A',
        price: '+15 000 Kč',
        priceKey: 'configurator.price.plus_15k',
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
</script>
