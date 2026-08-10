<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {
    acceptCategory,
    validCookie,
    showPreferences,
} from 'vanilla-cookieconsent';
import { Settings } from '@iconoir/vue';

const isVisible = ref(false);

onMounted(() => {
    if (!validCookie('cc_cookie')) {
        isVisible.value = true;
    }
});

const handleAcceptAll = () => {
    acceptCategory('all');
    isVisible.value = false;
};

const handleRejectAll = () => {
    acceptCategory([]);
    isVisible.value = false;
};

const handleOpenSettings = () => {
    showPreferences();
};
</script>

<template>
    <Transition
        enter-active-class="transition duration-500 ease-out"
        enter-from-class="transform translate-y-20 opacity-0"
        enter-to-class="transform translate-y-0 opacity-100"
        leave-active-class="transition duration-300 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
    >
        <div
            v-if="isVisible"
            class="pointer-events-none fixed inset-x-0 bottom-4 z-[9999] flex justify-center px-4 sm:bottom-6 sm:justify-end sm:px-6"
        >
            <div
                class="pointer-events-auto flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl border border-zinc-200/90 bg-white p-3.5 shadow-2xl backdrop-blur-xl sm:w-auto sm:max-w-none sm:flex-row sm:px-4"
            >
                <div class="w-full text-center text-xs font-semibold text-zinc-900 sm:w-auto sm:text-left sm:text-sm">
                    {{ $t('common.cookie.title') }}
                </div>
                <div class="flex h-10 w-full items-center justify-center gap-2 sm:w-auto">
                    <button
                        type="button"
                        class="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-xl bg-blue-600 px-4 text-center text-xs font-semibold text-white whitespace-nowrap transition-all hover:bg-blue-700 active:scale-95 sm:flex-none sm:text-sm"
                        @click="handleAcceptAll"
                    >
                        {{ $t('common.cookie.accept_all') }}
                    </button>
                    <button
                        type="button"
                        class="flex h-10 flex-1 cursor-pointer items-center justify-center rounded-xl bg-zinc-950 px-4 text-center text-xs font-semibold text-white whitespace-nowrap transition-all hover:bg-black active:scale-95 sm:flex-none sm:text-sm"
                        @click="handleRejectAll"
                    >
                        {{ $t('common.cookie.reject_all') }}
                    </button>
                    <button
                        type="button"
                        class="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-zinc-950 text-white transition-all hover:bg-black active:scale-95"
                        :title="$t('common.cookie.settings')"
                        @click="handleOpenSettings"
                    >
                        <Settings class="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>
