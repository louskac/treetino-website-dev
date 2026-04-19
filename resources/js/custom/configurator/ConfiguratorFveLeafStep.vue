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
        id: 'realistic',
        label: 'Realistický design',
        swatch: 'linear-gradient(135deg, #3D6B2A 0%, #6BA84F 50%, #2E5120 100%)',
        price: null,
        description: 'Listy s přirozenou texturou a barevným přechodem imitujícím skutečné listí.',
    },
    {
        id: 'stylized',
        label: 'Stylizovaný design',
        swatch: 'linear-gradient(135deg, #1A6B5A 0%, #2DA882 50%, #0E4A3D 100%)',
        price: '+5 900 Kč',
        description: 'Moderní geometrická interpretace listů s výrazným designovým charakterem.',
    },
    {
        id: 'minimal',
        label: 'Minimalistický design',
        swatch: 'linear-gradient(135deg, #7BA05B 0%, #A8C98C 50%, #5A7A3F 100%)',
        price: '+3 900 Kč',
        description: 'Čistý, jednoduchý tvar listu bez rušivých detailů – vhodný pro moderní architekturu.',
    },
];
</script>
