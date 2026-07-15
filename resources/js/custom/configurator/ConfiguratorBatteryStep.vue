<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} — Fyzická baterie
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
                        : 'opacity-50 hover:opacity-100'
                "
            >
                <div class="mb-1 flex items-center justify-between">
                    <span class="text-sm text-black dark:text-white">{{
                        option.label
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
                        {{ modelValue === option.id ? 'Přidáno' : 'Přidat' }}
                    </span>
                </div>
                <p
                    v-if="option.roi"
                    class="w-18 rounded-full border border-t-blue bg-black/8 px-2 py-0.5 text-xs font-medium text-t-blue dark:bg-white/10 dark:text-t-blue"
                >
                    +{{ option.roi }} % ROI
                </p>
                <p
                    class="text-xs leading-relaxed text-black dark:text-white/40"
                >
                    {{ option.description }}
                </p>
                <p
                    v-if="option.price"
                    class="mt-1 text-xs text-black/40 dark:text-white/40"
                >
                    {{ option.price }}
                </p>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStepFormatter } from '@/composables/useStepFormatter';
import { ProductId } from '@/types/products';
import CheckCircle from '../icons/CheckCircle.vue';

const { t } = useI18n();
const { formatStep } = useStepFormatter();

const props = defineProps<{
    modelValue: string;
    stepNumber: number;
    productId: string;
}>();

defineEmits<{
    'update:modelValue': [value: string];
}>();

const BATTERY_CAPACITY: Partial<Record<string, string>> = {
    [ProductId.StromV1]: '100 kWh',
    [ProductId.StromV2]: '50 kWh',
};

const options = computed(() => {
    const capacity = BATTERY_CAPACITY[props.productId];

    return [
        {
            id: 'none',
            label: 'Bez baterie',
            price: 'Zdarma',
            roi: null,
            description: t("configurator.preview.addons.battery.none"),
        },
        {
            id: 'battery',
            label: `Baterie${capacity ? ' ' + capacity : ''}`,
            roi: 14,
            price: null,
            description: t("configurator.preview.addons.battery.text"),
        },
    ];
});
</script>
