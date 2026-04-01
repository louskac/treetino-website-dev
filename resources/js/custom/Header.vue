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
                        <Link href="#" class="text-sm text-white/80 transition-colors hover:text-white" @mouseenter="activeDropdown = 'products'">Produkty</Link>
                        <!--<Link href="#" class="text-sm text-white/80 transition-colors hover:text-white" @mouseenter="activeDropdown = null">Sdílení energie</Link>-->
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
                <Transition name="dropdown">
                    <div v-if="activeDropdown === 'products'" class="mt-4 hidden gap-6 xl:flex">
                        <div v-for="item in products" :key="item.name" class="flex flex-1 flex-col gap-2">
                            <div class="h-36 rounded-xl bg-white/10"></div>
                            <p class="text-sm font-medium text-white">{{ item.name }}</p>
                            <div class="flex gap-2">
                                <Link href="#" class="flex-1 rounded-lg border border-white/20 py-1.5 text-center text-xs text-white/80 transition-colors hover:text-white">Více informací</Link>
                                <Link href="#" class="flex-1 rounded-lg bg-white py-1.5 text-center text-xs font-medium text-black transition-opacity hover:opacity-80">Objednat</Link>
                            </div>
                        </div>
                    </div>
                </Transition>
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

const products = [
    { name: 'Strom V1' },
    { name: 'Strom V2' },
    { name: 'Větrná turbína' },
];

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

<style scoped>
.dropdown-enter-active,
.dropdown-leave-active {
    transition:
        max-height 0.35s ease,
        opacity 0.35s ease;
    overflow: hidden;
}
.dropdown-enter-from,
.dropdown-leave-to {
    max-height: 0;
    opacity: 0;
}
.dropdown-enter-to,
.dropdown-leave-from {
    max-height: 200px;
    opacity: 1;
}
</style>
