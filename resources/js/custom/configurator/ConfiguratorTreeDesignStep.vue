<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} —
            {{ $t('configurator.steps.tree_design') }}
        </p>
        <div class="flex flex-col gap-2">
            <button
                v-for="option in options"
                :key="option.id"
                type="button"
                :disabled="option.comingSoon"
                @click="!option.comingSoon && $emit('update:modelValue', option.id)"
                class="relative w-full rounded-xl border p-4 text-left transition-all duration-200"
                :class="[
                    option.comingSoon
                        ? 'cursor-not-allowed border-black/10 bg-black/2 opacity-60 dark:border-white/10 dark:bg-white/2'
                        : modelValue === option.id
                          ? 'border-black/30 bg-stone-50/90 shadow-xs dark:border-white/30 dark:bg-zinc-900/80 cursor-pointer'
                          : 'border-black/10 bg-transparent opacity-75 hover:border-black/20 hover:opacity-100 dark:border-white/10 dark:hover:border-white/20 cursor-pointer',
                ]"
            >
                <div class="mb-1 flex items-center justify-between">
                    <span
                        class="text-sm font-semibold text-black dark:text-white"
                    >
                        {{ $t(option.labelKey, option.label) }}
                    </span>
                    <div class="flex items-center gap-1.5">
                        <span
                            v-if="option.comingSoon"
                            class="rounded-full border border-black/15 bg-black/5 px-2.5 py-0.5 text-xs font-semibold text-black/60 dark:border-white/15 dark:bg-white/10 dark:text-white/60"
                        >
                            {{ $t('configurator.coming_soon', 'Již brzy') }}
                        </span>
                        <span
                            v-else
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
        id: 'standard',
        label: 'Standardní',
        labelKey: 'configurator.tree_design.standard.label',
        description:
            'Klasický design s organickými tvary inspirovanými přírodou. Přirozeně zapadne do každého prostředí.',
        descKey: 'configurator.tree_design.standard.desc',
        comingSoon: false,
    },
    {
        id: 'cyber',
        label: 'Cyber',
        labelKey: 'configurator.tree_design.cyber.label',
        description:
            'Futuristický geometrický design s ostrými hranami a moderním industriálním výrazem.',
        descKey: 'configurator.tree_design.cyber.desc',
        comingSoon: true,
    },
];
</script>
