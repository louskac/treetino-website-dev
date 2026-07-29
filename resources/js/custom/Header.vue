<template>
    <header class="fixed z-50 w-full">
        <div
            class="mx-auto flex w-full max-w-[1400px] justify-between px-6 pt-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div
                class="flex w-full flex-col rounded-2xl border bg-black/20 p-6 backdrop-blur-2xl transition-all duration-550"
                :class="[
                    activeDropdown === 'products' || mobileMenuOpen
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
                                        isScrolled ||
                                        mobileMenuOpen,
                                    'text-white':
                                        activeDropdown !== 'products' &&
                                        !isScrolled &&
                                        !mobileMenuOpen,
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
                            >{{ $t('common.nav.products') }}</Link
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
                            >{{ $t('common.nav.collaboration') }}</Link
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
                            >{{ $t('common.nav.media') }}</Link
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
                            >{{ $t('common.nav.contact') }}</Link
                        >
                    </nav>

                    <div class="flex gap-4">
                        <div class="my-auto flex gap-4">
                            <LocaleSwitcher :inverted="headerIsInverted" />
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
                                <button
                                    class="-m-1 cursor-pointer p-1"
                                    @click="mobileMenuOpen = !mobileMenuOpen"
                                >
                                    <Xmark
                                        v-if="mobileMenuOpen"
                                        stroke-width="2"
                                        class="h-4.5 w-4.5 text-black"
                                    />
                                    <Menu
                                        v-else
                                        stroke-width="2"
                                        class="h-4.5 w-4.5"
                                        :class="{
                                            'text-black':
                                                activeDropdown === 'products' ||
                                                isScrolled,
                                            'text-white':
                                                activeDropdown !== 'products' &&
                                                !isScrolled,
                                        }"
                                    />
                                </button>
                            </div>
                        </div>

                        <div class="my-auto hidden text-white md:block">
                            <ButtonPrimary
                                :href="route('configurator')"
                                variant="slim"
                                >{{
                                    $t('common.actions.preorder')
                                }}</ButtonPrimary
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
                                class="relative flex aspect-4/5 flex-col overflow-clip rounded-xl bg-black/10"
                            >
                                <div
                                    class="absolute top-0 left-0 h-full w-full"
                                >
                                    <img
                                        class="h-full w-full"
                                        :src="item.image"
                                        alt=""
                                    />
                                </div>

                                <div
                                    class="absolute bottom-0 left-0 h-50 w-full rounded-b-2xl bg-linear-to-b from-transparent to-black to-50%"
                                ></div>

                                <div class="relative mt-auto p-6">
                                    <p
                                        class="mb-3 text-2xl font-medium text-white"
                                    >
                                        {{ item.label }}
                                    </p>
                                    <div class="flex gap-2">
                                        <Link
                                            :href="`/products/${item.detail}`"
                                            class="flex-1 rounded-lg py-1.5 text-center text-xs transition-all duration-550"
                                            :class="{
                                                'border bg-white text-black/80 hover:text-black/60':
                                                    activeDropdown ===
                                                    'products',
                                                'border border-transparent bg-white text-white/80 hover:text-white':
                                                    activeDropdown !==
                                                    'products',
                                            }"
                                            >{{
                                                $t('common.actions.info')
                                            }}</Link
                                        >
                                        <Link
                                            :href="`/configurator/${item.id}`"
                                            class="flex-1 rounded-lg py-1.5 text-center text-xs font-medium transition-all duration-550 hover:opacity-80"
                                            :class="{
                                                'border border-transparent bg-t-blue text-white':
                                                    activeDropdown ===
                                                    'products',
                                                'border border-transparent bg-white text-t-blue':
                                                    activeDropdown !==
                                                    'products',
                                            }"
                                            >{{
                                                $t('common.actions.preorder')
                                            }}</Link
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Transition>

                <!-- Mobile menu -->
                <Transition
                    enter-active-class="transition-all duration-300 ease-out"
                    leave-active-class="transition-all duration-200 ease-in"
                    enter-from-class="opacity-0 -translate-y-2"
                    leave-to-class="opacity-0 -translate-y-2"
                >
                    <div
                        v-if="mobileMenuOpen"
                        class="mt-6 border-t border-black/10 pt-6 xl:hidden"
                    >
                        <!-- Nav links -->
                        <nav class="flex flex-col">
                            <Link
                                :href="route('collaboration.index')"
                                class="rounded-xl px-3 py-3 text-sm font-medium text-black/80 transition-colors hover:bg-black/5 hover:text-black"
                                @click="mobileMenuOpen = false"
                                >{{ $t('common.nav.collaboration') }}</Link
                            >
                            <Link
                                :href="route('media.index')"
                                class="rounded-xl px-3 py-3 text-sm font-medium text-black/80 transition-colors hover:bg-black/5 hover:text-black"
                                @click="mobileMenuOpen = false"
                                >{{ $t('common.nav.media') }}</Link
                            >
                            <Link
                                :href="route('contact.index')"
                                class="rounded-xl px-3 py-3 text-sm font-medium text-black/80 transition-colors hover:bg-black/5 hover:text-black"
                                @click="mobileMenuOpen = false"
                                >{{ $t('common.nav.contact') }}</Link
                            >
                        </nav>

                        <!-- Products -->
                        <div class="mt-2">
                            <p
                                class="mb-1 px-3 text-xs font-semibold tracking-[0.2em] text-black/40 uppercase"
                            >
                                {{ $t('common.nav.products') }}
                            </p>
                            <div class="flex flex-col">
                                <div
                                    v-for="item in products"
                                    :key="item.id"
                                    class="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-black/5"
                                >
                                    <span
                                        class="text-sm font-medium text-black/80"
                                        >{{ item.label }}</span
                                    >
                                    <div class="flex gap-2">
                                        <Link
                                            :href="`/products/${item.detail}`"
                                            class="rounded-lg border border-black/20 px-3 py-1 text-xs text-black/70 transition-colors hover:text-black"
                                            @click="mobileMenuOpen = false"
                                            >{{
                                                $t('common.actions.configure')
                                            }}</Link
                                        >
                                        <Link
                                            :href="`/configurator?product=${item.id}`"
                                            class="rounded-lg bg-t-blue px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80"
                                            @click="mobileMenuOpen = false"
                                            >{{
                                                $t('common.actions.preorder')
                                            }}</Link
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- CTA -->
                        <div class="mt-6">
                            <ButtonPrimary
                                :href="route('configurator')"
                                class="w-full text-center"
                                @click="mobileMenuOpen = false"
                                >{{
                                    $t('common.actions.preorder')
                                }}</ButtonPrimary
                            >
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { SunLight, HalfMoon, Menu, Xmark } from '@iconoir/vue';
import { Link } from '@inertiajs/vue3';
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';
import LocaleSwitcher from '@/custom/LocaleSwitcher.vue';
import LogoType from '@/custom/LogoType.vue';
import { PRODUCTS } from '@/types/products';

const props = defineProps({
    scroll: {
        type: Boolean,
        default: true,
    },
});

const activeDropdown = ref<string | null>(null);
const mobileMenuOpen = ref(false);

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

// Close mobile menu exactly once when crossing the xl breakpoint (1280px)
const xlQuery = window.matchMedia('(min-width: 1280px)');
const handleBreakpoint = (e: MediaQueryListEvent) => {
    if (e.matches) {
        mobileMenuOpen.value = false;
    }
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

    xlQuery.addEventListener('change', handleBreakpoint);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
    xlQuery.removeEventListener('change', handleBreakpoint);
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

const headerIsInverted = computed(() => {
    return (
        activeDropdown.value === 'products' ||
        isScrolled.value ||
        mobileMenuOpen.value
    );
});
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
