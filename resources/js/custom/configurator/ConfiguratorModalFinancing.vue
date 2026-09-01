<template>
    <div
        class="fixed top-0 left-0 z-50 flex h-full w-full p-6 backdrop-blur-xs"
        @click.self="emit('close')"
    >
        <div
            class="mx-auto my-auto w-full rounded-2xl bg-white shadow-[0_0_15px_5px_rgba(0,0,0,0.2)] lg:w-120 dark:bg-zinc-900"
        >
            <!-- Header -->
            <div
                class="flex items-center justify-between border-b border-black/10 p-6 dark:border-white/10"
            >
                <h2 class="text-base font-semibold text-black dark:text-white">
                    {{ $t('configurator.modal_financing.title') }}
                </h2>
                <Xmark
                    class="h-5 w-5 cursor-pointer text-black/50 transition-colors hover:text-black dark:text-white/50 dark:hover:text-white"
                    @click="emit('close')"
                />
            </div>

            <div class="flex flex-col gap-5 p-6">
                <!-- Grant discount notice -->
                <div
                    v-if="grantPct"
                    class="flex items-center gap-2 rounded-lg bg-black/4 px-3 py-2.5 dark:bg-white/5"
                >
                    <span
                        class="text-xs leading-relaxed text-black/50 dark:text-white/35"
                    >
                        {{ $t('configurator.checkout.base_price') }}
                        <strong class="text-black dark:text-white"
                            >{{ formatCurrency(basePrice, locale) }}</strong
                        >
                        {{ $t('configurator.checkout.after_grant') }}
                        <strong class="text-t-blue"
                            >{{ grantLabel }} −{{ grantPct }}&thinsp;%</strong
                        >:
                        <strong class="text-black dark:text-white"
                            >{{
                                formatCurrency(discountedPrice, locale)
                            }}</strong
                        >
                    </span>
                </div>

                <!-- Inputs -->
                <div class="flex flex-col gap-4">
                    <!-- Down payment -->
                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-xs tracking-widest text-black/50 uppercase dark:text-white/40"
                            >{{
                                $t('configurator.modal_financing.down_payment')
                            }}</label
                        >
                        <div class="relative">
                            <input
                                type="number"
                                :value="downPayment"
                                @input="
                                    emit(
                                        'update:downPayment',
                                        Number(
                                            ($event.target as HTMLInputElement)
                                                .value,
                                        ),
                                    )
                                "
                                :min="0"
                                :max="discountedPrice - 1"
                                step="10000"
                                class="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2.5 pr-10 text-sm text-black transition-colors focus:border-black focus:outline-none dark:border-white/15 dark:text-white dark:focus:border-white"
                            />
                            <span
                                class="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs text-black/35 dark:text-white/30"
                                >{{ locale === 'en' ? '€' : 'Kč' }}</span
                            >
                        </div>
                    </div>
                    <p
                        v-if="isOverMaxDownPayment"
                        class="text-[11px] font-medium text-red-500"
                    >
                        {{
                            $t(
                                'configurator.modal_financing.max_down_payment',
                                { amount: formatCurrency(discountedPrice - 1, locale) },
                            )
                        }}
                    </p>

                    <!-- Loan term -->
                    <div class="flex flex-col gap-1.5">
                        <label
                            class="text-xs tracking-widest text-black/50 uppercase dark:text-white/40"
                            >{{
                                $t('configurator.modal_financing.loan_term')
                            }}</label
                        >
                        <select
                            :value="loanMonths"
                            @change="
                                emit(
                                    'update:loanMonths',
                                    Number(
                                        ($event.target as HTMLSelectElement)
                                            .value,
                                    ),
                                )
                            "
                            class="w-full cursor-pointer rounded-lg border border-black/15 bg-white px-3 py-2.5 text-sm text-black transition-colors focus:border-black focus:outline-none dark:border-white/15 dark:bg-zinc-900 dark:text-white dark:focus:border-white"
                        >
                            <option
                                v-for="m in monthOptions"
                                :key="m"
                                :value="m"
                            >
                                {{ m }}
                                {{ $t('configurator.modal_financing.months') }}
                            </option>
                        </select>
                    </div>
                </div>

                <!-- Result -->
                <div
                    class="flex flex-col gap-1 rounded-xl border border-black/10 p-4 dark:border-white/10"
                >
                    <p
                        class="text-xs tracking-widest text-black/40 uppercase dark:text-white/30"
                    >
                        {{ $t('configurator.checkout.monthly_from') }}
                    </p>
                    <p
                        class="text-3xl font-bold tracking-tight text-black dark:text-white"
                    >
                        {{ formatCurrency(adjustedMonthlyPayment, locale) }}
                        <span
                            class="text-base font-normal text-black/40 dark:text-white/30"
                            >{{ $t('configurator.checkout.per_month') }}</span
                        >
                    </p>
                    <p class="mt-0.5 text-xs text-black/35 dark:text-white/25">
                        {{ $t('configurator.modal_financing.loan_amount') }}
                        {{ formatCurrency(loanPrincipal, locale) }} ·
                        {{ loanMonths }}&nbsp;{{
                            $t('configurator.modal_financing.months')
                        }}
                    </p>
                </div>

                <!-- Energy savings toggle -->
                <button
                    @click="emit('update:includeSavings', !includeSavings)"
                    class="flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors"
                    :class="
                        includeSavings
                            ? 'border-emerald-400 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-900/15'
                            : 'border-black/12 hover:border-black/25 dark:border-white/12 dark:hover:border-white/25'
                    "
                >
                    <div
                        class="relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200"
                        :class="
                            includeSavings
                                ? 'bg-emerald-500'
                                : 'bg-black/18 dark:bg-white/18'
                        "
                    >
                        <span
                            class="absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200"
                            :class="
                                includeSavings
                                    ? 'translate-x-4'
                                    : 'translate-x-0'
                            "
                        />
                    </div>
                    <span
                        class="text-xs leading-snug"
                        :class="
                            includeSavings
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-black/65 dark:text-white/55'
                        "
                    >
                        {{ $t('configurator.modal_financing.include_savings') }}
                        <span class="mt-0.5 block font-medium"
                            >−{{
                                formatCurrency(props.monthlySavings, locale)
                            }}&nbsp;{{
                                $t('configurator.modal_financing.per_month')
                            }}</span
                        >
                    </span>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Xmark } from '@iconoir/vue';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { calcMonthlyPayment, formatPrice, formatCurrency } from '@/composables/useFinancing';
import { getGrantById } from '@/types/grants';

const { t, locale } = useI18n();

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
const grantLabel = computed(() => {
    const info = getGrantById(props.grant);

    if (!info) {
        return '';
    }

    return info.labelKey ? t(info.labelKey, info.label) : info.label;
});

const discountedPrice = computed(() => {
    const pct = getGrantById(props.grant)?.percentage;

    if (!pct) {
        return props.basePrice;
    }

    return Math.round(props.basePrice * (1 - pct / 100));
});

const safeDownPayment = computed(() =>
    Math.min(Math.max(0, props.downPayment), discountedPrice.value - 1),
);

const isOverMaxDownPayment = computed(() => {
    return props.downPayment >= discountedPrice.value;
});

const loanPrincipal = computed(
    () => discountedPrice.value - safeDownPayment.value,
);

const monthlyPayment = computed(() =>
    calcMonthlyPayment(loanPrincipal.value, props.loanMonths),
);

const adjustedMonthlyPayment = computed(() =>
    props.includeSavings
        ? Math.max(0, monthlyPayment.value - props.monthlySavings)
        : monthlyPayment.value,
);

const monthOptions = [12, 24, 36, 48, 60];
</script>
