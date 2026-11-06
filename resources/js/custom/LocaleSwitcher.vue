<script setup lang="ts">
import { Globe } from '@iconoir/vue';
import { usePage } from '@inertiajs/vue3';
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import i18nMessages from '../i18n_messages.json';
import {
    detectInitialLocale,
    persistLocale,
    type AppLocale,
} from '../lib/locale';

defineProps<{
    inverted?: boolean;
}>();

const page = usePage();
const { locale: vueI18nLocale, setLocaleMessage } = useI18n();

const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

const activeLocale = ref<string>(
    (vueI18nLocale.value as string) ||
        detectInitialLocale(page.props.i18n?.locale as string | undefined),
);

watch(vueI18nLocale, (newVal) => {
    if (newVal && newVal !== activeLocale.value) {
        activeLocale.value = newVal as string;
    }
});

const locale = computed(() => activeLocale.value);
const locales = computed(
    () => (page.props.i18n?.locales as string[]) || ['cs', 'en'],
);

const formatLocale = (value: string) => value.toUpperCase();

const changeLocale = (targetLocale: string) => {
    isOpen.value = false;

    if (targetLocale === activeLocale.value) {
        return;
    }

    // 1. Update localStorage & cookie
    persistLocale(targetLocale as AppLocale);

    // 2. Instantly update reactive i18n state on client
    activeLocale.value = targetLocale;
    const msgs =
        (i18nMessages as Record<string, any>)[targetLocale] ||
        (i18nMessages as Record<string, any>)['cs'];
    setLocaleMessage(targetLocale, msgs);
    vueI18nLocale.value = targetLocale;

    if (page.props.i18n) {
        page.props.i18n.locale = targetLocale;
        page.props.i18n.messages = msgs;
    }

    document.documentElement.lang = targetLocale;

    // 3. Dispatch global custom event for any non-reactive listeners
    if (typeof window !== 'undefined') {
        window.dispatchEvent(
            new CustomEvent('locale-changed', { detail: targetLocale }),
        );
    }

    // 4. Sync with backend session silently without triggering Inertia page navigation/redirects
    const appEl =
        typeof document !== 'undefined' ? document.getElementById('app') : null;
    if (appEl?.dataset.page) {
        const csrfToken = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute('content');
        const xsrfMatch = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]*)/);
        const xsrfToken = xsrfMatch ? decodeURIComponent(xsrfMatch[1]) : null;

        void fetch('/locale', {
            method: 'POST',
            credentials: 'same-origin',
            priority: 'low',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                ...(csrfToken ? { 'X-CSRF-TOKEN': csrfToken } : {}),
                ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
            },
            body: JSON.stringify({ locale: targetLocale }),
        }).catch(() => {
            // Static or serverless fallback: cookies & localStorage are already persisted above
        });
    }
};

const handleClickOutside = (event: MouseEvent) => {
    if (!dropdownRef.value?.contains(event.target as Node)) {
        isOpen.value = false;
    }
};

const handleExternalLocaleChange = (event: Event) => {
    const customEvent = event as CustomEvent<string>;
    if (customEvent.detail && customEvent.detail !== activeLocale.value) {
        activeLocale.value = customEvent.detail;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    window.addEventListener('locale-changed', handleExternalLocaleChange);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
    window.removeEventListener('locale-changed', handleExternalLocaleChange);
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
