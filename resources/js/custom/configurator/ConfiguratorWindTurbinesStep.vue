<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} —
            {{ $t('configurator.steps.wind_turbines') }}
        </p>
        <div class="flex flex-col gap-2">
            <button
                v-for="option in options"
                :key="option.id"
                @click="
                    !option.comingSoon && $emit('update:modelValue', option.id)
                "
                class="w-full rounded-lg border-2 px-4 py-3.5 text-left transition-all duration-200"
                :class="
                    option.comingSoon
                        ? 'cursor-not-allowed border-black/8 opacity-50 dark:border-white/8'
                        : modelValue === option.id
                          ? 'border-black bg-black/4 dark:border-white dark:bg-white/6'
                          : 'border-black/15 hover:border-black/35 dark:border-white/15 dark:hover:border-white/35'
                "
            >
                <div class="mb-1 flex items-center justify-between">
                    <span
                        class="text-sm font-medium text-black dark:text-white"
                        >{{ $t(option.labelKey, option.label) }}</span
                    >
                    <span
                        v-if="option.comingSoon"
                        class="rounded-full bg-black/8 px-2 py-0.5 text-xs font-medium text-black/40 dark:bg-white/10 dark:text-white/40"
                    >
                        {{ $t('configurator.coming_soon') }}
                    </span>
                    <span
                        v-else
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
        id: 'with-turbines',
        label: 'S větrnými turbínami',
        labelKey: 'configurator.wind_turbines.with.label',
        description:
            'Kombinace solárních listů a větrných turbín pro maximální výrobu energie za každého počasí.',
        descKey: 'configurator.wind_turbines.with.desc',
        comingSoon: true,
    },
    {
        id: 'without-turbines',
        label: 'Bez větrných turbín',
        labelKey: 'configurator.wind_turbines.without.label',
        description:
            'Pouze solární listy. Ideální pro lokality s vysokým slunečním svitem.',
        descKey: 'configurator.wind_turbines.without.desc',
        comingSoon: false,
    },
];
</script>
