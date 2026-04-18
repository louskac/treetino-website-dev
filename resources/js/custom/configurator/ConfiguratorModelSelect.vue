<template>
    <div class="flex items-center flex-wrap gap-y-1">
        <template v-for="(product, i) in products" :key="product.id">
            <button
                @click="$emit('update:modelValue', product.id)"
                class="text-xs tracking-widest uppercase transition-colors duration-200 py-0.5"
                :class="modelValue === product.id
                    ? 'text-black dark:text-white font-bold'
                    : 'text-black/55 dark:text-white/35 hover:text-black/65 dark:hover:text-white/65'"
            >{{ product.label }}</button>
            <span
                v-if="i < products.length - 1"
                class="mx-2.5 text-black/20 dark:text-white/20 text-xs select-none"
            >|</span>
        </template>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string;
    products: { id: string; label: string }[];
}>();

defineEmits<{
    'update:modelValue': [value: string];
}>();
</script>
