<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-4">
            {{ formatStep(stepNumber) }} — {{ $t('configurator.steps.tree_design') }}
        </p>
        <div class="flex flex-col gap-2">
            <button
                v-for="option in options"
                :key="option.id"
                @click="$emit('update:modelValue', option.id)"
                class="w-full py-3.5 px-4 rounded-lg text-left border-2 transition-all duration-200"
                :class="modelValue === option.id
                    ? 'border-black dark:border-white bg-black/4 dark:bg-white/6'
                    : 'border-black/15 dark:border-white/15 hover:border-black/35 dark:hover:border-white/35'"
            >
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm font-medium text-black dark:text-white">{{ $t(option.labelKey, option.label) }}</span>
                    <span
                        class="flex items-center gap-1.5 text-xs transition-colors duration-200"
                        :class="modelValue === option.id
                            ? 'text-black dark:text-white font-semibold'
                            : 'text-black/35 dark:text-white/35'"
                    >
                        <CheckCircle v-if="modelValue === option.id" />
                        {{ modelValue === option.id ? $t('configurator.selected') : $t('configurator.select') }}
                    </span>
                </div>
                <p class="text-xs text-black/55 dark:text-white/40 leading-relaxed">{{ $t(option.descKey, option.description) }}</p>
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
        id: 'standard',
        label: 'Standardní',
        labelKey: 'configurator.tree_design.standard.label',
        description: 'Klasický design s organickými tvary inspirovanými přírodou. Přirozeně zapadne do každého prostředí.',
        descKey: 'configurator.tree_design.standard.desc',
    },
    {
        id: 'cyber',
        label: 'Cyber',
        labelKey: 'configurator.tree_design.cyber.label',
        description: 'Futuristický geometrický design s ostrými hranami a moderním industriálním výrazem.',
        descKey: 'configurator.tree_design.cyber.desc',
    },
];
</script>
