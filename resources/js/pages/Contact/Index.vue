<script setup lang="ts">
import { CheckCircle, Refresh } from '@iconoir/vue';
import { Head, Link } from '@inertiajs/vue3';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { ref } from 'vue';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

// Contact Form
const name = ref('');
const mail = ref('');
const message = ref('');

const formSending = ref(false);
const formSent = ref(false);

const formErrors = ref<Record<string, string[]>>({});

async function formProcess() {
    try {
        formSending.value = true;

        const response = await axios({
            url: route('contact.store'),
            method: 'POST',
            data: {
                name: name.value,
                mail: mail.value,
                message: message.value,
            },
        });

        formSent.value = true;
        formSending.value = false;
        console.log(response.data);
    } catch (error) {
        const requestError = error as AxiosError<{
            errors: Record<string, string[]>;
        }>;

        if (requestError.response) {
            formErrors.value = requestError.response.data.errors;
        }

        formSending.value = false;
        formSent.value = false;
        console.error('Process failed:', formErrors.value);
    }
}
</script>

<template>
    <Head :title="$t('contact.title')" />

    <DefaultLayout :scroll="false" class="relative">
        <div class="absolute h-90 w-full bg-blue-50">
            <div
                class="absolute bottom-0 h-30 w-full bg-linear-to-b from-transparent to-white"
            ></div>
        </div>

        <div class="buffer h-60 pb-12"></div>

        <section class="page relative">
            <div
                class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 [mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
            ></div>

            <div
                class="relative mx-auto h-full w-full max-w-[1400px] px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <div class="text-6xl">{{ $t('contact.title') }}</div>

                <div class="grid grid-cols-1 gap-6 pt-6 pb-12 md:grid-cols-2">
                    <div class="relative flex flex-col">
                        <div class="relative my-auto w-full">
                            <div class="pb-4 text-4xl">
                                {{ $t('contact.title') }}
                            </div>
                            <div class="block opacity-70 2xl:w-3/4">
                                <p class="mb-3">
                                    {{ $t('contact.lead') }}
                                </p>

                                <p>
                                    {{ $t('contact.response_time') }}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="relative flex flex-col overflow-clip rounded-2xl border bg-white p-6 shadow-xl"
                    >
                        <div class="relative grid gap-3">
                            <div class="">
                                <label
                                    for="name"
                                    class="mb-2 block text-sm opacity-70"
                                >
                                    {{ $t('contact.form.name') }}
                                </label>
                                <input
                                    class="w-full rounded-xl border bg-white px-4 py-3 text-black"
                                    type="text"
                                    id="name"
                                    v-model="name"
                                    placeholder="Jiří Dozvěděl"
                                />
                                <div
                                    v-if="formErrors.name"
                                    class="pt-1.5 text-sm text-red-500 opacity-70"
                                >
                                    {{ formErrors.name[0] }}
                                </div>
                            </div>

                            <div class="">
                                <label
                                    for="email"
                                    class="mb-2 block text-sm opacity-70"
                                >
                                    {{ $t('contact.form.email') }}
                                </label>
                                <input
                                    class="w-full rounded-xl border bg-white px-4 py-3 text-black"
                                    type="email"
                                    id="email"
                                    v-model="mail"
                                    placeholder="jiri.dozvedel@domena.cz"
                                />
                                <div
                                    v-if="formErrors.mail"
                                    class="pt-1.5 text-sm text-red-500 opacity-70"
                                >
                                    {{ formErrors.mail[0] }}
                                </div>
                            </div>

                            <div class="">
                                <label
                                    for="message"
                                    class="mb-2 block text-sm opacity-70"
                                >
                                    {{ $t('contact.form.message') }}
                                </label>
                                <textarea
                                    class="w-full rounded-xl border bg-white px-4 py-3 text-black"
                                    id="message"
                                    v-model="message"
                                    :placeholder="$t('contact.form.message_placeholder')"
                                />
                                <div
                                    v-if="formErrors.message"
                                    class="pt-1.5 text-sm text-red-500 opacity-70"
                                >
                                    {{ formErrors.message[0] }}
                                </div>
                            </div>
                        </div>

                        <div class="relative mt-auto">
                            <div class="grid gap-2 pt-6">
                                <ButtonPrimary
                                    class="w-full cursor-pointer text-center"
                                    @click="formProcess"
                                >
                                    {{ $t('contact.form.submit') }}
                                </ButtonPrimary>
                            </div>

                            <div class="mt-4 text-xs opacity-70">
                                <Link
                                    class="underline"
                                    :href="route('legal.pp')"
                                    >{{ $t('common.footer.privacy') }}</Link
                                >
                            </div>
                        </div>

                        <Transition>
                            <div
                                v-if="formSending || formSent"
                                class="absolute top-0 left-0 flex h-full w-full bg-white p-6"
                            >
                                <div
                                    class="mx-auto my-auto flex w-full flex-col gap-2"
                                >
                                    <div class="relative h-8 text-center">
                                        <Transition>
                                            <Refresh
                                                v-if="formSending"
                                                class="absolute left-1/2 h-8 w-8 -translate-x-1/2 animate-spin"
                                            />
                                        </Transition>

                                        <Transition>
                                            <CheckCircle
                                                v-if="formSent"
                                                class="absolute left-1/2 h-8 w-8 -translate-x-1/2 text-green-600"
                                            />
                                        </Transition>
                                    </div>
                                    <div class="relative w-full">
                                        <Transition>
                                            <div
                                                v-if="formSending"
                                                class="absolute left-1/2 -translate-x-1/2 text-center text-sm opacity-70"
                                            >
                                                {{ $t('contact.form.sending') }}
                                            </div>
                                        </Transition>

                                        <Transition>
                                            <div
                                                v-if="formSent"
                                                class="absolute left-1/2 -translate-x-1/2 text-center text-sm opacity-70"
                                            >
                                                {{ $t('contact.form.success') }}
                                            </div>
                                        </Transition>
                                    </div>
                                </div>
                            </div>
                        </Transition>
                    </div>
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>

<style>
.v-enter-active,
.v-leave-active {
    transition: opacity 200ms ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
