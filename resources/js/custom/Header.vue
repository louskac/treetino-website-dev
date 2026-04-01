<template>
    <header class="absolute z-50 w-full">
        <div
            class="mx-auto flex w-full max-w-[1400px] justify-between p-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div
                class="flex w-full flex-col rounded-2xl border border-white/20 bg-black/20 p-6 backdrop-blur-2xl"
                @mouseleave="activeDropdown = null"
            >
                <div class="flex w-full justify-between">
                    <div class="logo my-auto flex gap-3 text-white">
                        <LogoType class="fill-current text-white dark:text-white" />
                    </div>

                    <nav class="my-auto hidden gap-6 xl:flex">
                        <span @mouseenter="activeDropdown = 'products'">
                            <Link href="#" class="text-sm text-white/80 transition-colors hover:text-white">Produkty</Link>
                        </span>
                        <Link href="#" class="text-sm text-white/80 transition-colors hover:text-white" @mouseenter="activeDropdown = null">Sdílení energie</Link>
                        <Link href="#" class="text-sm text-white/80 transition-colors hover:text-white" @mouseenter="activeDropdown = null">Spolupráce</Link>
                        <Link href="#" class="text-sm text-white/80 transition-colors hover:text-white" @mouseenter="activeDropdown = null">Média</Link>
                        <Link href="#" class="text-sm text-white/80 transition-colors hover:text-white" @mouseenter="activeDropdown = null">Kontakty</Link>
                    </nav>

                    <div class="flex gap-8">
                        <div class="my-auto flex gap-4">
                            <div class="dark-switch my-auto text-white flex">
                                <button
                                    @click="toggleDark"
                                    class="cursor-pointer p-1 transition-opacity hover:opacity-70 my-auto"
                                >
                                    <SunLight
                                        v-if="isDark"
                                        class="h-4.5 w-4.5 text-white"
                                        stroke-width="2"
                                    />
                                    <HalfMoon
                                        v-else
                                        class="h-4.5 w-4.5 text-white"
                                        stroke-width="2"
                                    />
                                </button>
                            </div>

                            <div class="my-auto xl:hidden">
                                <Menu
                                    class="h-4.5 w-4.5 text-white"
                                    stroke-width="2"
                                />
                            </div>
                        </div>

                        <div class="my-auto hidden text-white md:block">
                            <Link href="/configurator">
                                <ButtonWhite variant="slim">Preorder Now</ButtonWhite>
                            </Link>
                        </div>
                    </div>
                </div>

                <!-- Products dropdown-->
                <div v-if="activeDropdown === 'products'" class="mt-4 hidden gap-4 xl:flex">
                    <div class="h-32 flex-1 rounded-xl bg-white/10"></div>
                    <div class="h-32 flex-1 rounded-xl bg-white/10"></div>
                    <div class="h-32 flex-1 rounded-xl bg-white/10"></div>
                </div>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { SunLight, HalfMoon, Menu } from '@iconoir/vue';
import { ref, onMounted } from 'vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';
import LogoType from '@/custom/LogoType.vue';

const activeDropdown = ref<string | null>(null);

// 1. Track if we are currently dark
const isDark = ref(false);

onMounted(() => {
    // Check the actual HTML class on load
    isDark.value = document.documentElement.classList.contains('dark');
});

const toggleDark = () => {
    isDark.value = !isDark.value;

    // 2. Toggle the class
    document.documentElement.classList.toggle('dark');

    // 3. Save it so it persists on refresh
    localStorage.setItem('appearance', isDark.value ? 'dark' : 'light');
};
</script>
