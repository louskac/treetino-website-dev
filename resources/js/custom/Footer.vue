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
                <div
                    class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5"
                >
                    <div class="">
                        <div class="flex gap-4">
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
                            <FooterLink :href="route('configurator')"
                                >Government Grants</FooterLink
                            >
                        </div>
                    </div>

                    <div class="">
                        <div class="flex gap-4">
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
                        <div class="flex gap-4">
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
                        </div>
                    </div>

                    <div class="col-span-1 xl:col-span-2">
                        <div class="rounded-2xl bg-white p-6 border">
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
                                <div class="flex w-full gap-2">
                                    <!-- Added flex-1 so it grows to fill all available space -->
                                    <input
                                        class="flex-1 rounded-xl bg-white py-3 px-4 text-black border"
                                        type="email"
                                        placeholder="jiri.dozvedel@domena.cz"
                                    />

                                    <ButtonPrimary>Send</ButtonPrimary>
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
} from '@iconoir/vue';
import { route } from 'ziggy-js';
import FooterLink from '@/custom/footer/FooterLink.vue';
import LogoType from '@/custom/LogoType.vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';
import ButtonSecondary from '@/custom/ButtonSecondary.vue';
</script>
