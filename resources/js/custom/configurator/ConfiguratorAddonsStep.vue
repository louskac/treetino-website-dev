<template>
    <div>
        <p class="text-xs uppercase tracking-widest text-black/70 dark:text-white/50 mb-4">
            {{ formatStep(stepNumber) }} — Příplatkové produkty
        </p>
        <div class="flex flex-col gap-1">

            <!-- EV Charger -->
            <div class="py-3 px-3 rounded">
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-black dark:text-white">Nabíjení pro elektromobily</span>
                    <span class="text-xs text-black font-semibold dark:text-white/40">11 kW</span>
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
                    <span class="text-xs text-black/60 dark:text-white/40 ml-1">ks</span>
                </div>
            </div>

            <div class="border-t border-black/8 dark:border-white/8 mx-3" />

            <!-- Bike Charger -->
            <button
                class="py-3 px-3 rounded text-left transition-opacity duration-200 w-full opacity-100"
                @click="bikeEnabled = !bikeEnabled"
            >
                <div class="flex items-center justify-between mb-1">
                    <span class="text-sm text-black dark:text-white">Nabíjení pro elektrokola</span>
                    <span class="flex items-center gap-1.5 text-xs transition-colors duration-200"
                        :class="bikeEnabled ? 'text-black dark:text-white font-medium' : 'text-black dark:text-white/40'"
                    >
                        <CheckCircle v-if="bikeEnabled"/>
                        {{ bikeEnabled ? 'Přidáno' : 'Přidat' }}
                    </span>
                </div>
                <p class="text-xs text-black/40 dark:text-white/40 leading-relaxed">Integrovaná nabíjecí stanice pro elektrokola s ochranou proti přebití.</p>
            </button>

        </div>
    </div>
</template>

<script setup lang="ts">
import { useStepFormatter } from '@/composables/useStepFormatter';
import CheckCircle from '../icons/CheckCircle.vue';

defineProps<{ stepNumber: number }>();

const { formatStep } = useStepFormatter();
const evCount = defineModel<number>('evChargerCount', { default: 0 });
const bikeEnabled = defineModel<boolean>('bikeChargerRequested', { default: false });
</script>
