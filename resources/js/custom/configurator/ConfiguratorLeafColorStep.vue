<template>
    <ConfiguratorColorPicker step-label="02 — Barva listů" :colors="colors" :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" />
</template>

<script setup lang="ts">
import ConfiguratorColorPicker, { type ColorOption } from './ConfiguratorColorPicker.vue';

defineProps<{ modelValue: string }>();
defineEmits<{ 'update:modelValue': [value: string] }>();

const colors: ColorOption[] = [
    { id: 'green',  label: 'Zelená',    hex: '#4A7C3F', price: null,            isCustom: false },
    { id: 'orange', label: 'Oranžová',  hex: '#C1541A', price: '+1 900 Kč',    isCustom: false },
    { id: 'golden', label: 'Zlatá',     hex: '#C8A100', price: '+1 900 Kč',    isCustom: false },
    { id: 'custom', label: 'Na míru',   hex: null,      price: 'Individuální', isCustom: true  },
];
</script>
