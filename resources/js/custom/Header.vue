<template>
    <header class="fixed z-50 w-full">
        <div
            class="mx-auto flex w-full max-w-[1400px] justify-between px-6 pt-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div
                class="flex w-full flex-col rounded-2xl border bg-black/20 p-6 backdrop-blur-2xl transition-all duration-550"
                :class="[
                    activeDropdown === 'products'
                        ? 'border-transparent bg-white shadow-2xl'
                        : isScrolled
                          ? 'bg-white/80 shadow-lg'
                          : 'border-white/20 bg-black/20',
                ]"
                @mouseleave="activeDropdown = null"
            >
                <div class="flex w-full justify-between">
                    <div class="logo my-auto flex gap-3 text-white">
                        <Link :href="route('home')">
                            <LogoType
                                class="fill-current transition-all duration-550"
                                :class="{
                                    'text-black':
                                        activeDropdown === 'products' ||
                                        isScrolled,
                                    'text-white':
                                        activeDropdown !== 'products' &&
                                        !isScrolled,
                                }"
                            />
                        </Link>
                    </div>

                    <nav class="my-auto hidden gap-6 xl:flex">
                        <Link
                            href="#"
                            class="text-sm transition-all duration-550"
                            :class="{
                                'text-black/80 hover:text-black':
                                    activeDropdown === 'products' || isScrolled,
                                'text-white/80 hover:text-white':
                                    activeDropdown !== 'products' &&
                                    !isScrolled,
                            }"
                            @mouseenter="activeDropdown = 'products'"
                            >Produkty</Link
                        >
                        <!--<Link href="#" class="text-sm text-white/80 transition-colors hover:text-white" @mouseenter="activeDropdown = null">Sdílení energie</Link>-->
                        <Link
                            :href="route('collaboration.index')"
                            class="text-sm transition-all duration-550"
                            :class="{
                                'text-black/80 hover:text-black':
                                    activeDropdown === 'products' || isScrolled,
                                'text-white/80 hover:text-white':
                                    activeDropdown !== 'products' &&
                                    !isScrolled,
                            }"
                            @mouseenter="activeDropdown = null"
                            >Spolupráce</Link
                        >
                        <Link
                            :href="route('media.index')"
                            class="text-sm transition-all duration-550"
                            :class="{
                                'text-black/80 hover:text-black':
                                    activeDropdown === 'products' || isScrolled,
                                'text-white/80 hover:text-white':
                                    activeDropdown !== 'products' &&
                                    !isScrolled,
                            }"
                            @mouseenter="activeDropdown = null"
                            >Média</Link
                        >
                        <Link
                            :href="route('contact.index')"
                            class="text-sm transition-all duration-550"
                            :class="{
                                'text-black/80 hover:text-black':
                                    activeDropdown === 'products' || isScrolled,
                                'text-white/80 hover:text-white':
                                    activeDropdown !== 'products' &&
                                    !isScrolled,
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
                            <ButtonPrimary
                                :href="route('configurator')"
                                variant="slim"
                                >Preorder Now</ButtonPrimary
                            >
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
                            <div
                                class="flex aspect-square flex-col rounded-xl bg-black/10"
                            >
                                <div class="mt-auto p-6">
                                    <p
                                        class="mb-3 text-2xl font-medium text-black"
                                    >
                                        {{ item.label }}
                                    </p>
                                    <div class="flex gap-2">
                                        <Link
                                            href="#"
                                            class="flex-1 rounded-lg py-1.5 text-center text-xs transition-all duration-550"
                                            :class="{
                                                'border bg-white text-black/80 hover:text-black/60':
                                                    activeDropdown ===
                                                    'products',
                                                'border border-transparent bg-white text-white/80 hover:text-white':
                                                    activeDropdown !==
                                                    'products',
                                            }"
                                            >Více informací</Link
                                        >
                                        <Link
                                            :href="`/configurator?product=${item.id}`"
                                            class="flex-1 rounded-lg py-1.5 text-center text-xs font-medium transition-all duration-550 hover:opacity-80"
                                            :class="{
                                                'border border-transparent bg-black text-white':
                                                    activeDropdown ===
                                                    'products',
                                                'border border-transparent bg-white text-black':
                                                    activeDropdown !==
                                                    'products',
                                            }"
                                            >Objednat</Link
                                        >
                                    </div>
                                </div>
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
import { ref, onMounted, onUnmounted } from 'vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';
import LogoType from '@/custom/LogoType.vue';
import { PRODUCTS } from '@/types/products';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import { route } from 'ziggy-js';

const props = defineProps({
    scroll: {
        type: Boolean,
        default: true,
    },
});

const activeDropdown = ref<string | null>(null);

const isScrolled = ref(!props.scroll);

const products = PRODUCTS;

const handleScroll = () => {
    if (!props.scroll) {
        isScrolled.value = true;
        return;
    }

    // Change state after 600px
    isScrolled.value = window.scrollY > 600;
};

onMounted(() => {
    if (props.scroll) {
        window.addEventListener('scroll', handleScroll);
        // Run once on mount to check current position
        handleScroll();
    } else {
        // If scroll is false, ensure it's set to true
        isScrolled.value = true;
    }
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});

// // 1. Track if we are currently dark
// const isDark = ref(false);

// onMounted(() => {
//     // Check the actual HTML class on load
//     isDark.value = document.documentElement.classList.contains('dark');
// });

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
        max-height 0.55s ease,
        opacity 0.55s ease;
    overflow: hidden;
}
.dropdown-enter-from,
.dropdown-leave-to {
    max-height: 0;
    opacity: 0;
}
.dropdown-enter-to,
.dropdown-leave-from {
    max-height: 1000px;
    opacity: 1;
}
</style>
