<template>
    <div>
        <!-- Section heading – larger visual break than regular steps -->
        <h2 class="text-base font-semibold tracking-tight text-black dark:text-white mb-1">
            {{ $t('configurator.financing.title') }}
        </h2>
        <p class="text-xs text-black/40 dark:text-white/30 mb-5 leading-relaxed">
            {{ $t('configurator.financing.subtitle') }}
        </p>

        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-3">
            {{ $t('configurator.financing.grant_program') }}
        </p>

        <div class="flex flex-col gap-1">
            <button
                v-for="option in grants"
                :key="option.id"
                @click="$emit('update:modelValue', option.id)"
                class="w-full py-3 px-3 rounded text-left transition-opacity duration-200 opacity-100"
            >
                <div class="flex items-center justify-between mb-0.5">
                    <div class="flex items-center gap-2.5">
                        <!-- Radio indicator -->
                        <span
                            class="w-3.5 h-3.5 rounded-full border-2 shrink-0 transition-colors duration-200 flex items-center justify-center"
                            :class="modelValue === option.id
                                ? 'border-black dark:border-white bg-black dark:bg-white'
                                : 'border-black/30 dark:border-white/30'"
                        >
                            <span
                                v-if="modelValue === option.id"
                                class="w-1.5 h-1.5 rounded-full bg-white dark:bg-black"
                            />
                        </span>
                        <span class="text-sm font-medium text-black dark:text-white">
                            {{ option.labelKey ? $t(option.labelKey, option.label) : option.label }}
                        </span>
                    </div>
                    <span
                        v-if="option.percentage !== null"
                        class="text-xs px-2 py-0.5 rounded-full bg-black/5 dark:bg-white/10 text-t-blue dark:text-t-blue border border-t-blue font-medium"
                    >
                        {{ $t('configurator.financing.up_to') }} {{ option.percentage }}&thinsp;%
                    </span>
                </div>
                <div class="pl-6">
                    <p
                        v-if="option.eligibilityKey || option.eligibility"
                        class="text-xs text-black/55 dark:text-white/40"
                    >
                        {{ option.eligibilityKey ? $t(option.eligibilityKey, option.eligibility) : option.eligibility }}
                    </p>
                    <p
                        v-if="option.descriptionKey || option.description"
                        class="text-xs text-black/35 dark:text-white/25 leading-relaxed mt-0.5"
                    >
                        {{ option.descriptionKey ? $t(option.descriptionKey, option.description) : option.description }}
                    </p>
                </div>
            </button>
        </div>

        <!-- CZ-only notice -->
        <div class="mt-4 flex items-start gap-2 rounded-lg bg-black/4 dark:bg-white/5 px-3 py-2.5">
            <span class="text-black/35 dark:text-white/25 text-xs mt-px shrink-0 select-none">ℹ</span>
            <p class="text-xs text-black/50 dark:text-white/35 leading-relaxed">
                {{ $t('configurator.financing.cz_notice') }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string;
}>();

defineEmits<{
    'update:modelValue': [value: string];
}>();

import { GRANTS } from '@/types/grants';

const grants = GRANTS;
</script>
