<script setup lang="ts">
import { Globe } from '@iconoir/vue';
import { router, usePage } from '@inertiajs/vue3';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import i18nMessages from '../i18n_messages.json';

defineProps<{
    inverted?: boolean;
}>();

const page = usePage();
const { locale: vueI18nLocale, setLocaleMessage } = useI18n();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const activeLocale = ref<string>(
    (typeof window !== 'undefined' ? localStorage.getItem('app_locale') : null) ||
    (page.props.i18n?.locale as string) ||
    'cs'
);

const locale = computed(() => activeLocale.value);
const locales = computed(() => (page.props.i18n?.locales as string[]) || ['cs', 'en']);

const formatLocale = (value: string) => value.toUpperCase();

const changeLocale = (targetLocale: string) => {
    isOpen.value = false;
    if (targetLocale === activeLocale.value) {
        return;
    }

    // 1. Update localStorage & cookie
    if (typeof window !== 'undefined') {
        localStorage.setItem('app_locale', targetLocale);
        document.cookie = `app_locale=${targetLocale};path=/;max-age=31536000`;
    }

    // 2. Instantly update reactive i18n state on client
    activeLocale.value = targetLocale;
    const msgs = (i18nMessages as Record<string, any>)[targetLocale] || (i18nMessages as Record<string, any>)['cs'];
    setLocaleMessage(targetLocale, msgs);
    vueI18nLocale.value = targetLocale;

    if (page.props.i18n) {
        page.props.i18n.locale = targetLocale;
        page.props.i18n.messages = msgs;
    }
    document.documentElement.lang = targetLocale;

    // 3. Dispatch global custom event for any non-reactive listeners
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('locale-changed', { detail: targetLocale }));
    }

    // 4. Try POST request if backend is present, ignoring errors on static hosts
    try {
        router.post(
            '/locale',
            { locale: targetLocale },
            {
                preserveScroll: true,
                onError: () => {},
                onFinish: () => {},
            }
        );
    } catch (e) {
        // static deployment fallback
    }
};

const handleClickOutside = (event: MouseEvent) => {
    if (!dropdownRef.value?.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    const saved = localStorage.getItem('app_locale');
    if (saved && saved !== activeLocale.value) {
        changeLocale(saved);
    }
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <div ref="dropdownRef" class="relative inline-block text-left">
        <button
            type="button"
            aria-label="Change language"
            class="inline-flex h-[40px] cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur transition focus:ring-2 focus:outline-none"
            :class="
                inverted
                    ? 'border-black/10 bg-black/5 text-black hover:bg-black/10 focus:ring-black/10'
                    : 'border-white/20 bg-white/15 text-white hover:bg-white/25 focus:ring-white/20'
            "
            @click.stop="isOpen = !isOpen"
        >
            <Globe class="size-4" stroke-width="2" />

            <span>
                {{ formatLocale(locale) }}
            </span>
        </button>

        <Transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="translate-y-1 opacity-0"
            enter-to-class="translate-y-0 opacity-100"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="translate-y-0 opacity-100"
            leave-to-class="translate-y-1 opacity-0"
        >
            <div
                v-if="isOpen"
                class="absolute right-0 z-50 mt-2 min-w-28 overflow-hidden rounded-xl p-1 shadow-xl backdrop-blur"
                :class="
                    inverted
                        ? 'border border-black/10 bg-white text-black'
                        : 'border border-white/10 bg-neutral-950/95 text-white'
                "
            >
                <button
                    v-for="item in locales"
                    :key="item"
                    type="button"
                    class="flex w-full cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-left text-sm font-medium transition"
                    :class="
                        inverted
                            ? item === locale
                                ? 'bg-black/10 hover:bg-black/10'
                                : 'hover:bg-black/5'
                            : item === locale
                              ? 'bg-white/10 hover:bg-white/10'
                              : 'hover:bg-white/10'
                    "
                    @click="changeLocale(item)"
                >
                    <span>{{ formatLocale(item) }}</span>

                    <span
                        v-if="item === locale"
                        class="size-1.5 rounded-full"
                        :class="inverted ? 'bg-black' : 'bg-white'"
                    />
                </button>
            </div>
        </Transition>
    </div>
</template>
