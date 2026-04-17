<script setup lang="ts">
import { Xmark } from '@iconoir/vue';

const emit = defineEmits(['close']);
</script>

<template>
    <div class="fixed top-0 left-0 flex h-full w-full bg-black/70 p-6">
        <div
            class="mx-auto my-auto min-h-140 w-full rounded-2xl bg-white lg:w-160"
        >
            <div class="flex justify-between border-b p-6">
                <div class="opacity-70">Get More Information</div>
                <div class="my-auto">
                    <Xmark
                        class="h-5 w-5 cursor-pointer"
                        @click="emit('close')"
                    />
                </div>
            </div>

            <div class="p-6">
                Info
            </div>
        </div>
    </div>
</template>
