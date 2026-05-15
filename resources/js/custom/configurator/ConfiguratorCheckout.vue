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

        <p v-if="grantInfo?.percentage" class="text-xs leading-relaxed text-black/50 dark:text-white/40">
            <template v-if="grantInfo?.percentage">
                <span class="text-xs text-black/50 dark:text-white/35 leading-relaxed">
                Základní cena <strong class="text-black dark:text-white">{{ formatPrice(basePrice) }}&thinsp;Kč</strong>
                po odečtení dotace <strong class="text-t-blue">{{ grantLabel }} −{{ grantPct }}&thinsp;%</strong>:
                <strong class="text-black dark:text-white">{{ formatPrice(discountedPrice) }}&thinsp;Kč</strong>
            </span>
            </template>
        </p>

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
                na {{ loanMonths }}&nbsp;měsíců
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
                    >{{ formatPrice(reservationPrice) }}&thinsp;Kč</div
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
                Pro měsíc <strong>{{ currentMonthName }}</strong> bylo již rezervováno
                <strong>{{ urgency.reserved }} z {{ urgency.total }}</strong> {{ urgency.unit }}.
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
import { ref, computed, watch } from 'vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
import ConfiguratorModalFinancing from '@/custom/configurator/ConfiguratorModalFinancing.vue';
import { getGrantById } from '@/types/grants';
import { Flash } from '@iconoir/vue';
import { calcMonthlyPayment, formatPrice } from '@/composables/useFinancing';

import { ProductId } from '@/types/products';

const props = defineProps<{
    basePrice: number;
    grant: string;
    monthlySavings: number;
    productId: string;
    reservationPrice: number;
}>();

const emit = defineEmits<{
    checkout: [paymentMode: string];
    info: [];
}>();

const modalFinancing = ref(false);
const paymentMode = ref<'cash' | 'credit'>('cash');
const downPayment = ref(0);
const loanMonths = ref(60);
const includeSavings = ref(false);

const grantInfo = computed(() => getGrantById(props.grant));
const grantPct = computed(() => getGrantById(props.grant)?.percentage ?? 0);
const grantLabel = computed(() => getGrantById(props.grant)?.label ?? '');

const discountedPrice = computed(() => {
    const pct = grantInfo.value?.percentage;
    if (!pct) return props.basePrice;
    return Math.round(props.basePrice * (1 - pct / 100));
});

// Watch discountedPrice and update downPayment to 30% of it
watch(
    () => discountedPrice.value,
    (newPrice) => {
        downPayment.value = Math.round(newPrice * 0.3);
    },
    { immediate: true },
);

const loanPrincipal = computed(() =>
    discountedPrice.value - Math.min(Math.max(0, downPayment.value), discountedPrice.value - 1),
);

const monthlyPayment = computed(() => calcMonthlyPayment(loanPrincipal.value, loanMonths.value));

const adjustedMonthlyPayment = computed(() =>
    includeSavings.value
        ? Math.max(0, monthlyPayment.value - props.monthlySavings)
        : monthlyPayment.value,
);

const URGENCY_DATA: Record<string, { reserved: number; total: number; unit: string }> = {
    [ProductId.StromV1]: { reserved: 3, total: 5, unit: 'stromů' },
    [ProductId.StromV2]: { reserved: 2, total: 10, unit: 'stromů' },
    [ProductId.Turbina]: { reserved: 14, total: 20, unit: 'turbín' },
};

const urgency = computed(
    () => URGENCY_DATA[props.productId] ?? { reserved: 0, total: 0, unit: 'kusů' },
);

const currentMonthName = computed(() => {
    const monthNames = [
        'leden', 'únor', 'březen', 'duben', 'květen', 'červen', 'červenec', 'srpen', 'září', 'říjen', 'listopad', 'prosinec',
    ];
    const now = new Date();
    return monthNames[now.getMonth()];
});

const reservationBenefits = [
    'Lorem ipsum dolor sit amet',
    'Consectetur adipiscing elit sed do',
    'Sed ut perspiciatis unde omnis',
    'Ut enim ad minima veniam, quis nostrum',
    'Neque porro quisquam est, qui dolorem ipsum',
    'Vel illum qui dolorem eum fugiat quo',
];
</script>
