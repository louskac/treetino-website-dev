<template>
    <div class="flex flex-col gap-6">

        <div>
            <p
                class="text-xs tracking-widest text-black/50 uppercase dark:text-white/50"
            >
                Shrnutí objednávky
            </p>
<!--            <div class="flex items-baseline justify-between">-->
<!--                <span class="text-xs text-black/50 dark:text-white/50"-->
<!--                    >Cena od</span-->
<!--                >-->
<!--                <span-->
<!--                    class="text-lg font-bold tracking-tight text-black dark:text-white"-->
<!--                    >{{ basePrice.toLocaleString('cs-CZ') }} Kč</span-->
<!--                >-->
<!--            </div>-->
        </div>

        <!-- Cash / Zelený úvěr tabs -->
        <div class="flex w-full border-b border-black/10 dark:border-white/10">
            <button
                @click="paymentMode = 'cash'"
                class="pb-2.5 flex-1 text-sm font-medium transition-colors relative"
                :class="paymentMode === 'cash'
                    ? 'text-black dark:text-white'
                    : 'text-black/38 dark:text-white/35 hover:text-black/65 dark:hover:text-white/55'"
            >
                Hotovost
                <span v-if="paymentMode === 'cash'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-t-full" />
            </button>
            <button
                @click="paymentMode = 'credit'"
                class="pb-2.5 flex-1 text-sm font-medium transition-colors relative"
                :class="paymentMode === 'credit'
                    ? 'text-black dark:text-white'
                    : 'text-black/38 dark:text-white/35 hover:text-black/65 dark:hover:text-white/55'"
            >
                Zelený úvěr
                <span v-if="paymentMode === 'credit'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white rounded-t-full" />
            </button>
        </div>

        <!-- Price display -->
        <div v-if="paymentMode === 'cash'" class="flex flex-col gap-1">
            <p class="text-xs text-black/40 dark:text-white/30 uppercase tracking-widest">Cena celkem</p>
            <p class="text-3xl font-bold tracking-tight text-black dark:text-white">
                {{ formatPrice(discountedPrice) }}&thinsp;Kč
            </p>
            <p class="text-xs text-black/38 dark:text-white/30 leading-relaxed mt-1">
                Cena nezahrnuje odhad 5leté úspory za výrobu energie ve výši
                <strong class="font-medium text-black/55 dark:text-white/45">{{ formatPrice(monthlySavings * 60) }}&thinsp;Kč</strong>.
            </p>
        </div>
        <div v-else class="flex flex-col gap-1">
            <p class="text-xs text-black/40 dark:text-white/30 uppercase tracking-widest">Měsíční splátka od</p>
            <p class="text-3xl font-bold tracking-tight text-black dark:text-white">
                {{ formatPrice(adjustedMonthlyPayment) }}&thinsp;Kč
                <span class="text-base font-normal text-black/40 dark:text-white/30">/měs.</span>
            </p>
            <p class="text-xs text-black/35 dark:text-white/25 mt-0.5">
                na {{ loanMonths }}&nbsp;měsíců · {{ ANNUAL_RATE }}&thinsp;%&nbsp;p.a.
            </p>
            <p class="text-xs text-black/38 dark:text-white/30 leading-relaxed mt-1">
                Cena nezahrnuje odhadované měsíční úspory za výrobu energie ve výši
                <strong class="font-medium text-black/55 dark:text-white/45">{{ formatPrice(monthlySavings) }}&thinsp;Kč</strong>.
            </p>
            <button
                @click="modalFinancing = true"
                class="cursor-pointer self-start text-xs text-black/50 dark:text-white/40 underline underline-offset-2 hover:text-black dark:hover:text-white transition-colors mt-2"
            >
                Upravit podmínky financování
            </button>
        </div>

        <div
            class="flex flex-col gap-4 rounded-xl border border-black/10 p-4 dark:border-white/10"
        >
            <div class="flex items-baseline justify-between">
                <div
                    class="text-sm text-black/70 dark:text-white/50"
                    >Reserve Price</div
                >
                <div class="text-xl font-semibold text-black dark:text-white"
                    >12 000 Kč</div
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

        <!-- Urgency notice -->
        <div class="flex flex-row items-center gap-3 p-3 rounded-lg bg-orange-50 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/40">
            <Flash class="h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400" />
            <p class="text-xs font-medium text-orange-700 dark:text-orange-300">
                Pro měsíc <strong>{{ currentMonthName }}</strong> bylo již rezervováno <strong>3 z 5</strong> stromů.
            </p>
        </div>

        <div class="flex flex-col gap-2">
            <ButtonPrimary @click="emit('checkout', paymentMode)" class="cursor-pointer">
                Rezervovat a Zaplatit
            </ButtonPrimary>

            <ButtonSecondary @click="emit('info')" class="cursor-pointer">
                Více Informací
            </ButtonSecondary>
        </div>
    </div>

    <Transition>
        <ConfiguratorModalFinancing
            v-if="modalFinancing"
            :base-price="basePrice"
            :grant="grant"
            :down-payment="downPayment"
            :loan-months="loanMonths"
            :include-savings="includeSavings"
            :monthly-savings="monthlySavings"
            @update:down-payment="downPayment = $event"
            @update:loan-months="loanMonths = $event"
            @update:include-savings="includeSavings = $event"
            @close="modalFinancing = false"
        />
    </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
import ConfiguratorModalFinancing from '@/custom/configurator/ConfiguratorModalFinancing.vue';
import { getGrantById } from '@/types/grants';
import { Flash } from '@iconoir/vue';

const ANNUAL_RATE = 3.9;

const props = defineProps<{
    basePrice: number;
    grant: string;
    monthlySavings: number;
}>();

const emit = defineEmits<{
    checkout: [paymentMode: string];
    info: [];
}>();

const modalFinancing = ref(false);
const paymentMode = ref<'cash' | 'credit'>('cash');
const downPayment = ref(750000);
const loanMonths = ref(60);
const includeSavings = ref(false);

const discountedPrice = computed(() => {
    const pct = getGrantById(props.grant)?.percentage;
    if (!pct) return props.basePrice;
    return Math.round(props.basePrice * (1 - pct / 100));
});

const loanPrincipal = computed(() =>
    discountedPrice.value - Math.min(Math.max(0, downPayment.value), discountedPrice.value - 1),
);

const monthlyPayment = computed(() => {
    const P = loanPrincipal.value;
    const r = ANNUAL_RATE / 100 / 12;
    const n = loanMonths.value;
    if (P <= 0) return 0;
    return (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
});

const adjustedMonthlyPayment = computed(() =>
    includeSavings.value
        ? Math.max(0, monthlyPayment.value - props.monthlySavings)
        : monthlyPayment.value,
);

const currentMonthName = computed(() => {
    const monthNames = [
        'leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec',
    ];
    const now = new Date();
    return monthNames[now.getMonth()];
});

function formatPrice(v: number) {
    return Math.round(v).toLocaleString('cs-CZ');
}

const reservationBenefits = [
    'Lorem ipsum dolor sit amet',
    'Consectetur adipiscing elit sed do',
    'Sed ut perspiciatis unde omnis',
    'Ut enim ad minima veniam, quis nostrum',
    'Neque porro quisquam est, qui dolorem ipsum',
    'Vel illum qui dolorem eum fugiat quo',
];
</script>
