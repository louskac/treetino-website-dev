<template>
    <footer>
        <div
            class="mx-auto w-full max-w-[1200px] justify-between px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="flex flex-col">
                <div class="w-full py-6">
                    <div class="flex justify-between">
                        <div class="logo flex">
                            <LogoType
                                class="fill-current text-black dark:text-white"
                            />
                        </div>

                        <div class="socials flex gap-5 my-auto">
                            <Instagram class="h-5 w-5"/>
                            <Linkedin class="h-5 w-5"/>
                            <X class="h-5 w-5"/>
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
    X,
} from '@iconoir/vue';
import LogoType from '@/custom/LogoType.vue';
</script>
