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
import ConfiguratorColorPicker, { type ColorOption } from './ConfiguratorColorPicker.vue';
import { useStepFormatter } from '@/composables/useStepFormatter';
const { formatStep } = useStepFormatter();

defineProps<{ modelValue: string, stepNumber: number, customHex?: string }>();
defineEmits<{ 'update:modelValue': [value: string], 'update:customHex': [value: string] }>();

const colors: ColorOption[] = [
    { id: 'white',  label: 'Bílá',           labelKey: 'configurator.color.white',       hex: '#F0F0F0', price: null,           isCustom: false },
    { id: 'silver', label: 'Stříbrná',       labelKey: 'configurator.color.silver',      hex: '#A8A9AD', price: '+2 900 Kč',    isCustom: false },
    { id: 'brown',  label: 'Hnědá',          labelKey: 'configurator.color.brown',       hex: '#7B4B2A', price: '+3 900 Kč',    isCustom: false },
    { id: 'green',  label: 'Lesní zelená',   labelKey: 'configurator.color.green',       hex: '#3A5F3A', price: '+4 500 Kč',    isCustom: false },
    { id: 'custom', label: 'Barva na míru',  labelKey: 'configurator.color.custom',      hex: null,      price: 'Individuální', priceKey: 'configurator.price.individual', isCustom: true  },
];
</script>
