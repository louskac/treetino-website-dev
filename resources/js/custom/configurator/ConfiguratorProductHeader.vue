<template>
    <div>
        <h1 class="text-3xl font-bold tracking-tight text-black dark:text-white leading-none">
            {{ product.label }}
        </h1>
        <div class="mt-5 border-t border-black/10 dark:border-white/10 pt-5 flex flex-col gap-3">
            <div v-for="param in paramList" :key="param.label" class="flex justify-between items-baseline">
                <span class="text-xs uppercase tracking-widest text-black/50 dark:text-white/50">{{ param.label }}</span>
                <span class="text-sm font-semibold text-black dark:text-white">{{ param.value }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    product: {
        id: string;
        label: string;
        params: { power: string; dailyProduction: string; roi: string };
    };
}>();

const paramList = computed(() => [
    { label: 'Výkon', value: props.product.params.power },
    { label: 'Denní výroba', value: props.product.params.dailyProduction },
    { label: 'Průměrná návratnost', value: props.product.params.roi },
]);
</script>
