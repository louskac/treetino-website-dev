<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 mb-4">
            05 — Příplatkové produkty
        </p>
        <div class="flex flex-col gap-1">

            <!-- EV Charger -->
            <div class="py-3 px-3 rounded">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-black dark:text-white">Nabíjení pro elektromobily</span>
                    <span class="text-xs text-black/60 font-semibold dark:text-white/40">11 kW</span>
                </div>
                <p class="text-xs text-black/40 dark:text-white/40 leading-relaxed mb-3">Přípojka pro rychlé domácí nebo firemní nabíjení elektromobilů.</p>
                <div class="flex items-center gap-3">
                    <button
                        @click="evCount = Math.max(0, evCount - 1)"
                        class="w-7 h-7 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center text-black dark:text-white transition-opacity hover:opacity-70 disabled:opacity-20"
                        :disabled="evCount === 0"
                    >-</button>
                    <span class="text-sm font-semibold text-black dark:text-white w-4 text-center">{{ evCount }}</span>
                    <button
                        @click="evCount = Math.min(10, evCount + 1)"
                        class="w-7 h-7 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center text-black dark:text-white transition-opacity hover:opacity-70"
                    >+</button>
                    <span class="text-xs text-black/40 dark:text-white/40 ml-1">ks</span>
                </div>
            </div>

            <div class="border-t border-black/8 dark:border-white/8 mx-3" />

            <!-- Bike Charger -->
            <div class="py-3 px-3 rounded">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-black dark:text-white">Nabíjení pro elektrokola</span>
                </div>
                <p class="text-xs text-black/40 dark:text-white/40 leading-relaxed mb-3">Integrovaná nabíjecí stanice pro elektrokola s ochranou proti přebití.</p>
                <div class="flex items-center gap-3">
                    <button
                        @click="bikeCount = Math.max(0, bikeCount - 1)"
                        class="w-7 h-7 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center text-black dark:text-white transition-opacity hover:opacity-70 disabled:opacity-20"
                        :disabled="bikeCount === 0"
                    >-</button>
                    <span class="text-sm font-semibold text-black dark:text-white w-4 text-center">{{ bikeCount }}</span>
                    <button
                        @click="bikeCount = Math.min(10, bikeCount + 1)"
                        class="w-7 h-7 rounded-full border border-black/20 dark:border-white/20 flex items-center justify-center text-black dark:text-white transition-opacity hover:opacity-70"
                    >+</button>
                    <span class="text-xs text-black/40 dark:text-white/40 ml-1">ks</span>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
const evCount = defineModel<number>('evChargerCount', { default: 0 });
const bikeCount = defineModel<number>('bikeChargerCount', { default: 0 });
</script>
