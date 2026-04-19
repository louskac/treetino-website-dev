<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

import { Whatsapp } from '@iconoir/vue';
import { ref } from 'vue';

// Contact Form
const mail = ref('');
const message = ref('');
</script>

<template>
    <Head title="Contact" />

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
                <div class="text-6xl">Contact</div>

                <div class="grid grid-cols-1 gap-6 pt-6 pb-12 md:grid-cols-2">
                    <div class="relative flex flex-col">
                        <div class="relative my-auto w-full">
                            <div class="pb-4 text-4xl">Write to our team</div>
                            <div class="block opacity-70 2xl:w-3/4">
                                <p>
                                    Feel free to ask about our products and
                                    services or about government grant
                                    assistance
                                </p>
                            </div>
                        </div>
                    </div>

                    <div
                        class="flex flex-col rounded-2xl border bg-white p-6 shadow-xl"
                    >
                        <div class="grid gap-3">
                            <div class="">
                                <label
                                    for="name"
                                    class="mb-2 block text-sm opacity-70"
                                >
                                    Name
                                </label>
                                <input
                                    class="w-full rounded-xl border bg-white px-4 py-3 text-black"
                                    type="text"
                                    id="name"
                                    v-model="mail"
                                    placeholder="Jiří Dozvěděl"
                                />
                            </div>

                            <div class="">
                                <label
                                    for="email"
                                    class="mb-2 block text-sm opacity-70"
                                >
                                    E-Mail
                                </label>
                                <input
                                    class="w-full rounded-xl border bg-white px-4 py-3 text-black"
                                    type="email"
                                    id="email"
                                    v-model="mail"
                                    placeholder="jiri.dozvedel@domena.cz"
                                />
                            </div>

                            <div class="">
                                <label
                                    for="message"
                                    class="mb-2 block text-sm opacity-70"
                                >
                                    Message
                                </label>
                                <textarea
                                    class="w-full rounded-xl border bg-white px-4 py-3 text-black"
                                    id="message"
                                    v-model="message"
                                    placeholder="Leave your message here"
                                />
                            </div>
                        </div>

                        <div class="mt-auto grid gap-2 pt-6">
                            <ButtonPrimary class="w-full text-center">
                                Send
                            </ButtonPrimary>

                            <ButtonSecondary class="flex w-full">
                                <div class="mx-auto flex w-fit gap-2">
                                    <div class="my-auto">
                                        <Whatsapp class="h-5 w-5" />
                                    </div>
                                    <div class="my-auto">
                                        Chat with WhatsApp
                                    </div>
                                </div>
                            </ButtonSecondary>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>
