<script setup lang="ts">
import { computed } from 'vue';
import { Xmark } from '@iconoir/vue';
import { getGrantById } from '@/types/grants';

const ANNUAL_RATE = 3.9;

const props = defineProps<{
    basePrice: number;
    grant: string;
    downPayment: number;
    loanMonths: number;
    includeSavings: boolean;
    monthlySavings: number;
}>();

const emit = defineEmits<{
    close: [];
    'update:downPayment': [number];
    'update:loanMonths': [number];
    'update:includeSavings': [boolean];
}>();

const grantPct = computed(() => getGrantById(props.grant)?.percentage ?? 0);
const grantLabel = computed(() => getGrantById(props.grant)?.label ?? '');

const discountedPrice = computed(() => {
    const pct = getGrantById(props.grant)?.percentage;
    if (!pct) return props.basePrice;
    return Math.round(props.basePrice * (1 - pct / 100));
});

const safeDownPayment = computed(() =>
    Math.min(Math.max(0, props.downPayment), discountedPrice.value - 1),
);

const isOverMaxDownPayment = computed(() => {
    return props.downPayment >= discountedPrice.value;
});

const loanPrincipal = computed(() => discountedPrice.value - safeDownPayment.value);

const monthlyPayment = computed(() => {
    const P = loanPrincipal.value;
    const r = ANNUAL_RATE / 100 / 12;
    const n = props.loanMonths;
    if (P <= 0) return 0;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
});

const adjustedMonthlyPayment = computed(() =>
    props.includeSavings
        ? Math.max(0, monthlyPayment.value - props.monthlySavings)
        : monthlyPayment.value,
);

function formatPrice(v: number) {
    return Math.round(v).toLocaleString('cs-CZ');
}

const monthOptions = [12, 24, 36, 48, 60];
</script>

<template>
    <div class="fixed top-0 left-0 z-50 flex h-full w-full backdrop-blur-xs p-6" @click.self="emit('close')">
        <div class="mx-auto my-auto w-full rounded-2xl bg-white dark:bg-zinc-900 shadow-[0_0_15px_5px_rgba(0,0,0,0.2)] lg:w-120">

            <!-- Header -->
            <div class="flex items-center justify-between border-b border-black/10 dark:border-white/10 p-6">
                <h2 class="text-base font-semibold text-black dark:text-white">Možnosti financování</h2>
                <Xmark class="h-5 w-5 cursor-pointer text-black/50 dark:text-white/50 hover:text-black dark:hover:text-white transition-colors" @click="emit('close')" />
            </div>

            <div class="p-6 flex flex-col gap-5">

                <!-- Grant discount notice -->
                <div v-if="grantPct" class="flex items-center gap-2 rounded-lg bg-black/4 dark:bg-white/5 px-3 py-2.5">
                    <span class="text-xs text-black/50 dark:text-white/35 leading-relaxed">
                        Základní cena <strong class="text-black dark:text-white">{{ formatPrice(basePrice) }}&thinsp;Kč</strong>
                        po odečtení dotace <strong class="text-t-blue">{{ grantLabel }} −{{ grantPct }}&thinsp;%</strong>:
                        <strong class="text-black dark:text-white">{{ formatPrice(discountedPrice) }}&thinsp;Kč</strong>
                    </span>
                </div>

                <!-- Inputs -->
                <div class="flex flex-col gap-4">

                    <!-- Down payment -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs text-black/50 dark:text-white/40 uppercase tracking-widest">Platba předem</label>
                        <div class="relative">
                            <input
                                type="number"
                                :value="downPayment"
                                @input="emit('update:downPayment', Number(($event.target as HTMLInputElement).value))"
                                :min="0"
                                :max="discountedPrice - 1"
                                step="10000"
                                class="w-full rounded-lg border border-black/15 dark:border-white/15 bg-transparent px-3 py-2.5 pr-10 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                            />
                            <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black/35 dark:text-white/30 pointer-events-none">Kč</span>
                        </div>
                    </div>
                    <p v-if="isOverMaxDownPayment" class="text-[11px] text-red-500 font-medium">
                        Maximální platba předem může být {{ formatPrice(discountedPrice - 1) }} Kč.
                    </p>

                    <!-- Loan term -->
                    <div class="flex flex-col gap-1.5">
                        <label class="text-xs text-black/50 dark:text-white/40 uppercase tracking-widest">Doba splatnosti</label>
                        <select
                            :value="loanMonths"
                            @change="emit('update:loanMonths', Number(($event.target as HTMLSelectElement).value))"
                            class="w-full rounded-lg border border-black/15 dark:border-white/15 bg-white dark:bg-zinc-900 px-3 py-2.5 text-sm text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white transition-colors cursor-pointer"
                        >
                            <option v-for="m in monthOptions" :key="m" :value="m">{{ m }} měsíců</option>
                        </select>
                    </div>
                </div>

                <!-- Result -->
                <div class="rounded-xl border border-black/10 dark:border-white/10 p-4 flex flex-col gap-1">
                    <p class="text-xs text-black/40 dark:text-white/30 uppercase tracking-widest">Měsíční splátka od</p>
                    <p class="text-3xl font-bold tracking-tight text-black dark:text-white">
                        {{ formatPrice(adjustedMonthlyPayment) }}&thinsp;Kč
                        <span class="text-base font-normal text-black/40 dark:text-white/30">/měs.</span>
                    </p>
                    <p class="text-xs text-black/35 dark:text-white/25 mt-0.5">
                        Výše úvěru {{ formatPrice(loanPrincipal) }}&thinsp;Kč · {{ loanMonths }}&nbsp;měsíců · {{ ANNUAL_RATE }}&thinsp;%&nbsp;p.a.
                    </p>
                </div>

                <!-- Energy savings toggle -->
                <button
                    @click="emit('update:includeSavings', !includeSavings)"
                    class="flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors"
                    :class="includeSavings
                        ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/15 dark:border-emerald-700'
                        : 'border-black/12 dark:border-white/12 hover:border-black/25 dark:hover:border-white/25'"
                >
                    <div
                        class="relative w-9 h-5 rounded-full shrink-0 transition-colors duration-200"
                        :class="includeSavings ? 'bg-emerald-500' : 'bg-black/18 dark:bg-white/18'"
                    >
                        <span
                            class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                            :class="includeSavings ? 'translate-x-4' : 'translate-x-0'"
                        />
                    </div>
                    <span class="text-xs leading-snug" :class="includeSavings ? 'text-emerald-700 dark:text-emerald-400' : 'text-black/65 dark:text-white/55'">
                        Zahrnout odhadované měsíční úspory za výrobu energie
                        <span class="block mt-0.5 font-medium">−{{ props.monthlySavings.toLocaleString('cs-CZ') }}&nbsp;Kč/měsíc</span>
                    </span>
                </button>

            </div>
        </div>
    </div>
</template>
