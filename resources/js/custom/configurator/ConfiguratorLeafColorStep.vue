<template>
    <ConfiguratorColorPicker :step-label="`${formatStep(stepNumber)} — Barva listů`" :colors="colors" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import { useStepFormatter } from '@/composables/useStepFormatter';
import ConfiguratorColorPicker, { type ColorOption } from './ConfiguratorColorPicker.vue';

defineProps<{ modelValue: string, stepNumber: number }>();
defineEmits<{ 'update:modelValue': [value: string] }>();

const { formatStep } = useStepFormatter();

const colors: ColorOption[] = [
    { id: 'green',  label: 'Zelená',    hex: '#4A7C3F', price: null,            isCustom: false },
    { id: 'orange', label: 'Oranžová',  hex: '#C1541A', price: '+1 900 Kč',    isCustom: false },
    { id: 'golden', label: 'Zlatá',     hex: '#C8A100', price: '+1 900 Kč',    isCustom: false },
    { id: 'custom', label: 'Na míru',   hex: null,      price: 'Individuální', isCustom: true  },
];
</script>
