import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        host: '127.0.0.1',
        port: 5174,
        strictPort: true,
    },
    plugins: [
        laravel({
            input: ['resources/js/app.ts'],
            ssr: 'resources/js/ssr.ts',
            refresh: true,
        }),
        tailwindcss(),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        ...(process.env.VERCEL ? [] : [wayfinder({ formVariants: true })]),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('i18n_messages.json')) {
                        return 'i18n-messages';
                    }
                    if (id.includes('node_modules/three')) {
                        return 'vendor-three';
                    }
                    if (id.includes('node_modules/gsap')) {
                        return 'vendor-gsap';
                    }
                    if (id.includes('node_modules/swiper')) {
                        return 'vendor-swiper';
                    }
                    if (
                        id.includes('node_modules/vue') ||
                        id.includes('node_modules/@vue') ||
                        id.includes('node_modules/@inertiajs') ||
                        id.includes('node_modules/vue-i18n')
                    ) {
                        return 'vendor-vue';
                    }
                },
            },
        },
    },
});
