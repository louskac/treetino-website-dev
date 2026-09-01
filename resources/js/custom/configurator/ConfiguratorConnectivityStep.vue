<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} —
            {{ $t('configurator.steps.connectivity') }}
        </p>
        <div class="flex flex-col gap-2">
            <button
                v-for="option in options"
                :key="option.id"
                type="button"
                @click="$emit('update:modelValue', option.id)"
                class="group relative flex w-full flex-col gap-1.5 rounded-xl border p-3.5 text-left transition-all duration-200"
                :class="
                    modelValue === option.id
                        ? 'border-black/30 bg-stone-50/90 shadow-xs dark:border-white/30 dark:bg-zinc-900/80'
                        : 'border-black/10 bg-transparent opacity-70 hover:border-black/20 hover:opacity-100 dark:border-white/10 dark:hover:border-white/20'
                "
            >
                <div class="flex items-center justify-between">
                    <span class="text-sm font-semibold text-black dark:text-white">
                        {{ $t(option.labelKey, option.label) }}
                    </span>
                    <span
                        class="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs transition-colors duration-200"
                        :class="
                            modelValue === option.id
                                ? 'bg-t-blue text-white font-medium shadow-2xs'
                                : 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60'
                        "
                    >
                        <CheckCircle v-if="modelValue === option.id" class="h-3.5 w-3.5" />
                        {{
                            modelValue === option.id
                                ? $t('configurator.selected', 'Vybráno')
                                : $t('configurator.select', 'Vybrat')
                        }}
                    </span>
                </div>

                <div
                    v-if="option.tag"
                    class="inline-flex self-start rounded-md border border-t-blue/30 bg-t-blue/10 px-2 py-0.5 text-[11px] font-semibold text-t-blue dark:bg-blue-400/15 dark:text-blue-300"
                >
                    {{ option.tag }}
                </div>

                <p class="text-xs leading-relaxed text-black/65 dark:text-white/55">
                    {{ option.description }}
                </p>

                <p
                    v-if="option.priceKey || option.price"
                    class="mt-1 text-xs font-semibold text-black/80 dark:text-white/80"
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
        tag: null,
        description: t('configurator.preview.connectivity.premium.none'),
    },
    {
        id: 'premium',
        label: 'Premium Connectivity (Treetino App)',
        labelKey: 'configurator.connectivity.premium.label',
        price: '3 měsíce zdarma, poté 7 990 Kč / měs.',
        priceKey: 'configurator.price.connectivity_monthly',
        tag: 'AI Optimalizace & Vyšší výnosy',
        description: t('configurator.preview.connectivity.premium.text'),
    },
]);
</script>
