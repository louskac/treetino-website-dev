<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} — Design FVE listů
        </p>
        <div class="flex flex-col gap-1">
            <button
                v-for="option in visibleOptions"
                :key="option.id"
                @click="$emit('update:modelValue', option.id)"
                class="flex w-full items-center gap-3 rounded px-1 py-2 transition-opacity duration-200"
                :class="
                    modelValue === option.id
                        ? 'opacity-100'
                        : 'opacity-50 hover:opacity-100'
                "
            >
                <!-- Design swatch -->
                <div
                    class="h-6 w-6 shrink-0 rounded-full border border-black/15 transition-all duration-200 dark:border-white/15"
                    :class="[
                        modelValue === option.id
                            ? 'ring-2 ring-black ring-offset-1 ring-offset-white dark:ring-white dark:ring-offset-black'
                            : '',
                    ]"
                    :style="{ background: option.swatch }"
                />
                <span
                    class="flex-1 text-left text-sm text-black dark:text-white"
                >
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
import { computed } from 'vue';
import { useStepFormatter } from '@/composables/useStepFormatter';
import { ProductId } from '@/types/products';

const props = defineProps<{
    modelValue: string;
    stepNumber: number;
    productId: string;
}>();
defineEmits<{ 'update:modelValue': [value: string] }>();

const { formatStep } = useStepFormatter();

const options = [
    {
        id: 'none',
        label: 'Bez designu',
        swatch: '#E5E7EB',
        price: null,
        description: 'FVE listy bez sezonního designu.',
    },
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

const visibleOptions = computed(() =>
    props.productId === ProductId.StromV1
        ? options
        : options.filter((option) => option.id !== 'none'),
);
</script>
