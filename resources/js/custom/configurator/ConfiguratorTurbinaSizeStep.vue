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
                @click="$emit('update:modelValue', option.id)"
                class="w-full rounded-lg border-2 px-4 py-3.5 text-left transition-all duration-200"
                :class="
                    modelValue === option.id
                        ? 'border-black bg-black/4 dark:border-white dark:bg-white/6'
                        : 'border-black/15 hover:border-black/35 dark:border-white/15 dark:hover:border-white/35'
                "
            >
                <div class="mb-1 flex items-center justify-between">
                    <span
                        class="text-sm font-medium text-black dark:text-white"
                        >{{ $t(option.labelKey, option.label) }}</span
                    >
                    <span class="flex items-center gap-2">
                        <span
                            class="text-xs font-semibold text-black/60 dark:text-white/50"
                            >{{
                                option.powerKey
                                    ? $t(option.powerKey, option.power)
                                    : option.power
                            }}</span
                        >
                        <span
                            class="flex items-center gap-1.5 text-xs transition-colors duration-200"
                            :class="
                                modelValue === option.id
                                    ? 'font-semibold text-black dark:text-white'
                                    : 'text-black/35 dark:text-white/35'
                            "
                        >
                            <CheckCircle v-if="modelValue === option.id" />
                            {{
                                modelValue === option.id
                                    ? $t('configurator.selected')
                                    : $t('configurator.select')
                            }}
                        </span>
                    </span>
                </div>
                <p
                    class="text-xs leading-relaxed text-black/55 dark:text-white/40"
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
        power: '1 kW (1,2 m)',
        powerKey: 'configurator.turbine_size.small.power',
        description:
            'Kompaktní turbína pro menší instalace a lokality s omezeným prostorem.',
        descKey: 'configurator.turbine_size.small.desc',
    },
];
</script>
