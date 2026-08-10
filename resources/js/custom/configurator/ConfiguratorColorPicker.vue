<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-4">
            {{ stepLabel }}
        </p>
        <div class="flex flex-col gap-1">
            <button
                v-for="color in colors"
                :key="color.id"
                @click="$emit('update:modelValue', color.id)"
                class="flex items-center gap-3 w-full py-2 px-1 rounded transition-opacity duration-200"
                :class="modelValue === color.id ? 'opacity-100' : 'opacity-50 hover:opacity-100'"
            >
                <div class="w-6 h-6 rounded-full shrink-0 border border-black/15 dark:border-white/15 transition-all duration-200"
                    :class="[
                        color.isCustom ? 'bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]' : '',
                        color.isTransparent ? 'bg-[repeating-conic-gradient(#ccc_0%_25%,white_0%_50%)] bg-size-[8px_8px]' : '',
                        modelValue === color.id ? 'ring-2 ring-black dark:ring-white ring-offset-1 ring-offset-white dark:ring-offset-black' : '',
                    ]"
                    :style="color.hex ? { background: color.hex } : {}"
                />
                <span class="flex-1 text-sm text-left text-black dark:text-white">{{ color.labelKey ? $t(color.labelKey) : color.label }}</span>
                <span class="text-xs text-black dark:text-white">{{ color.priceKey ? $t(color.priceKey) : (color.price ?? $t('configurator.free')) }}</span>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
export type ColorOption = {
    id: string;
    label: string;
    labelKey?: string;
    hex: string | null;
    price: string | null;
    priceKey?: string;
    isCustom: boolean;
    isTransparent?: boolean;
};

defineProps<{
    modelValue: string;
    stepLabel: string;
    colors: ColorOption[];
}>();

defineEmits<{
    'update:modelValue': [value: string];
}>();
</script>
