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
    <Head :title="`${$t('legal.mediation.title')} | Treetino`" />

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
                                    ? 'Legal Document • Commercial Agency & Brokerage Agreement'
                                    : 'Právní dokument • Obchodní zastoupení & Zprostředkování'
                            }}
                        </span>
                        <h1
                            class="mt-3 text-3xl leading-tight font-medium tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'Commercial Brokerage and Mediation Agreement'
                                    : 'Smlouva o zprostředkování'
                            }}
                        </h1>
                        <p
                            class="mt-3 text-sm text-slate-600 sm:text-base dark:text-slate-400"
                        >
                            {{
                                isEn
                                    ? 'concluded pursuant to Section 2445 et seq. of Act No. 89/2012 Coll., the Civil Code, as amended.'
                                    : 'Uzavřená dle ustanovení § 2445 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů.'
                            }}
                        </p>
                    </div>

                    <div
                        class="flex shrink-0 flex-wrap items-center gap-3 print:hidden"
                    >
                        <template v-if="isEn">
                            <a
                                href="/legal/mediation/download?lang=en"
                                class="inline-flex items-center gap-2 rounded-xl bg-t-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                            >
                                <Download class="h-4 w-4" />
                                <span>Download PDF (English)</span>
                            </a>
                            <a
                                href="/legal/mediation/download?lang=cs"
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
                                href="/legal/mediation/download?lang=cs"
                                class="inline-flex items-center gap-2 rounded-xl bg-t-blue px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                            >
                                <Download class="h-4 w-4" />
                                <span>Stáhnout PDF (Česky)</span>
                            </a>
                            <a
                                href="/legal/mediation/download?lang=en"
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
                    <!-- Článek I / Article I -->
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
                                    ? 'On the date specified below, the following Contracting Parties enter into this Commercial Brokerage and Mediation Agreement (hereinafter referred to as the "Agreement"):'
                                    : 'Smluvní strany uzavírají níže uvedeného dne, měsíce a roku tuto Smlouvu o zprostředkování (dále jen „Smlouva“):'
                            }}
                        </p>

                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <!-- Zájemce / Principal -->
                            <div
                                class="rounded-2xl border border-t-blue/30 bg-blue-50/40 p-6 shadow-xs dark:border-t-blue/40 dark:bg-blue-950/20"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-t-blue uppercase"
                                >
                                    {{
                                        isEn
                                            ? '1.1 Principal (Company)'
                                            : '1.1 Zájemce (Společnost)'
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
                                                isEn ? 'VAT ID (DIČ):' : 'DIČ:'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-semibold text-slate-900 dark:text-white"
                                        >
                                            CZ10800107
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
                                                    ? 'Vlčetín 62, Bílá 463 43, Czech Republic'
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
                                                isEn ? 'Register:' : 'Rejstřík:'
                                            }}
                                        </dt>
                                        <dd
                                            class="font-semibold text-slate-900 dark:text-white"
                                        >
                                            {{
                                                isEn
                                                    ? 'Regional Court Ústí n. L., Sec. C, Ins. 48430'
                                                    : 'KS v Ústí n. L., oddíl C, vl. 48430'
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
                                            ? '(hereinafter referred to as the "Principal" or "Treetino")'
                                            : '(dále jen jako „Zájemce“ nebo „Treetino“)'
                                    }}
                                </div>
                            </div>

                            <!-- Zprostředkovatel / Broker -->
                            <div
                                class="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-xs dark:border-slate-800 dark:bg-zinc-900/60"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400"
                                >
                                    {{
                                        isEn
                                            ? '1.2 Broker (Partner / Sales Agent)'
                                            : '1.2 Zprostředkovatel (Partner / Prodejce)'
                                    }}
                                </div>
                                <h3
                                    class="mt-1 text-lg font-bold text-slate-950 dark:text-white"
                                >
                                    {{
                                        isEn
                                            ? 'Sales Partner / Broker'
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
                                                    ? 'Email / Phone:'
                                                    : 'E-mail / Telefon:'
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
                                            ? '(hereinafter referred to as the "Broker" or "Partner")'
                                            : '(dále jen jako „Zprostředkovatel“ nebo „Partner“)'
                                    }}
                                </div>
                            </div>
                        </div>

                        <p
                            class="mt-4 text-xs text-slate-500 italic dark:text-slate-400"
                        >
                            {{
                                isEn
                                    ? '(Principal and Broker hereinafter collectively referred to as the "Parties", or individually as a "Party")'
                                    : '(Zájemce a Zprostředkovatel dále společně také jen jako „Smluvní strany“, nebo každý samostatně jako „Smluvní strana“)'
                            }}
                        </p>
                    </section>

                    <!-- Článek II / Article II -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'II. Subject of Agreement'
                                    : 'II. Předmět smlouvy'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>2.1</strong> The Broker hereby
                                undertakes to actively conduct brokerage and
                                mediation activities on behalf of the Principal,
                                aimed at enabling the Principal to conclude
                                contracts of sale or supply contracts with third
                                parties (hereinafter "<strong>Clients</strong>")
                                for the supply of the Principal's products and
                                solutions.
                            </p>
                            <p>
                                <strong>2.2</strong> The subject of brokerage
                                consists exclusively of the innovative products
                                presented at www.treetino.com (and
                                www.treetino.eu), specifically autonomous energy
                                trees <strong>Treetino V1</strong>,
                                <strong>Treetino V2</strong>, standalone
                                vertical wind micro-turbines, and related
                                technological accessories (hereinafter
                                "<strong>Products</strong>").
                            </p>
                            <p>
                                <strong>2.3</strong> The Broker is authorized to
                                actively present and market the Products to
                                prospective Clients on agreed territories.
                                However, without prior express written power of
                                attorney from the Principal, the Broker is not
                                entitled to enter into contracts or accept
                                financial or other performance on behalf of the
                                Principal.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>2.1</strong> Zprostředkovatel se touto
                                smlouvou zavazuje vyvíjet činnost směřující k
                                tomu, aby Zájemce měl příležitost uzavřít s
                                třetími osobami (dále jen
                                „<strong>Klienti</strong>“) kupní smlouvy nebo
                                smlouvy o dílo na dodávku produktů a systémů
                                Zájemce.
                            </p>
                            <p>
                                <strong>2.2</strong> Předmětem zprostředkování
                                jsou výhradně inovativní produkty Zájemce
                                prezentované na webové stránce www.treetino.com
                                (případně www.treetino.eu), a to konkrétně
                                autonomní hybridní stromy
                                <strong>Treetino V1</strong>,
                                <strong>Treetino V2</strong>, samostatné
                                vertikální větrné mikroturbíny a související
                                technologické příslušenství (dále jen
                                „<strong>Produkty</strong>“).
                            </p>
                            <p>
                                <strong>2.3</strong> Zprostředkovatel je
                                oprávněn Produkty aktivně nabízet, prezentovat a
                                vyhledávat zájemce na dohodnutém území.
                                Zprostředkovatel však není bez předchozí písemné
                                plné moci oprávněn za Zájemce uzavírat jakékoliv
                                smlouvy ani přijímat peněžitá či jiná plnění.
                            </p>
                        </div>
                    </section>

                    <!-- Článek III / Article III -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'III. Commission Terms and Payouts'
                                    : 'III. Provize a platební podmínky'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>3.1</strong> For procuring the
                                opportunity to conclude a transaction with a
                                Client, the Broker is entitled to a commission
                                of
                                <strong
                                    >3% of the net contract value excluding
                                    VAT</strong
                                >
                                for each successfully completed transaction, or
                                a commission tier corresponding to the Broker's
                                performance standing (Silver, Gold, Platinum).
                                This entitlement also arises if the Broker
                                establishes the verified lead and the final
                                commercial negotiation is concluded by the
                                Principal.
                            </p>
                            <p>
                                <strong>3.2</strong> Entitlement to the
                                commission arises exclusively upon full receipt
                                and clearance of the Client's initial payment
                                (deposit invoice or first contract milestone)
                                into the Principal's bank account.
                            </p>
                            <p>
                                <strong>3.3</strong> The commission is payable
                                within 14 calendar days of receipt of payment
                                from the Client, based on a compliant tax
                                invoice duly issued by the Broker.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>3.1</strong> Za obstarání příležitosti k
                                uzavření smlouvy s Klientem náleží
                                Zprostředkovateli provize ve výši
                                <strong
                                    >3 % z čisté prodejní ceny bez DPH</strong
                                >
                                u každého takto realizovaného obchodu, případně
                                provize odpovídající zařazení Zprostředkovatele
                                ve výkonnostní třídě B2B partnerského portálu
                                (Silver, Gold, Platinum). Nárok na tuto provizi
                                vzniká Zprostředkovateli ve stejné výši i v
                                případě, že Zprostředkovatel zajistí
                                prokazatelný kontakt a ověřenou poptávku (lead)
                                a samotné finální smluvní jednání dokončí
                                Zájemce.
                            </p>
                            <p>
                                <strong>3.2</strong> Nárok na provizi vzniká
                                Zprostředkovateli výlučně v okamžiku, kdy Klient
                                v plné výši uhradí Zájemci první vystavenou
                                fakturu (např. zálohovou fakturu či platbu za
                                první etapu) vztahující se k předmětnému
                                obchodu.
                            </p>
                            <p>
                                <strong>3.3</strong> Provize je splatná na
                                základě daňového dokladu (faktury) řádně
                                vystaveného Zprostředkovatelem. Lhůta splatnosti
                                činí 14 kalendářních dnů ode dne, kdy byla
                                příslušná platba od Klienta prokazatelně
                                připsána na bankovní účet Zájemce.
                            </p>
                        </div>
                    </section>

                    <!-- Článek IV / Article IV -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'IV. Intellectual Property, Trade Secrets & NDA'
                                    : 'IV. Ochrana práv, know-how a mlčenlivost (NDA)'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>4.1 Intellectual Property:</strong> The
                                Broker acknowledges that the Products, software,
                                and technologies are subject to patent,
                                industrial design, utility model, and trademark
                                protections owned by the Principal. The Broker
                                is strictly prohibited from copying, reverse
                                engineering, or assisting any third party in
                                unauthorized utilization of the Principal's
                                technology.
                            </p>
                            <p>
                                <strong
                                    >4.2 Trade Secrets &
                                    Confidentiality:</strong
                                >
                                All technical, pricing, calculation models
                                within the Treetino Pricing app, customer
                                databases, and marketing strategies constitute
                                proprietary trade secrets of the Principal.
                            </p>
                            <p>
                                <strong>4.3 Confidentiality Obligation:</strong>
                                The Broker undertakes to maintain strict
                                confidentiality during the term of this
                                Agreement and for a period of 5 (five) years
                                following its termination; and indefinitely with
                                respect to statutory trade secrets and
                                proprietary technical know-how.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong
                                    >4.1 Práva duševního vlastnictví:</strong
                                >
                                Zprostředkovatel výslovně bere na vědomí, že
                                Produkty a technologie Treetino podléhají
                                patentové ochraně, ochraně průmyslových vzorů,
                                užitných vzorů a ochranných známek ve
                                vlastnictví Zájemce. Zprostředkovatel nesmí
                                Produkty napodobovat, reverzně analyzovat
                                (reverse engineering) ani poskytnout součinnost
                                třetí osobě k neoprávněnému využití technologií
                                Zájemce.
                            </p>
                            <p>
                                <strong
                                    >4.2 Obchodní tajemství a důvěrné
                                    informace:</strong
                                >
                                Veškeré obchodní, technické, kalkulační a
                                finanční informace, včetně informací o
                                cenotvorbě, provizních schématech, kalkulačních
                                modelech v aplikaci Treetino Pricing a
                                databázích klientů, se kterými se
                                Zprostředkovatel seznámí, tvoří přísně chráněné
                                obchodní tajemství Zájemce.
                            </p>
                            <p>
                                <strong>4.3 Závazek mlčenlivosti:</strong>
                                Zprostředkovatel se zavazuje zachovávat
                                absolutní mlčenlivost o všech důvěrných
                                informacích po celou dobu trvání této smlouvy a
                                po dobu 5 (pěti) let po jejím zániku; v případě
                                informací tvořících obchodní tajemství bez
                                časového omezení.
                            </p>
                        </div>
                    </section>

                    <!-- Článek V / Article V -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'V. Contractual Penalties and Damages'
                                    : 'V. Smluvní pokuty a náhrada škody'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>5.1</strong> In the event of any breach
                                of the obligations specified in Article IV by
                                the Broker, the Broker shall pay the Principal a
                                contractual penalty of
                                <strong
                                    >CZK 500,000 (five hundred thousand Czech
                                    Crowns)</strong
                                >
                                for each individual violation.
                            </p>
                            <p>
                                <strong>5.2</strong> The right to claim full
                                damages, loss of profits, and injunctive relief
                                exceeding the contractual penalty remains
                                completely unaffected and directly enforceable.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>5.1</strong> V případě porušení
                                povinností stanovených v čl. IV. této smlouvy je
                                Zprostředkovatel povinen uhradit Zájemci smluvní
                                pokutu ve výši
                                <strong
                                    >500.000 Kč (slovy: pět set tisíc korun
                                    českých)</strong
                                >
                                za každý jednotlivý případ porušení.
                            </p>
                            <p>
                                <strong>5.2</strong> Ujednáním o smluvní pokutě
                                ani jejím uhrazením není dotčen nárok Zájemce na
                                náhradu způsobené škody v plné výši,
                                přesahuje-li výše vzniklé škody sjednanou
                                smluvní pokutu.
                            </p>
                        </div>
                    </section>

                    <!-- Článek VI / Article VI -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'VI. Duration and Final Provisions'
                                    : 'VI. Doba trvání a závěrečná ustanovení'
                            }}
                        </h2>

                        <div v-if="isEn" class="space-y-4">
                            <p>
                                <strong>6.1</strong> This Agreement is concluded
                                for an indefinite duration. Either Party may
                                terminate this Agreement without giving cause by
                                giving 1 month's written notice, commencing on
                                the first day of the calendar month following
                                delivery.
                            </p>
                            <p>
                                <strong>6.2</strong> Legal relationships
                                established hereunder are governed by the laws
                                of the Czech Republic, particularly Act No.
                                89/2012 Coll., the Civil Code. Any disputes
                                shall be settled by the competent courts of the
                                Czech Republic having jurisdiction over the
                                Principal's registered seat.
                            </p>
                            <p>
                                <strong>6.3</strong> This Agreement is executed
                                in two counterparts, each having the force of an
                                original, or in an electronic counterpart
                                executed with valid electronic signatures.
                            </p>
                            <p>
                                <strong>6.4</strong> The Parties declare that
                                they have read and understood this Agreement,
                                enter into it freely, seriously, and knowingly,
                                and affix their signatures in witness thereof.
                            </p>
                        </div>
                        <div v-else class="space-y-4">
                            <p>
                                <strong>6.1</strong> Tato smlouva se uzavírá na
                                dobu neurčitou. Smlouvu lze ukončit písemnou
                                výpovědí kterékoliv ze Smluvních stran i bez
                                uvedení důvodu s výpovědní dobou 1 měsíc, která
                                počíná běžet prvním dnem kalendářního měsíce
                                následujícího po doručení výpovědi.
                            </p>
                            <p>
                                <strong>6.2</strong> Právní vztahy založené
                                touto smlouvou se řídí právním řádem České
                                republiky, zejména zákonem č. 89/2012 Sb.,
                                občanský zákoník. Případné spory budou řešeny
                                věcně a místně příslušným soudem podle sídla
                                Zájemce.
                            </p>
                            <p>
                                <strong>6.3</strong> Smlouva je vyhotovena ve
                                dvou stejnopisech s platností originálu, z nichž
                                každá Smluvní strana obdrží po jednom
                                vyhotovení, popřípadě v elektronickém vyhotovení
                                opatřeném elektronickými podpisy obou Smluvních
                                stran.
                            </p>
                            <p>
                                <strong>6.4</strong> Smluvní strany prohlašují,
                                že si tuto smlouvu před jejím podpisem přečetly,
                                porozuměly jejímu obsahu a uzavírají ji ze své
                                svobodné a vážné vůle, na důkaz čehož připojují
                                své podpisy.
                            </p>
                        </div>
                    </section>

                    <!-- Podpisy / Signatures -->
                    <section
                        class="mt-16 rounded-2xl border border-black/10 bg-slate-50/50 p-6 sm:p-10 dark:border-white/10 dark:bg-zinc-900/50"
                    >
                        <h3
                            class="mb-6 text-lg font-bold text-slate-950 uppercase dark:text-white"
                        >
                            {{
                                isEn
                                    ? 'Signatures of the Contracting Parties'
                                    : 'Podpisy smluvních stran'
                            }}
                        </h3>

                        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <!-- Zájemce / Principal -->
                            <div
                                class="rounded-xl border border-black/10 bg-white p-6 shadow-2xs dark:border-white/10 dark:bg-zinc-900"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-t-blue uppercase"
                                >
                                    {{
                                        isEn
                                            ? 'For Principal (Treetino)'
                                            : 'Za Zájemce (Treetino)'
                                    }}
                                </div>
                                <div
                                    class="mt-2 text-sm font-semibold text-slate-900 dark:text-white"
                                >
                                    Treetino corp s.r.o.
                                </div>
                                <div
                                    class="text-xs text-slate-500 dark:text-slate-400"
                                >
                                    {{
                                        isEn
                                            ? 'In Prague / Bílá on: July 21, 2026'
                                            : 'V Bílé / Praze dne: 21. 7. 2026'
                                    }}
                                </div>

                                <!-- Handwritten Signature Graphic -->
                                <div
                                    class="my-4 flex h-24 items-center justify-center rounded-lg border border-dashed border-black/20 bg-slate-50/80 p-2 dark:border-white/20 dark:bg-zinc-800/60"
                                >
                                    <img
                                        src="/img/legal/dominik-signature.png"
                                        alt="Podpis Dominik Mašek"
                                        class="h-16 w-auto object-contain"
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

                            <!-- Zprostředkovatel / Broker -->
                            <div
                                class="rounded-xl border border-black/10 bg-white p-6 shadow-2xs dark:border-white/10 dark:bg-zinc-900"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400"
                                >
                                    {{
                                        isEn
                                            ? 'For Broker (Partner)'
                                            : 'Za Zprostředkovatele'
                                    }}
                                </div>
                                <div
                                    class="mt-2 text-sm font-semibold text-slate-900 dark:text-white"
                                >
                                    {{
                                        isEn
                                            ? '[ Sales Partner / Broker ]'
                                            : '[ Obchodní partner / Firma ]'
                                    }}
                                </div>
                                <div
                                    class="text-xs text-slate-500 dark:text-slate-400"
                                >
                                    {{
                                        isEn
                                            ? 'In ........................................ on: ............................'
                                            : 'V ........................................ dne: ............................'
                                    }}
                                </div>

                                <div
                                    class="my-4 flex h-24 items-center justify-center rounded-lg border border-dashed border-black/20 bg-slate-50 text-xs font-medium text-slate-400 dark:border-white/20 dark:bg-zinc-800/60"
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
                                    href="/legal/mediation/download?lang=en"
                                    class="inline-flex items-center gap-2 rounded-xl bg-t-blue px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                                >
                                    <Download class="h-4 w-4" />
                                    <span>Download PDF (English)</span>
                                </a>
                                <a
                                    href="/legal/mediation/download?lang=cs"
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
                                    href="/legal/mediation/download?lang=cs"
                                    class="inline-flex items-center gap-2 rounded-xl bg-t-blue px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-600"
                                >
                                    <Download class="h-4 w-4" />
                                    <span>Stáhnout PDF (Česky)</span>
                                </a>
                                <a
                                    href="/legal/mediation/download?lang=en"
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
