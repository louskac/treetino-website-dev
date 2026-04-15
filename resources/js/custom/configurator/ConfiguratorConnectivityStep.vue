<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-4">
            03 — Premium Connectivity
        </p>
        <div class="flex flex-col gap-1">
            <button
                v-for="option in options"
                :key="option.id"
                @click="$emit('update:modelValue', option.id)"
                class="w-full py-3 px-3 rounded text-left transition-opacity duration-200"
                :class="modelValue === option.id ? 'opacity-100' : 'opacity-55 hover:opacity-100'"
            >
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-black dark:text-white">{{ option.label }}</span>
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-black dark:text-white/50">{{ option.price }}</span>
                    </div>
                </div>
                <p
                    v-if="option.roi"
                    class="text-xs w-18 px-2 py-0.5 rounded-full bg-black/8 dark:bg-white/10 text-t-blue border border-t-blue dark:text-white font-medium"
                >+{{ option.roi }} % ROI</p>
                <p class="text-xs text-black/60 dark:text-white/40 leading-relaxed">{{ option.description }}</p>
            </button>
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

const options = [
    {
        id: 'none',
        label: 'Bez předplatného',
        price: 'Zdarma',
        roi: null,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing.',
    },
    {
        id: 'premium',
        label: 'Premium Connectivity',
        price: 'Měsíční předplatné',
        roi: 18,
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do.',
    },
];
</script>
