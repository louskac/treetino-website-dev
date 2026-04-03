<template>
    <div class="flex flex-col gap-5">

        <div>
            <p class="text-xs uppercase tracking-widest text-black/50 dark:text-white/50 mb-4">
                Shrnutí objednávky
            </p>
            <div class="flex items-baseline justify-between">
                <span class="text-xs text-black/50 dark:text-white/50">Cena od</span>
                <span class="text-lg font-bold tracking-tight text-black dark:text-white">{{ basePrice.toLocaleString('cs-CZ') }} Kč</span>
            </div>
        </div>

        <div class="rounded-sm border border-black/10 dark:border-white/10 p-4 flex flex-col gap-3">
            <div class="flex items-baseline justify-between">
                <span class="text-sm text-black font-semibold dark:text-white/50">Splatné dnes</span>
                <span class="text-xl font-semibold text-black dark:text-white">12 000 Kč</span>
            </div>
            <ul class="flex flex-col gap-1.5">
                <li v-for="item in reservationBenefits" :key="item" class="flex items-start gap-2 text-xs text-black/50 dark:text-white/50">
                    <span class="mt-px text-black/30 dark:text-white/30 shrink-0">—</span>
                    {{ item }}
                </li>
            </ul>
        </div>

        <button class="w-full rounded-sm bg-t-blue dark:bg-white py-4 text-sm font-semibold tracking-wide text-white dark:text-black transition-opacity hover:opacity-80 active:opacity-70">
            Rezervovat a zaplatit
        </button>

        <button class="w-full rounded-sm border border-black/15 dark:border-white/15 py-3 text-sm text-black/60 dark:text-white/60 transition-opacity hover:opacity-70">
            Více informací
        </button>

    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    basePrice: number;
}>();

const reservationBenefits = [
    'Lorem ipsum dolor sit amet',
    'Consectetur adipiscing elit sed do',
    'Sed ut perspiciatis unde omnis',
    'Ut enim ad minima veniam, quis nostrum',
    'Neque porro quisquam est, qui dolorem ipsum',
    'Vel illum qui dolorem eum fugiat quo',
];
</script>
