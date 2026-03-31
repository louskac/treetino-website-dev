<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 mb-4">
            01 — Barva konstrukce
        </p>
        <div class="flex flex-col gap-1">
            <button
                v-for="color in colors"
                :key="color.id"
                @click="$emit('update:modelValue', color.id)"
                class="flex items-center gap-3 w-full py-2 px-1 rounded transition-opacity duration-200"
                :class="modelValue === color.id ? 'opacity-100' : 'opacity-50 hover:opacity-70'"
            >
                <div class="w-6 h-6 rounded-full shrink-0 border border-black/15 dark:border-white/15 transition-all duration-200"
                    :class="[
                        color.isCustom ? 'bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]' : '',
                        modelValue === color.id ? 'ring-2 ring-black dark:ring-white ring-offset-1 ring-offset-white dark:ring-offset-black' : '',
                    ]"
                    :style="color.hex ? { background: color.hex } : {}"
                />
                <span class="flex-1 text-sm text-left text-black dark:text-white">{{ color.label }}</span>
                <span class="text-xs text-black/50 dark:text-white/50">{{ color.price ?? 'Zdarma' }}</span>
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

const colors = [
    { id: 'white',  label: 'Bílá',          hex: '#F0F0F0', price: null,        isCustom: false },
    { id: 'silver', label: 'Stříbrná',       hex: '#A8A9AD', price: '+2 900 Kč', isCustom: false },
    { id: 'black',  label: 'Černá',          hex: '#1B1B1B', price: '+3 900 Kč', isCustom: false },
    { id: 'green',  label: 'Lesní zelená',   hex: '#3A5F3A', price: '+4 500 Kč', isCustom: false },
    { id: 'custom', label: 'Barva na míru',  hex: null,      price: 'Dle dohody', isCustom: true },
];
</script>
