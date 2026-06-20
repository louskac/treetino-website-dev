<script setup lang="ts">
import { Form, Head } from '@inertiajs/vue3';
import InputError from '@/components/InputError.vue';
import PasswordInput from '@/components/PasswordInput.vue';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
</script>

<template>
    <Head title="Admin login" />
    <div class="flex min-h-screen items-center justify-center bg-slate-950 px-6">
        <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div class="mb-8">
                <div class="text-2xl font-semibold">Treetino Admin</div>
                <p class="mt-1 text-sm text-slate-500">Sign in to the separate administration area.</p>
            </div>
            <Form action="/admin/login" method="post" :reset-on-success="['password']" v-slot="{ errors, processing }" class="space-y-5">
                <div class="space-y-2">
                    <Label for="email">Email address</Label>
                    <Input id="email" name="email" type="email" autocomplete="email" required autofocus />
                    <InputError :message="errors.email" />
                </div>
                <div class="space-y-2">
                    <Label for="password">Password</Label>
                    <PasswordInput id="password" name="password" autocomplete="current-password" required />
                    <InputError :message="errors.password" />
                </div>
                <Label class="flex items-center gap-3 font-normal">
                    <Checkbox name="remember" value="1" /> Remember me
                </Label>
                <Button class="w-full" :disabled="processing">
                    <Spinner v-if="processing" /> Sign in
                </Button>
            </Form>
        </div>
    </div>
</template>
