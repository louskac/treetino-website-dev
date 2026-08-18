<template>
    <header class="fixed z-50 w-full">
        <div
            class="mx-auto flex w-full max-w-[1400px] justify-between px-6 pt-6 sm:w-[500px] sm:px-0 md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div
                class="flex w-full flex-col rounded-2xl border p-6 backdrop-blur-2xl transition-all duration-550"
                :class="[
                    activeDropdown === 'products' || mobileMenuOpen
                        ? 'border-transparent bg-white shadow-2xl text-black'
                        : isScrolled
                          ? 'border-black/10 bg-white/90 shadow-lg text-black'
                          : 'border-white/20 bg-black/20 text-white',
                ]"
                @mouseleave="activeDropdown = null"
            >
                <div class="flex w-full justify-between">
                    <div class="logo my-auto flex gap-3">
                        <Link :href="route('home')">
                            <LogoType
                                class="fill-current transition-colors duration-350"
                                :class="headerIsInverted ? 'text-black' : 'text-white'"
                            />
                        </Link>
                    </div>

                    <nav class="my-auto hidden gap-6 xl:flex">
                        <Link
                            href="#"
                            class="text-sm font-medium transition-colors"
                            :class="headerIsInverted ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'"
                            @mouseenter="activeDropdown = 'products'"
                            >{{ $t('common.nav.products') }}</Link
                        >
                        <Link
                            :href="route('collaboration.index')"
                            class="text-sm font-medium transition-colors"
                            :class="headerIsInverted ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'"
                            @mouseenter="activeDropdown = null"
                            >{{ $t('common.nav.collaboration') }}</Link
                        >
                        <Link
                            :href="route('sales.index')"
                            class="text-sm font-medium transition-colors"
                            :class="headerIsInverted ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'"
                            @mouseenter="activeDropdown = null"
                            >{{ $t('common.nav.sales') }}</Link
                        >
                        <Link
                            :href="route('media.index')"
                            class="text-sm font-medium transition-colors"
                            :class="headerIsInverted ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'"
                            @mouseenter="activeDropdown = null"
                            >{{ $t('common.nav.media') }}</Link
                        >
                        <Link
                            :href="route('contact.index')"
                            class="text-sm font-medium transition-colors"
                            :class="headerIsInverted ? 'text-black/80 hover:text-black' : 'text-white/80 hover:text-white'"
                            @mouseenter="activeDropdown = null"
                            >{{ $t('common.nav.contact') }}</Link
                        >
                    </nav>

                    <div class="flex gap-4">
                        <div class="my-auto flex gap-4">
                            <LocaleSwitcher :inverted="headerIsInverted" />

                            <div class="my-auto xl:hidden">
                                <button
                                    type="button"
                                    class="-m-1 cursor-pointer p-1"
                                    :class="headerIsInverted ? 'text-black' : 'text-white'"
                                    @click="mobileMenuOpen = !mobileMenuOpen"
                                >
                                    <Xmark
                                        v-if="mobileMenuOpen"
                                        stroke-width="2"
                                        class="h-5 w-5 text-black"
                                    />
                                    <Menu
                                        v-else
                                        stroke-width="2"
                                        class="h-5 w-5"
                                    />
                                </button>
                            </div>
                        </div>

                        <div class="my-auto hidden md:block">
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
                            <ProductCard
                                :product="item"
                                @click="activeDropdown = null"
                            />
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
                        <nav class="flex flex-col gap-1">
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
                        <div class="mt-4">
                            <p
                                class="mb-2 px-3 text-xs font-semibold tracking-[0.2em] text-black/40 uppercase"
                            >
                                {{ $t('common.nav.products') }}
                            </p>
                            <div class="flex flex-col gap-1">
                                <div
                                    v-for="item in products"
                                    :key="item.id"
                                    class="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-black/5"
                                >
                                    <span
                                        class="text-sm font-medium text-black"
                                        >{{ item.label }}</span
                                    >
                                    <div class="flex gap-2">
                                        <a
                                            :href="`/products/${item.detail}`"
                                            class="rounded-lg border border-black/10 px-3 py-1 text-xs text-black/80 transition-colors hover:text-black"
                                            @click="mobileMenuOpen = false"
                                            >{{
                                                $t('common.actions.info')
                                            }}</a
                                        >
                                        <a
                                            :href="`/configurator/${item.id}`"
                                            class="rounded-lg bg-t-blue px-3 py-1 text-xs font-medium text-white transition-opacity hover:opacity-80"
                                            @click="mobileMenuOpen = false"
                                            >{{
                                                $t('common.actions.preorder')
                                            }}</a
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
                            >
                                {{ $t('common.actions.preorder') }}
                            </ButtonPrimary>
                        </div>
                    </div>
                </Transition>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import { computed, onMounted, onUnmounted, ref } from 'vue';

import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import LocaleSwitcher from '@/custom/LocaleSwitcher.vue';
import LogoType from '@/custom/LogoType.vue';
import ProductCard from '@/custom/ProductCard.vue';
import { PRODUCTS } from '@/types/products';
import { Menu, Xmark } from '@iconoir/vue';

const products = PRODUCTS;

const isScrolled = ref(false);
const activeDropdown = ref<'products' | null>(null);
const mobileMenuOpen = ref(false);

const headerIsInverted = computed(() => {
    return (
        activeDropdown.value === 'products' ||
        isScrolled.value ||
        mobileMenuOpen.value
    );
});

const handleScroll = () => {
    isScrolled.value = window.scrollY > 50;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
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
