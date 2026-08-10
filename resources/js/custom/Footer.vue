<template>
    <footer class="relative text-black">
        <div
            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/10 border-l-black/10 [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        ></div>

        <div
            class="relative mx-auto w-full max-w-[1400px] justify-between px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="flex flex-col pt-16">
                <div class="w-full pb-6">
                    <div class="flex justify-between">
                        <div class="logo flex">
                            <LogoType
                                class="fill-current text-black"
                            />
                        </div>

                        <div class="socials my-auto flex gap-5 text-black/70">
                            <Instagram class="h-5 w-5 transition-colors hover:text-black" />
                            <Linkedin class="h-5 w-5 transition-colors hover:text-black" />
                            <X class="h-5 w-5 transition-colors hover:text-black" />
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

                                <h2 class="my-auto text-xl font-medium text-black">Links</h2>
                            </div>

                            <div class="mt-6 flex flex-col gap-2">
                                <FooterLink :href="route('home')">
                                    {{ $t('common.nav.home') }}
                                </FooterLink>
                                <FooterLink :href="route('configurator')">{{
                                    $t('configurator.title')
                                }}</FooterLink>
                                <FooterLink :href="route('collaboration.index')"
                                    >Government Grants</FooterLink
                                >
                                <FooterLink
                                    :href="route('collaboration.index')"
                                    >{{
                                        $t('common.nav.collaboration')
                                    }}</FooterLink
                                >
                                <FooterLink :href="route('media.index')">{{
                                    $t('common.nav.media')
                                }}</FooterLink>
                                <FooterLink :href="route('media.index')">{{
                                    $t('common.nav.contact')
                                }}</FooterLink>
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

                                <h2 class="my-auto text-xl font-medium text-black">Community</h2>
                            </div>

                            <div class="mt-6 flex flex-col gap-2">
                                <div class="w-fit cursor-not-allowed text-black/50">
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

                                <h2 class="my-auto text-xl font-medium text-black">Legal</h2>
                            </div>

                            <div class="mt-6 flex flex-col gap-2">
                                <FooterLink :href="route('legal.tos')">
                                    Terms & Conditions
                                </FooterLink>

                                <FooterLink :href="route('legal.pp')">
                                    Privacy Policy
                                </FooterLink>

                                <div
                                    @click="openSettings"
                                    class="group relative w-fit cursor-pointer text-black/70 transition-colors duration-300 hover:text-black"
                                >
                                    <div class="relative">Cookie Settings</div>
                                    <div
                                        class="absolute bottom-0 left-0 h-[1px] w-0 bg-black transition-all duration-300 group-hover:w-full"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                                <h2 class="text-3xl font-medium">Treetino Corp s.r.o.</h2>

                                <p class="mt-1 text-white/80">IČO: 10800107</p>
                                <p class="mt-1 text-white/80">DIČ: CZ10800107</p>

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
                            class="order-1 rounded-2xl border border-black/10 bg-white p-6 text-black shadow-xl lg:order-2"
                        >
                            <div
                                class="relative z-10 flex items-center justify-between"
                            >
                                <span
                                    class="text-xs font-semibold tracking-[0.2em] text-black/60 uppercase"
                                    >Newsletter</span
                                >
                                <span
                                    class="text-xs font-medium tracking-widest text-black/60"
                                >
                                    <Mail class="h-4 w-4" stroke-width="3" />
                                </span>
                            </div>

                            <div class="mt-3">
                                <h2 class="text-3xl font-medium text-black">Get Updates</h2>

                                <p class="mt-1 text-black/70">
                                    Stay in the loop and get the latest info
                                    about new product, features and community
                                    development.
                                </p>
                            </div>

                            <div class="my-5">
                                <div class="flex w-full items-stretch gap-2">
                                    <input
                                        class="min-w-0 flex-1 rounded-xl border border-black/10 bg-stone-100 px-4 py-3 text-black placeholder-black/40 focus:border-t-blue focus:outline-none"
                                        type="email"
                                        placeholder="jiri.dozvedel@domena.cz"
                                    />

                                    <ButtonPrimary
                                        class="flex shrink-0 items-center justify-center px-6"
                                    >
                                        Send
                                    </ButtonPrimary>
                                </div>
                            </div>

                            <div class="text-xs text-black/60">
                                By submitting the form, you agree to our
                                <Link class="underline hover:text-black" :href="route('legal.pp')">Privacy Policy</Link>
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
import { showPreferences } from 'vanilla-cookieconsent';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import FooterLink from '@/custom/footer/FooterLink.vue';
import LogoType from '@/custom/LogoType.vue';

const openSettings = () => {
    // This function will automatically find the active instance
    showPreferences();
};
</script>
