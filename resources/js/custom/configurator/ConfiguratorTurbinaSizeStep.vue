<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} —
            {{ $t('configurator.steps.turbine_size') }}
        </p>
        <div class="flex flex-col gap-2">
            <button
                v-for="option in options"
                :key="option.id"
                type="button"
                @click="$emit('update:modelValue', option.id)"
                class="relative w-full rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer"
                :class="
                    modelValue === option.id
                        ? 'border-black/30 bg-stone-50/90 shadow-xs dark:border-white/30 dark:bg-zinc-900/80'
                        : 'border-black/10 bg-transparent opacity-75 hover:border-black/20 hover:opacity-100 dark:border-white/10 dark:hover:border-white/20'
                "
            >
                <div class="mb-1 flex items-center justify-between">
                    <div class="flex items-baseline gap-2">
                        <span
                            class="text-sm font-semibold text-black dark:text-white"
                        >
                            {{ $t(option.labelKey, option.label) }}
                        </span>
                        <span
                            v-if="option.priceKey"
                            class="text-xs font-semibold text-t-blue dark:text-blue-400"
                        >
                            {{ $t(option.priceKey, option.price) }}
                        </span>
                    </div>
                    <div class="flex items-center gap-2">
                        <span
                            class="text-xs font-medium text-black/60 dark:text-white/50"
                        >
                            {{
                                option.powerKey
                                    ? $t(option.powerKey, option.power)
                                    : option.power
                            }}
                        </span>
                        <span
                            class="flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs transition-colors duration-200"
                            :class="
                                modelValue === option.id
                                    ? 'bg-t-blue text-white font-medium shadow-2xs'
                                    : 'bg-black/5 text-black/60 dark:bg-white/10 dark:text-white/60'
                            "
                        >
                            <CheckCircle
                                v-if="modelValue === option.id"
                                class="h-3.5 w-3.5"
                            />
                            {{
                                modelValue === option.id
                                    ? $t('configurator.selected', 'Vybráno')
                                    : $t('configurator.select', 'Vybrat')
                            }}
                        </span>
                    </div>
                </div>
                <p
                    class="text-xs leading-relaxed text-black/60 dark:text-white/45"
                >
                    {{ $t(option.descKey, option.description) }}
                </p>
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
        labelKey: 'configurator.turbine_size.large.label',
        price: '150 000 Kč',
        priceKey: 'configurator.price.150k',
        power: '3 kW (2,8 m)',
        powerKey: 'configurator.turbine_size.large.power',
        description:
            'Maximální výkon pro průmyslové a firemní instalace s vysokou spotřebou.',
        descKey: 'configurator.turbine_size.large.desc',
    },
    {
        id: 'medium',
        label: 'Střední',
        labelKey: 'configurator.turbine_size.medium.label',
        price: '110 000 Kč',
        priceKey: 'configurator.price.110k',
        power: '2 kW (1,8 m)',
        powerKey: 'configurator.turbine_size.medium.power',
        description:
            'Vyvážený poměr výkonu a rozměrů, vhodný pro obce a větší budovy.',
        descKey: 'configurator.turbine_size.medium.desc',
    },
    {
        id: 'small',
        label: 'Menší',
        labelKey: 'configurator.turbine_size.small.label',
        price: '80 000 Kč',
        priceKey: 'configurator.price.80k',
        power: '1 kW (1,2 m)',
        powerKey: 'configurator.turbine_size.small.power',
        description:
            'Kompaktní turbína pro menší instalace a lokality s omezeným prostorem.',
        descKey: 'configurator.turbine_size.small.desc',
    },
];
</script>
