<template>
    <div>
        <p
            class="mb-4 text-xs tracking-widest text-black/70 uppercase dark:text-white/50"
        >
            {{ formatStep(stepNumber) }} — Příplatkové produkty
        </p>
        <div class="flex flex-col gap-1">
            <!-- EV Charger -->
            <div class="rounded px-3 py-3">
                <div class="mb-1 flex items-center justify-between">
                    <span class="text-sm text-black dark:text-white"
                        >Nabíjení pro elektromobily</span
                    >
                    <span
                        class="text-xs font-semibold text-black dark:text-white/40"
                        >11 kW</span
                    >
                </div>
                <p
                    class="mb-3 text-xs leading-relaxed text-black/40 dark:text-white/40"
                >
                    {{ t('configurator.preview.addons.ev_charger.text') }}
                </p>
                <div class="flex items-center gap-3">
                    <button
                        @click="evCount = Math.max(0, evCount - 1)"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-black/20 text-black transition-opacity hover:opacity-70 disabled:opacity-20 dark:border-white/20 dark:text-white"
                        :disabled="evCount === 0"
                    >
                        -
                    </button>
                    <span
                        class="w-4 text-center text-sm font-semibold text-black dark:text-white"
                        >{{ evCount }}</span
                    >
                    <button
                        @click="evCount = Math.min(10, evCount + 1)"
                        class="flex h-7 w-7 items-center justify-center rounded-full border border-black/20 text-black transition-opacity hover:opacity-70 dark:border-white/20 dark:text-white"
                    >
                        +
                    </button>
                    <span class="ml-1 text-xs text-black/60 dark:text-white/40"
                        >ks</span
                    >
                </div>
            </div>

            <div class="mx-3 border-t border-black/8 dark:border-white/8" />

            <!-- Bike Charger -->
            <button
                class="w-full rounded px-3 py-3 text-left opacity-100 transition-opacity duration-200"
                @click="bikeEnabled = !bikeEnabled"
            >
                <div class="mb-1 flex items-center justify-between">
                    <span class="text-sm text-black dark:text-white"
                        >Nabíjení pro elektrokola</span
                    >
                    <span
                        class="flex items-center gap-1.5 text-xs transition-colors duration-200"
                        :class="
                            bikeEnabled
                                ? 'font-medium text-black dark:text-white'
                                : 'text-black dark:text-white/40'
                        "
                    >
                        <CheckCircle v-if="bikeEnabled" />
                        {{ bikeEnabled ? 'Přidáno' : 'Přidat' }}
                    </span>
                </div>
                <p
                    class="text-xs leading-relaxed text-black/40 dark:text-white/40"
                >
                    {{ t('configurator.preview.addons.bike_charger.text') }}
                </p>
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useStepFormatter } from '@/composables/useStepFormatter';
import CheckCircle from '../icons/CheckCircle.vue';
const { t } = useI18n();

defineProps<{ stepNumber: number }>();

const { formatStep } = useStepFormatter();
const evCount = defineModel<number>('evChargerCount', { default: 0 });
const bikeEnabled = defineModel<boolean>('bikeChargerRequested', {
    default: false,
});
</script>
