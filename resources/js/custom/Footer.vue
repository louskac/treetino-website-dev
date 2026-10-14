<template>
    <footer class="relative" :class="props.dark ? 'bg-zinc-950 text-white' : 'text-black'">
        <div
            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] sm:block sm:w-[500px] md:w-[calc(100%-140px)] md:max-w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            :class="props.dark ? 'border-r-white/10 border-l-white/10' : 'border-r-black/10 border-l-black/10'"
        ></div>

        <div
            class="relative mx-auto w-[calc(100%-72px)] max-w-[1400px] justify-between px-4 sm:px-6 sm:w-[500px] md:w-[calc(100%-140px)] md:max-w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="flex flex-col pt-16">
                <div class="w-full pb-6">
                    <div class="flex justify-between">
                        <div class="logo flex">
                            <LogoType class="fill-current" :class="props.dark ? 'text-white' : 'text-black'" />
                        </div>

                        <div class="socials my-auto flex gap-5" :class="props.dark ? 'text-white/70' : 'text-black/70'">
                            <a
                                href="https://instagram.com/treetino_corp"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Treetino on Instagram"
                                class="transition-colors"
                                :class="props.dark ? 'hover:text-white' : 'hover:text-black'"
                            >
                                <Instagram class="h-5 w-5" />
                            </a>
                            <a
                                href="https://linkedin.com/company/treetino"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Treetino on LinkedIn"
                                class="transition-colors"
                                :class="props.dark ? 'hover:text-white' : 'hover:text-black'"
                            >
                                <Linkedin class="h-5 w-5" />
                            </a>
                            <a
                                href="https://x.com/treetino_corp"
                                target="_blank"
                                rel="noreferrer"
                                aria-label="Treetino on X"
                                class="transition-colors"
                                :class="props.dark ? 'hover:text-white' : 'hover:text-black'"
                            >
                                <X class="h-5 w-5" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <div class="mb-12 pt-6">
                <div class="grid gap-12">
                    <div
                        class="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-3"
                    >
                        <div class="">
                            <div
                                class="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row"
                            >
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-t-blue/10 text-t-blue"
                                >
                                    <LinkIcon
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <h2
                                    class="my-auto text-xl font-medium"
                                    :class="props.dark ? 'text-white' : 'text-black'"
                                >
                                    {{ $t('common.footer.links') }}
                                </h2>
                            </div>

                            <div class="mt-6 flex flex-col gap-2">
                                <FooterLink :href="route('home')">
                                    {{ $t('common.nav.home') }}
                                </FooterLink>
                                <FooterLink :href="route('configurator')">{{
                                    $t('configurator.title')
                                }}</FooterLink>
                                <FooterLink
                                    :href="route('collaboration.index')"
                                    >{{
                                        $t('common.footer.grants')
                                    }}</FooterLink
                                >
                                <FooterLink
                                    :href="route('collaboration.index')"
                                    >{{
                                        $t('common.nav.collaboration')
                                    }}</FooterLink
                                >
                                <FooterLink :href="route('sales.index')">{{
                                    $t('common.nav.sales')
                                }}</FooterLink>
                                <FooterLink :href="route('media.index')">{{
                                    $t('common.nav.media')
                                }}</FooterLink>
                                <FooterLink :href="route('contact.index')">{{
                                    $t('common.nav.contact')
                                }}</FooterLink>
                                <FooterLink href="/media#pitchdeck">
                                    Pitch Deck
                                </FooterLink>
                            </div>
                        </div>

                        <div class="">
                            <div
                                class="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row"
                            >
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-t-blue/10 text-t-blue"
                                >
                                    <PeopleTag
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <h2
                                    class="my-auto text-xl font-medium"
                                    :class="props.dark ? 'text-white' : 'text-black'"
                                >
                                    {{ $t('common.footer.community') }}
                                </h2>
                            </div>

                            <div class="mt-6 flex flex-col gap-2">
                                <div
                                    class="w-fit cursor-not-allowed"
                                    :class="props.dark ? 'text-white/40' : 'text-black/50'"
                                >
                                    {{ $t('common.status.coming_soon') }}
                                </div>
                            </div>
                        </div>

                        <div class="">
                            <div
                                class="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row"
                            >
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-t-blue/10 text-t-blue"
                                >
                                    <GraduationCap
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <h2
                                    class="my-auto text-xl font-medium"
                                    :class="props.dark ? 'text-white' : 'text-black'"
                                >
                                    {{ $t('common.footer.legal') }}
                                </h2>
                            </div>

                            <div class="mt-6 flex flex-col gap-2">
                                <FooterLink :href="route('legal.tos')">
                                    {{ $t('common.footer.terms') }}
                                </FooterLink>

                                <FooterLink :href="route('legal.pp')">
                                    {{ $t('common.footer.privacy') }}
                                </FooterLink>

                                <FooterLink :href="route('legal.nda')">
                                    {{ $t('common.footer.nda') }}
                                </FooterLink>

                                <FooterLink :href="route('legal.mediation')">
                                    {{ $t('common.footer.mediation') }}
                                </FooterLink>

                                <div
                                    @click="openSettings"
                                    class="group relative w-fit cursor-pointer transition-colors duration-300"
                                    :class="props.dark ? 'text-white/70 hover:text-white' : 'text-black/70 hover:text-black'"
                                >
                                    <div class="relative">
                                        {{
                                            $t('common.footer.cookie_settings')
                                        }}
                                    </div>
                                    <div
                                        class="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-300 group-hover:w-full"
                                        :class="props.dark ? 'bg-white' : 'bg-black'"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Clean Official CzechInvest Grant Acknowledgment Banner (Clean Link to Collaboration Page) -->
                    <Link
                        :href="route('collaboration.index')"
                        class="group block border-y py-6 transition-colors"
                        :class="props.dark ? 'border-white/10 hover:bg-white/[0.02]' : 'border-black/10 hover:bg-black/[0.02]'"
                    >
                        <div
                            class="flex flex-col items-center justify-between gap-6 sm:flex-row"
                        >
                            <div
                                class="flex flex-col items-center gap-5 text-center sm:flex-row sm:text-left"
                            >
                                <img
                                    src="/partners/image.png"
                                    alt="Technologická inkubace & CzechInvest"
                                    class="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                                />
                                <p
                                    class="max-w-3xl text-xs leading-relaxed sm:text-sm"
                                    :class="props.dark ? 'text-white/75' : 'text-black/75'"
                                >
                                    {{
                                        $t('common.footer.grant_acknowledgment')
                                    }}
                                </p>
                            </div>
                            <div
                                class="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-t-blue group-hover:text-t-blue/80"
                            >
                                <span>{{
                                    $t('common.footer.grant_learn_more')
                                }}</span>
                                <ArrowRight
                                    class="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                                />
                            </div>
                        </div>
                    </Link>

                    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div
                            class="order-2 flex flex-col rounded-2xl bg-t-blue p-6 text-white shadow-xl lg:order-1"
                        >
                            <div
                                class="relative z-10 flex items-center justify-between"
                            >
                                <span
                                    class="text-xs font-semibold tracking-[0.2em] text-white/70 uppercase"
                                    >{{ $t('common.footer.company') }}</span
                                >
                                <span
                                    class="text-xs font-medium tracking-widest text-white/70"
                                >
                                    <Building
                                        class="h-4 w-4"
                                        stroke-width="3"
                                    />
                                </span>
                            </div>

                            <div class="mt-3 text-white">
                                <h2 class="text-3xl font-medium">
                                    Treetino Corp s.r.o.
                                </h2>

                                <p class="mt-1 text-white/80">IČO: 10800107</p>
                                <p class="mt-1 text-white/80">
                                    DIČ: CZ10800107
                                </p>

                                <p class="mt-2 text-white/80">
                                    Bílá - Vlčetín 62, <br />
                                    463 43 &mdash; Bílá - Vlčetín
                                </p>
                            </div>

                            <div class="mt-auto pt-6 text-xs text-white/70">
                                &copy; 2026, Treetino Corp s.r.o.,
                                {{ $t('common.footer.rights') }}<br />
                                Design & Development by
                                <a
                                    class="underline hover:text-white"
                                    target="_blank"
                                    href="https://baranowski.cz"
                                    >Baranowski & Collective</a
                                >
                            </div>
                        </div>

                        <div
                            class="order-1 rounded-2xl border p-6 shadow-xl lg:order-2"
                            :class="props.dark ? 'border-white/10 bg-zinc-900 text-white' : 'border-black/10 bg-white text-black'"
                        >
                            <div
                                class="relative z-10 flex items-center justify-between"
                            >
                                <span
                                    class="text-xs font-semibold tracking-[0.2em] uppercase"
                                    :class="props.dark ? 'text-white/60' : 'text-black/60'"
                                    >{{ $t('common.footer.newsletter') }}</span
                                >
                                <span
                                    class="text-xs font-medium tracking-widest"
                                    :class="props.dark ? 'text-white/60' : 'text-black/60'"
                                >
                                    <Mail class="h-4 w-4" stroke-width="3" />
                                </span>
                            </div>

                            <div class="mt-3">
                                <h2 class="text-3xl font-medium" :class="props.dark ? 'text-white' : 'text-black'">
                                    {{ $t('common.footer.get_updates') }}
                                </h2>

                                <p class="mt-1" :class="props.dark ? 'text-white/70' : 'text-black/70'">
                                    {{
                                        $t('common.footer.newsletter_subtitle')
                                    }}
                                </p>
                            </div>

                            <div class="my-5">
                                <div class="flex w-full items-stretch gap-2">
                                    <input
                                        class="min-w-0 flex-1 rounded-xl border px-4 py-3 focus:border-t-blue focus:outline-none"
                                        :class="props.dark ? 'border-white/10 bg-zinc-800 text-white placeholder-white/40' : 'border-black/10 bg-stone-100 text-black placeholder-black/40'"
                                        type="email"
                                        :placeholder="
                                            $t(
                                                'common.footer.email_placeholder',
                                            )
                                        "
                                    />

                                    <ButtonPrimary
                                        class="flex shrink-0 items-center justify-center px-6"
                                    >
                                        {{ $t('common.actions.send') }}
                                    </ButtonPrimary>
                                </div>
                            </div>

                            <div class="text-xs" :class="props.dark ? 'text-white/60' : 'text-black/60'">
                                <Link
                                    class="underline"
                                    :class="props.dark ? 'hover:text-white' : 'hover:text-black'"
                                    :href="route('legal.pp')"
                                    >{{ $t('common.footer.privacy') }}</Link
                                >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import {
    Instagram,
    Linkedin,
    Link as LinkIcon,
    GraduationCap,
    PeopleTag,
    X,
    Mail,
    Building,
} from '@iconoir/vue';
import { Link } from '@inertiajs/vue3';
import { ArrowRight } from 'lucide-vue-next';
import { showPreferences } from 'vanilla-cookieconsent';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import FooterLink from '@/custom/footer/FooterLink.vue';
import LogoType from '@/custom/LogoType.vue';

const props = withDefaults(
    defineProps<{
        dark?: boolean;
    }>(),
    {
        dark: false,
    },
);

const openSettings = () => {
    // This function will automatically find the active instance
    showPreferences();
};
</script>
