<script setup lang="ts">
import { CheckCircle, Refresh } from '@iconoir/vue';
import { Head, Link } from '@inertiajs/vue3';
import axios from 'axios';
import type { AxiosError } from 'axios';
import { ref } from 'vue';
import { route } from 'ziggy-js';
import { Mail, MapPin, Clock, Send } from 'lucide-vue-next';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import HomeCtaGeneric from '@/custom/home/HomeCtaGeneric.vue';

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
        formErrors.value = {};

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

        if (requestError.response && requestError.response.data?.errors) {
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

    <DefaultLayout :inverted="true">
        <div class="relative overflow-hidden bg-white text-black selection:bg-t-blue selection:text-white pt-36 sm:pt-44">
            <!-- Ambient Boundary Lines Matching Site Layout -->
            <div
                class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/10 border-l-black/10 pointer-events-none sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            ></div>

            <main class="relative mx-auto max-w-[1400px] px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]">
                <!-- Hero Header -->
                <div class="pb-16 sm:pb-20 border-b border-black/10">
                    <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                        {{ $t('contact.tag') }}
                    </span>
                    <h1 class="mt-3 text-4xl font-medium tracking-tight text-black sm:text-5xl lg:text-6xl">
                        {{ $t('contact.title') }}
                    </h1>
                    <p class="mt-4 max-w-3xl text-lg sm:text-xl text-black/70 leading-relaxed">
                        {{ $t('contact.lead') }}
                    </p>
                </div>

                <!-- Contact Details & Form Section (Split Editorial Grid) -->
                <section class="py-20 lg:py-28">
                    <div class="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-16">
                        <!-- Left Column: Company & Direct Channels (Vertical Accent Blocks) -->
                        <div class="lg:col-span-5 flex flex-col justify-between space-y-10">
                            <div class="space-y-8">
                                <div class="border-l-2 border-t-blue pl-6">
                                    <div class="flex items-center gap-3 text-t-blue mb-2">
                                        <MapPin class="h-5 w-5" />
                                        <span class="text-xs font-semibold uppercase tracking-wider">{{ $t('contact.headquarters_tag') }}</span>
                                    </div>
                                    <h3 class="text-xl font-medium text-black">Treetino Corp s.r.o.</h3>
                                    <p class="mt-2 text-sm sm:text-base text-black/70 leading-relaxed">
                                        Bílá – Vlčetín 62<br />
                                        463 43 Bílá – Vlčetín<br />
                                        Česká republika
                                    </p>
                                    <p class="mt-2 text-xs text-black/50">
                                        IČO: 10800107 • DIČ: CZ10800107
                                    </p>
                                </div>

                                <div class="border-l-2 border-black/10 pl-6">
                                    <div class="flex items-center gap-3 text-t-blue mb-2">
                                        <Mail class="h-5 w-5" />
                                        <span class="text-xs font-semibold uppercase tracking-wider">{{ $t('contact.email_tag') }}</span>
                                    </div>
                                    <a
                                        href="mailto:info@treetino.com"
                                        class="text-xl font-medium text-black hover:text-t-blue transition-colors"
                                    >
                                        info@treetino.com
                                    </a>
                                    <p class="mt-1 text-sm text-black/70">
                                        {{ $t('contact.email_desc') }}
                                    </p>
                                </div>

                                <div class="border-l-2 border-black/10 pl-6">
                                    <div class="flex items-center gap-3 text-t-blue mb-2">
                                        <Clock class="h-5 w-5" />
                                        <span class="text-xs font-semibold uppercase tracking-wider">{{ $t('contact.response_tag') }}</span>
                                    </div>
                                    <p class="text-sm sm:text-base text-black/70 leading-relaxed">
                                        {{ $t('contact.response_time') }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Right Column: Clean Minimalist Contact Form -->
                        <div class="lg:col-span-7">
                            <div class="relative rounded-3xl border border-black/10 bg-zinc-50/50 p-8 sm:p-10 shadow-xs">
                                <div class="relative grid gap-6">
                                    <div>
                                        <label
                                            for="name"
                                            class="mb-2 block text-xs font-semibold uppercase tracking-wider text-black/70"
                                        >
                                            {{ $t('contact.form.name') }}
                                        </label>
                                        <input
                                            class="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-black placeholder:text-black/35 focus:border-t-blue focus:ring-2 focus:ring-t-blue/20 focus:outline-none transition-all"
                                            type="text"
                                            id="name"
                                            v-model="name"
                                            :placeholder="$t('contact.form.name_placeholder')"
                                        />
                                        <div
                                            v-if="formErrors.name"
                                            class="pt-1.5 text-xs text-red-500 font-medium"
                                        >
                                            {{ formErrors.name[0] }}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            for="email"
                                            class="mb-2 block text-xs font-semibold uppercase tracking-wider text-black/70"
                                        >
                                            {{ $t('contact.form.email') }}
                                        </label>
                                        <input
                                            class="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-black placeholder:text-black/35 focus:border-t-blue focus:ring-2 focus:ring-t-blue/20 focus:outline-none transition-all"
                                            type="email"
                                            id="email"
                                            v-model="mail"
                                            :placeholder="$t('contact.form.email_placeholder')"
                                        />
                                        <div
                                            v-if="formErrors.mail"
                                            class="pt-1.5 text-xs text-red-500 font-medium"
                                        >
                                            {{ formErrors.mail[0] }}
                                        </div>
                                    </div>

                                    <div>
                                        <label
                                            for="message"
                                            class="mb-2 block text-xs font-semibold uppercase tracking-wider text-black/70"
                                        >
                                            {{ $t('contact.form.message') }}
                                        </label>
                                        <textarea
                                            rows="5"
                                            class="w-full rounded-xl border border-black/15 bg-white px-4 py-3.5 text-black placeholder:text-black/35 focus:border-t-blue focus:ring-2 focus:ring-t-blue/20 focus:outline-none transition-all resize-y"
                                            id="message"
                                            v-model="message"
                                            :placeholder="$t('contact.form.message_placeholder')"
                                        />
                                        <div
                                            v-if="formErrors.message"
                                            class="pt-1.5 text-xs text-red-500 font-medium"
                                        >
                                            {{ formErrors.message[0] }}
                                        </div>
                                    </div>

                                    <div class="pt-2">
                                        <ButtonPrimary
                                            class="w-full cursor-pointer text-center py-4"
                                            @click="formProcess"
                                        >
                                            <div class="flex items-center justify-center gap-2">
                                                <Send class="h-4 w-4" />
                                                <span>{{ $t('contact.form.submit') }}</span>
                                            </div>
                                        </ButtonPrimary>
                                    </div>

                                    <div class="text-xs text-black/50 text-center">
                                        {{ $t('contact.privacy_consent') }}
                                        <Link
                                            class="underline hover:text-black ml-1 text-black/70"
                                            :href="route('legal.pp')"
                                        >
                                            {{ $t('contact.privacy_link') }}
                                        </Link>.
                                    </div>
                                </div>

                                <!-- Sending / Success Overlay -->
                                <Transition>
                                    <div
                                        v-if="formSending || formSent"
                                        class="absolute inset-0 flex items-center justify-center rounded-3xl bg-white/95 backdrop-blur-sm p-8 text-black z-20"
                                    >
                                        <div class="text-center space-y-3">
                                            <Refresh
                                                v-if="formSending"
                                                class="mx-auto h-10 w-10 animate-spin text-t-blue"
                                            />
                                            <CheckCircle
                                                v-if="formSent"
                                                class="mx-auto h-12 w-12 text-green-600"
                                            />
                                            <div class="text-lg font-medium text-black">
                                                {{ formSending ? $t('contact.form.sending') : $t('contact.form.success') }}
                                            </div>
                                        </div>
                                    </div>
                                </Transition>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Team & Founders Section -->
                <section class="py-20 lg:py-28 border-t border-black/10">
                    <div class="mb-14">
                        <span class="text-xs font-semibold tracking-[0.2em] text-t-blue uppercase">
                            {{ $t('contact.team_tag') }}
                        </span>
                        <h2 class="mt-3 text-3xl font-medium tracking-tight text-black sm:text-4xl lg:text-5xl">
                            {{ $t('contact.team_title') }}
                        </h2>
                        <p class="mt-4 max-w-3xl text-base sm:text-lg text-black/70 leading-relaxed">
                            {{ $t('contact.team_lead') }}
                        </p>
                    </div>

                    <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        <!-- Left: Team Photo & Credentials (6 Cols) -->
                        <div class="lg:col-span-5 space-y-6">
                            <div class="group relative overflow-hidden rounded-3xl border border-black/10 bg-black shadow-2xl">
                                <div class="aspect-4/3 overflow-hidden">
                                    <img
                                        src="/img/team/founders-leaf.jpg"
                                        alt="Treetino Founders Dominik Mašek & Jakub Lustyk"
                                        class="h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                                    />
                                </div>
                                <div class="absolute inset-0 bg-linear-to-t from-black/85 via-black/20 to-transparent pointer-events-none"></div>
                                <div class="absolute bottom-0 inset-x-0 p-6 text-white text-xs leading-relaxed opacity-95">
                                    <p>{{ $t('contact.team_caption') }}</p>
                                </div>
                            </div>

                            <!-- Quote & Badges Block -->
                            <div class="rounded-2xl border border-black/10 bg-zinc-50 p-6 space-y-4">
                                <p class="text-xs sm:text-sm font-medium italic text-black/80 leading-relaxed">
                                    {{ $t('contact.team_quote') }}
                                </p>
                                <div class="flex flex-wrap items-center gap-2 pt-3 border-t border-black/10">
                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                                        ✓ CzechInvest Inkubace
                                    </span>
                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-t-blue border border-sky-200">
                                        ✓ Patent EP 4 664 750
                                    </span>
                                    <span class="inline-flex items-center gap-1.5 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-black/70 border border-black/10">
                                        {{ $t('contact.badge_rnd') }}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <!-- Right: Founders & Key Team Profiles (7 Cols) -->
                        <div class="lg:col-span-7 space-y-8">
                            <!-- Founder: Dominik Mašek -->
                            <div class="border-l-2 border-t-blue pl-6">
                                <div class="flex items-center gap-2.5">
                                    <h3 class="text-xl sm:text-2xl font-bold text-black">{{ $t('contact.team_dominik_name') }}</h3>
                                    <span class="rounded-full bg-t-blue/10 px-2.5 py-0.5 text-xs font-semibold text-t-blue">
                                        {{ $t('contact.team_dominik_role') }}
                                    </span>
                                </div>
                                <p class="mt-2 text-xs sm:text-sm text-black/75 leading-relaxed">
                                    {{ $t('contact.team_dominik_desc') }}
                                </p>
                            </div>

                            <!-- Founder: Jakub Lustyk -->
                            <div class="border-l-2 border-t-blue pl-6">
                                <div class="flex items-center gap-2.5">
                                    <h3 class="text-xl sm:text-2xl font-bold text-black">{{ $t('contact.team_jakub_name') }}</h3>
                                    <span class="rounded-full bg-t-blue/10 px-2.5 py-0.5 text-xs font-semibold text-t-blue">
                                        {{ $t('contact.team_jakub_role') }}
                                    </span>
                                </div>
                                <p class="mt-2 text-xs sm:text-sm text-black/75 leading-relaxed">
                                    {{ $t('contact.team_jakub_desc') }}
                                </p>
                            </div>

                            <!-- Key Team: Radim Novotný -->
                            <div class="border-l-2 border-black/20 pl-6">
                                <div class="flex items-center gap-2.5">
                                    <h3 class="text-lg sm:text-xl font-bold text-black">{{ $t('contact.team_radim_name') }}</h3>
                                    <span class="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-black/70 border border-black/10">
                                        {{ $t('contact.team_radim_role') }}
                                    </span>
                                </div>
                                <p class="mt-2 text-xs sm:text-sm text-black/75 leading-relaxed">
                                    {{ $t('contact.team_radim_desc') }}
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <!-- Final CTA Banner -->
            <HomeCtaGeneric />
        </div>
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
