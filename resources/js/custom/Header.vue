<template>
    <header class="fixed z-50 w-full">
        <div
            class="mx-auto flex w-[calc(100%-72px)] max-w-[1400px] justify-between pt-3 sm:pt-6 sm:w-[500px] md:w-[calc(100%-140px)] md:max-w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div
                class="flex w-full flex-col rounded-2xl border px-4 py-2.5 sm:p-6 backdrop-blur-2xl transition-all duration-550"
                :class="[
                    props.dark
                        ? mobileMenuOpen
                            ? 'border-white/15 bg-zinc-950/95 text-white shadow-2xl'
                            : activeDropdown === 'products'
                              ? 'border-white/15 bg-zinc-900 text-white shadow-2xl'
                              : isScrolled || !props.scroll || props.inverted
                                ? 'border-white/10 bg-zinc-950/80 text-white shadow-2xl'
                                : 'border-white/20 bg-black/20 text-white'
                        : activeDropdown === 'products' || mobileMenuOpen
                          ? 'border-transparent bg-white text-black shadow-2xl'
                          : isScrolled || !props.scroll || props.inverted
                            ? 'border-black/10 bg-white/80 text-black shadow-lg'
                            : 'border-white/20 bg-black/20 text-white',
                ]"
                @mouseleave="activeDropdown = null"
            >
                <div class="flex w-full justify-between">
                    <div class="logo my-auto flex gap-3">
                        <Link :href="route('home')">
                            <LogoType
                                class="fill-current transition-colors duration-350"
                                :class="
                                    headerIsInverted
                                        ? 'text-black'
                                        : 'text-white'
                                "
                            />
                        </Link>
                    </div>

                    <nav class="my-auto hidden gap-6 xl:flex">
                        <Link
                            href="#"
                            class="text-sm font-medium transition-colors"
                            :class="
                                headerIsInverted
                                    ? 'text-black/80 hover:text-black'
                                    : 'text-white/80 hover:text-white'
                            "
                            @mouseenter="activeDropdown = 'products'"
                            >{{ $t('common.nav.products') }}</Link
                        >
                        <Link
                            :href="route('collaboration.index')"
                            class="text-sm font-medium transition-colors"
                            :class="
                                headerIsInverted
                                    ? 'text-black/80 hover:text-black'
                                    : 'text-white/80 hover:text-white'
                            "
                            @mouseenter="activeDropdown = null"
                            >{{ $t('common.nav.collaboration') }}</Link
                        >
                        <Link
                            :href="route('sales.index')"
                            class="text-sm font-medium transition-colors"
                            :class="
                                headerIsInverted
                                    ? 'text-black/80 hover:text-black'
                                    : 'text-white/80 hover:text-white'
                            "
                            @mouseenter="activeDropdown = null"
                            >{{ $t('common.nav.sales') }}</Link
                        >
                        <Link
                            :href="route('media.index')"
                            class="text-sm font-medium transition-colors"
                            :class="
                                headerIsInverted
                                    ? 'text-black/80 hover:text-black'
                                    : 'text-white/80 hover:text-white'
                            "
                            @mouseenter="activeDropdown = null"
                            >{{ $t('common.nav.media') }}</Link
                        >
                        <Link
                            :href="route('contact.index')"
                            class="text-sm font-medium transition-colors"
                            :class="
                                headerIsInverted
                                    ? 'text-black/80 hover:text-black'
                                    : 'text-white/80 hover:text-white'
                            "
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
                                    :class="
                                        headerIsInverted
                                            ? 'text-black'
                                            : 'text-white'
                                    "
                                    @click="mobileMenuOpen = !mobileMenuOpen"
                                >
                                    <Xmark
                                        v-if="mobileMenuOpen"
                                        stroke-width="2"
                                        class="h-5 w-5"
                                        :class="props.dark ? 'text-white' : 'text-black'"
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
                        class="mt-4 border-t pt-4 sm:mt-6 sm:pt-6 xl:hidden"
                        :class="props.dark ? 'border-white/10' : 'border-black/10'"
                    >
                        <!-- Products Section (First in desktop order) -->
                        <div class="mb-4">
                            <p
                                class="mb-2 px-3 text-xs font-semibold tracking-[0.2em] uppercase"
                                :class="props.dark ? 'text-white/40' : 'text-black/40'"
                            >
                                {{ $t('common.nav.products') }}
                            </p>
                            <div class="flex flex-col gap-1">
                                <div
                                    v-for="item in products"
                                    :key="item.id"
                                    class="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors"
                                    :class="props.dark ? 'hover:bg-white/5' : 'hover:bg-black/5'"
                                >
                                    <span
                                        class="text-sm font-medium"
                                        :class="props.dark ? 'text-white' : 'text-black'"
                                        >{{
                                            $t(item.labelKey, item.label)
                                        }}</span
                                    >
                                    <div class="flex gap-2">
                                        <Link
                                            :href="`/products/${item.detail}`"
                                            class="rounded-lg border px-3 py-1 text-xs font-medium shadow-2xs transition"
                                            :class="props.dark ? 'border-white/20 bg-white/10 text-white hover:bg-white/15' : 'border-black/15 bg-white text-black/80 hover:border-black/30 hover:bg-black/5'"
                                            @click="mobileMenuOpen = false"
                                            >{{
                                                $t('common.actions.info')
                                            }}</Link
                                        >
                                        <Link
                                            :href="`/configurator/${item.id}`"
                                            class="rounded-lg bg-t-blue px-3 py-1 text-xs font-medium text-white shadow-2xs transition hover:bg-t-blue/90"
                                            @click="mobileMenuOpen = false"
                                            >{{
                                                $t('common.actions.preorder')
                                            }}</Link
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Divider -->
                        <div class="my-3 border-t" :class="props.dark ? 'border-white/10' : 'border-black/10'"></div>

                        <!-- Nav links in exact desktop order -->
                        <nav class="flex flex-col gap-1">
                            <Link
                                :href="route('collaboration.index')"
                                class="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                                :class="props.dark ? 'text-white/80 hover:bg-white/5 hover:text-white' : 'text-black/80 hover:bg-black/5 hover:text-black'"
                                @click="mobileMenuOpen = false"
                                >{{ $t('common.nav.collaboration') }}</Link
                            >
                            <Link
                                :href="route('sales.index')"
                                class="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                                :class="props.dark ? 'text-white/80 hover:bg-white/5 hover:text-white' : 'text-black/80 hover:bg-black/5 hover:text-black'"
                                @click="mobileMenuOpen = false"
                                >{{ $t('common.nav.sales') }}</Link
                            >
                            <Link
                                :href="route('media.index')"
                                class="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                                :class="props.dark ? 'text-white/80 hover:bg-white/5 hover:text-white' : 'text-black/80 hover:bg-black/5 hover:text-black'"
                                @click="mobileMenuOpen = false"
                                >{{ $t('common.nav.media') }}</Link
                            >
                            <Link
                                :href="route('contact.index')"
                                class="rounded-xl px-3 py-2.5 text-sm font-medium transition-colors"
                                :class="props.dark ? 'text-white/80 hover:bg-white/5 hover:text-white' : 'text-black/80 hover:bg-black/5 hover:text-black'"
                                @click="mobileMenuOpen = false"
                                >{{ $t('common.nav.contact') }}</Link
                            >
                        </nav>

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
import { Menu, Xmark } from '@iconoir/vue';
import { Link } from '@inertiajs/vue3';
import { computed, onMounted, onUnmounted, ref } from 'vue';

import { route } from 'ziggy-js';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import LocaleSwitcher from '@/custom/LocaleSwitcher.vue';
import LogoType from '@/custom/LogoType.vue';
import ProductCard from '@/custom/ProductCard.vue';
import { PRODUCTS } from '@/types/products';

const props = withDefaults(
    defineProps<{
        scroll?: boolean;
        inverted?: boolean;
        dark?: boolean;
    }>(),
    {
        scroll: true,
        inverted: false,
        dark: false,
    },
);

const products = PRODUCTS;

const isScrolled = ref(false);
const activeDropdown = ref<'products' | null>(null);
const mobileMenuOpen = ref(false);

const headerIsInverted = computed(() => {
    if (props.dark) {
        return false;
    }
    return (
        props.inverted ||
        !props.scroll ||
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
