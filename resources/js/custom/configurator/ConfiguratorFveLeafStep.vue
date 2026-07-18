<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-4">
            {{ formatStep(stepNumber) }} — Design FVE listů
        </p>
        <div class="flex flex-col gap-1">
            <button
                v-for="option in options"
                :key="option.id"
                @click="$emit('update:modelValue', option.id)"
                class="flex items-center gap-3 w-full py-2 px-1 rounded transition-opacity duration-200"
                :class="modelValue === option.id ? 'opacity-100' : 'opacity-50 hover:opacity-100'"
            >
                <!-- Design swatch -->
                <div
                    class="w-6 h-6 rounded-full shrink-0 border border-black/15 dark:border-white/15 transition-all duration-200"
                    :class="[
                        modelValue === option.id
                            ? 'ring-2 ring-black dark:ring-white ring-offset-1 ring-offset-white dark:ring-offset-black'
                            : '',
                    ]"
                    :style="{ background: option.swatch }"
                />
                <span class="flex-1 text-sm text-left text-black dark:text-white">
                    {{ option.label }}
                </span>
                <span class="text-xs text-black dark:text-white">
                    {{ option.price ?? 'Zdarma' }}
                </span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStepFormatter } from '@/composables/useStepFormatter';

defineProps<{ modelValue: string; stepNumber: number }>();
defineEmits<{ 'update:modelValue': [value: string] }>();

const { formatStep } = useStepFormatter();

const options = [
    {
        id: 'spring',
        label: 'Jaro',
        swatch: 'linear-gradient(135deg, #CFEA7D 0%, #82B84C 50%, #3F7E3A 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro jarní variantu stromu.',
    },
    {
        id: 'summer',
        label: 'Léto',
        swatch: 'linear-gradient(135deg, #8BC34A 0%, #4C9A3D 50%, #1F6F3A 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro letní variantu stromu.',
    },
    {
        id: 'autumn',
        label: 'Podzim',
        swatch: 'linear-gradient(135deg, #F2B84B 0%, #C85D2A 50%, #7A3B20 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro podzimní variantu stromu.',
    },
    {
        id: 'winter',
        label: 'Zima',
        swatch: 'linear-gradient(135deg, #F3F7FA 0%, #B8D1E0 50%, #6E8798 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro zimní variantu stromu.',
    },
];
</script>
