<template>
    <div class="grid grid-cols-3 gap-3 sm:gap-6 border-t border-white/12 pt-4 sm:pt-5">
        <div v-for="stat in stats" :key="stat.label" class="min-w-0">
            <p
                class="leading-none font-medium tracking-tight text-white tabular-nums truncate"
                :class="valueClass(stat.value)"
                :title="stat.value"
            >
                {{ stat.value }}
            </p>
            <p class="mt-2 text-[11px] leading-snug text-white/50 sm:text-xs xl:text-sm">
                {{ stat.label }}
            </p>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Stat } from './tokens';

defineProps<{
    stats: Stat[];
}>();

function valueClass(val: string): string {
    const len = val.length;
    if (len >= 11) {
        return 'text-sm sm:text-lg lg:text-[clamp(1.05rem,1.4vw,1.35rem)]';
    }
    if (len >= 8) {
        return 'text-base sm:text-xl lg:text-[clamp(1.2rem,1.7vw,1.6rem)]';
    }
    return 'text-xl sm:text-2xl lg:text-[clamp(1.5rem,2.1vw,2.0rem)]';
}
</script>
