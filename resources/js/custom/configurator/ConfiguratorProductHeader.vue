<template>
    <div>
        <h1 class="text-3xl font-bold tracking-tight text-black dark:text-white leading-none">
            {{ $t(product.labelKey, product.label) }}
        </h1>
        <div class="mt-5 border-t border-black/10 dark:border-white/10 pt-5 flex flex-col gap-3">
            <div v-for="param in paramList" :key="param.label" class="flex justify-between items-baseline">
                <span class="text-xs uppercase tracking-widest text-black/80 dark:text-white/50">{{ param.label }}</span>
                <span class="text-sm font-semibold text-black dark:text-white">{{ param.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Product, ProductParams } from '@/types';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const props = defineProps<{
    product: Product;
    params: ProductParams;
}>();

const paramList = computed(() => [
    { label: t('configurator.header.power'), value: props.params.power },
    { label: t('configurator.header.daily_prod'), value: props.params.dailyProduction },
    { label: t('configurator.header.roi'), value: props.params.roi ? (props.params.roi.startsWith('configurator.') ? t(props.params.roi) : props.params.roi) : '' },
]);
</script>
