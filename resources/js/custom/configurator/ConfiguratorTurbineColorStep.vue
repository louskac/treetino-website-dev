<template>
    <ConfiguratorColorPicker :step-label="`${formatStep(stepNumber)} — Barva konstrukce`" :colors="colors" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import ConfiguratorColorPicker, { type ColorOption } from './ConfiguratorColorPicker.vue';
import { useStepFormatter } from '@/composables/useStepFormatter';
const { formatStep } = useStepFormatter();

defineProps<{ modelValue: string, stepNumber: number }>();
defineEmits<{ 'update:modelValue': [value: string] }>();

const colors: ColorOption[] = [
    { id: 'transparent', label: 'Průhledná',       hex: null,      price: null,           isCustom: false, isTransparent: true },
    { id: 'white',       label: 'Bílá',            hex: '#F0F0F0', price: null,           isCustom: false },
    { id: 'black',       label: 'Černá',           hex: '#1B1B1B', price: null,           isCustom: false },
    { id: 'custom',      label: 'Barva na míru',   hex: null,      price: 'Individuální', isCustom: true  },
];
</script>
