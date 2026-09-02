<script setup lang="ts">
import { Download, Printer } from '@iconoir/vue';
import { Head } from '@inertiajs/vue3';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const { t, locale } = useI18n();
const isEn = computed(() => locale.value === 'en');

function printPage() {
    if (typeof window !== 'undefined') {
        window.print();
    }
}
</script>

<template>
    <Head :title="`${$t('legal.nda.title')} | Treetino`" />

    <DefaultLayout :inverted="true">
        <div
            class="relative overflow-hidden bg-white pt-36 text-black sm:pt-44"
        >
            <div
                class="pointer-events-none absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-black/10 sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            ></div>

            <main
                class="relative mx-auto h-full w-full max-w-[1400px] px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <!-- Title & Download CTA Bar -->
                <div
                    class="flex flex-col justify-between gap-6 border-b border-black/10 pb-8 md:flex-row md:items-end dark:border-white/10"
                >
                    <div>
                        <span
                            class="inline-block rounded-md bg-t-blue/10 px-3 py-1 text-xs font-bold tracking-wider text-t-blue uppercase dark:bg-t-blue/20"
                        >
                            {{
                                isEn
                                    ? 'Legal Document • Non-Disclosure Agreement (NDA)'
                                    : 'Právní dokument • Non-Disclosure Agreement (NDA)'
                            }}
                        </span>
                        <h1
                            class="mt-3 text-3xl leading-tight font-medium tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'Non-Disclosure and Confidentiality Agreement'
                                    : 'Dohoda o mlčenlivosti a ochraně informací'
                            }}
                        </h1>
                        <p
                            class="mt-3 text-sm text-slate-600 sm:text-base dark:text-slate-400"
                        >
                            {{
                                isEn
                                    ? 'entered into pursuant to Section 1746(2) and Section 1730 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended'
                                    : 'Uzavřená dle ustanovení § 1746 odst. 2 a § 1730 a násl. zákona č. 89/2012 Sb., občanský zákoník.'
                            }}
                        </p>
                    </div>

                    <div
                        class="flex shrink-0 flex-wrap items-center gap-3 print:hidden"
                    >
                        <template v-if="isEn">
                            <a
                                href="/legal/nda/download?lang=en"
                                class="inline-flex items-center gap-2 rounded-xl bg-t-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                            >
                                <Download class="h-4 w-4" />
                                <span>Download PDF (English)</span>
                            </a>
                            <a
                                href="/legal/nda/download?lang=cs"
                                class="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                            >
                                <Download class="h-4 w-4" />
                                <span>Stáhnout PDF (Česky)</span>
                            </a>
                            <button
                                type="button"
                                @click="printPage"
                                class="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-2xs transition hover:bg-slate-50 dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                            >
                                <Printer class="h-4 w-4" />
                                <span>Print</span>
                            </button>
                        </template>
                        <template v-else>
                            <a
                                href="/legal/nda/download?lang=cs"
                                class="inline-flex items-center gap-2 rounded-xl bg-t-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                            >
                                <Download class="h-4 w-4" />
                                <span>Stáhnout PDF (Česky)</span>
                            </a>
                            <a
                                href="/legal/nda/download?lang=en"
                                class="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                            >
                                <Download class="h-4 w-4" />
                                <span>Download PDF (English)</span>
                            </a>
                            <button
                                type="button"
                                @click="printPage"
                                class="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-4 py-3 text-sm font-medium text-slate-800 shadow-2xs transition hover:bg-slate-50 dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                            >
                                <Printer class="h-4 w-4" />
                                <span>Vytisknout</span>
                            </button>
                        </template>
                    </div>
                </div>

                <!-- Document Body -->
                <article
                    class="pt-10 pb-20 text-sm leading-relaxed text-slate-800 sm:text-base dark:text-slate-200"
                >
                    <!-- Článek I -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'I. Contracting Parties'
                                    : 'I. Smluvní strany'
                            }}
                        </h2>

                        <p class="mb-6">
                            {{
                                isEn
                                    ? 'On the date, month, and year indicated below, the following Contracting Parties enter into this Non-Disclosure and Confidentiality Agreement (hereinafter the "Agreement"):'
                                    : 'Smluvní strany uzavírají níže uvedeného dne, měsíce a roku tuto Dohodu o mlčenlivosti, ochraně informací a zákazu jejich zneužití (dále jen „Dohoda“):'
                            }}
                        </p>

                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <!-- Poskytovatel / Disclosing Party -->
                            <div
                                class="rounded-2xl border border-t-blue/30 bg-blue-50/40 p-6 shadow-xs dark:border-t-blue/40 dark:bg-blue-950/20"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-t-blue uppercase"
                                >
                                    {{
                                        isEn
                                            ? '1.1 Disclosing Party (Treetino)'
                                            : '1.1 Poskytovatel'
                                    }}
                                </div>
                                <h3
                                    class="mt-1 text-lg font-bold text-slate-950 dark:text-white"
                                >
                                    Treetino corp s.r.o.
                                </h3>

                                <dl class="mt-4 space-y-2 text-sm">
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? 'Company ID (IČO):'
                                                    : 'IČO:'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-semibold text-slate-900 dark:text-white"
                                        >
                                            10800107
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? 'Registered Seat:'
                                                    : 'Sídlo:'
                                            }}
                                        </dt>
                                        <dd
                                            class="text-right font-semibold text-slate-900 dark:text-white"
                                        >
                                            {{
                                                isEn
                                                    ? 'Vlčetín 62, Bílá 463 43, Czechia'
                                                    : 'Vlčetín 62, Bílá 463 43'
                                            }}
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? 'Represented by:'
                                                    : 'Zastoupena:'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-semibold text-slate-900 dark:text-white"
                                        >
                                            {{
                                                isEn
                                                    ? 'Dominik Mašek, Managing Director'
                                                    : 'Dominik Mašek, jednatel'
                                            }}
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            {{
                                                isEn ? 'Registry:' : 'Rejstřík:'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-semibold text-slate-900 dark:text-white"
                                        >
                                            {{
                                                isEn
                                                    ? 'Regional Court in Ústí n. L., C 48430'
                                                    : 'KS v Ústí n. L., C 48430'
                                            }}
                                        </dd>
                                    </div>
                                    <div class="flex justify-between py-1">
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            E-mail:
                                        </dt>
                                        <dd
                                            class="font-semibold text-slate-900 dark:text-white"
                                        >
                                            info@treetino.com
                                        </dd>
                                    </div>
                                </dl>

                                <div
                                    class="mt-4 text-xs text-slate-500 italic dark:text-slate-400"
                                >
                                    {{
                                        isEn
                                            ? '(hereinafter referred to as the "Disclosing Party" or "Treetino")'
                                            : '(dále jen jako „Poskytovatel“ nebo „Treetino“)'
                                    }}
                                </div>
                            </div>

                            <!-- Příjemce / Receiving Party -->
                            <div
                                class="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-xs dark:border-slate-800 dark:bg-zinc-900/60"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400"
                                >
                                    {{
                                        isEn
                                            ? '1.2 Receiving Party (Partner / Agent)'
                                            : '1.2 Příjemce (Partner / Prodejce)'
                                    }}
                                </div>
                                <h3
                                    class="mt-1 text-lg font-bold text-slate-950 dark:text-white"
                                >
                                    {{
                                        isEn
                                            ? 'Sales Partner / Agent'
                                            : 'Obchodní zástupce / Partner'
                                    }}
                                </h3>

                                <dl class="mt-4 space-y-2 text-sm">
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? 'Company / Name:'
                                                    : 'Firma / Jméno:'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? '[ To be filled by partner ]'
                                                    : '[ Vyplní obchodní partner ]'
                                            }}
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? 'ID / Date of Birth:'
                                                    : 'IČO / RČ / Dat. nar.:'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? '[ To be filled by partner ]'
                                                    : '[ Vyplní obchodní partner ]'
                                            }}
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? 'VAT ID:'
                                                    : 'DIČ (plátce DPH):'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? '[ To be filled by partner ]'
                                                    : '[ Vyplní obchodní partner ]'
                                            }}
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? 'Seat / Residence:'
                                                    : 'Sídlo / Bydliště:'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? '[ To be filled by partner ]'
                                                    : '[ Vyplní obchodní partner ]'
                                            }}
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? 'Represented by:'
                                                    : 'Zastoupen(a):'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? '[ To be filled by partner ]'
                                                    : '[ Vyplní obchodní partner ]'
                                            }}
                                        </dd>
                                    </div>
                                    <div class="flex justify-between py-1">
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? 'Email & Phone:'
                                                    : 'E-mail & Tel.:'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            {{
                                                isEn
                                                    ? '[ To be filled by partner ]'
                                                    : '[ Vyplní obchodní partner ]'
                                            }}
                                        </dd>
                                    </div>
                                </dl>

                                <div
                                    class="mt-4 text-xs text-slate-500 italic dark:text-slate-400"
                                >
                                    {{
                                        isEn
                                            ? '(hereinafter referred to as the "Receiving Party" or "Commercial Partner")'
                                            : '(dále jen jako „Příjemce“ nebo „Obchodní partner“)'
                                    }}
                                </div>
                            </div>
                        </div>

                        <p
                            class="mt-4 text-xs text-slate-500 dark:text-slate-400"
                        >
                            {{
                                isEn
                                    ? '(The Disclosing Party and the Receiving Party hereinafter collectively referred to as the "Parties", or individually as a "Party")'
                                    : '(Poskytovatel a Příjemce dále společně také jen jako „Smluvní strany“, nebo každý samostatně jako „Smluvní strana“)'
                            }}
                        </p>
                    </section>

                    <!-- Článek II -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'II. Preamble and Purpose of the Agreement'
                                    : 'II. Preambule a účel dohody'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>2.1</strong> The Parties are engaged in
                                mutual negotiations regarding the establishment
                                and execution of commercial and technical
                                collaboration, within which the Receiving Party,
                                acting as a sales representative, commercial
                                agent, distributor, or partner entity, will
                                conduct business development activities,
                                specifically identifying commercial
                                opportunities, mediating sales, presenting,
                                marketing, and securing distribution or
                                installation of Treetino products and
                                technologies (including autonomous solar and
                                wind trees Treetino V1, Treetino V2, vertical
                                wind microturbines T1, and related accessories),
                                as well as utilizing Treetino's proprietary
                                sales and calculation software (Treetino Pricing
                                App, CRM, partner portal, and 3D configuration
                                tools) – hereinafter referred to as "<strong
                                    >Mutual Collaboration</strong
                                >".
                            </p>
                            <p>
                                <strong>2.2</strong> For the purpose of
                                negotiating and performing the Mutual
                                Collaboration, the Disclosing Party will provide
                                the Receiving Party with highly confidential
                                commercial, pricing, technical, developmental,
                                strategic, customer, and operational information
                                and know-how, which constitute valuable trade
                                secrets and intellectual property of the
                                Disclosing Party and hold essential economic and
                                competitive value.
                            </p>
                            <p>
                                <strong>2.3</strong> The purpose of this
                                Agreement is to establish binding rules and
                                legal framework for the protection of all
                                Confidential Information and Trade Secrets of
                                the Disclosing Party, define the Receiving
                                Party's obligations in handling such
                                information, prohibit any unauthorized
                                disclosure, dissemination, or utilization
                                thereof, and determine legal remedies and
                                sanctions in the event of any breach.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>2.1</strong> Smluvní strany vedou
                                vzájemná jednání o navázání a realizaci obchodní
                                a technické spolupráce, v jejímž rámci bude
                                Příjemce jako obchodní zástupce, prodejce,
                                distributor nebo partnerská společnost vyvíjet
                                obchodní činnost, zejména vyhledávat obchodní
                                příležitosti, zprostředkovávat prodej,
                                prezentovat, propagovat a zajišťovat distribuci
                                nebo instalaci produktů a technologií
                                společnosti Treetino (zejména autonomních
                                větrných a solárních stromů Treetino V1,
                                Treetino V2, vertikálních větrných mikroturbín
                                T1 a souvisejícího příslušenství) a využívat
                                obchodní software a kalkulační nástroje
                                Poskytovatele (Treetino Pricing App, CRM,
                                partnerský portál a konfigurační nástroje) –
                                dále jen „<strong>Vzájemná spolupráce</strong>“.
                            </p>
                            <p>
                                <strong>2.2</strong> Za účelem jednání o
                                Vzájemné spolupráci a jejího následného řádného
                                výkonu bude Poskytovatel Příjemci zpřístupňovat
                                vysoce důvěrné obchodní, cenové, technické,
                                vývojové, strategické, klientské a provozní
                                informace a know-how, které představují cenné
                                obchodní tajemství a duševní vlastnictví
                                Poskytovatele a mají zásadní hospodářskou
                                hodnotu.
                            </p>
                            <p>
                                <strong>2.3</strong> Účelem této Dohody je
                                stanovení přesných a závazných podmínek pro
                                ochranu důvěrných informací a obchodního
                                tajemství Poskytovatele, vymezení povinností
                                Příjemce při nakládání s těmito informacemi,
                                zákaz jejich neoprávněného užití, vyzrazení,
                                šíření či zpřístupnění třetím osobám a stanovení
                                právních následků a sankcí v případě jejich
                                porušení.
                            </p>
                        </div>
                    </section>

                    <!-- Článek III -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'III. Definition of Confidential Information and Trade Secrets'
                                    : 'III. Vymezení důvěrných informací a obchodního tajemství'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>3.1 "Confidential Information"</strong>
                                for the purposes of this Agreement means any and
                                all information, facts, data, documents,
                                materials, designs, analyses, and know-how of
                                any nature (technical, commercial, pricing,
                                financial, legal, manufacturing, strategic,
                                operational, or organizational), in tangible or
                                intangible form, regardless of the manner or
                                medium of transmission (oral, written,
                                electronic, CAD/3D models, drawings,
                                source/binary code, demonstration of prototypes,
                                or software), that the Disclosing Party has
                                directly or indirectly disclosed, provided, or
                                made accessible to the Receiving Party, or of
                                which the Receiving Party became aware in
                                connection with the negotiations or Mutual
                                Collaboration (hereinafter "<strong
                                    >Confidential Information</strong
                                >").
                            </p>

                            <p>
                                <strong>3.2</strong> Confidential Information
                                and <strong>Trade Secrets</strong> within the
                                meaning of Section 504 and Section 1730 of the
                                Civil Code include, without limitation:
                            </p>

                            <ul class="list-disc space-y-2 pl-6">
                                <li>
                                    <strong
                                        >Commercial, pricing, and financial
                                        data:</strong
                                    >
                                    wholesale/retail price lists, margin and
                                    discount structures, sales representative
                                    commission schedules and compensation
                                    models, calculation matrices and formulas,
                                    customized quotes prepared for clients,
                                    commercial and marketing strategies, sales
                                    pipeline, and expansion plans;
                                </li>
                                <li>
                                    <strong
                                        >Customer and partner records:</strong
                                    >
                                    database of client inquiries, contact
                                    details and identities of existing and
                                    prospective customers, sales leads,
                                    negotiation history, CRM records, and terms
                                    negotiated with suppliers and
                                    sub-contractors;
                                </li>
                                <li>
                                    <strong
                                        >Technical documentation and
                                        know-how:</strong
                                    >
                                    engineering drawings, 3D CAD models,
                                    electrical wiring schematics, technical
                                    specifications of solar/wind trees,
                                    composite material specifications,
                                    aerodynamic profiles of microturbines,
                                    inverter integration, electronic
                                    controllers, and battery energy storage
                                    systems;
                                </li>
                                <li>
                                    <strong
                                        >Software, digital assets, and system
                                        credentials:</strong
                                    >
                                    source and binary code, database schemas,
                                    web and cloud applications (specifically
                                    Treetino Pricing / Sales App), API
                                    endpoints, and all user credentials
                                    (usernames, passwords, API tokens, and
                                    certificates) issued to the Receiving Party;
                                </li>
                                <li>
                                    <strong>Strategic and legal assets:</strong>
                                    information regarding pending patents,
                                    utility and industrial designs, investment
                                    discussions, corporate partnerships, and
                                    internal standard operating procedures.
                                </li>
                            </ul>

                            <p>
                                <strong>3.3</strong> Confidential Information
                                also includes the very existence of this
                                Agreement, the fact that negotiations are taking
                                place between the Parties, and all terms and
                                parameters of the Mutual Collaboration.
                            </p>
                            <p>
                                <strong>3.4</strong> All information specified
                                in this Article is hereinafter collectively
                                referred to as "<strong
                                    >Protected Information</strong
                                >". All information disclosed by the Disclosing
                                Party shall be deemed Protected Information
                                unless explicitly designated otherwise in
                                writing by the Disclosing Party.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>3.1 Důvěrnými informacemi</strong> se
                                pro účely této Dohody rozumí veškeré informace,
                                skutečnosti, data, podklady, materiály a
                                know-how jakékoliv povahy (technické, obchodní,
                                finanční, cenové, právní, výrobní, strategické,
                                provozní či organizační), bez ohledu na formu a
                                způsob jejich zachycení nebo sdělení (ústně,
                                písemně, elektronicky, v podobě výkresů, 3D CAD
                                modelů, zdrojových kódů či předvedením prototypů
                                a softwaru), které Poskytovatel Příjemci přímo
                                či nepřímo zpřístupnil, sdělil, předal nebo
                                které se Příjemce v souvislosti s jednáním či
                                Vzájemnou spoluprací dozvěděl (dále jen „<strong
                                    >Důvěrné informace</strong
                                >“).
                            </p>

                            <p>
                                <strong>3.2</strong> Za Důvěrné informace a
                                <strong>obchodní tajemství</strong>
                                Poskytovatele ve smyslu ustanovení § 504 a §
                                1730 občanského zákoníku se považují zejména,
                                nikoliv však výlučně:
                            </p>

                            <ul class="list-disc space-y-2 pl-6">
                                <li>
                                    <strong
                                        >Obchodní, cenové a finanční
                                        informace:</strong
                                    >
                                    prodejní i nákupní ceníky, struktura marží a
                                    slev, provizní řády a odměňovací modely
                                    prodejců, kalkulační matice a vzorce, cenové
                                    nabídky připravované pro zákazníky, obchodní
                                    a marketingové strategie, obchodní pipeline
                                    a plány expanze na tuzemské i zahraniční
                                    trhy;
                                </li>
                                <li>
                                    <strong
                                        >Klientská a partnerská data:</strong
                                    >
                                    databáze poptávek, kontaktů a
                                    identifikačních údajů stávajících i
                                    potenciálních zákazníků, rozpracované
                                    obchodní případy (leads), historie
                                    komunikace s klienty, záznamy v CRM a
                                    obchodních evidencích, a podmínky sjednané s
                                    dodavateli;
                                </li>
                                <li>
                                    <strong
                                        >Technická dokumentace a
                                        know-how:</strong
                                    >
                                    výrobní a konstrukční výkresy, 3D CAD
                                    modely, schémata zapojení, technické
                                    parametry větrných a solárních stromů,
                                    materiálové specifikace kompozitů,
                                    aerodynamické profily mikroturbín, řešení
                                    střídačů, řídicí elektroniky a bateriových
                                    systémů;
                                </li>
                                <li>
                                    <strong
                                        >Software, digitální aktiva a
                                        přístupy:</strong
                                    >
                                    veškeré zdrojové i binární kódy, databázové
                                    struktury, webové a cloudové aplikace
                                    (zejména Treetino Pricing / Sales App),
                                    přístupová rozhraní (API), jakož i veškeré
                                    přístupové údaje (uživatelská jména, hesla,
                                    tokeny a certifikáty) přidělené Příjemci;
                                </li>
                                <li>
                                    <strong
                                        >Strategické a organizační
                                        informace:</strong
                                    >
                                    informace o patentech, užitných a
                                    průmyslových vzorech v přípravě,
                                    investičních jednáních, smluvních vztazích s
                                    partnery a interních provozních postupech.
                                </li>
                            </ul>

                            <p>
                                <strong>3.3</strong> Důvěrnou informací je
                                rovněž samotná existence této Dohody,
                                skutečnost, že mezi Smluvními stranami probíhají
                                jednání, a veškerý obsah a parametry Vzájemné
                                spolupráce.
                            </p>
                            <p>
                                <strong>3.4</strong> Veškeré informace uvedené v
                                tomto článku jsou dále souhrnně označovány jako
                                „<strong>Chráněné informace</strong>“. Má se za
                                to, že veškeré informace předané Poskytovatelem
                                Příjemci jsou Chráněnými informacemi, ledaže
                                Poskytovatel výslovně písemně prohlásí opak.
                            </p>
                        </div>
                    </section>

                    <!-- Článek IV -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'IV. Obligations of the Receiving Party and Data Protection'
                                    : 'IV. Závazky Příjemce a pravidla ochrany informací'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong
                                    >4.1 The Receiving Party irrevocably
                                    covenants and agrees:</strong
                                >
                            </p>
                            <ul class="list-disc space-y-2 pl-6">
                                <li>
                                    To maintain the strictest confidentiality
                                    regarding all Protected Information and to
                                    protect it with the care of a prudent
                                    businessperson and the highest standard of
                                    professional diligence;
                                </li>
                                <li>
                                    To use the Protected Information exclusively
                                    for the performance of the agreed Mutual
                                    Collaboration and solely for the benefit of
                                    the Disclosing Party;
                                </li>
                                <li>
                                    Not to disclose, transfer, make accessible,
                                    disseminate, publish, or otherwise permit
                                    access to the Protected Information to any
                                    third party without the prior express
                                    written consent of the Disclosing Party;
                                </li>
                                <li>
                                    Not to utilize the Protected Information
                                    (including acquired know-how, calculation
                                    models, and customer databases) for its own
                                    commercial benefit or for the benefit of any
                                    third party, in particular not to engage in
                                    direct or indirect competitive activity
                                    against the Disclosing Party nor develop or
                                    offer competing technical or commercial
                                    solutions;
                                </li>
                                <li>
                                    Not to take any steps aimed at circumventing
                                    the Disclosing Party (<strong
                                        >non-circumvention obligation</strong
                                    >), in particular not to directly approach,
                                    contact, or solicit clients, prospects, or
                                    suppliers of the Disclosing Party discovered
                                    in the course of the Mutual Collaboration
                                    for the purpose of concluding transactions
                                    outside of the Disclosing Party.
                                </li>
                            </ul>

                            <p>
                                <strong>4.2 Access Restriction:</strong> The
                                Receiving Party may disclose Protected
                                Information solely to its statutory
                                representatives, employees, and professional
                                advisors who strictly need to know such
                                information for the purposes of the Mutual
                                Collaboration (<em>need-to-know basis</em>). The
                                Receiving Party must ensure that such
                                individuals are bound by confidentiality
                                obligations at least as stringent as those
                                contained herein, and the Receiving Party
                                remains fully liable for any breach committed by
                                such individuals as if it had committed the
                                breach itself.
                            </p>

                            <p>
                                <strong
                                    >4.3 Technical Security Measures:</strong
                                >
                                The Receiving Party undertakes to secure all
                                devices (computers, smartphones, tablets) used
                                to access the Disclosing Party's software and
                                systems with strong passwords, biometric
                                authentication, and two-factor authentication
                                (2FA). The Receiving Party shall not share its
                                credentials with any third party and shall not
                                store Protected Information on public or
                                unencrypted cloud storage.
                            </p>

                            <p>
                                <strong>4.4 Notification Duty:</strong> In the
                                event of discovering any unauthorized access,
                                breach, leakage, loss, or disclosure of
                                Protected Information, the Receiving Party shall
                                immediately (and no later than within 24 hours)
                                notify the Disclosing Party in writing and
                                provide all necessary assistance to mitigate
                                damages.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong
                                    >4.1 Příjemce se tímto neodvolatelně
                                    zavazuje:</strong
                                >
                            </p>
                            <ul class="list-disc space-y-2 pl-6">
                                <li>
                                    Zachovávat o všech Chráněných informacích
                                    nejpřísnější mlčenlivost a chránit je s péčí
                                    řádného hospodáře a nejvyšší možnou mírou
                                    obezřetnosti;
                                </li>
                                <li>
                                    Užívat Chráněné informace výhradně a pouze
                                    za účelem plnění dohodnuté Vzájemné
                                    spolupráce a výhradně ve prospěch
                                    Poskytovatele;
                                </li>
                                <li>
                                    Neposkytnout, nesdělit, nezpřístupnit,
                                    nerozšiřovat, nepublikovat ani neumožnit
                                    přístup k Chráněným informacím žádné třetí
                                    osobě bez předchozího výslovného písemného
                                    souhlasu Poskytovatele;
                                </li>
                                <li>
                                    Nevyužít Chráněné informace (včetně
                                    získaného know-how, kalkulačních modelů a
                                    klientských databází) ve svůj vlastní
                                    prospěch ani ve prospěch jakékoliv třetí
                                    osoby, zejména nevyvíjet přímou ani nepřímou
                                    konkurenční činnost vůči Poskytovateli a
                                    nevyvíjet ani nenabízet obdobná technická či
                                    obchodní řešení;
                                </li>
                                <li>
                                    Nečinit žádné kroky směřující k obcházení
                                    Poskytovatele (<strong
                                        >zákaz obcházení /
                                        non-circumvention</strong
                                    >), zejména nekontaktovat napřímo klienty,
                                    poptávající osoby či dodavatele
                                    Poskytovatele za účelem uzavření obchodu
                                    mimo Poskytovatele.
                                </li>
                            </ul>

                            <p>
                                <strong>4.2 Omezení okruhu osob:</strong>
                                Příjemce je oprávněn zpřístupnit Chráněné
                                informace pouze těm svým statutárním orgánům,
                                zaměstnancům a odborným poradcům, kteří tyto
                                informace nezbytně nutně potřebují k výkonu
                                Vzájemné spolupráce (princip
                                <em>need-to-know</em>). Příjemce je povinen tyto
                                osoby předem prokazatelně a písemně zavázat
                                mlčenlivostí ve stejném rozsahu jako dle této
                                Dohody, přičemž za jakékoliv porušení těmito
                                osobami odpovídá Příjemce tak, jako by se
                                porušení dopustil sám.
                            </p>

                            <p>
                                <strong
                                    >4.3 Technická a bezpečnostní
                                    ochrana:</strong
                                >
                                Příjemce se zavazuje zabezpečit veškerá
                                technická zařízení (počítače, mobilní telefony,
                                tablety), ze kterých přistupuje k softwaru a
                                systémům Poskytovatele, silnými přístupovými
                                hesly a dvoufaktorovým ověřením (2FA). Příjemce
                                nesmí sdělit své přístupové údaje žádné další
                                osobě a nesmí ukládat Chráněné informace na
                                veřejná či nezabezpečená cloudová úložiště.
                            </p>

                            <p>
                                <strong>4.4 Oznamovací povinnost:</strong> V
                                případě zjištění jakéhokoliv neoprávněného
                                přístupu, úniku, ztráty či vyzrazení Chráněných
                                informací je Příjemce povinen neprodleně
                                (nejpozději do 24 hodin) písemně informovat
                                Poskytovatele a poskytnout mu veškerou
                                součinnost k nápravě.
                            </p>
                        </div>
                    </section>

                    <!-- Článek V -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'V. Exceptions to Confidentiality Obligations'
                                    : 'V. Výjimky ze závazku mlčenlivosti'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>5.1</strong> The confidentiality
                                obligation under this Agreement shall not apply
                                to information that:
                            </p>
                            <ul class="list-disc space-y-2 pl-6">
                                <li>
                                    Was demonstrably publicly known at the time
                                    of disclosure, or became publicly known
                                    subsequent to disclosure other than through
                                    a breach of this Agreement by the Receiving
                                    Party;
                                </li>
                                <li>
                                    Was demonstrably and lawfully in the
                                    possession of the Receiving Party prior to
                                    disclosure by the Disclosing Party;
                                </li>
                                <li>
                                    Was released from confidentiality by prior
                                    written consent of the Disclosing Party;
                                </li>
                                <li>
                                    The Receiving Party is obligated to disclose
                                    pursuant to mandatory legal provisions, a
                                    binding court judgment, or an order of a law
                                    enforcement or public authority (provided
                                    that the Receiving Party shall immediately
                                    notify the Disclosing Party in advance in
                                    writing, disclose only the minimum required
                                    scope, and request confidential treatment).
                                </li>
                            </ul>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>5.1</strong> Povinnost mlčenlivosti dle
                                této Dohody se nevztahuje na informace, které:
                            </p>
                            <ul class="list-disc space-y-2 pl-6">
                                <li>
                                    Byly v době jejich zpřístupnění prokazatelně
                                    veřejně známé, nebo se staly veřejně známými
                                    po jejich zpřístupnění jinak než v důsledku
                                    porušení této Dohody či právních předpisů ze
                                    strany Příjemce;
                                </li>
                                <li>
                                    Měl Příjemce prokazatelně k dispozici již
                                    před jejich poskytnutím Poskytovatelem;
                                </li>
                                <li>
                                    Byly uvolněny ze závazku mlčenlivosti na
                                    základě předchozího písemného souhlasu
                                    Poskytovatele;
                                </li>
                                <li>
                                    Je Příjemce povinen zpřístupnit na základě
                                    kogentních právních předpisů, pravomocného
                                    rozhodnutí soudu, policejního orgánu nebo
                                    jiného věcně příslušného orgánu veřejné moci
                                    (s povinností předem písemně informovat
                                    Poskytovatele a minimalizovat rozsah
                                    sdělovaných dat).
                                </li>
                            </ul>
                        </div>
                    </section>

                    <!-- Článek VI -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'VI. Intellectual Property and Return of Materials'
                                    : 'VI. Duševní vlastnictví a nakládání s podklady'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>6.1</strong> All intellectual property
                                rights, trade secrets, patents, utility models,
                                trademarks, copyrights, engineering designs,
                                know-how, databases, and software tools remain
                                the sole and exclusive property of the
                                Disclosing Party. The provision of Protected
                                Information conveys no license, patent right, or
                                title to the Receiving Party.
                            </p>
                            <p>
                                <strong
                                    >6.2 Return and Disposal of
                                    Materials:</strong
                                >
                                Upon written request by the Disclosing Party or
                                at latest within 5 (five) business days
                                following termination of the Mutual
                                Collaboration, the Receiving Party shall return
                                to the Disclosing Party all tangible materials,
                                data carriers, drawings, samples, and documents
                                containing Protected Information, and
                                permanently and irrevocably erase/shred all
                                digital copies and records from all its devices
                                and servers.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>6.1</strong> Veškerá práva k Chráněným
                                informacím, obchodnímu tajemství, patentům,
                                užitným vzorům, ochranným známkám, autorským
                                dílům, konstrukčním řešením, know-how, databázím
                                a softwarovým nástrojům zůstávají výlučným a
                                neomezeným majetkem Poskytovatele. Poskytnutí
                                Chráněných informací nezakládá žádné licenční
                                oprávnění ani převod vlastnických práv.
                            </p>
                            <p>
                                <strong
                                    >6.2 Vrácení a skartace podkladů:</strong
                                >
                                Příjemce je povinen na písemnou výzvu
                                Poskytovatele nebo nejpozději do 5 (pěti)
                                pracovních dnů od ukončení Vzájemné spolupráce
                                vrátit Poskytovateli veškeré hmotné materiály,
                                nosiče dat, výkresy, vzorky a dokumenty
                                obsahující Chráněné informace a veškeré
                                digitální kopie a záznamy trvale a nevratně
                                vymazat/skartovat ze všech svých zařízení.
                            </p>
                        </div>
                    </section>

                    <!-- Článek VII -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'VII. Contractual Penalty and Damages'
                                    : 'VII. Smluvní pokuta a odpovědnost za škodu'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>7.1</strong> In the event of any breach
                                by the Receiving Party of any obligation set
                                forth in this Agreement (including breach of
                                confidentiality, unauthorized disclosure,
                                commercial misuse, breach of
                                non-circumvention/non-compete covenants, or
                                failure to return materials), the Receiving
                                Party shall pay to the Disclosing Party a
                                <strong
                                    >contractual penalty of €4,000 / CZK 100,000
                                    (four thousand Euros / one hundred thousand
                                    Czech crowns)</strong
                                >
                                for each individual breach. In the case of a
                                continuing breach, a contractual penalty of
                                <strong>€200 / CZK 5,000</strong> shall be paid
                                for each day or part thereof during which such
                                breach continues.
                            </p>
                            <p>
                                <strong>7.2</strong> The contractual penalty
                                shall be due and payable within 14 (fourteen)
                                calendar days following delivery of a written
                                demand for payment to the Receiving Party.
                            </p>
                            <p>
                                <strong>7.3 Damages:</strong> The agreement on
                                and payment of a contractual penalty shall not
                                affect or limit the Disclosing Party's right to
                                full compensation for all damages, pecuniary and
                                non-pecuniary losses, and lost profits in full.
                                The Parties
                                <strong
                                    >expressly exclude the application of
                                    Section 2050 of the Civil Code</strong
                                >
                                and agree that claims for damages remain
                                enforceable in full alongside contractual
                                penalties.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>7.1</strong> Poruší-li Příjemce
                                jakoukoliv povinnost stanovenou v této Dohodě
                                (zejména poruší-li povinnost mlčenlivosti,
                                zpřístupní-li Chráněné informace třetí osobě,
                                zneužije-li Chráněné informace pro vlastní
                                prospěch či prospěch třetích osob, poruší-li
                                zákaz obcházení/konkurence nebo nesplní-li
                                povinnost vrácení podkladů), je Příjemce povinen
                                zaplatit Poskytovateli
                                <strong
                                    >smluvní pokutu ve výši 100.000 Kč (slovy:
                                    jedno sto tisíc korun českých)</strong
                                >
                                za každý jednotlivý případ porušení. V případě
                                trvajícího porušení se sjednává smluvní pokuta
                                ve výši <strong>5.000 Kč</strong> za každý
                                započatý den trvání porušení.
                            </p>
                            <p>
                                <strong>7.2</strong> Smluvní pokuta je splatná
                                do 14 (čtrnácti) kalendářních dnů ode dne
                                doručení písemné výzvy k její úhradě Příjemci.
                            </p>
                            <p>
                                <strong>7.3 Náhrada škody:</strong> Ujednáním o
                                smluvní pokutě ani jejím zaplacením není nijak
                                dotčeno ani omezeno právo Poskytovatele na
                                náhradu způsobené škody, jiné majetkové i
                                nemajetkové újmy a ušlého zisku v plné výši.
                                Smluvní strany výslovně
                                <strong
                                    >vylučují aplikaci ustanovení § 2050
                                    občanského zákoníku</strong
                                >
                                a sjednávají, že náhrada škody je vymahatelná v
                                plném rozsahu vedle smluvní pokuty.
                            </p>
                        </div>
                    </section>

                    <!-- Článek VIII -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'VIII. Duration and Effectiveness'
                                    : 'VIII. Doba trvání a účinnost dohody'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>8.1</strong> This Agreement takes effect
                                upon its signature by both Parties and is
                                entered into for an
                                <strong>indefinite term</strong>.
                            </p>
                            <p>
                                <strong>8.2</strong> The confidentiality
                                obligations regarding Protected Information
                                shall survive and remain in effect throughout
                                the duration of negotiations and Mutual
                                Collaboration and for a period of
                                <strong>5 (five) years</strong> following the
                                termination of all collaboration; with respect
                                to information constituting trade secrets or
                                proprietary know-how of the Disclosing Party,
                                confidentiality obligations shall survive
                                indefinitely for as long as such trade secrets
                                exist.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>8.1</strong> Tato Dohoda nabývá
                                platnosti a účinnosti dnem jejího podpisu oběma
                                Smluvními stranami a uzavírá se na
                                <strong>dobu neurčitou</strong>.
                            </p>
                            <p>
                                <strong>8.2</strong> Závazek k ochraně
                                Chráněných informací a zachování mlčenlivosti
                                trvá po celou dobu trvání jednání i samotné
                                Vzájemné spolupráce Smluvních stran a dále po
                                dobu <strong>5 (pěti) let</strong> od faktického
                                ukončení veškeré Vzájemné spolupráce; v případě
                                informací tvořících obchodní tajemství ve smyslu
                                § 504 občanského zákoníku a know-how
                                Poskytovatele trvá závazek mlčenlivosti po celou
                                dobu existence tohoto obchodního tajemství bez
                                časového omezení.
                            </p>
                        </div>
                    </section>

                    <!-- Článek IX -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'IX. Final Provisions'
                                    : 'IX. Závěrečná ustanovení'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>9.1</strong> Legal relations under this
                                Agreement shall be governed by the laws of the
                                Czech Republic, in particular Act No. 89/2012
                                Coll., the Civil Code. Any disputes shall be
                                submitted to the competent general courts of the
                                Czech Republic having jurisdiction over the
                                registered seat of the Disclosing Party.
                            </p>
                            <p>
                                <strong>9.2</strong> Amendments to this
                                Agreement must be made in writing in
                                sequentially numbered addenda signed by both
                                Parties. Should any provision be deemed invalid,
                                the remaining provisions shall remain fully
                                effective (severability clause).
                            </p>
                            <p>
                                <strong>9.3</strong> This Agreement is executed
                                in counterparts with the force of an original,
                                or in an electronic format executed via
                                recognized electronic signatures by both
                                Parties.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>9.1</strong> Právní vztahy založené
                                touto Dohodou se řídí právním řádem České
                                republiky, zejména zákonem č. 89/2012 Sb.,
                                občanský zákoník. Případné spory budou
                                rozhodovány věcně a místně příslušnými obecnými
                                soudy České republiky podle sídla Poskytovatele.
                            </p>
                            <p>
                                <strong>9.2</strong> Veškeré změny a doplňky
                                této Dohody vyžadují písemnou formu vzestupně
                                číslovaných dodatků podepsaných oběma Smluvními
                                stranami. Neplatnost některého ustanovení se
                                nedotýká platnosti ostatních ustanovení
                                (salvátorská klauzule).
                            </p>
                            <p>
                                <strong>9.3</strong> Tato Dohoda je vyhotovena
                                ve dvou stejnopisech s platností originálu (po
                                jednom pro každou stranu), popřípadě v jednom
                                elektronickém vyhotovení opatřeném
                                elektronickými podpisy obou Smluvních stran.
                            </p>
                        </div>
                    </section>

                    <!-- Podpisová doložka -->
                    <section
                        class="mt-16 rounded-2xl border border-black/10 bg-stone-50/70 p-6 sm:p-8 dark:border-white/10 dark:bg-stone-900/40"
                    >
                        <h3
                            class="text-base font-bold text-slate-950 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'Signatures of the Contracting Parties'
                                    : 'Podpisová doložka'
                            }}
                        </h3>
                        <p
                            class="mt-1 text-sm text-slate-600 dark:text-slate-400"
                        >
                            {{
                                isEn
                                    ? 'In witness of their free, serious, and unambiguous intent, the Parties hereto attach their signatures:'
                                    : 'Na důkaz svobodného, vážného a srozumitelného projevu vůle připojují Smluvní strany své podpisy:'
                            }}
                        </p>

                        <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                            <!-- Poskytovatel -->
                            <div
                                class="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-950"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-slate-500 uppercase"
                                >
                                    {{
                                        isEn
                                            ? 'For Disclosing Party (Treetino)'
                                            : 'Za Poskytovatele'
                                    }}
                                </div>
                                <div
                                    class="mt-2 text-base font-bold text-slate-950 dark:text-white"
                                >
                                    Treetino corp s.r.o.
                                </div>
                                <div class="mt-1 text-xs text-slate-500">
                                    {{
                                        isEn
                                            ? 'In Bílá / Prague on: July 21, 2026'
                                            : 'V Bílé / Praze dne 21. 7. 2026'
                                    }}
                                </div>

                                <div
                                    class="my-6 flex h-20 items-center justify-center rounded-lg border border-dashed border-black/20 bg-slate-50 dark:border-white/20 dark:bg-zinc-900"
                                >
                                    <img
                                        src="/img/legal/dominik-signature.png"
                                        class="h-12 w-auto object-contain dark:invert"
                                        alt="Podpis Dominik Mašek"
                                    />
                                </div>

                                <div
                                    class="text-sm font-semibold text-slate-900 dark:text-white"
                                >
                                    Dominik Mašek
                                </div>
                                <div class="text-xs text-slate-500">
                                    {{
                                        isEn
                                            ? 'Managing Director, Treetino corp s.r.o.'
                                            : 'Jednatel, Treetino corp s.r.o.'
                                    }}
                                </div>
                            </div>

                            <!-- Partner -->
                            <div
                                class="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-950"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-slate-500 uppercase"
                                >
                                    {{
                                        isEn
                                            ? 'For Receiving Party (Partner)'
                                            : 'Za Příjemce'
                                    }}
                                </div>
                                <div
                                    class="mt-2 text-base font-bold text-slate-950 dark:text-white"
                                >
                                    {{
                                        isEn
                                            ? '[ Sales Partner / Agent ]'
                                            : 'Obchodní partner / Prodejce'
                                    }}
                                </div>
                                <div class="mt-1 text-xs text-slate-500">
                                    {{
                                        isEn
                                            ? 'In ............................ on ............................'
                                            : 'V ............................ dne ............................'
                                    }}
                                </div>

                                <div
                                    class="my-6 flex h-20 items-center justify-center rounded-lg border border-dashed border-black/20 bg-slate-50 text-xs font-medium text-slate-400 dark:border-white/20 dark:bg-zinc-900"
                                >
                                    {{
                                        isEn
                                            ? '[ Handwritten / Digital Signature ]'
                                            : '[ Vlastnoruční / Digitální podpis ]'
                                    }}
                                </div>

                                <div
                                    class="text-sm font-semibold text-slate-900 dark:text-white"
                                >
                                    {{
                                        isEn
                                            ? 'Full Name: ........................................'
                                            : 'Jméno a příjmení: ........................................'
                                    }}
                                </div>
                                <div class="text-xs text-slate-500">
                                    {{
                                        isEn
                                            ? 'Capacity / Title: ........................................'
                                            : 'Funkce / Oprávnění: ........................................'
                                    }}
                                </div>
                            </div>
                        </div>

                        <!-- Bottom Download CTA -->
                        <div
                            class="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-black/10 pt-6 dark:border-white/10 print:hidden"
                        >
                            <template v-if="isEn">
                                <a
                                    href="/legal/nda/download?lang=en"
                                    class="inline-flex items-center gap-2 rounded-xl bg-t-blue px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                                >
                                    <Download class="h-4 w-4" />
                                    <span>Download PDF (English)</span>
                                </a>
                                <a
                                    href="/legal/nda/download?lang=cs"
                                    class="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                                >
                                    <Download class="h-4 w-4" />
                                    <span>Stáhnout PDF (Česky)</span>
                                </a>
                                <button
                                    type="button"
                                    @click="printPage"
                                    class="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-5 py-3.5 text-sm font-medium text-slate-800 shadow-2xs transition hover:bg-slate-50 dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                                >
                                    <Printer class="h-4 w-4" />
                                    <span>Print</span>
                                </button>
                            </template>
                            <template v-else>
                                <a
                                    href="/legal/nda/download?lang=cs"
                                    class="inline-flex items-center gap-2 rounded-xl bg-t-blue px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                                >
                                    <Download class="h-4 w-4" />
                                    <span>Stáhnout PDF (Česky)</span>
                                </a>
                                <a
                                    href="/legal/nda/download?lang=en"
                                    class="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-5 py-3.5 text-sm font-semibold text-slate-800 shadow-2xs transition hover:bg-slate-50 dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                                >
                                    <Download class="h-4 w-4" />
                                    <span>Download PDF (English)</span>
                                </a>
                                <button
                                    type="button"
                                    @click="printPage"
                                    class="inline-flex items-center gap-2 rounded-xl border border-black/15 bg-white px-5 py-3.5 text-sm font-medium text-slate-800 shadow-2xs transition hover:bg-slate-50 dark:border-white/20 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800"
                                >
                                    <Printer class="h-4 w-4" />
                                    <span>Vytisknout</span>
                                </button>
                            </template>
                        </div>
                    </section>
                </article>
            </main>
        </div>
    </DefaultLayout>
</template>

<style scoped>
@media print {
    :deep(header),
    :deep(footer),
    .buffer,
    .print\:hidden {
        display: none !important;
    }

    .page {
        padding: 0 !important;
    }
}
</style>
