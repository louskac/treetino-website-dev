<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import { Download, Printer } from '@iconoir/vue';
import ButtonPrimary from '@/custom/ButtonPrimary.vue';
import ButtonWhite from '@/custom/ButtonWhite.vue';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

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
                            Právní dokument &bull; Non-Disclosure Agreement
                            (NDA)
                        </span>
                        <h1
                            class="mt-3 text-3xl leading-tight font-medium tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white"
                        >
                            Dohoda o mlčenlivosti a ochraně informací
                        </h1>
                        <p
                            class="mt-3 text-sm text-slate-600 sm:text-base dark:text-slate-400"
                        >
                            Uzavřená dle ustanovení § 1746 odst. 2 a § 1730 a
                            násl. zákona č. 89/2012 Sb., občanský zákoník.
                        </p>
                    </div>

                    <div
                        class="flex shrink-0 flex-wrap items-center gap-3 print:hidden"
                    >
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
                            <span>Vytisknout</span>
                        </button>
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
                            I. Smluvní strany
                        </h2>

                        <p class="mb-6">
                            Smluvní strany uzavírají níže uvedeného dne, měsíce
                            a roku tuto Dohodu o mlčenlivosti, ochraně informací
                            a zákazu jejich zneužití (dále jen
                            „<strong>Dohoda</strong>“):
                        </p>

                        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <!-- Poskytovatel -->
                            <div
                                class="rounded-2xl border border-t-blue/30 bg-blue-50/40 p-6 shadow-xs dark:border-t-blue/40 dark:bg-blue-950/20"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-t-blue uppercase"
                                >
                                    1.1 Poskytovatel
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
                                            IČO:
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
                                            Sídlo:
                                        </dt>
                                        <dd
                                            class="text-right font-semibold text-slate-900 dark:text-white"
                                        >
                                            Vlčetín 62, Bílá 463 43
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            Zastoupena:
                                        </dt>
                                        <dd
                                            class="font-semibold text-slate-900 dark:text-white"
                                        >
                                            Dominik Mašek, jednatel
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            Rejstřík:
                                        </dt>
                                        <dd
                                            class="font-semibold text-slate-900 dark:text-white"
                                        >
                                            KS v Ústí n. L., C 48430
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
                                    (dále jen jako „Poskytovatel“ nebo
                                    „Treetino“)
                                </div>
                            </div>

                            <!-- Příjemce -->
                            <div
                                class="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 shadow-xs dark:border-slate-800 dark:bg-zinc-900/60"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-emerald-600 uppercase dark:text-emerald-400"
                                >
                                    1.2 Příjemce (Partner / Prodejce)
                                </div>
                                <h3
                                    class="mt-1 text-lg font-bold text-slate-950 dark:text-white"
                                >
                                    Obchodní zástupce / Partner
                                </h3>

                                <dl class="mt-4 space-y-2 text-sm">
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            Firma / Jméno:
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            [ Vyplní obchodní partner ]
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            IČO / RČ / Dat. nar.:
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            [ Vyplní obchodní partner ]
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            DIČ (plátce DPH):
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            [ Vyplní obchodní partner ]
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            Sídlo / Bydliště:
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            [ Vyplní obchodní partner ]
                                        </dd>
                                    </div>
                                    <div
                                        class="flex justify-between border-b border-black/5 py-1 dark:border-white/5"
                                    >
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            Zastoupen(a):
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            [ Vyplní obchodní partner ]
                                        </dd>
                                    </div>
                                    <div class="flex justify-between py-1">
                                        <dt
                                            class="text-slate-500 dark:text-slate-400"
                                        >
                                            E-mail & Tel.:
                                        </dt>
                                        <dd
                                            class="font-mono text-xs text-slate-500 italic dark:text-slate-400"
                                        >
                                            [ Vyplní obchodní partner ]
                                        </dd>
                                    </div>
                                </dl>

                                <div
                                    class="mt-4 text-xs text-slate-500 italic dark:text-slate-400"
                                >
                                    (dále jen jako „Příjemce“ nebo „Obchodní
                                    partner“)
                                </div>
                            </div>
                        </div>

                        <p
                            class="mt-4 text-xs text-slate-500 dark:text-slate-400"
                        >
                            (Poskytovatel a Příjemce dále společně také jen jako
                            „Smluvní strany“, nebo každý samostatně jako
                            „Smluvní strana“)
                        </p>
                    </section>

                    <!-- Článek II -->
                    <section class="mb-12">
                        <h2
                            class="mb-5 border-b border-black/10 pb-2 text-xl font-bold tracking-tight text-slate-950 uppercase sm:text-2xl dark:border-white/10 dark:text-white"
                        >
                            II. Preambule a účel dohody
                        </h2>

                        <div class="space-y-4">
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
                            III. Vymezení důvěrných informací a obchodního
                            tajemství
                        </h2>

                        <div class="space-y-4">
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
                            IV. Závazky Příjemce a pravidla ochrany informací
                        </h2>

                        <div class="space-y-4">
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
                            V. Výjimky ze závazku mlčenlivosti
                        </h2>

                        <div class="space-y-4">
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
                            VI. Duševní vlastnictví a nakládání s podklady
                        </h2>

                        <div class="space-y-4">
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
                            VII. Smluvní pokuta a odpovědnost za škodu
                        </h2>

                        <div class="space-y-4">
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
                            VIII. Doba trvání a účinnost dohody
                        </h2>

                        <div class="space-y-4">
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
                            IX. Závěrečná ustanovení
                        </h2>

                        <div class="space-y-4">
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
                            Podpisová doložka
                        </h3>
                        <p
                            class="mt-1 text-sm text-slate-600 dark:text-slate-400"
                        >
                            Na důkaz svobodného, vážného a srozumitelného
                            projevu vůle připojují Smluvní strany své podpisy:
                        </p>

                        <div class="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
                            <!-- Poskytovatel -->
                            <div
                                class="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-950"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-slate-500 uppercase"
                                >
                                    Za Poskytovatele
                                </div>
                                <div
                                    class="mt-2 text-base font-bold text-slate-950 dark:text-white"
                                >
                                    Treetino corp s.r.o.
                                </div>
                                <div class="mt-1 text-xs text-slate-500">
                                    V Bílé / Praze dne 21. 7. 2026
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
                                    Jednatel, Treetino corp s.r.o.
                                </div>
                            </div>

                            <!-- Partner -->
                            <div
                                class="rounded-xl border border-black/10 bg-white p-5 dark:border-white/10 dark:bg-zinc-950"
                            >
                                <div
                                    class="text-xs font-bold tracking-wider text-slate-500 uppercase"
                                >
                                    Za Příjemce
                                </div>
                                <div
                                    class="mt-2 text-base font-bold text-slate-950 dark:text-white"
                                >
                                    Obchodní partner / Prodejce
                                </div>
                                <div class="mt-1 text-xs text-slate-500">
                                    V ............................ dne
                                    ............................
                                </div>

                                <div
                                    class="my-6 flex h-20 items-center justify-center rounded-lg border border-dashed border-black/20 bg-slate-50 text-xs font-medium text-slate-400 dark:border-white/20 dark:bg-zinc-900"
                                >
                                    [ Vlastnoruční / Digitální podpis ]
                                </div>

                                <div
                                    class="text-sm font-semibold text-slate-900 dark:text-white"
                                >
                                    Jméno a příjmení:
                                    ........................................
                                </div>
                                <div class="text-xs text-slate-500">
                                    Funkce / Oprávnění:
                                    ........................................
                                </div>
                            </div>
                        </div>

                        <!-- Bottom Download CTA -->
                        <div
                            class="mt-10 flex flex-wrap items-center justify-center gap-4 border-t border-black/10 pt-6 dark:border-white/10 print:hidden"
                        >
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
                                <span>Vytisknout</span>
                            </button>
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
