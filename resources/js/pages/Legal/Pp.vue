<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const processingPurposes = [
    [
        'Vyřízení objednávky, provedení prohlídky, zpracování nabídky, uzavření a plnění smlouvy o dílo, komunikace se zákazníkem',
        'plnění smlouvy - čl. 6 odst. 1 písm. b) GDPR',
        'po dobu trvání smluvního vztahu',
    ],
    [
        'Vedení účetnictví, vystavování a evidence daňových dokladů',
        'plnění právní povinnosti - čl. 6 odst. 1 písm. c) GDPR',
        'po dobu stanovenou právními předpisy, zpravidla 10 let',
    ],
    [
        'Určení, výkon a obhajoba právních nároků ze smlouvy (vč. práv ze záruky a odpovědnosti za vady)',
        'oprávněný zájem - čl. 6 odst. 1 písm. f) GDPR',
        'po dobu trvání promlčecích lhůt, nejdéle [●] let od zániku smlouvy',
    ],
    [
        'Přímý marketing - zasílání obchodních sdělení stávajícím zákazníkům o obdobných službách Správce',
        'oprávněný zájem - čl. 6 odst. 1 písm. f) GDPR, § 7 odst. 3 zák. č. 480/2004 Sb.',
        'do vznesení námitky / odhlášení',
    ],
    [
        'Zasílání obchodních sdělení osobám, které nejsou zákazníky Správce',
        'souhlas - čl. 6 odst. 1 písm. a) GDPR',
        'do odvolání souhlasu, nejdéle [●] let',
    ],
];

const sections = [
    {
        number: 1,
        title: 'SPRÁVCE OSOBNÍCH ÚDAJŮ',
        paragraphs: [
            'Správcem osobních údajů je společnost Treetino corp s.r.o., IČO: 10800107, se sídlem Český Šternberk 9, 257 26 (dále jen „Správce“). Kontakt: e-mail info@wattino.eu, tel. 730 587 857.',
            'Správce nejmenoval pověřence pro ochranu osobních údajů; povinnost jmenování se na něj nevztahuje.',
        ],
    },
    {
        number: 2,
        title: 'ROZSAH ZPRACOVÁVANÝCH ÚDAJŮ',
        paragraphs: [
            'Správce zpracovává osobní údaje, které mu subjekt údajů sám poskytl v souvislosti s objednávkou služeb prostřednictvím e-shopu www.wattino.eu, poptávkou nebo uzavřením smlouvy, a údaje vzniklé při plnění smlouvy. Jde zejména o: identifikační údaje (jméno, příjmení, u podnikatelů IČO a DIČ), kontaktní údaje (e-mail, telefon, doručovací a fakturační adresa), adresu a popis objektu, na němž má být provedena prohlídka či dílo, dokumentaci pořízenou při prohlídce objektu (zaměření, fotografie objektu), platební a fakturační údaje a obsah vzájemné komunikace.',
            'Fotografie a další dokumentace objektu mohou v jednotlivých případech zachycovat i prostory obytného domu; Správce je pořizuje a zpracovává výhradně v rozsahu nezbytném pro zpracování nabídky a provedení díla.',
        ],
    },
    {
        number: 4,
        title: 'PŘÍJEMCI OSOBNÍCH ÚDAJŮ',
        paragraphs: [
            'Správce předává osobní údaje pouze těmto kategoriím příjemců: provozovatel platební brány [●] (zpracování plateb), poskytovatel e-shopové platformy a hostingu [●], externí účetní kancelář [●], subdodavatelé podílející se na provedení prohlídky či díla (v rozsahu jméno, kontakt a adresa objektu) a poskytovatelé doručovacích služeb. S příjemci v postavení zpracovatelů má Správce uzavřeny smlouvy o zpracování osobních údajů dle čl. 28 GDPR.',
            'Správce nepředává osobní údaje do třetích zemí mimo EU/EHP ani mezinárodním organizacím. Při zpracovávání osobních údajů nedochází k automatizovanému rozhodování ani profilování ve smyslu čl. 22 GDPR.',
        ],
    },
    {
        number: 5,
        title: 'PRÁVA SUBJEKTU ÚDAJŮ',
        paragraphs: [
            'Subjekt údajů má právo na přístup ke svým osobním údajům (čl. 15 GDPR), na jejich opravu (čl. 16), výmaz (čl. 17), omezení zpracování (čl. 18), na přenositelnost údajů (čl. 20) a právo vznést námitku proti zpracování založenému na oprávněném zájmu, včetně přímého marketingu (čl. 21).',
            'Je-li zpracování založeno na souhlasu, má subjekt údajů právo souhlas kdykoli odvolat, aniž je tím dotčena zákonnost zpracování před jeho odvoláním. Odvolání lze učinit e-mailem na info@wattino.eu nebo prostřednictvím odkazu v každém obchodním sdělení.',
            'Svá práva subjekt údajů uplatňuje u Správce na kontaktech uvedených v čl. 1. Správce vyřídí žádost bez zbytečného odkladu, nejpozději do jednoho měsíce od jejího obdržení; tuto lhůtu lze v odůvodněných případech prodloužit o další dva měsíce.',
            'Subjekt údajů má právo podat stížnost u dozorového úřadu, kterým je Úřad pro ochranu osobních údajů, Pplk. Sochora 27, 170 00 Praha 7, www.uoou.gov.cz.',
        ],
    },
    {
        number: 6,
        title: 'COOKIES',
        paragraphs: [
            'Používání souborů cookies a obdobných technologií na www.wattino.eu se řídí samostatnými zásadami používání cookies dostupnými na [●]. Technické cookies nezbytné pro provoz e-shopu jsou zpracovávány na základě oprávněného zájmu; ostatní cookies pouze na základě souhlasu uděleného prostřednictvím cookies lišty.',
        ],
    },
    {
        number: 7,
        title: 'ZÁVĚREČNÁ USTANOVENÍ',
        paragraphs: [
            'Správce je oprávněn tyto zásady aktualizovat; aktuální znění je vždy dostupné na www.wattino.eu. Tyto zásady nabývají účinnosti dnem [●].',
        ],
    },
];

const checkoutTexts = [
    {
        title: 'Povinný checkbox - obchodní podmínky (nezaškrtnutý ve výchozím stavu):',
        text: '☐ Seznámil(a) jsem se s obchodními podmínkami [odkaz] a souhlasím s nimi.',
    },
    {
        title: 'Povinný samostatný checkbox - zahájení prohlídky před uplynutím lhůty pro odstoupení (nezaškrtnutý ve výchozím stavu, nesmí být sloučen s checkboxem č. 1):',
        text: '☐ Výslovně žádám, aby prohlídka, zaměření a zpracování projektu a rozpočtu byly zahájeny před uplynutím 14denní lhůty pro odstoupení od smlouvy. Beru na vědomí, že úplným provedením těchto služeb ztrácím právo odstoupit od smlouvy (§ 1837 písm. a) občanského zákoníku).',
    },
    {
        title: 'Informace o zpracování osobních údajů (bez checkboxu - pouze text pod tlačítkem objednávky; zpracování je založeno na plnění smlouvy, souhlas se nevyžaduje a jeho vyžadování by bylo matoucí):',
        text: 'Odesláním objednávky berete na vědomí zásady zpracování osobních údajů [odkaz].',
    },
    {
        title: 'Volitelný checkbox - marketing (nezaškrtnutý ve výchozím stavu, jeho nezaškrtnutí nesmí bránit odeslání objednávky):',
        text: '☐ Souhlasím se zasíláním obchodních sdělení a novinek Treetino corp s.r.o. na můj e-mail. Souhlas mohu kdykoli odvolat.',
    },
    {
        title: 'Text objednávkového tlačítka (§ 1826a odst. 2 OZ - povinná formulace zakládající povinnost platby):',
        text: '„Objednávka zavazující k platbě“ (případně „Závazně objednat a zaplatit 10.000 Kč“). Nepřípustné jsou formulace typu „Pokračovat“, „Odeslat“ nebo „Dokončit“.',
    },
    {
        title: 'Potvrzení druhé fáze - Objednávka Díla (tlačítko potvrzení Nabídky v e-shopu):',
        text: '☐ Seznámil(a) jsem se s nabídkou č. [●] a obchodními podmínkami [odkaz] a závazně ji potvrzuji. Beru na vědomí, že potvrzením nabídky uzavírám smlouvu o smlouvě budoucí a zavazuji se uzavřít smlouvu o dílo za podmínek uvedených v nabídce.',
        note: 'Tlačítko: „Závazně potvrdit nabídku“. U spotřebitele následně e-mailem potvrzení s poučením o 14denním právu na odstoupení od smlouvy o smlouvě budoucí (čl. 7.6 Podmínek).',
    },
];
</script>

<template>
    <Head title="Zásady zpracování osobních údajů" />

    <DefaultLayout :scroll="false" class="relative">
        <div class="absolute h-90 w-full bg-blue-50">
            <div
                class="absolute bottom-0 h-30 w-full bg-linear-to-b from-transparent to-white"
            ></div>
        </div>

        <div class="buffer h-60 pb-12"></div>

        <section class="page relative">
            <div
                class="absolute left-1/2 hidden h-full max-w-[1400px] -translate-x-1/2 border-r border-l border-black/20 [mask-image:linear-gradient(to_bottom,transparent_0%,black_100%)] sm:block sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)] dark:border-white/20"
            ></div>

            <div
                class="relative mx-auto h-full w-full max-w-[1400px] px-6 sm:w-[500px] md:w-[700px] lg:w-[calc(100%-200px)] xl:w-[calc(100%-400px)]"
            >
                <h1 class="text-4xl leading-tight font-medium sm:text-6xl">
                    {{ $t('legal.privacy.title') }}
                </h1>

                <article
                    class="pt-8 pb-20 text-base leading-7 text-slate-800 dark:text-slate-200"
                >
                    <template v-for="section in sections" :key="section.number">
                        <section v-if="section.number !== 4" class="mb-12">
                            <h2
                                class="mb-5 text-xl font-semibold text-slate-950 dark:text-white"
                            >
                                {{ section.number }}. {{ section.title }}
                            </h2>
                            <div class="space-y-4">
                                <div
                                    v-for="(
                                        paragraph, index
                                    ) in section.paragraphs"
                                    :key="index"
                                    class="grid grid-cols-[3.25rem_1fr] gap-x-2"
                                >
                                    <span
                                        >{{ section.number }}.{{
                                            index + 1
                                        }}.</span
                                    >
                                    <p>{{ paragraph }}</p>
                                </div>
                            </div>
                        </section>

                        <template v-else>
                            <section class="mb-12">
                                <h2
                                    class="mb-5 text-xl font-semibold text-slate-950 dark:text-white"
                                >
                                    3. ÚČELY A PRÁVNÍ ZÁKLADY ZPRACOVÁNÍ
                                </h2>
                                <div
                                    class="mb-5 grid grid-cols-[3.25rem_1fr] gap-x-2"
                                >
                                    <span>3.1.</span>
                                    <p>
                                        Správce zpracovává osobní údaje pro
                                        následující účely a na základě
                                        následujících právních základů:
                                    </p>
                                </div>

                                <div
                                    class="mb-5 overflow-x-auto rounded-sm border border-slate-200 dark:border-slate-700"
                                >
                                    <table
                                        class="w-full min-w-[700px] border-collapse text-left text-sm leading-6"
                                    >
                                        <thead
                                            class="bg-slate-100 text-slate-950 dark:bg-slate-800 dark:text-white"
                                        >
                                            <tr>
                                                <th
                                                    class="w-2/5 px-4 py-3 font-semibold"
                                                >
                                                    Účel zpracování
                                                </th>
                                                <th
                                                    class="w-[30%] px-4 py-3 font-semibold"
                                                >
                                                    Právní základ
                                                </th>
                                                <th
                                                    class="w-[30%] px-4 py-3 font-semibold"
                                                >
                                                    Doba uchování
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody
                                            class="divide-y divide-slate-200 dark:divide-slate-700"
                                        >
                                            <tr
                                                v-for="row in processingPurposes"
                                                :key="row[0]"
                                                class="align-top"
                                            >
                                                <td
                                                    v-for="cell in row"
                                                    :key="cell"
                                                    class="px-4 py-3"
                                                >
                                                    {{ cell }}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div
                                    class="grid grid-cols-[3.25rem_1fr] gap-x-2"
                                >
                                    <span>3.2.</span>
                                    <p>
                                        Poskytnutí údajů nezbytných pro vyřízení
                                        objednávky a plnění smlouvy je smluvním
                                        požadavkem; bez jejich poskytnutí nelze
                                        smlouvu uzavřít a splnit. Poskytnutí
                                        souhlasu s marketingem je zcela
                                        dobrovolné a nemá vliv na vyřízení
                                        objednávky.
                                    </p>
                                </div>
                            </section>

                            <section class="mb-12">
                                <h2
                                    class="mb-5 text-xl font-semibold text-slate-950 dark:text-white"
                                >
                                    {{ section.number }}. {{ section.title }}
                                </h2>
                                <div class="space-y-4">
                                    <div
                                        v-for="(
                                            paragraph, index
                                        ) in section.paragraphs"
                                        :key="index"
                                        class="grid grid-cols-[3.25rem_1fr] gap-x-2"
                                    >
                                        <span
                                            >{{ section.number }}.{{
                                                index + 1
                                            }}.</span
                                        >
                                        <p>{{ paragraph }}</p>
                                    </div>
                                </div>
                            </section>
                        </template>
                    </template>

                    <section
                        class="border-t border-slate-300 pt-10 dark:border-slate-600"
                    >
                        <h2
                            class="mb-6 text-xl font-semibold text-slate-950 dark:text-white"
                        >
                            NÁVRH CHECKBOXŮ A TEXTŮ V OBJEDNÁVKOVÉM PROCESU
                            E-SHOPU
                        </h2>
                        <ol class="space-y-6">
                            <li
                                v-for="(item, index) in checkoutTexts"
                                :key="item.title"
                            >
                                <h3
                                    class="mb-2 font-semibold text-slate-950 dark:text-white"
                                >
                                    {{ index + 1 }}. {{ item.title }}
                                </h3>
                                <p
                                    class="rounded-sm bg-slate-100 px-4 py-3 dark:bg-slate-800"
                                >
                                    {{ item.text }}
                                </p>
                                <p v-if="item.note" class="mt-2">
                                    {{ item.note }}
                                </p>
                            </li>
                        </ol>
                    </section>
                </article>
            </div>
        </section>
    </DefaultLayout>
</template>
