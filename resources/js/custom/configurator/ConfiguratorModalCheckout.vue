<script setup lang="ts">
import { Xmark } from '@iconoir/vue';

const emit = defineEmits(['close'])
</script>

<template>
    <div class="fixed top-0 left-0 flex h-full w-full bg-black/40 p-6">
        <div class="mx-auto my-auto w-full rounded-2xl bg-white lg:w-160 min-h-140">
            <div class="flex justify-between p-6 border-b">
                <div class="opacity-70">Finish Your Order</div>
                <div class="my-auto">
                    <Xmark class="h-5 w-5" @click="emit('close')"/>
                </div>
            </div>

            <div class="p-6">
                Checkout Logic
            </div>
        </div>
    </div>
</template>
