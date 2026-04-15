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
    { id: 'white',  label: 'Bílá',           hex: '#F0F0F0', price: null,           isCustom: false },
    { id: 'silver', label: 'Stříbrná',       hex: '#A8A9AD', price: '+2 900 Kč',    isCustom: false },
    { id: 'black',  label: 'Černá',          hex: '#1B1B1B', price: '+3 900 Kč',    isCustom: false },
    { id: 'green',  label: 'Lesní zelená',   hex: '#3A5F3A', price: '+4 500 Kč',    isCustom: false },
    { id: 'custom', label: 'Barva na míru',  hex: null,      price: 'Individuální', isCustom: true  },
];
</script>
