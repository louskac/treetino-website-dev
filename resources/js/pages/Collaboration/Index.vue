<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>

<template>
    <Head :title="$t('collaboration.title')" />

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
                <div class="text-6xl">{{ $t('collaboration.title') }}</div>

                <div class="grid grid-cols-1 gap-6 pt-6 pb-12 md:grid-cols-2">
                    <div
                        class="flex flex-col rounded-2xl border bg-white p-6 shadow-xl"
                    >
                        <div class="pb-4 text-4xl">{{ $t('collaboration.grants.title') }}</div>

                        <div class="opacity-70">
                            <p class="mb-3">
                                {{ $t('collaboration.grant_help') }}
                            </p>

                            <p>
                                {{ $t('collaboration.grants.text') }}
                            </p>
                        </div>

                        <div class="mt-auto pt-6">
                            <ButtonPrimary
                                :href="route('contact.index')"
                                class="w-full text-center"
                            >
                                {{ $t('common.nav.contact') }}
                            </ButtonPrimary>
                        </div>
                    </div>

                    <div
                        class="flex flex-col rounded-2xl border bg-white p-6 shadow-xl"
                    >
                        <div class="pb-4 text-4xl">{{ $t('collaboration.engineering.title') }}</div>

                        <div class="opacity-70">
                            <p class="">
                                {{ $t('collaboration.engineering.text') }}
                            </p>
                        </div>

                        <div class="mt-auto pt-6">
                            <ButtonPrimary
                                :href="route('contact.index')"
                                class="w-full text-center"
                            >
                                {{ $t('common.nav.contact') }}
                            </ButtonPrimary>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>
