<template>
    <footer class="relative">
        <div
            class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
        ></div>

        <div
            class="relative mx-auto w-full max-w-[1400px] justify-between px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="flex flex-col">
                <div class="w-full py-6">
                    <div class="flex justify-between">
                        <div class="logo flex">
                            <LogoType
                                class="fill-current text-black dark:text-white"
                            />
                        </div>

                        <div class="socials my-auto flex gap-5">
                            <Instagram class="h-5 w-5" />
                            <Linkedin class="h-5 w-5" />
                            <X class="h-5 w-5" />
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
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                                >
                                    <Link
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <h2 class="my-auto text-xl">Links</h2>
                            </div>

                            <div class="mt-6 flex flex-col gap-2">
                                <FooterLink :href="route('home')">
                                    Home
                                </FooterLink>
                                <FooterLink :href="route('configurator')"
                                    >Configurator</FooterLink
                                >
                                <FooterLink :href="route('collaboration.index')"
                                    >Government Grants</FooterLink
                                >
                                <FooterLink :href="route('collaboration.index')"
                                    >Collaboration</FooterLink
                                >
                                <FooterLink :href="route('media.index')"
                                    >Media</FooterLink
                                >
                                <FooterLink :href="route('media.index')"
                                    >Contact</FooterLink
                                >
                            </div>
                        </div>

                        <div class="">
                            <div
                                class="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row"
                            >
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                                >
                                    <PeopleTag
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <h2 class="my-auto text-xl">Community</h2>
                            </div>

                            <div class="mt-6 flex flex-col gap-2">
                                <div class="w-fit cursor-not-allowed">
                                    Coming Soon
                                </div>
                            </div>
                        </div>

                        <div class="">
                            <div
                                class="flex flex-col gap-4 sm:flex-row md:flex-col lg:flex-row"
                            >
                                <div
                                    class="flex aspect-square h-12 w-12 rounded-xl bg-primary/5 text-t-blue dark:text-primary"
                                >
                                    <GraduationCap
                                        stroke-width="1.5"
                                        class="mx-auto my-auto h-6 w-6"
                                    />
                                </div>

                                <h2 class="my-auto text-xl">Legal</h2>
                            </div>

                            <div class="mt-6 flex flex-col gap-2">
                                <FooterLink :href="route('home')">
                                    Terms & Conditions
                                </FooterLink>

                                <FooterLink :href="route('home')">
                                    Privacy Policy
                                </FooterLink>

                                <div
                                    @click="openSettings"
                                    class="group relative w-fit cursor-pointer opacity-70 transition-all duration-300 hover:opacity-100"
                                >
                                    <div class="relative">
                                        Cookie Settings
                                    </div>
                                    <div
                                        class="absolute w-0 border-b transition-all duration-300 group-hover:w-full group-hover:border-b group-hover:border-b-black"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
                        <div
                            class="order-2 flex flex-col rounded-2xl border-transparent bg-t-blue p-6 shadow-xl lg:order-1"
                        >
                            <div
                                class="relative z-10 flex items-center justify-between"
                            >
                                <span
                                    class="text-xs font-semibold tracking-[0.2em] text-white/60 uppercase"
                                    >Company</span
                                >
                                <span
                                    class="text-xs font-medium tracking-widest text-white/60"
                                >
                                    <Building
                                        class="h-4 w-4"
                                        stroke-width="3"
                                    />
                                </span>
                            </div>

                            <div class="mt-3 text-white">
                                <h2 class="text-3xl">Treetino Corp s.r.o.</h2>

                                <p class="mt-1 opacity-70">IČO: 10800107</p>

                                <p class="mt-2 opacity-70">
                                    Český Šternberk 9, <br />
                                    257 26 &mdash; Český Šternberk
                                </p>
                            </div>

                            <div class="mt-auto text-xs text-white opacity-70">
                                &copy; 2026, Treetino Corp s.r.o., All Rights
                                Reserved<br />
                                Design & Development by
                                <a
                                    class="underline"
                                    target="_blank"
                                    href="https://baranowski.cz"
                                    >Baranowski & Collective</a
                                >
                            </div>
                        </div>

                        <div
                            class="order-1 rounded-2xl border bg-white p-6 shadow-xl lg:order-2"
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
                                <h2 class="text-3xl">Get Updates</h2>

                                <p class="mt-1 opacity-70">
                                    Stay in the loop and get the latest info
                                    about new product, features and community
                                    development.
                                </p>
                            </div>

                            <div class="my-5">
                                <div class="flex w-full items-stretch gap-2">
                                    <input
                                        class="min-w-0 flex-1 rounded-xl border bg-white px-4 py-3 text-black"
                                        type="email"
                                        placeholder="jiri.dozvedel@domena.cz"
                                    />

                                    <ButtonPrimary
                                        class="flex shrink-0 items-center justify-center p-0"
                                    >
                                        Send
                                    </ButtonPrimary>
                                </div>
                            </div>

                            <div class="text-xs opacity-70">
                                By submitting the form, you agree to our Terms &
                                Conditions and Privacy Policy
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
    Link,
    GraduationCap,
    PeopleTag,
    X,
    Mail,
    Building,
} from '@iconoir/vue';
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
