<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-4">
            {{ formatStep(stepNumber) }} — Umístění turbíny
        </p>
        <div class="flex flex-col gap-1">
            <button
                v-for="option in options"
                :key="option.id"
                @click="$emit('update:modelValue', option.id)"
                class="w-full py-3 px-3 rounded text-left transition-opacity duration-200"
                :class="modelValue === option.id ? 'opacity-100' : 'opacity-55 hover:opacity-100'"
            >
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-black dark:text-white">{{ option.label }}</span>
                    <span
                        class="flex items-center gap-1.5 text-xs transition-colors duration-200"
                        :class="modelValue === option.id ? 'text-black dark:text-white font-medium' : 'text-black/40 dark:text-white/40'"
                    >
                        <CheckCircle v-if="modelValue === option.id" />
                        {{ modelValue === option.id ? 'Vybráno' : 'Vybrat' }}
                    </span>
                </div>
                <p class="text-xs text-black/60 dark:text-white/40 leading-relaxed">{{ option.description }}</p>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useStepFormatter } from '@/composables/useStepFormatter';
import CheckCircle from '../icons/CheckCircle.vue';
const { formatStep } = useStepFormatter();

defineProps<{
    modelValue: string;
    stepNumber: number;
}>();

defineEmits<{
    'update:modelValue': [value: string];
}>();

const options = [
    {
        id: 'roof',
        label: 'Na střechu',
        description: 'Montáž na střešní konstrukci. Ideální pro maximální expozici větru bez překážek.',
    },
    {
        id: 'wall',
        label: 'Na zeď',
        description: 'Nástěnná montáž na fasádu budovy. Vhodné tam, kde střecha není dostupná.',
    },
    {
        id: 'pole',
        label: 'Na sloup',
        description: 'Volně stojící sloupová montáž. Nejuniverzálnější řešení pro libovolnou lokalitu.',
    },
];
</script>
