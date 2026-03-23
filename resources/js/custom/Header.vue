<template>
    <header class="absolute z-50 w-full">
        <div
            class="mx-auto flex w-full max-w-[1400px] justify-between p-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
        >
            <div class="logo flex gap-3 text-white">
                <LogoType class="fill-current text-white dark:text-white" />
            </div>

            <div class="dark-switch my-auto text-white">
                <button
                    @click="toggleDark"
                    class="cursor-pointer p-1 transition-opacity hover:opacity-70"
                >
                    <HalfMoon v-if="isDark" class="h-5 w-5 text-white" />
                    <SunLight v-else class="h-5 w-5 text-white" />
                </button>
            </div>
        </div>
    </header>
</template>

<script setup lang="ts">
import { SunLight, HalfMoon } from '@iconoir/vue';
import { ref, onMounted } from 'vue';
import LogoType from '@/custom/LogoType.vue';

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
