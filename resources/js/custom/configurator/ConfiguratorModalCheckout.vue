<script setup lang="ts">
import axios from 'axios';
import { ref, nextTick } from 'vue';
import { route } from 'ziggy-js';
import { loadStripe } from '@stripe/stripe-js';

import { Xmark } from '@iconoir/vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';

const emit = defineEmits(['close', 'success']);

// State logic
const step = ref(1);
const email = ref('');
const isProcessing = ref(false);
const errorMessage = ref('');

// Stripe refs
const stripe = ref(null);
const elements = ref(null);
const cardElement = ref(null);
const clientSecret = ref('');

const handleContinue = async () => {
    if (!email.value) return;

    isProcessing.value = true;
    errorMessage.value = '';

    try {
        const response = await axios.post(route('checkout-initiate'), {
            email: email.value,
            type: '1',
        });

        console.log('Backend Response:', response.data);
        clientSecret.value = response.data.client_secret;

        // Move to Step 2
        step.value = 2;

        // Wait for DOM to update so Stripe can find the #card-element div
        await nextTick();
        await initStripe();
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message || 'Something went wrong.';
    } finally {
        isProcessing.value = false;
    }
};

/**
 * Step 2: Initialize Stripe Elements
 */
const initStripe = async () => {
    stripe.value = await loadStripe(import.meta.env.VITE_STRIPE_KEY);
    elements.value = stripe.value.elements();

    const style = {
        base: {
            color: '#000000',
            fontFamily: 'Inter, ui-sans-serif, system-ui',
            fontSize: '16px',
            '::placeholder': { color: '#9ca3af' },
        },
    };

    cardElement.value = elements.value.create('card', {
        style,
        hidePostalCode: true,
    });

    cardElement.value.mount('#card-element');
};

/**
 * Step 3: Confirm Payment
 */
const handlePayment = async () => {
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
        errorMessage.value = error.message;
        isProcessing.value = false;
    } else if (paymentIntent.status === 'succeeded') {
        // Success!
        emit('success', paymentIntent);
    }
};
</script>

<template>
    <div class="fixed top-0 left-0 flex h-full w-full bg-black/70 p-6">
        <div
            class="mx-auto my-auto flex min-h-140 w-full flex-col rounded-2xl bg-white lg:w-160"
        >
            <!--            <div class="flex justify-between border-b p-6">-->
            <!--                <div class="opacity-70">Finish Your Order</div>-->
            <!--                <div class="my-auto"></div>-->
            <!--            </div>-->

            <div class="bg-t-accent/10 p-6">
                <div class="flex items-baseline justify-between">
                    <div class="text-sm text-black/70 dark:text-white/50">
                        Reserve Price
                    </div>
                    <div
                        class="text-xl font-semibold text-black dark:text-white"
                    >
                        12 000 Kč
                    </div>
                </div>
            </div>

            <div class="flex flex-1 flex-col p-6">
                <div v-if="step === 1" class="step-1">
                    <div class="">
                        <label for="mail" class="mb-2 block text-sm">
                            E-mail
                        </label>

                        <input
                            v-model="email"
                            id="mail"
                            class="w-full rounded-xl border bg-white px-4 py-3 text-black"
                            type="email"
                            placeholder="jiri.dozvedel@domena.cz"
                            :disabled="isProcessing"
                        />
                    </div>

                    <div class="pt-6 opacity-70">
                        We need your e-mail address to process your desired
                        configuration for our team. Your configuration and
                        invoice will be delivered to you.
                    </div>
                </div>

                <div v-if="step === 2" class="step-2">
                    <label class="mb-2 block text-sm">Payment Details</label>
                    <div
                        id="card-element"
                        class="w-full rounded-xl border bg-white px-4 py-4 text-black"
                    ></div>
                    <p v-if="errorMessage" class="mt-2 text-xs text-red-500">
                        {{ errorMessage }}
                    </p>
                </div>

                <div class="mt-auto pt-6">
                    <div class="flex w-full justify-between pb-6">
                        <div
                            class="text-xs tracking-widest text-black/50 uppercase"
                        >
                            Checkout
                        </div>

                        <div
                            class="text-xs tracking-widest text-black/50 uppercase"
                        >
                            Step 1 of 2
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
                                    ? 'Processing...'
                                    : step === 1
                                      ? 'Continue'
                                      : 'Pay 12 000 Kč'
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
