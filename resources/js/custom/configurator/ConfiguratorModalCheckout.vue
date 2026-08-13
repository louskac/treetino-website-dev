<script setup lang="ts">
import { Xmark } from '@iconoir/vue';
import { loadStripe } from '@stripe/stripe-js';
import type {
    PaymentRequest,
    PaymentRequestPaymentMethodEvent,
    Stripe,
    StripeCardElement,
    StripePaymentRequestButtonElement,
} from '@stripe/stripe-js';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { ref, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';
import { route } from 'ziggy-js';

import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';

const { t } = useI18n();

const props = defineProps({
    productId: {
        type: String,
        required: true,
    },
    configuration: {
        type: Object,
        required: true,
    },
    reservationPrice: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['close', 'success']);

// State logic
const step = ref(1);
const email = ref('');
const isProcessing = ref(false);
const errorMessage = ref('');
const preorderUuid = ref('');

// Stripe refs
const stripe = ref<Stripe | null>(null);
const paymentRequest = ref<PaymentRequest | null>(null);
const prButton = ref<StripePaymentRequestButtonElement | null>(null);
const canPayWithWallet = ref(false);
const cardElement = ref<StripeCardElement | null>(null);
const clientSecret = ref('');

const handleContinue = async () => {
    if (!email.value) {
        return;
    }

    isProcessing.value = true;
    errorMessage.value = '';

    try {
        const response = await axios.post(route('checkout-initiate'), {
            email: email.value,
            type: props.productId,
            configuration: props.configuration,
        });

        console.log('Backend Response:', response.data);
        clientSecret.value = response.data.client_secret;
        preorderUuid.value = response.data.preorder_uuid;

        // Move to Step 2
        step.value = 2;

        // Wait for DOM to update so Stripe can find the #card-element div
        await nextTick();
        await initStripe();
    } catch (error) {
        const requestError = error as AxiosError<{ message?: string }>;
        console.log(error);
        errorMessage.value =
            requestError.response?.data?.message || 'Something went wrong.';
    } finally {
        isProcessing.value = false;
    }
};

/**
 * Step 2: Initialize Stripe Elements
 */
const initStripe = async () => {
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_KEY);

    if (!stripe.value) {
        errorMessage.value = 'Payment service could not be initialized.';
        return;
    }

    const stripeInstance = stripe.value;

    // 1. Create the Payment Request
    paymentRequest.value = stripeInstance.paymentRequest({
        country: 'CZ',
        currency: 'czk',
        total: {
            label: 'Reservation Deposit',
            amount: props.reservationPrice * 100,
        },
        requestPayerName: true,
        requestPayerEmail: true,
    });

    const elements = stripeInstance.elements();

    // 2. Wallet Button check
    const request = paymentRequest.value;
    const result = await request.canMakePayment();

    if (result) {
        canPayWithWallet.value = true;
        prButton.value = elements.create('paymentRequestButton', {
            paymentRequest: request,
            style: {
                paymentRequestButton: {
                    type: 'book',
                    theme: 'dark',
                    height: '48px',
                },
            },
        });
    }

    // 3. MOUNT THE CARD ELEMENT CORRECTLY
    cardElement.value = elements.create('card', {
        style: { base: { fontSize: '16px' } },
        hidePostalCode: true,
    });

    cardElement.value.mount('#card-element');

    // 4. Mount Wallet Button
    if (canPayWithWallet.value) {
        await nextTick();
        prButton.value?.mount('#wallet-button');
    }

    // 5. Wallet listener
    request.on('paymentmethod', async (ev: PaymentRequestPaymentMethodEvent) => {
        const { paymentIntent, error: confirmError } =
            await stripeInstance.confirmCardPayment(
                clientSecret.value,
                { payment_method: ev.paymentMethod.id },
                { handleActions: false },
            );

        if (confirmError) {
            ev.complete('fail');
            errorMessage.value = confirmError.message ?? 'Payment failed.';
        } else {
            ev.complete('success');
            if (paymentIntent.status === 'requires_action') {
                const { error: actionError } =
                    await stripeInstance.confirmCardPayment(clientSecret.value);
                if (actionError) {
                    errorMessage.value = actionError.message ?? 'Payment failed.';
                } else {
                    emit('success', preorderUuid.value);
                }
            } else {
                emit('success', preorderUuid.value);
            }
        }
    });
};

const handlePayment = async () => {
    if (!stripe.value || !cardElement.value) {
        return;
    }

    isProcessing.value = true;
    errorMessage.value = '';

    const { paymentIntent, error } = await stripe.value.confirmCardPayment(
        clientSecret.value,
        {
            payment_method: {
                card: cardElement.value,
                billing_details: { email: email.value },
            },
        },
    );

    if (error) {
        errorMessage.value = error.message ?? 'Payment failed.';
        isProcessing.value = false;
    } else if (paymentIntent.status === 'succeeded') {
        emit('success', preorderUuid.value);
    }
};
</script>

<template>
    <div class="fixed top-0 left-0 z-50 flex h-full w-full bg-black/70 p-6">
        <div
            class="mx-auto my-auto flex min-h-140 w-full flex-col rounded-2xl bg-white dark:bg-zinc-900 lg:w-160 shadow-xl overflow-hidden"
        >
            <div class="bg-t-accent/10 dark:bg-white/5 p-6 border-b border-black/10 dark:border-white/10">
                <div class="flex items-baseline justify-between">
                    <div class="text-sm text-black/70 dark:text-white/70">
                        {{ $t('configurator.checkout.reserve_price') }}
                    </div>
                    <div
                        class="text-xl font-semibold text-black dark:text-white"
                    >
                        {{ reservationPrice.toLocaleString('cs-CZ') }}&thinsp;Kč
                    </div>
                </div>
            </div>

            <div class="flex flex-1 flex-col p-6">
                <div v-if="step === 1" class="step-1">
                    <div class="">
                        <label for="mail" class="mb-2 block text-sm font-medium text-black dark:text-white">
                            {{ $t('configurator.modal_checkout.email_label') }}
                        </label>

                        <input
                            v-model="email"
                            id="mail"
                            class="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-zinc-800 px-4 py-3 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white transition-colors"
                            type="email"
                            placeholder="jiri.dozvedel@domena.cz"
                            :disabled="isProcessing"
                        />
                    </div>

                    <div class="pt-6 text-xs text-black/60 dark:text-white/60 leading-relaxed">
                        {{ $t('configurator.modal_checkout.email_desc') }}
                    </div>
                </div>

                <div v-if="step === 2" class="step-2">
                    <!-- Wallet Button Container -->
                    <div v-if="canPayWithWallet" class="mb-6">
                        <div id="wallet-button"></div>
                        <div
                            class="relative my-6 flex items-center justify-center"
                        >
                            <hr class="w-full border-black/10 dark:border-white/10" />
                            <span
                                class="absolute bg-white dark:bg-zinc-900 px-2 text-xs text-black/40 dark:text-white/40"
                                >{{ $t('configurator.modal_checkout.or_card') }}</span
                            >
                        </div>
                    </div>

                    <label class="mb-2 block text-sm font-medium text-black dark:text-white">{{ $t('configurator.modal_checkout.card_info') }}</label>
                    <div
                        id="card-element"
                        class="w-full rounded-xl border border-black/15 dark:border-white/15 bg-white dark:bg-zinc-800 px-4 py-4 text-black dark:text-white"
                    ></div>

                    <p v-if="errorMessage" class="mt-2 text-xs text-red-500 font-medium">
                        {{ errorMessage }}
                    </p>
                </div>

                <div class="mt-auto pt-6 border-t border-black/10 dark:border-white/10">
                    <div class="flex w-full justify-between pb-4">
                        <div
                            class="text-xs tracking-widest text-black/50 dark:text-white/50 uppercase"
                        >
                            {{ $t('configurator.title') }}
                        </div>

                        <div
                            class="text-xs tracking-widest text-black/50 dark:text-white/50 uppercase"
                        >
                            0{{ step }} / 02
                        </div>
                    </div>

                    <div class="flex gap-2">
                        <ButtonPrimary
                            class="w-full cursor-pointer"
                            @click="
                                step === 1 ? handleContinue() : handlePayment()
                            "
                            :disabled="isProcessing || !email"
                        >
                            {{
                                isProcessing
                                    ? $t('configurator.modal_checkout.processing')
                                    : step === 1
                                      ? $t('configurator.modal_checkout.continue')
                                      : $t('configurator.modal_checkout.pay', { amount: reservationPrice.toLocaleString('cs-CZ') })
                            }}
                        </ButtonPrimary>

                        <ButtonSecondary
                            @click="emit('close')"
                            class="cursor-pointer"
                        >
                            <Xmark class="h-5 w-5" />
                        </ButtonSecondary>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
