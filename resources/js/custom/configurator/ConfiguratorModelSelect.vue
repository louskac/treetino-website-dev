<template>
    <div class="flex flex-wrap items-center gap-y-1">
        <template v-for="(product, i) in products" :key="product.id">
            <button
                @click="$emit('update:modelValue', product.id)"
                class="py-0.5 text-xs tracking-widest uppercase transition-colors duration-200"
                :class="
                    modelValue === product.id
                        ? 'font-bold text-black dark:text-white'
                        : 'text-black/55 hover:text-black/65 dark:text-white/35 dark:hover:text-white/65'
                "
            >
                {{ $t(product.labelKey, product.label) }}
            </button>
            <span
                v-if="i < products.length - 1"
                class="mx-2.5 text-xs text-black/20 select-none dark:text-white/20"
                >|</span
            >
        </template>
    </div>
</template>

<script setup lang="ts">
import type { Product } from '@/types/products';

defineProps<{
    modelValue: string;
    products: Product[];
}>();

defineEmits<{
    'update:modelValue': [value: string];
}>();
</script>
