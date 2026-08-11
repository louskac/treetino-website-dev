<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} — {{ $t('configurator.steps.fve_leaf') }}
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
                    {{ $t(option.labelKey, option.label) }}
                </span>
                <span class="text-xs text-black dark:text-white">
                    {{ option.priceKey ? $t(option.priceKey) : (option.price ?? $t('configurator.free')) }}
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

interface FveLeafOption {
    id: string;
    label: string;
    labelKey: string;
    swatch: string;
    price: string | null;
    priceKey?: string;
    description: string;
    descKey: string;
}

const options: FveLeafOption[] = [
    {
        id: 'none',
        label: 'Bez designu',
        labelKey: 'configurator.fve_leaf.none.label',
        swatch: '#E5E7EB',
        price: null,
        description: 'FVE listy bez sezonního designu.',
        descKey: 'configurator.fve_leaf.none.desc',
    },
    {
        id: 'spring',
        label: 'Jaro',
        labelKey: 'configurator.fve_leaf.spring.label',
        swatch: 'linear-gradient(135deg, #E2F674 0%, #A3E635 50%, #4D7C0F 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro jarní variantu stromu.',
        descKey: 'configurator.fve_leaf.spring.desc',
    },
    {
        id: 'summer',
        label: 'Léto',
        labelKey: 'configurator.fve_leaf.summer.label',
        swatch: 'linear-gradient(135deg, #34D399 0%, #059669 50%, #064E3B 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro letní variantu stromu.',
        descKey: 'configurator.fve_leaf.summer.desc',
    },
    {
        id: 'autumn',
        label: 'Podzim',
        labelKey: 'configurator.fve_leaf.autumn.label',
        swatch: 'linear-gradient(135deg, #F2B84B 0%, #C85D2A 50%, #7A3B20 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro podzimní variantu stromu.',
        descKey: 'configurator.fve_leaf.autumn.desc',
    },
    {
        id: 'winter',
        label: 'Zima',
        labelKey: 'configurator.fve_leaf.winter.label',
        swatch: 'linear-gradient(135deg, #F3F7FA 0%, #B8D1E0 50%, #6E8798 100%)',
        price: null,
        description: 'Sezonní design FVE listů pro zimní variantu stromu.',
        descKey: 'configurator.fve_leaf.winter.desc',
    },
];

const visibleOptions = computed(() =>
    props.productId === ProductId.StromV1
        ? options
        : options.filter((option) => option.id !== 'none'),
);
</script>
