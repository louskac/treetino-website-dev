<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-4">
            {{ stepLabel }}
        </p>
        <div class="flex flex-col gap-1">
            <template v-for="color in colors" :key="color.id">
                <button
                    @click="$emit('update:modelValue', color.id)"
                    class="flex items-center gap-3 w-full py-2.5 px-2 rounded-xl transition-all duration-200"
                    :class="modelValue === color.id ? 'opacity-100 bg-stone-50 dark:bg-zinc-900/60' : 'opacity-60 hover:opacity-100'"
                >
                    <div
                        class="w-6 h-6 rounded-full shrink-0 border border-black/15 dark:border-white/15 transition-all duration-200 shadow-xs"
                        :class="[
                            color.isCustom && (!customHex || modelValue !== color.id) ? 'bg-[conic-gradient(red,yellow,lime,cyan,blue,magenta,red)]' : '',
                            color.isTransparent ? 'bg-[repeating-conic-gradient(#ccc_0%_25%,white_0%_50%)] bg-size-[8px_8px]' : '',
                            modelValue === color.id ? 'ring-2 ring-black dark:ring-white ring-offset-1 ring-offset-white dark:ring-offset-black scale-105' : '',
                        ]"
                        :style="color.isCustom && customHex && modelValue === color.id ? { background: customHex } : (color.hex ? { background: color.hex } : {})"
                    />
                    <span class="flex-1 text-sm text-left font-medium text-black dark:text-white">
                        {{ color.labelKey ? $t(color.labelKey) : color.label }}
                    </span>
                    <span class="text-xs text-black/70 dark:text-white/70">
                        {{ color.priceKey ? $t(color.priceKey) : (color.price ?? $t('configurator.free')) }}
                    </span>
                </button>

                <!-- Custom Treetino App Color Picker Widget -->
                <div
                    v-if="color.isCustom && modelValue === color.id"
                    class="mt-1 mb-3 ml-2 mr-1 p-3.5 rounded-2xl bg-stone-100/90 dark:bg-zinc-900/90 border border-black/10 dark:border-white/10 shadow-sm space-y-3"
                >
                    <!-- Swatch & Hex Display Badge -->
                    <div class="flex items-center justify-between">
                        <div class="flex items-center gap-2.5">
                            <div
                                class="w-6 h-6 rounded-full border-2 border-white shadow-md transition-colors duration-150 shrink-0"
                                :style="{ backgroundColor: activeHex }"
                            />
                            <span class="text-xs font-semibold tracking-wide text-black/80 dark:text-white/80">
                                {{ color.labelKey ? $t(color.labelKey) : color.label }}
                            </span>
                        </div>
                        <span class="px-2.5 py-1 text-xs font-mono font-bold rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-white border border-black/10 dark:border-white/15 shadow-xs">
                            {{ activeHex }}
                        </span>
                    </div>

                    <!-- Hue Slider -->
                    <div class="space-y-1">
                        <div class="flex justify-between text-[10px] font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
                            <span>Odstín</span>
                        </div>
                        <div class="relative flex items-center h-5 w-full">
                            <input
                                type="range"
                                min="0"
                                max="360"
                                :value="hue"
                                @input="updateHue"
                                class="treetino-hue-slider w-full h-3.5 rounded-full appearance-none cursor-pointer outline-none shadow-inner"
                            />
                        </div>
                    </div>

                    <!-- Lightness Slider -->
                    <div class="space-y-1">
                        <div class="flex justify-between text-[10px] font-medium text-black/40 dark:text-white/40 uppercase tracking-wider">
                            <span>Jas</span>
                        </div>
                        <div class="relative flex items-center h-5 w-full">
                            <input
                                type="range"
                                min="20"
                                max="80"
                                :value="lightness"
                                @input="updateLightness"
                                class="treetino-lightness-slider w-full h-3.5 rounded-full appearance-none cursor-pointer outline-none shadow-inner"
                                :style="lightnessSliderStyle"
                            />
                        </div>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

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

const props = withDefaults(
    defineProps<{
        modelValue: string;
        stepLabel: string;
        colors: ColorOption[];
        customHex?: string;
        defaultCustomHex?: string;
    }>(),
    {
        customHex: '#00D2FF',
        defaultCustomHex: '#00D2FF',
    }
);

const emit = defineEmits<{
    'update:modelValue': [value: string];
    'update:customHex': [value: string];
}>();

const activeHex = computed(() => props.customHex || props.defaultCustomHex);

// HSL state for custom slider
const hue = ref(190);
const lightness = ref(50);
const saturation = ref(100);

// Initialize HSL from activeHex
function hexToHsl(hex: string): { h: number; s: number; l: number } {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
        cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const r = parseInt(cleanHex.substring(0, 2) || '00', 16) / 255;
    const g = parseInt(cleanHex.substring(2, 4) || '00', 16) / 255;
    const b = parseInt(cleanHex.substring(4, 6) || '00', 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100),
    };
}

function hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

// Sync HSL from activeHex when customHex changes externally
watch(
    () => activeHex.value,
    (newHex) => {
        if (newHex && /^#[0-9A-Fa-f]{6}$/.test(newHex)) {
            const hsl = hexToHsl(newHex);
            hue.value = hsl.h;
            saturation.value = hsl.s > 0 ? hsl.s : 100;
            lightness.value = Math.max(20, Math.min(80, hsl.l));
        }
    },
    { immediate: true }
);

function updateHue(e: Event) {
    hue.value = Number((e.target as HTMLInputElement).value);
    emitColor();
}

function updateLightness(e: Event) {
    lightness.value = Number((e.target as HTMLInputElement).value);
    emitColor();
}

function emitColor() {
    const hex = hslToHex(hue.value, saturation.value, lightness.value);
    emit('update:customHex', hex);
}

const lightnessSliderStyle = computed(() => {
    const pureHueHex = hslToHex(hue.value, 100, 50);
    return {
        background: `linear-gradient(to right, #000000 0%, ${pureHueHex} 50%, #ffffff 100%)`,
    };
});
</script>

<style scoped>
.treetino-hue-slider {
    background: linear-gradient(
        to right,
        #ff0000 0%,
        #ffff00 17%,
        #00ff00 33%,
        #00ffff 50%,
        #0000ff 67%,
        #ff00ff 83%,
        #ff0000 100%
    );
}

.treetino-hue-slider::-webkit-slider-thumb,
.treetino-lightness-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ffffff;
    border: 2px solid rgba(0, 0, 0, 0.2);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
    cursor: pointer;
    transition: transform 0.1s ease;
}

.treetino-hue-slider::-webkit-slider-thumb:hover,
.treetino-lightness-slider::-webkit-slider-thumb:hover {
    transform: scale(1.15);
}
</style>
