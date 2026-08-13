<template>
    <div class="flex flex-col gap-6">
        <div>
            <p
                class="text-xs tracking-widest text-black/50 uppercase dark:text-white/50"
            >
                {{ $t('configurator.checkout.summary') }}
            </p>
        </div>

        <!-- Cash / Zelený úvěr tabs -->
        <div class="flex w-full border-b border-black/10 dark:border-white/10">
            <button
                @click="paymentMode = 'cash'"
                class="relative flex-1 pb-2.5 text-sm font-medium transition-colors"
                :class="
                    paymentMode === 'cash'
                        ? 'text-black dark:text-white'
                        : 'text-black/38 hover:text-black/65 dark:text-white/35 dark:hover:text-white/55'
                "
            >
                {{ $t('configurator.checkout.cash') }}
                <span
                    v-if="paymentMode === 'cash'"
                    class="absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full bg-black dark:bg-white"
                />
            </button>
            <button
                @click="paymentMode = 'credit'"
                class="relative flex-1 pb-2.5 text-sm font-medium transition-colors"
                :class="
                    paymentMode === 'credit'
                        ? 'text-black dark:text-white'
                        : 'text-black/38 hover:text-black/65 dark:text-white/35 dark:hover:text-white/55'
                "
            >
                {{ $t('configurator.checkout.credit') }}
                <span
                    v-if="paymentMode === 'credit'"
                    class="absolute right-0 bottom-0 left-0 h-0.5 rounded-t-full bg-black dark:bg-white"
                />
            </button>
        </div>

        <p
            v-if="grantInfo?.percentage"
            class="text-xs leading-relaxed text-black/50 dark:text-white/40"
        >
            <template v-if="grantInfo?.percentage">
                <span
                    class="text-xs leading-relaxed text-black/50 dark:text-white/35"
                >
                    {{ $t('configurator.checkout.base_price') }}
                    <strong class="text-black dark:text-white"
                        >{{ formatPrice(basePrice) }}&thinsp;Kč</strong
                    >
                    {{ $t('configurator.checkout.after_grant') }}
                    <strong class="text-t-blue"
                        >{{ grantLabel }} −{{ grantPct }}&thinsp;%</strong
                    >:
                    <strong class="text-black dark:text-white"
                        >{{ formatPrice(discountedPrice) }}&thinsp;Kč</strong
                    >
                </span>
            </template>
        </p>

        <!-- Price display -->
        <div v-if="paymentMode === 'cash'" class="flex flex-col gap-1">
            <p
                class="text-xs tracking-widest text-black/40 uppercase dark:text-white/30"
            >
                {{ $t('configurator.checkout.total_price') }}
            </p>
            <p
                class="text-3xl font-bold tracking-tight text-black dark:text-white"
            >
                {{ formatPrice(discountedPrice) }}&thinsp;Kč
            </p>
            <p
                class="mt-1 text-xs leading-relaxed text-black/38 dark:text-white/30"
            >
                {{ $t('configurator.checkout.savings_5yr_notice', { savings: formatPrice(monthlySavings * 60) }) }}
            </p>
        </div>
        <div v-else class="flex flex-col gap-1">
            <p
                class="text-xs tracking-widest text-black/40 uppercase dark:text-white/30"
            >
                {{ $t('configurator.checkout.monthly_from') }}
            </p>
            <p
                class="text-3xl font-bold tracking-tight text-black dark:text-white"
            >
                {{ formatPrice(adjustedMonthlyPayment) }}&thinsp;Kč
                <span
                    class="text-base font-normal text-black/40 dark:text-white/30"
                    >{{ $t('configurator.checkout.per_month') }}</span
                >
            </p>
            <p class="mt-0.5 text-xs text-black/35 dark:text-white/25">
                {{ $t('configurator.checkout.for_months', { months: loanMonths }) }}
            </p>
            <p
                class="mt-1 text-xs leading-relaxed text-black/38 dark:text-white/30"
            >
                {{ $t('configurator.checkout.monthly_savings_notice', { savings: formatPrice(monthlySavings) }) }}
            </p>
            <button
                @click="modalFinancing = true"
                class="mt-2 cursor-pointer self-start text-xs text-black/50 underline underline-offset-2 transition-colors hover:text-black dark:text-white/40 dark:hover:text-white"
            >
                {{ $t('configurator.checkout.edit_financing') }}
            </button>
        </div>

        <div
            class="flex flex-col gap-4 rounded-xl border border-black/10 p-4 dark:border-white/10"
        >
            <div class="flex items-baseline justify-between">
                <div class="text-sm text-black/70 dark:text-white/50">
                    {{ $t('configurator.checkout.reserve_price') }}
                </div>
                <div class="text-xl font-semibold text-black dark:text-white">
                    {{ formatPrice(reservationPrice) }}&thinsp;Kč
                </div>
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
        <div
            class="flex flex-row items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-3 dark:border-orange-800/40 dark:bg-orange-900/20"
        >
            <Flash
                class="h-5 w-5 shrink-0 text-orange-600 dark:text-orange-400"
            />
            <p class="text-xs font-medium text-orange-700 dark:text-orange-300">
                {{ $t('configurator.checkout.urgency', { month: currentMonthTranslated, reserved: urgency.reserved, total: urgency.total, unit: urgencyTranslatedUnit }) }}
            </p>
        </div>

        <div class="flex gap-3">
            <div class="">
                <input type="checkbox" v-model="tosConsent" id="tosConsent" class="cursor-pointer accent-black dark:accent-white" />
            </div>
            <div class="-mt-0.5">
                <label for="tosConsent" class="cursor-pointer text-sm text-black/80 dark:text-white/80">
                    <i18n-t keypath="configurator.checkout.tos_agree" tag="span">
                        <template #tos>
                            <a class="underline text-black/90 hover:text-black dark:text-white/90 dark:hover:text-white" :href="route('legal.tos')" target="_blank" @click.stop>{{ $t('configurator.checkout.tos_link') }}</a>
                        </template>
                        <template #pp>
                            <a class="underline text-black/90 hover:text-black dark:text-white/90 dark:hover:text-white" :href="route('legal.pp')" target="_blank" @click.stop>{{ $t('configurator.checkout.pp_link') }}</a>
                        </template>
                    </i18n-t>
                </label>
            </div>
        </div>

        <div class="flex flex-col gap-2">
            <ButtonPrimary
                :disabled="!tosConsent"
                @click="emit('checkout', paymentMode)"
                class="cursor-pointer disabled:opacity-70"
            >
                {{ $t('configurator.checkout.btn_order') }}
            </ButtonPrimary>

            <ButtonSecondary @click="emit('info')" class="cursor-pointer">
                {{ $t('configurator.checkout.btn_info') }}
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
import { useI18n } from 'vue-i18n';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
import ConfiguratorModalFinancing from '@/custom/configurator/ConfiguratorModalFinancing.vue';
import { getGrantById } from '@/types/grants';
import { Flash } from '@iconoir/vue';
import { calcMonthlyPayment, formatPrice } from '@/composables/useFinancing';

import { ProductId } from '@/types/products';
import { route } from 'ziggy-js';

const { t } = useI18n();

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
const grantLabel = computed(() => {
    const info = getGrantById(props.grant);
    if (!info) return '';
    return info.labelKey ? t(info.labelKey, info.label) : info.label;
});

const discountedPrice = computed(() => {
    const pct = grantInfo.value?.percentage;
    if (!pct) return props.basePrice;
    return Math.round(props.basePrice * (1 - pct / 100));
});

const tosConsent = ref(false);

// Watch discountedPrice and update downPayment to 30% of it
watch(
    () => discountedPrice.value,
    (newPrice) => {
        downPayment.value = Math.round(newPrice * 0.3);
    },
    { immediate: true },
);

const loanPrincipal = computed(
    () =>
        discountedPrice.value -
        Math.min(Math.max(0, downPayment.value), discountedPrice.value - 1),
);

const monthlyPayment = computed(() =>
    calcMonthlyPayment(loanPrincipal.value, loanMonths.value),
);

const adjustedMonthlyPayment = computed(() =>
    includeSavings.value
        ? Math.max(0, monthlyPayment.value - props.monthlySavings)
        : monthlyPayment.value,
);

const URGENCY_DATA: Record<
    string,
    { reserved: number; total: number; unitKey: string }
> = {
    [ProductId.StromV1]: { reserved: 3, total: 5, unitKey: 'configurator.checkout.units.trees' },
    [ProductId.StromV2]: { reserved: 2, total: 10, unitKey: 'configurator.checkout.units.trees' },
    [ProductId.Turbina]: { reserved: 14, total: 20, unitKey: 'configurator.checkout.units.turbines' },
};

const urgency = computed(
    () =>
        URGENCY_DATA[props.productId] ?? {
            reserved: 0,
            total: 0,
            unitKey: 'configurator.checkout.units.pcs',
        },
);

const urgencyTranslatedUnit = computed(() => t(urgency.value.unitKey));

const monthKeys = [
    'january',
    'february',
    'march',
    'april',
    'may',
    'june',
    'july',
    'august',
    'september',
    'october',
    'november',
    'december',
];

const currentMonthTranslated = computed(() => {
    const now = new Date();
    const key = monthKeys[now.getMonth()];
    return t(`configurator.months.${key}`);
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
