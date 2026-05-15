<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-4">
            {{ formatStep(stepNumber) }} — Velikost turbíny
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
                    <span class="text-sm font-medium text-black dark:text-white">{{ option.label }}</span>
                    <span class="flex items-center gap-2">
                        <span class="text-xs font-semibold text-black/60 dark:text-white/50">{{ option.power }}</span>
                        <span
                            class="flex items-center gap-1.5 text-xs transition-colors duration-200"
                            :class="modelValue === option.id
                                ? 'text-black dark:text-white font-semibold'
                                : 'text-black/35 dark:text-white/35'"
                        >
                            <CheckCircle v-if="modelValue === option.id" />
                            {{ modelValue === option.id ? 'Vybráno' : 'Vybrat' }}
                        </span>
                    </span>
                </div>
                <p class="text-xs text-black/55 dark:text-white/40 leading-relaxed">{{ option.description }}</p>
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
        id: 'large',
        label: 'Velká',
        power: '3 kW',
        description: 'Maximální výkon pro průmyslové a firemní instalace s vysokou spotřebou.',
    },
    {
        id: 'medium',
        label: 'Střední',
        power: '1,5 kW',
        description: 'Vyvážený poměr výkonu a rozměrů, vhodný pro obce a větší budovy.',
    },
    {
        id: 'small',
        label: 'Menší',
        power: '1 kW',
        description: 'Kompaktní turbína pro menší instalace a lokality s omezeným prostorem.',
    },
];
</script>
