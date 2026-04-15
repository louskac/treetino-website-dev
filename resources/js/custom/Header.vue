<template>
    <header class="absolute z-50 w-full">
        <div
            class="mx-auto flex w-full max-w-[1400px] justify-between px-6 sm:px-0 pt-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div
                class="flex w-full flex-col rounded-2xl border border-white/20 bg-black/20 p-6 backdrop-blur-2xl transition-all duration-300"
                :class="{
                    'bg-white': activeDropdown === 'products',
                    'bg-black/20': activeDropdown !== 'products',
                }"
                @mouseleave="activeDropdown = null"
            >
                <div class="flex w-full justify-between">
                    <div class="logo my-auto flex gap-3 text-white">
                        <LogoType
                            class="fill-current transition-all duration-300"
                            :class="{
                                'text-black': activeDropdown === 'products',
                                'text-white': activeDropdown !== 'products',
                            }"
                        />
                    </div>

                    <nav class="my-auto hidden gap-6 xl:flex">
                        <Link
                            href="#"
                            class="text-sm transition-all duration-300"
                            :class="{
                                'text-black/80 hover:text-black':
                                    activeDropdown === 'products',
                                'text-white/80 hover:text-white':
                                    activeDropdown !== 'products',
                            }"
                            @mouseenter="activeDropdown = 'products'"
                            >Produkty</Link
                        >
                        <!--<Link href="#" class="text-sm text-white/80 transition-colors hover:text-white" @mouseenter="activeDropdown = null">Sdílení energie</Link>-->
                        <Link
                            href="#"
                            class="text-sm transition-all duration-300"
                            :class="{
                                'text-black/80 hover:text-black':
                                    activeDropdown === 'products',
                                'text-white/80 hover:text-white':
                                    activeDropdown !== 'products',
                            }"
                            @mouseenter="activeDropdown = null"
                            >Spolupráce</Link
                        >
                        <Link
                            href="#"
                            class="text-sm transition-all duration-300"
                            :class="{
                                'text-black/80 hover:text-black':
                                    activeDropdown === 'products',
                                'text-white/80 hover:text-white':
                                    activeDropdown !== 'products',
                            }"
                            @mouseenter="activeDropdown = null"
                            >Média</Link
                        >
                        <Link
                            href="#"
                            class="text-sm transition-all duration-300"
                            :class="{
                                'text-black/80 hover:text-black':
                                    activeDropdown === 'products',
                                'text-white/80 hover:text-white':
                                    activeDropdown !== 'products',
                            }"
                            @mouseenter="activeDropdown = null"
                            >Kontakty</Link
                        >
                    </nav>

                    <div class="flex gap-8">
                        <div class="my-auto flex gap-4">
<!--                            <div class="dark-switch my-auto flex text-white">-->
<!--                                <button-->
<!--                                    @click="toggleDark"-->
<!--                                    class="my-auto cursor-pointer p-1 transition-opacity hover:opacity-70"-->
<!--                                >-->
<!--                                    <SunLight-->
<!--                                        v-if="isDark"-->
<!--                                        class="h-4.5 w-4.5 transition-all duration-300"-->
<!--                                        :class="{-->
<!--                                            'text-black/80 hover:text-black':-->
<!--                                                activeDropdown === 'products',-->
<!--                                            'text-white/80 hover:text-white':-->
<!--                                                activeDropdown !== 'products',-->
<!--                                        }"-->
<!--                                        stroke-width="2"-->
<!--                                    />-->
<!--                                    <HalfMoon-->
<!--                                        v-else-->
<!--                                        class="h-4.5 w-4.5 transition-all duration-300"-->
<!--                                        :class="{-->
<!--                                            'text-black/80 hover:text-black':-->
<!--                                                activeDropdown === 'products',-->
<!--                                            'text-white/80 hover:text-white':-->
<!--                                                activeDropdown !== 'products',-->
<!--                                        }"-->
<!--                                        stroke-width="2"-->
<!--                                    />-->
<!--                                </button>-->
<!--                            </div>-->

                            <div class="my-auto xl:hidden">
                                <Menu
                                    class="h-4.5 w-4.5 text-white"
                                    stroke-width="2"
                                />
                            </div>
                        </div>

                        <div class="my-auto hidden text-white md:block">
                            <Link href="/configurator">
                                <ButtonWhite
                                    variant="slim"
                                    :class="{
                                        'border shadow-xl':
                                            activeDropdown === 'products',
                                        'border border-white':
                                            activeDropdown !== 'products',
                                    }"
                                    >Preorder Now</ButtonWhite
                                >
                            </Link>
                        </div>
                    </div>
                </div>

                <!-- Products dropdown-->
                <Transition name="dropdown">
                    <div
                        v-if="activeDropdown === 'products'"
                        class="hidden gap-6 xl:flex"
                    >
                        <div
                            v-for="item in products"
                            :key="item.id"
                            class="flex flex-1 flex-col gap-2 pt-6"
                        >
                            <div class="h-36 rounded-xl bg-black/10"></div>
                            <p class="mt-1 text-2xl font-medium text-black">
                                {{ item.label }}
                            </p>
                            <div class="flex gap-2">
                                <Link
                                    href="#"
                                    class="flex-1 rounded-lg py-1.5 text-center text-xs transition-all duration-300"
                                    :class="{
                                        'border text-black/80 hover:text-white':
                                            activeDropdown === 'products',
                                        'border border-transparent text-white/80 hover:text-white':
                                            activeDropdown !== 'products',
                                    }"
                                    >Více informací</Link
                                >
                                <Link
                                    :href="`/configurator?product=${item.id}`"
                                    class="flex-1 rounded-lg py-1.5 text-center text-xs font-medium transition-all duration-300 hover:opacity-80"
                                    :class="{
                                        'border border-transparent bg-black text-white':
                                            activeDropdown === 'products',
                                        'border border-transparent bg-white text-black':
                                            activeDropdown !== 'products',
                                    }"
                                    >Objednat</Link
                                >
                            </div>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { SunLight, HalfMoon, Menu } from '@iconoir/vue';
import { Link } from '@inertiajs/vue3';
import { ref, onMounted } from 'vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';
import LogoType from '@/custom/LogoType.vue';
import { PRODUCTS } from '@/types/products';

const activeDropdown = ref<string | null>(null);

const products = PRODUCTS;

// 1. Track if we are currently dark
const isDark = ref(false);

onMounted(() => {
    // Check the actual HTML class on load
    isDark.value = document.documentElement.classList.contains('dark');
});

// const toggleDark = () => {
//     isDark.value = !isDark.value;
//
//     // 2. Toggle the class
//     document.documentElement.classList.toggle('dark');
//
//     // 3. Save it so it persists on refresh
//     localStorage.setItem('appearance', isDark.value ? 'dark' : 'light');
// };
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
    max-height: 250px; /* Increased from 200px */
    opacity: 1;
}
</style>
