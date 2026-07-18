<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
</script>

<template>
    <Head title="Terms & Conditions" />

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
                <div class="text-6xl">{{ $t('legal.tos.title') }}</div>

                <div class="pt-6 pb-12">
                    <div class="mb-4">Obchodní společnosti</div>

                    <div class="mb-4">
                        <b>Treetino corp s.r.o.,</b><br />
                        IČO: 10800107, DIČ: CZ10800107<br />
                        se sídlem Český Šternberk 9, 257 26<br />
                        zastoupená Dominikem Maškem, jednatelem<br />
                        (dále jen „Zhotovitel“)
                    </div>

                    <div class="mb-4">
                        <b>Kontakt:</b><br />
                        Tel.: 730 587 857<br />
                        E-mail: info@treetino.eu<br />
                        Adresa: Český Šternberk 9, 257 26
                    </div>

                    <div class="mb-4">

                    </div>
                </div>
            </div>
        </section>
    </DefaultLayout>
</template>
