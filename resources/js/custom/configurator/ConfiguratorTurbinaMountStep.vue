<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-4">
            {{ formatStep(stepNumber) }} — {{ $t('configurator.steps.turbine_mount') }}
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
                    <span class="text-sm text-black dark:text-white">{{ $t(option.labelKey, option.label) }}</span>
                    <span
                        class="flex items-center gap-1.5 text-xs transition-colors duration-200"
                        :class="modelValue === option.id ? 'text-black dark:text-white font-medium' : 'text-black/40 dark:text-white/40'"
                    >
                        <CheckCircle v-if="modelValue === option.id" />
                        {{ modelValue === option.id ? $t('configurator.selected') : $t('configurator.select') }}
                    </span>
                </div>
                <p class="text-xs text-black/60 dark:text-white/40 leading-relaxed">{{ $t(option.descKey, option.description) }}</p>
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
        labelKey: 'configurator.turbine_mount.roof.label',
        description: 'Montáž na střešní konstrukci. Ideální pro maximální expozici větru bez překážek.',
        descKey: 'configurator.turbine_mount.roof.desc',
    },
    {
        id: 'wall',
        label: 'Na zeď',
        labelKey: 'configurator.turbine_mount.wall.label',
        description: 'Nástěnná montáž na fasádu budovy. Vhodné tam, kde střecha není dostupná.',
        descKey: 'configurator.turbine_mount.wall.desc',
    },
    {
        id: 'pole',
        label: 'Na sloup',
        labelKey: 'configurator.turbine_mount.pole.label',
        description: 'Volně stojící sloupová montáž. Nejuniverzálnější řešení pro libovolnou lokalitu.',
        descKey: 'configurator.turbine_mount.pole.desc',
    },
];
</script>
