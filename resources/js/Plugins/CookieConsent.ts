import { run  } from 'vanilla-cookieconsent';
import type {CookieConsentConfig} from 'vanilla-cookieconsent';
import type { App } from 'vue';

export default {
    install: (app: App, config: CookieConsentConfig) => {
        // Initialize the library
        const cc = run(config);

        // Make the API available globally in Vue components
        // Use: const cc = inject('cc') in Composition API
        app.provide('cc', cc);

        // Optional: Also make it available in Options API via this.$cc
        app.config.globalProperties.$cc = cc;
    },
};
