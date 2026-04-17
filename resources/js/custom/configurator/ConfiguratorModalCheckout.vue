<script setup lang="ts">
import { Xmark } from '@iconoir/vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';

const emit = defineEmits(['close']);
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
                <div class="">
                    <label for="mail" class="mb-2 block text-sm">
                        E-mail
                    </label>

                    <input
                        id="mail"
                        class="w-full rounded-xl border bg-white px-4 py-3 text-black"
                        type="email"
                        placeholder="jiri.dozvedel@domena.cz"
                    />
                </div>

                <div class="pt-6 opacity-70">
                    We need your e-mail address to process your desired
                    configuration for our team. Your configuration and invoice
                    will be delivered to you.
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
                        <ButtonPrimary class="w-full">Continue</ButtonPrimary>
                        <ButtonSecondary @click="emit('close')" class="curpoin">
                            <Xmark class="h-5 w-5" />
                        </ButtonSecondary>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
