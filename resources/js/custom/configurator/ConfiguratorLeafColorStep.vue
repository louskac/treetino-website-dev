<template>
    <ConfiguratorColorPicker :step-label="`${formatStep(stepNumber)} — ${$t('configurator.steps.leaf_color')}`" :colors="colors" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import { useStepFormatter } from '@/composables/useStepFormatter';
import ConfiguratorColorPicker, { type ColorOption } from './ConfiguratorColorPicker.vue';

defineProps<{ modelValue: string, stepNumber: number }>();
defineEmits<{ 'update:modelValue': [value: string] }>();

const { formatStep } = useStepFormatter();

const colors: ColorOption[] = [
    { id: 'green',  label: 'Zelená',    labelKey: 'configurator.color.green',        hex: '#4A7C3F', price: null,            isCustom: false },
    { id: 'orange', label: 'Oranžová',  labelKey: 'configurator.color.orange',       hex: '#C1541A', price: '+1 900 Kč',    isCustom: false },
    { id: 'grey',   label: 'Šedá',      labelKey: 'configurator.color.grey',         hex: '#8A8A8A', price: '+1 900 Kč',    isCustom: false },
    { id: 'custom', label: 'Na míru',   labelKey: 'configurator.color.custom_short', hex: null,      price: 'Individuální', priceKey: 'configurator.price.individual', isCustom: true  },
];
</script>
