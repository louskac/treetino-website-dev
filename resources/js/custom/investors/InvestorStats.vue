<template>
    <div class="grid grid-cols-3 gap-4 lg:gap-5 border-t border-white/12 pt-4 sm:gap-6 sm:pt-5">
        <div v-for="stat in stats" :key="stat.label">
            <p
                class="text-xl leading-none font-medium tracking-[-0.03em] whitespace-nowrap text-white tabular-nums sm:text-3xl lg:text-[clamp(1.5rem,2.4vw,2.15rem)]"
            >
                {{ stat.value }}
            </p>
            <p class="mt-2 text-[11px] leading-snug text-white/45 sm:text-sm">
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
</script>
