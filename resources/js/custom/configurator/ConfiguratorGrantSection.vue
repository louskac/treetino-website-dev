<template>
    <div>
        <!-- Section heading – larger visual break than regular steps -->
        <h2
            class="mb-1 text-base font-semibold tracking-tight text-black dark:text-white"
        >
            {{ $t('configurator.financing.title') }}
        </h2>
        <p
            class="mb-5 text-xs leading-relaxed text-black/40 dark:text-white/30"
        >
            {{ $t('configurator.financing.subtitle') }}
        </p>

        <p
            class="mb-3 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ $t('configurator.financing.grant_program') }}
        </p>

        <div class="flex flex-col gap-1">
            <button
                v-for="option in grants"
                :key="option.id"
                @click="$emit('update:modelValue', option.id)"
                class="w-full rounded px-3 py-3 text-left opacity-100 transition-opacity duration-200"
            >
                <div class="mb-0.5 flex items-center justify-between">
                    <div class="flex items-center gap-2.5">
                        <!-- Radio indicator -->
                        <span
                            class="flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border-2 transition-colors duration-200"
                            :class="
                                modelValue === option.id
                                    ? 'border-black bg-black dark:border-white dark:bg-white'
                                    : 'border-black/30 dark:border-white/30'
                            "
                        >
                            <span
                                v-if="modelValue === option.id"
                                class="h-1.5 w-1.5 rounded-full bg-white dark:bg-black"
                            />
                        </span>
                        <span
                            class="text-sm font-medium text-black dark:text-white"
                        >
                            {{
                                option.labelKey
                                    ? $t(option.labelKey, option.label)
                                    : option.label
                            }}
                        </span>
                    </div>
                    <span
                        v-if="option.percentage !== null"
                        class="rounded-full border border-t-blue bg-black/5 px-2 py-0.5 text-xs font-medium text-t-blue dark:bg-white/10 dark:text-t-blue"
                    >
                        {{ $t('configurator.financing.up_to') }}
                        {{ option.percentage }}&thinsp;%
                    </span>
                </div>
                <div class="pl-6">
                    <p
                        v-if="option.eligibilityKey || option.eligibility"
                        class="text-xs text-black/55 dark:text-white/40"
                    >
                        {{
                            option.eligibilityKey
                                ? $t(option.eligibilityKey, option.eligibility)
                                : option.eligibility
                        }}
                    </p>
                    <p
                        v-if="option.descriptionKey || option.description"
                        class="mt-0.5 text-xs leading-relaxed text-black/35 dark:text-white/25"
                    >
                        {{
                            option.descriptionKey
                                ? $t(option.descriptionKey, option.description)
                                : option.description
                        }}
                    </p>
                </div>
            </button>
        </div>

        <!-- CZ-only notice -->
        <div
            class="mt-4 flex items-start gap-2 rounded-lg bg-black/4 px-3 py-2.5 dark:bg-white/5"
        >
            <span
                class="mt-px shrink-0 text-xs text-black/35 select-none dark:text-white/25"
                >ℹ</span
            >
            <p class="text-xs leading-relaxed text-black/50 dark:text-white/35">
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
