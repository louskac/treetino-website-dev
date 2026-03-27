<template>
    <footer class="relative">
        <div
            class="absolute left-1/2 h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-r-black/20 border-l-black/20 [mask-image:linear-gradient(to_bottom,black_0%,transparent_100%)] sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-r-white/20 dark:border-l-white/20"
        ></div>

        <div
            class="mx-auto w-full max-w-[1400px] justify-between px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
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
        </div>
    </footer>
</template>

<script setup lang="ts">
import { Instagram, Linkedin, X } from '@iconoir/vue';
import LogoType from '@/custom/LogoType.vue';
</script>
