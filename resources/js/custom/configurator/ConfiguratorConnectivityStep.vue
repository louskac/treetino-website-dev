<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} — {{ $t('configurator.steps.connectivity') }}
        </p>
        <div class="flex flex-col gap-1">
            <button
                v-for="option in options"
                :key="option.id"
                @click="$emit('update:modelValue', option.id)"
                class="w-full rounded px-3 py-3 text-left transition-opacity duration-200"
                :class="
                    modelValue === option.id
                        ? 'opacity-100'
                        : 'opacity-55 hover:opacity-100'
                "
            >
                <div class="mb-1 flex items-center justify-between">
                    <span class="text-sm text-black dark:text-white">{{
                        $t(option.labelKey, option.label)
                    }}</span>
                    <span
                        class="flex items-center gap-1.5 text-xs transition-colors duration-200"
                        :class="
                            modelValue === option.id
                                ? 'font-medium text-black dark:text-white'
                                : 'text-black dark:text-white/40'
                        "
                    >
                        <CheckCircle v-if="modelValue === option.id" />
                        {{ modelValue === option.id ? $t('configurator.added') : $t('configurator.add') }}
                    </span>
                </div>
                <p
                    v-if="option.roi"
                    class="w-18 rounded-full border border-t-blue bg-black/8 px-2 py-0.5 text-xs font-medium text-t-blue dark:bg-white/10 dark:text-white"
                >
                    +{{ option.roi }} % ROI
                </p>
                <p
                    class="text-xs leading-relaxed text-black/60 dark:text-white/40"
                >
                    {{ option.description }}
                </p>
                <p
                    v-if="option.priceKey || option.price"
                    class="mt-1 text-xs text-black/40 dark:text-white/40"
                >
                    {{ option.priceKey ? $t(option.priceKey) : option.price }}
                </p>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStepFormatter } from '@/composables/useStepFormatter';
import CheckCircle from '../icons/CheckCircle.vue';

const { t } = useI18n();
const { formatStep } = useStepFormatter();

defineProps<{
    modelValue: string;
    stepNumber: number;
}>();

defineEmits<{
    'update:modelValue': [value: string];
}>();

const options = computed(() => [
    {
        id: 'none',
        label: 'Bez předplatného',
        labelKey: 'configurator.connectivity.none.label',
        price: 'Zdarma',
        priceKey: 'configurator.free',
        roi: null,
        description: t('configurator.preview.connectivity.premium.none'),
    },
    {
        id: 'premium',
        label: 'Premium Connectivity',
        labelKey: 'configurator.connectivity.premium.label',
        price: 'Měsíční předplatné',
        priceKey: 'configurator.connectivity.monthly_sub',
        roi: 18,
        description: t('configurator.preview.connectivity.premium.text'),
    },
]);
</script>
