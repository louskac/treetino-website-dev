<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-4">
            {{ formatStep(stepNumber) }} — Premium Connectivity
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
                        :class="modelValue === option.id ? 'text-black dark:text-white font-medium' : 'text-black dark:text-white/40'"
                    >
                        <CheckCircle v-if="modelValue === option.id" />
                        {{ modelValue === option.id ? 'Přidáno' : 'Přidat' }}
                    </span>
                </div>
                <p
                    v-if="option.roi"
                    class="text-xs w-18 px-2 py-0.5 rounded-full bg-black/8 dark:bg-white/10 text-t-blue border border-t-blue dark:text-white font-medium"
                >+{{ option.roi }} % ROI</p>
                <p class="text-xs text-black/60 dark:text-white/40 leading-relaxed">{{ option.description }}</p>
                <p v-if="option.price" class="text-xs text-black/40 dark:text-white/40 mt-1">{{ option.price }}</p>
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
        id: 'none',
        label: 'Bez předplatného',
        price: 'Zdarma',
        roi: null,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
    },
    {
        id: 'premium',
        label: 'Premium Connectivity',
        price: 'Měsíční předplatné',
        roi: 18,
        description: '1 měsíc zdarma, poté dle obchodních podmínek automatické strhávání po předání stavby',
    },
];
</script>
