<script setup lang="ts">
import { Link } from '@inertiajs/vue3';
import axios, { AxiosError } from 'axios';
import {
    ArrowRight,
    CheckCircle2,
    ExternalLink,
    Mail,
    Send,
    X,
} from 'lucide-vue-next';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';

const { t } = useI18n();

const props = withDefaults(
    defineProps<{
        productId?: string;
        productLabel?: string;
        productDetail?: string;
    }>(),
    {
        productId: 'strom-v1',
        productLabel: 'Strom V1',
        productDetail: 'treetino-v1',
    },
);

const emit = defineEmits<{
    close: [];
}>();

const productRoute = computed(() => {
    if (props.productDetail) {
        return `/products/${props.productDetail}`;
    }
    if (props.productId === 'strom-v2') {
        return '/products/treetino-v2';
    }
    if (props.productId === 'turbina') {
        return '/products/turbine';
    }
    return '/products/treetino-v1';
});

const productVisual = computed(() => {
    if (props.productId === 'strom-v2') {
        return {
            render: '/img/stills/Still_Strom-v2.png',
            badge: '124 TopCon FVE + 6× VTE',
            power: '6 – 12 kW',
            specsKey: 'products.v2.numbers_description',
            specsDefault:
                'Ideální řešení pro dokonalé proporce na zahradě bez zabírání trávníku.',
        };
    }
    if (props.productId === 'turbina') {
        return {
            render: '/img/stills/Still_Turbina.png',
            badge: 'Tichá vertikální VTE',
            power: '1 – 3 kW',
            specsKey: 'products.turbine.numbers_description',
            specsDefault:
                'Ideální doplněk pro střechy budov, parkovací domy nebo městskou infrastrukturu.',
        };
    }
    return {
        render: '/img/stills/Still_Strom-v1.png',
        badge: '300 TopCon FVE + 12× VTE',
        power: '49,8 kW',
        specsKey: 'products.v1.numbers_description',
        specsDefault:
            'Navrženo pro byznys centra, průmyslové parky, městská náměstí a EV nabíjecí huby.',
    };
});

// Form state
const name = ref('');
const email = ref('');
const phone = ref('');
const message = ref(
    `Dobrý den, mám zájem o bližší informace k produktu ${props.productLabel}.`,
);
const botcheck = ref('');

const isSending = ref(false);
const isSent = ref(false);
const errorMessage = ref('');
const formErrors = ref<Record<string, string[]>>({});

function validateForm(): boolean {
    formErrors.value = {};
    errorMessage.value = '';

    if (!name.value.trim()) {
        formErrors.value.name = [
            t('contact.errors.name_required', 'Zadejte prosím své jméno.'),
        ];
    }

    if (!email.value.trim()) {
        formErrors.value.mail = [
            t('contact.errors.mail_required', 'Zadejte prosím svůj e-mail.'),
        ];
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        formErrors.value.mail = [
            t(
                'contact.errors.mail_invalid',
                'Zadejte platnou e-mailovou adresu.',
            ),
        ];
    }

    if (!message.value.trim()) {
        formErrors.value.message = [
            t('contact.errors.message_required', 'Zadejte prosím text zprávy.'),
        ];
    }

    return Object.keys(formErrors.value).length === 0;
}

async function handleSendInquiry() {
    if (!validateForm()) {
        return;
    }

    isSending.value = true;
    errorMessage.value = '';

    try {
        const fullMessage = phone.value.trim()
            ? `[Produkt: ${props.productLabel} | Tel: ${phone.value.trim()}]\n\n${message.value.trim()}`
            : `[Produkt: ${props.productLabel}]\n\n${message.value.trim()}`;

        const response = await axios.post('/api/contact', {
            name: name.value.trim(),
            mail: email.value.trim(),
            message: fullMessage,
            botcheck: botcheck.value,
        });

        if (response.data?.status === 'success' || response.status === 200) {
            isSent.value = true;
            name.value = '';
            email.value = '';
            phone.value = '';
            message.value = '';
        }
    } catch (error) {
        const requestError = error as AxiosError<{
            errors?: Record<string, string[]>;
            message?: string;
        }>;

        if (requestError.response?.data?.errors) {
            formErrors.value = requestError.response.data.errors;
        } else if (requestError.response?.data?.message) {
            errorMessage.value = requestError.response.data.message;
        } else {
            errorMessage.value = t(
                'configurator.modal_info.sent_error',
                'Odeslání se nezdařilo. Zkuste to prosím znovu nebo nám napište na info@treetino.com.',
            );
        }
    } finally {
        isSending.value = false;
    }
}
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-xs sm:p-6"
        @click.self="emit('close')"
    >
        <div
            class="relative my-auto flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl dark:border-white/15 dark:bg-zinc-900"
        >
            <!-- Header -->
            <div
                class="flex items-center justify-between border-b border-black/10 px-6 py-5 dark:border-white/10"
            >
                <div class="flex items-center gap-2">
                    <span
                        class="text-base font-bold tracking-tight text-black dark:text-white"
                    >
                        {{
                            $t('configurator.modal_info.title', 'Více informací')
                        }}
                    </span>
                    <span
                        class="rounded-full bg-t-blue/10 px-2.5 py-0.5 text-xs font-semibold text-t-blue dark:bg-blue-400/15 dark:text-blue-300"
                    >
                        {{ productLabel }}
                    </span>
                </div>
                <button
                    type="button"
                    @click="emit('close')"
                    class="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/5 text-black/60 transition-colors hover:bg-black/10 hover:text-black dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20 dark:hover:text-white"
                >
                    <X class="h-4 w-4" />
                </button>
            </div>

            <!-- Scrollable Body -->
            <div class="space-y-6 overflow-y-auto px-6 py-6">
                <!-- Product Landing Page Link Card with Render -->
                <div
                    class="relative overflow-hidden rounded-2xl border border-black/10 bg-linear-to-br from-stone-50 to-stone-100/70 p-4 sm:p-5 dark:border-white/10 dark:from-zinc-800/70 dark:to-zinc-900/80"
                >
                    <div class="flex flex-col sm:flex-row items-center gap-4">
                        <!-- Render Thumbnail -->
                        <div
                            class="relative flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-black/5 bg-white p-2 shadow-2xs dark:border-white/10 dark:bg-black/40"
                        >
                            <img
                                :src="productVisual.render"
                                :alt="productLabel"
                                class="h-full w-full object-contain drop-shadow-md transition-transform duration-300 hover:scale-105"
                                loading="lazy"
                            />
                        </div>

                        <!-- Info & Link -->
                        <div
                            class="flex flex-1 flex-col justify-between self-stretch text-center sm:text-left"
                        >
                            <div>
                                <div
                                    class="flex flex-wrap items-center justify-center gap-2 sm:justify-start"
                                >
                                    <h4
                                        class="text-sm font-bold text-black dark:text-white"
                                    >
                                        {{ productLabel }}
                                    </h4>
                                    <span
                                        class="rounded-md bg-t-blue/10 px-2 py-0.5 text-[11px] font-semibold text-t-blue dark:bg-blue-400/15 dark:text-blue-300"
                                    >
                                        {{ productVisual.power }}
                                    </span>
                                </div>
                                <p
                                    class="mt-1 text-xs leading-relaxed text-black/60 dark:text-white/60"
                                >
                                    {{
                                        $t(
                                            productVisual.specsKey,
                                            productVisual.specsDefault,
                                        )
                                    }}
                                </p>
                            </div>

                            <div
                                class="mt-3 flex items-center justify-center sm:justify-start"
                            >
                                <Link
                                    :href="productRoute"
                                    target="_blank"
                                    class="inline-flex items-center gap-1.5 rounded-xl bg-t-blue px-3.5 py-2 text-xs font-semibold text-white shadow-xs transition-all hover:bg-blue-600 active:scale-95"
                                >
                                    <span>{{
                                        $t(
                                            'configurator.modal_info.product_link_btn',
                                            'Přejít na detail produktu',
                                        )
                                    }}</span>
                                    <ExternalLink class="h-3.5 w-3.5" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Inquiry Form Section -->
                <div class="space-y-4">
                    <div>
                        <h4
                            class="text-sm font-semibold text-black dark:text-white"
                        >
                            {{
                                $t(
                                    'configurator.modal_info.form_title',
                                    'Máte dotaz nebo zájem o nabídku?',
                                )
                            }}
                        </h4>
                        <p
                            class="mt-0.5 text-xs text-black/60 dark:text-white/50"
                        >
                            {{
                                $t(
                                    'configurator.modal_info.form_desc',
                                    'Napište nám a náš specialista se vám ozve do 24 hodin.',
                                )
                            }}
                        </p>
                    </div>

                    <!-- Success State -->
                    <div
                        v-if="isSent"
                        class="flex flex-col items-center justify-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50/80 p-6 text-center dark:border-emerald-500/30 dark:bg-emerald-950/30"
                    >
                        <div
                            class="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md"
                        >
                            <CheckCircle2 class="h-6 w-6" />
                        </div>
                        <div>
                            <h5
                                class="text-sm font-bold text-emerald-900 dark:text-emerald-200"
                            >
                                {{ $t('common.actions.send', 'Odesláno') }}
                            </h5>
                            <p
                                class="mt-1 text-xs text-emerald-800/80 dark:text-emerald-300/80"
                            >
                                {{
                                    $t(
                                        'configurator.modal_info.sent_success',
                                        'Děkujeme za váš zájem! Zprávu jsme v pořádku přijali a brzy se vám ozveme.',
                                    )
                                }}
                            </p>
                        </div>
                        <button
                            type="button"
                            @click="isSent = false"
                            class="mt-2 text-xs font-semibold text-emerald-700 underline dark:text-emerald-400"
                        >
                            {{
                                $t(
                                    'configurator.modal_info.send_another',
                                    'Odeslat další dotaz',
                                )
                            }}
                        </button>
                    </div>

                    <!-- Form Inputs -->
                    <form
                        v-else
                        @submit.prevent="handleSendInquiry"
                        class="space-y-3.5"
                    >
                        <!-- Honeypot for spam bots -->
                        <input
                            type="checkbox"
                            name="botcheck"
                            class="hidden"
                            style="display: none"
                            v-model="botcheck"
                        />

                        <!-- General Error Banner -->
                        <div
                            v-if="errorMessage"
                            class="rounded-xl border border-red-500/30 bg-red-50 p-3 text-xs text-red-600 dark:border-red-500/30 dark:bg-red-950/30 dark:text-red-300"
                        >
                            {{ errorMessage }}
                        </div>

                        <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            <!-- Name -->
                            <div class="space-y-1">
                                <label
                                    class="text-xs font-medium text-black/70 dark:text-white/70"
                                >
                                    {{
                                        $t(
                                            'configurator.modal_info.name_label',
                                            'Jméno a příjmení',
                                        )
                                    }}
                                    *
                                </label>
                                <input
                                    v-model="name"
                                    type="text"
                                    required
                                    placeholder="Jan Novák"
                                    class="w-full rounded-xl border border-black/15 bg-stone-50/50 px-3.5 py-2.5 text-xs text-black transition-colors focus:border-t-blue focus:bg-white focus:outline-none dark:border-white/15 dark:bg-zinc-800/50 dark:text-white dark:focus:border-t-blue dark:focus:bg-zinc-800"
                                    :class="{
                                        'border-red-500': formErrors.name,
                                    }"
                                />
                                <span
                                    v-if="formErrors.name"
                                    class="text-[11px] text-red-500"
                                >
                                    {{ formErrors.name[0] }}
                                </span>
                            </div>

                            <!-- Email -->
                            <div class="space-y-1">
                                <label
                                    class="text-xs font-medium text-black/70 dark:text-white/70"
                                >
                                    {{
                                        $t(
                                            'configurator.modal_info.email_label',
                                            'E-mail',
                                        )
                                    }}
                                    *
                                </label>
                                <input
                                    v-model="email"
                                    type="email"
                                    required
                                    placeholder="jan.novak@example.cz"
                                    class="w-full rounded-xl border border-black/15 bg-stone-50/50 px-3.5 py-2.5 text-xs text-black transition-colors focus:border-t-blue focus:bg-white focus:outline-none dark:border-white/15 dark:bg-zinc-800/50 dark:text-white dark:focus:border-t-blue dark:focus:bg-zinc-800"
                                    :class="{
                                        'border-red-500': formErrors.mail,
                                    }"
                                />
                                <span
                                    v-if="formErrors.mail"
                                    class="text-[11px] text-red-500"
                                >
                                    {{ formErrors.mail[0] }}
                                </span>
                            </div>
                        </div>

                        <!-- Phone (Optional) -->
                        <div class="space-y-1">
                            <label
                                class="text-xs font-medium text-black/70 dark:text-white/70"
                            >
                                {{
                                    $t(
                                        'configurator.modal_info.phone_label',
                                        'Telefon (volitelné)',
                                    )
                                }}
                            </label>
                            <input
                                v-model="phone"
                                type="tel"
                                placeholder="+420 777 000 000"
                                class="w-full rounded-xl border border-black/15 bg-stone-50/50 px-3.5 py-2.5 text-xs text-black transition-colors focus:border-t-blue focus:bg-white focus:outline-none dark:border-white/15 dark:bg-zinc-800/50 dark:text-white dark:focus:border-t-blue dark:focus:bg-zinc-800"
                            />
                        </div>

                        <!-- Message -->
                        <div class="space-y-1">
                            <label
                                class="text-xs font-medium text-black/70 dark:text-white/70"
                            >
                                {{
                                    $t(
                                        'configurator.modal_info.message_label',
                                        'Vaše zpráva',
                                    )
                                }}
                                *
                            </label>
                            <textarea
                                v-model="message"
                                rows="3"
                                required
                                class="w-full rounded-xl border border-black/15 bg-stone-50/50 p-3.5 text-xs text-black transition-colors focus:border-t-blue focus:bg-white focus:outline-none dark:border-white/15 dark:bg-zinc-800/50 dark:text-white dark:focus:border-t-blue dark:focus:bg-zinc-800"
                                :class="{
                                    'border-red-500': formErrors.message,
                                }"
                            ></textarea>
                            <span
                                v-if="formErrors.message"
                                class="text-[11px] text-red-500"
                            >
                                {{ formErrors.message[0] }}
                            </span>
                        </div>

                        <!-- Submit Button -->
                        <ButtonPrimary
                            type="submit"
                            :disabled="isSending"
                            class="w-full cursor-pointer justify-center py-3 text-xs font-semibold disabled:opacity-60"
                        >
                            <span v-if="isSending">{{
                                $t(
                                    'configurator.modal_info.sending',
                                    'Odesílám...',
                                )
                            }}</span>
                            <span
                                v-else
                                class="inline-flex items-center gap-1.5"
                            >
                                <Send class="h-3.5 w-3.5" />
                                {{
                                    $t(
                                        'configurator.modal_info.send_btn',
                                        'Odeslat dotaz',
                                    )
                                }}
                            </span>
                        </ButtonPrimary>
                    </form>
                </div>

                <!-- Direct Contact Info Footer -->
                <div
                    class="flex flex-wrap items-center justify-between gap-2 border-t border-black/10 pt-4 text-xs text-black/60 dark:border-white/10 dark:text-white/50"
                >
                    <a
                        href="mailto:info@treetino.com"
                        class="flex items-center gap-1.5 hover:text-t-blue dark:hover:text-white"
                    >
                        <Mail class="h-3.5 w-3.5" />
                        <span>info@treetino.com</span>
                    </a>
                    <Link
                        href="/contact"
                        class="flex items-center gap-1.5 hover:text-t-blue dark:hover:text-white"
                    >
                        <span>{{ $t('common.nav.contact', 'Kontakt') }}</span>
                        <ArrowRight class="h-3.5 w-3.5" />
                    </Link>
                </div>
            </div>
        </div>
    </div>
</template>
