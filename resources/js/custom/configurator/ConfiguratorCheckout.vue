<template>
    <div class="flex flex-col gap-6">
        <div>
            <p
                class="mb-4 text-xs tracking-widest text-black/50 uppercase dark:text-white/50"
            >
                Shrnutí objednávky
            </p>
            <div class="flex items-baseline justify-between">
                <span class="text-xs text-black/50 dark:text-white/50"
                    >Cena od</span
                >
                <span
                    class="text-lg font-bold tracking-tight text-black dark:text-white"
                    >{{ basePrice.toLocaleString('cs-CZ') }} Kč</span
                >
            </div>
        </div>

        <div
            class="flex flex-col gap-3 rounded-xl border border-black/10 p-4 dark:border-white/10"
        >
            <div class="flex items-baseline justify-between">
                <span
                    class="text-sm font-semibold text-black dark:text-white/50"
                    >Splatné dnes</span
                >
                <span class="text-xl font-semibold text-black dark:text-white"
                    >12 000 Kč</span
                >
            </div>
            <ul class="flex flex-col gap-1.5">
                <li
                    v-for="item in reservationBenefits"
                    :key="item"
                    class="flex items-start gap-2 text-xs text-black/50 dark:text-white/50"
                >
                    <span
                        class="mt-px shrink-0 text-black/30 dark:text-white/30"
                        >—</span
                    >
                    {{ item }}
                </li>
            </ul>
        </div>

        <div class="flex flex-col gap-2">
            <ButtonPrimary @click="emit('checkout')" class="cursor-pointer">
                Rezervovat a Zaplatit
            </ButtonPrimary>

            <ButtonSecondary @click="emit('info')" class="cursor-pointer">
                Více Informací
            </ButtonSecondary>
        </div>
    </div>
</template>

<script setup lang="ts">
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';

const props = defineProps<{
    basePrice: number;
}>();

const emit = defineEmits(['checkout', 'info']);

const reservationBenefits = [
    'Lorem ipsum dolor sit amet',
    'Consectetur adipiscing elit sed do',
    'Sed ut perspiciatis unde omnis',
    'Ut enim ad minima veniam, quis nostrum',
    'Neque porro quisquam est, qui dolorem ipsum',
    'Vel illum qui dolorem eum fugiat quo',
];
</script>
