<script setup lang="ts">
import { Head } from '@inertiajs/vue3';
import DefaultLayout from '@/layouts/DefaultLayout.vue';

const definitions = [
    [
        '„Cena Prohlídky“',
        '10.000 Kč, tj. odměna Zhotovitele za provedení Prohlídky dle čl. 4 Podmínek.',
    ],
    [
        '„Dílo“',
        'Dodání, instalace a montáž systémů obnovitelné energie ve smyslu Podmínek Díla.',
    ],
    [
        '„Eshop“',
        'Internetové rozhraní na www.wattino.eu, prostřednictvím kterého Zhotovitel nabízí uzavření Smlouvy o Prohlídce.',
    ],
    [
        '„Faktura“',
        'Daňový nebo účetní doklad s náležitostmi dle obecně závazných předpisů.',
    ],
    [
        '„Nabídka“',
        'Návrh Zhotovitele na uzavření Smlouvy o dílo předložený Objednateli po provedení Prohlídky spolu s hotovým návrhem Smlouvy o dílo, obsahující zejména technické řešení a rozpočet Díla.',
    ],
    [
        '„Objednatel“',
        'Fyzická nebo právnická osoba, která prostřednictvím Eshopu učiní Objednávku Prohlídky, bez ohledu na to, zda je podnikatelem, či spotřebitelem.',
    ],
    [
        '„Objednávka Prohlídky“',
        'Závazná objednávka Prohlídky učiněná Objednatelem prostřednictvím Eshopu.',
    ],
    [
        '„Objekt“',
        'Pozemek, stavba, nebo jejich část, na níž má být na základě Nabídky provedeno Dílo a na níž se provádí Prohlídka.',
    ],
    [
        '„OZ“',
        'Zákon č. 89/2012 Sb., občanský zákoník, ve znění ke dni účinnosti Podmínek.',
    ],
    ['„Podmínky“', 'Tyto obchodní podmínky e-shopu www.wattino.eu.'],
    [
        '„Podmínky Díla“',
        'Obchodní podmínky Zhotovitele pro provádění Díla na základě Smlouvy o dílo, dostupné na [●].',
    ],
    [
        '„Produkt“',
        'Typové řešení nabízené v Eshopu (např. fotovoltaická fasáda, plot, balkonová FVE, carport, integrovaná střecha, klasická FVE, pergola, wallbox), jehož výběrem Objednatel specifikuje předmět zájmu pro účely Prohlídky.',
    ],
    [
        '„Prohlídka“',
        'Soubor služeb spočívající v provedení místního šetření na Objektu, zpracování projektového návrhu, rozpočtu a zaměření nezbytných pro přípravu Nabídky.',
    ],
    [
        '„Smlouva o dílo“',
        'Smlouva o dílo dle § 2586 a násl. OZ uzavřená mezi Zhotovitelem a Objednatelem na základě Nabídky, řídící se výlučně Podmínkami Díla.',
    ],
    [
        '„Smlouva o Prohlídce“',
        'Smlouva uzavřená mezi Zhotovitelem a Objednatelem na základě Objednávky Prohlídky, jejímž předmětem je provedení Prohlídky za Cenu Prohlídky.',
    ],
    ['„Zhotovitel“', 'Treetino corp s.r.o., IČO 10800107.'],
];

const sections = [
    {
        number: 2,
        title: 'ÚVODNÍ USTANOVENÍ',
        paragraphs: [
            'Podmínky upravují práva a povinnosti Zhotovitele a Objednatele vznikající v souvislosti s objednáním Prohlídky prostřednictvím Eshopu a jsou nedílnou součástí Smlouvy o Prohlídce.',
            'Podmínky se týkají výhradně vztahů založených Smlouvou o Prohlídce. Je-li mezi Zhotovitelem a Objednatelem na základě Objednávky Díla uzavřena Smlouva o dílo, řídí se práva a povinnosti stran z ní vyplývající výlučně Podmínkami Díla, nikoli těmito Podmínkami.',
            'Podmínky jsou k dispozici na internetových stránkách Zhotovitele www.wattino.eu. Uzavřením Smlouvy o Prohlídce Objednatel Podmínky přijímá a prohlašuje, že se s nimi před odesláním Objednávky Prohlídky seznámil.',
            'Odchylná ujednání obsažená v Objednávce Prohlídky potvrzené Zhotovitelem mají přednost před Podmínkami. Podmínky se použijí bez ohledu na to, zda je Objednatel spotřebitelem, či podnikatelem, není-li v konkrétním ustanovení stanoveno jinak.',
        ],
    },
    {
        number: 3,
        title: 'UZAVŘENÍ SMLOUVY O PROHLÍDCE',
        paragraphs: [
            'Objednatel v Eshopu vybere Produkt a vyplní objednávkový formulář, zejména identifikační a kontaktní údaje a adresu Objektu. Před závazným odesláním má Objednatel možnost zkontrolovat a opravit zadané údaje.',
            'Tlačítko, kterým Objednatel Objednávku Prohlídky odesílá, je označeno jednoznačnou formulací potvrzující, že odeslání Objednávky Prohlídky zakládá povinnost k zaplacení Ceny Prohlídky, v souladu s § 1826 odst. 2 OZ.',
            'Objednávka Prohlídky je návrhem Objednatele na uzavření Smlouvy o Prohlídce. Smlouva o Prohlídce je uzavřena okamžikem, kdy Zhotovitel přijetí Objednávky Prohlídky potvrdí Objednateli e-mailem, případně, dojde-li k tomu dříve, okamžikem zaplacení Ceny Prohlídky Objednatelem.',
            'Zhotovitel je oprávněn Objednávku Prohlídky odmítnout, zejména není-li Objekt umístěn v oblasti, ve které Zhotovitel služby poskytuje, nebo existují-li důvodné pochybnosti o pravdivosti údajů uvedených v Objednávce Prohlídky. O odmítnutí Zhotovitel Objednatele bez zbytečného odkladu informuje a případně uhrazenou Cenu Prohlídky mu vrátí.',
            'Objednatel prohlašuje, že je vlastníkem Objektu, nebo že je k Objektu jinak oprávněn v rozsahu umožňujícím Zhotoviteli vstup na Objekt a provedení Prohlídky se souhlasem vlastníka.',
            'Zhotovitel poskytne Objednateli potvrzení o uzavřené Smlouvě o Prohlídce v textové podobě, a to e-mailem na adresu uvedenou v Objednávce Prohlídky, bez zbytečného odkladu po jejím uzavření. Součástí potvrzení je znění Smlouvy o Prohlídce a těchto Podmínek.',
            'Smlouvu o Prohlídce lze uzavřít pouze v českém jazyce. Uzavřená Smlouva o Prohlídce je Zhotovitelem archivována v elektronické podobě; Zhotovitel ji Objednateli na jeho žádost zaslanou na kontaktní e-mail zpřístupní.',
            'V případě zjevné chyby při uvedení Ceny Prohlídky nebo jiného údaje v Eshopu (zejména zjevně chybná částka co do výše či řádu) nemá Zhotovitel vůli Smlouvu o Prohlídce za takových podmínek uzavřít a Smlouva o Prohlídce uzavřena není. Zhotovitel tuto skutečnost Objednateli oznámí bez zbytečného odkladu poté, co chybu zjistí, a případně přijaté platby mu vrátí.',
        ],
    },
    {
        number: 4,
        title: 'CENA PROHLÍDKY A PLATEBNÍ PODMÍNKY',
        paragraphs: [
            'Cena Prohlídky činí 10.000 Kč. Je-li Objednatel spotřebitelem, je tato částka Cenou vč. DPH; je-li Objednatel podnikatelem, jedná se o Cenu bez DPH a DPH bude připočtena v zákonné výši ke dni uskutečnění zdanitelného plnění.',
            'Cena Prohlídky je splatná při odeslání Objednávky Prohlídky, a to prostřednictvím platební brány Eshopu. Zhotovitel je oprávněn umožnit Objednateli úhradu Ceny Prohlídky rovněž na základě Faktury se splatností 5 dnů od jejího doručení, je-li Objednatel spotřebitelem, resp. 3 dnů od jejího doručení, je-li Objednatel podnikatelem.',
            'Zhotovitel je povinen provést Prohlídku až po úplném zaplacení Ceny Prohlídky Objednatelem.',
            'Zápočet Ceny Prohlídky na Cenu Díla: uzavře-li Objednatel Smlouvu o dílo ve lhůtě platnosti Nabídky dle čl. 6.2 Podmínek, započítá se uhrazená Cena Prohlídky v plné výši na Cenu Díla sjednanou ve Smlouvě o dílo.',
            'Marným uplynutím lhůty platnosti Nabídky dle čl. 6.2 Podmínek, aniž by Objednatel Smlouvu o dílo uzavřel, nárok na zápočet dle čl. 4.4 Podmínek zaniká a Cena Prohlídky se považuje za nevratnou odměnu Zhotovitele za řádně provedenou Prohlídku. Totéž platí, odmítne-li Objednatel Nabídku, nebo Smlouvu o dílo neuzavře z jiného důvodu na své straně.',
            'Cena Prohlídky Objednateli nenáleží zpět v žádném případě, kdy byla Prohlídka Zhotovitelem řádně provedena, s výjimkou případů, kdy Objednateli vznikne nárok na vrácení podle čl. 7 Podmínek.',
        ],
    },
    {
        number: 5,
        title: 'PROVEDENÍ PROHLÍDKY',
        paragraphs: [
            'Termín provedení Prohlídky si strany dohodnou po uzavření Smlouvy o Prohlídce, zpravidla do [●] dnů od zaplacení Ceny Prohlídky.',
            'Objednatel je povinen zajistit Zhotoviteli řádný přístup k Objektu v dohodnutém termínu a poskytnout přiměřenou součinnost nutnou k provedení Prohlídky, zejména osobní přítomnost Objednatele nebo jím pověřené osoby a přístup k technickým prostorám Objektu (elektroměr, rozvaděč, střecha, fasáda apod.).',
            'Nezmaří-li Objednatel provedení Prohlídky v dohodnutém termínu, zejména nezajistí-li přístup k Objektu nebo se bez řádné a včasné omluvy nedostaví, je Zhotovitel oprávněn požadovat po Objednateli náhradu účelně vynaložených nákladů vzniklých v souvislosti s marnou cestou na Objekt. Nový termín Prohlídky bude v takovém případě sjednán pouze po předchozí dohodě stran.',
            'Na základě Prohlídky zpracuje Zhotovitel pro Objednatele Nabídku, kterou mu doručí v přiměřené lhůtě, zpravidla do [●] dnů od provedení Prohlídky.',
            'Zhotovitel neodpovídá za nepřesnost či nevhodnost Nabídky způsobenou nesprávnými, neúplnými nebo zavádějícími informacemi, které Objednatel poskytl před Prohlídkou nebo při jejím provádění, ani za skutečnosti týkající se Objektu, které nebyly a objektivně nemohly být při Prohlídce zjištěny.',
        ],
    },
    {
        number: 6,
        title: 'NABÍDKA A UZAVŘENÍ SMLOUVY O DÍLO',
        paragraphs: [
            'Nabídka obsahuje zejména popis navrhovaného technického řešení Díla, rozpočet (navrhovanou Cenu Díla) a další podmínky podstatné pro uzavření Smlouvy o dílo. Součástí Nabídky je vždy hotový návrh Smlouvy o dílo odpovídající jejímu obsahu. Nabídka je nezávazným návrhem, není-li v ní výslovně uvedeno jinak.',
            'Nabídka je platná po dobu v ní uvedenou, jinak po dobu [●] dnů ode dne jejího doručení Objednateli.',
            'Má-li Objednatel o realizaci Díla za podmínek uvedených v Nabídce zájem, uzavře se Zhotovitelem Smlouvu o dílo podpisem jejího návrhu předloženého dle čl. 6.1 Podmínek, a to ve lhůtě platnosti Nabídky dle čl. 6.2 Podmínek.',
            'Podstatné náležitosti Smlouvy o dílo (předmět, rozsah a technické řešení Díla, Cena Díla a termíny plnění) jsou určeny Nabídkou. Práva a povinnosti stran při provádění Díla, jakost, práva z vadného plnění, platební podmínky, odpovědnost stran a další náležitosti se řídí výlučně Podmínkami Díla dostupnými na [●], které jsou nedílnou součástí Smlouvy o dílo a mají přednost před těmito Podmínkami v rozsahu, v jakém by si odporovaly.',
            'Neuzavře-li Objednatel Smlouvu o dílo ve lhůtě platnosti Nabídky, je Zhotovitel oprávněn Nabídku a návrh Smlouvy o dílo odvolat nebo Objednateli předložit Nabídku novou, zejména s ohledem na změnu vstupních nákladů nebo jiných okolností rozhodných pro stanovení Ceny Díla.',
        ],
    },
    {
        number: 7,
        title: 'ODSTOUPENÍ OD SMLOUVY O PROHLÍDCE',
        paragraphs: [
            'Je-li Objednatel spotřebitelem, má v souladu s § 1829 OZ právo odstoupit od Smlouvy o Prohlídce bez udání důvodu ve lhůtě 14 dnů ode dne jejího uzavření, ledaže mu toto právo zanikne podle čl. 7.3 Podmínek.',
            'Odstoupení lze učinit jakýmkoli jednoznačným prohlášením vůči Zhotoviteli, zejména na kontaktní e-mail uvedený v úvodu Podmínek. Objednatel může využít vzorový formulář pro odstoupení od smlouvy, který tvoří Přílohu č. 1 Podmínek; jeho použití však není povinné. Využije-li Objednatel formulář, potvrdí mu Zhotovitel jeho přijetí bez zbytečného odkladu v textové podobě.',
            'Vzhledem k povaze Prohlídky, jejíž provedení je zpravidla nezbytné zahájit dříve, než uplyne lhůta pro odstoupení od Smlouvy o Prohlídce, může Objednatel při Objednávce Prohlídky výslovně požádat o zahájení provádění Prohlídky před uplynutím této lhůty. Udělením tohoto výslovného souhlasu Objednatel bere na vědomí, že v souladu s § 1837 písm. a) OZ ztrácí právo na odstoupení od Smlouvy o Prohlídce okamžikem, kdy Zhotovitel Prohlídku v plném rozsahu provede.',
            'Nebyla-li Prohlídka do okamžiku odstoupení provedena v plném rozsahu, je Objednatel povinen uhradit Zhotoviteli poměrnou část Ceny Prohlídky odpovídající rozsahu plnění poskytnutého do okamžiku odstoupení.',
            'Odstoupí-li Objednatel od Smlouvy o Prohlídce v souladu s tímto článkem, vrátí mu Zhotovitel bez zbytečného odkladu, nejpozději do 14 dnů ode dne odstoupení, veškeré platby, které od Objednatele na základě Smlouvy o Prohlídce obdržel, s výjimkou částky dle čl. 7.4 Podmínek, a to stejným způsobem, jakým platby přijal, nedohodnou-li se strany jinak.',
            'Právo na odstoupení dle tohoto článku se týká výlučně Smlouvy o Prohlídce. Je-li uzavřena Smlouva o dílo, řídí se právo na odstoupení od ní výlučně Podmínkami Díla.',
        ],
    },
    {
        number: 8,
        title: 'ODPOVĚDNOST OBJEDNATELE',
        paragraphs: [
            'Objednatel odpovídá za pravdivost, úplnost, správnost a nezavádějící charakter veškerých údajů a informací, které poskytl Zhotoviteli v souvislosti s Objednávkou Prohlídky a s prováděním Prohlídky, zejména údajů o vlastnictví, stavu, umístění a dostupnosti Objektu.',
            'Prokáže-li se prohlášení Objednatele o oprávnění k Objektu dle čl. 3.5 Podmínek nepravdivým, odpovídá Objednatel Zhotoviteli za újmu, která mu tím vznikla, včetně nároků třetích osob uplatněných vůči Zhotoviteli v této souvislosti.',
            'Objednatel odpovídá Zhotoviteli za škodu způsobenou Zhotoviteli nebo osobám, které se s ním na provádění Prohlídky podílejí, kterou způsobil porušením svých povinností dle Podmínek, zejména nezajištěním bezpečného přístupu k Objektu nebo zamlčením skutečností ohrožujících bezpečnost provádění Prohlídky.',
            'Objednatel bere na vědomí, že Nabídka je zpracována na základě údajů a skutečností zjištěných při Prohlídce a představuje odhad technického řešení a Ceny Díla; konečné a závazné podmínky provedení Díla budou stanoveny až ve Smlouvě o dílo.',
            'Ustanoveními tohoto článku nejsou dotčena práva Objednatele, který je spotřebitelem, od kterých se nelze smluvně odchýlit v jeho neprospěch podle OZ.',
        ],
    },
    {
        number: 9,
        title: 'ODPOVĚDNOST ZHOTOVITELE',
        paragraphs: [
            'Zhotovitel odpovídá za řádné provedení Prohlídky v rozsahu sjednaném Objednávkou Prohlídky a za soulad Nabídky se skutečnostmi zjištěnými při Prohlídce a s údaji poskytnutými Objednatelem.',
            'Zhotovitel neodpovídá za rozdíl mezi Cenou Díla uvedenou v Nabídce a konečnou Cenou Díla sjednanou ve Smlouvě o dílo, vzniklý v důsledku změny vstupních nákladů, rozsahu Díla nebo skutečností zjištěných až v průběhu přípravy či provádění Díla.',
            'Odpovědnost Zhotovitele za provedení Díla, práva z vadného plnění a rozsah případného omezení či vyloučení odpovědnosti Zhotovitele se řídí výlučně Podmínkami Díla.',
        ],
    },
    {
        number: 10,
        title: 'PRÁVA Z VADNÉHO PLNĚNÍ A REKLAMACE PROHLÍDKY',
        paragraphs: [
            'Práva Objednatele z vadného plnění Prohlídky se řídí příslušnými obecně závaznými předpisy, zejména § 1914 a násl. OZ. Prohlídka má vadu zejména tehdy, nebyla-li provedena v rozsahu dle definice Prohlídky, nebo neodpovídá-li Nabídka skutečnostem zjistitelným při Prohlídce s vynaložením odborné péče.',
            'Objednatel uplatňuje práva z vadného plnění (reklamaci) u Zhotovitele, a to na kontaktním e-mailu nebo na adrese uvedené v úvodu Podmínek, bez zbytečného odkladu poté, kdy vadu zjistil nebo při náležité pozornosti zjistit měl.',
            'Je-li Objednatel spotřebitelem, vydá mu Zhotovitel při uplatnění reklamace písemné potvrzení, v němž uvede datum uplatnění reklamace, její obsah, požadovaný způsob vyřízení a kontaktní údaje Objednatele pro poskytnutí informace o vyřízení. Reklamace včetně odstranění vady bude vyřízena a Objednatel o tom bude informován nejpozději do 30 dnů ode dne uplatnění reklamace, nedohodnou-li se strany na delší lhůtě. Po marném uplynutí této lhůty může Objednatel od Smlouvy o Prohlídce odstoupit nebo požadovat přiměřenou slevu z Ceny Prohlídky. Zhotovitel vydá Objednateli potvrzení o datu a způsobu vyřízení reklamace, případně písemné odůvodnění jejího zamítnutí.',
            'Je-li vada odstranitelná, může se Objednatel domáhat opravy nebo doplnění toho, co chybí (zejména opravy či doplnění Nabídky, projektového návrhu, rozpočtu nebo zaměření), anebo přiměřené slevy z Ceny Prohlídky. Nelze-li vadu odstranit, může Objednatel požadovat přiměřenou slevu z Ceny Prohlídky, nebo od Smlouvy o Prohlídce odstoupit.',
            'Objednatel, který je spotřebitelem, má právo na úhradu účelně vynaložených nákladů spojených s uplatněním oprávněné reklamace.',
        ],
    },
    {
        number: 11,
        title: 'OCHRANA OSOBNÍCH ÚDAJŮ',
        paragraphs: [
            'Odesláním Objednávky Prohlídky Objednatel bere na vědomí zásady zpracování osobních údajů Zhotovitele, dostupné na https://wattino.eu/zpracovani-osobnich-udaju.',
        ],
    },
];

const consumerInformation = [
    'Zhotovitel není ve vztahu k Objednateli vázán žádnými kodexy chování;',
    'Objednatel souhlasí s použitím komunikačních prostředků na dálku při uzavírání Smlouvy o Prohlídce; náklady vzniklé Objednateli při jejich použití (náklady na internetové připojení, telefonní hovory) si hradí Objednatel sám a tyto náklady se neliší od základní sazby;',
    'kontrolu dodržování právních předpisů na ochranu spotřebitele provádí Česká obchodní inspekce (www.coi.cz), která je rovněž subjektem mimosoudního řešení spotřebitelských sporů plynoucích ze Smlouvy o Prohlídce či z Podmínek;',
    'v případě spotřebitelského sporu ze Smlouvy o Prohlídce, který se nepodaří vyřešit dohodou, může Objednatel podat návrh na jeho mimosoudní řešení České obchodní inspekci, Ústřední inspektorát - oddělení ADR, Štěpánská 15, 120 00 Praha 2, e-mail: adr@coi.cz, web: www.coi.cz/informace-o-adr;',
    'pro podání stížnosti a pro vyhledání subjektu alternativního řešení sporů lze rovněž využít on-line platformu zřízenou Evropskou komisí na adrese ec.europa.eu/consumers/odr;',
    'k podnikání je Zhotovitel oprávněn na základě živnostenského oprávnění; živnostenskou kontrolu provádí v rámci své působnosti příslušný živnostenský úřad (www.rzp.cz);',
    'případné stížnosti vyřizuje Zhotovitel prostřednictvím kontaktního e-mailu uvedeného v úvodu Podmínek.',
];

const finalProvisions = [
    'Podmínky se použijí pro veškeré Objednávky Prohlídky učiněné prostřednictvím Eshopu. Jakákoli jejich změna vyžaduje písemnou formu a výslovný souhlas Zhotovitele.',
    'Na Podmínky a na právní vztahy z nich vyplývající se použije české právo. Tím nejsou dotčena práva Objednatele, který je spotřebitelem, plynoucí z právních předpisů na ochranu spotřebitele.',
    'Neplatností nebo neúčinností některého ustanovení Podmínek není dotčena platnost a účinnost ostatních ustanovení.',
    'Nedílnou součástí Podmínek je Příloha č. 1 - Vzorový formulář pro odstoupení od smlouvy.',
    'Tyto Podmínky nabývají platnosti a účinnosti dnem [●] a ruší veškeré předchozí obchodní podmínky Zhotovitele upravující objednávání Prohlídky prostřednictvím Eshopu.',
];
</script>

<template>
    <Head title="Obchodní podmínky" />

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
                    {{ $t('legal.tos.title') }}
                </h1>

                <article
                    class="pt-8 pb-20 text-base leading-7 text-slate-800 dark:text-slate-200"
                >
                    <header class="mb-12">
                        <p class="mb-4">obchodní společnosti</p>
                        <p class="mb-4">
                            <strong>Treetino corp s.r.o.,</strong><br />
                            IČO: 10800107, DIČ: CZ10800107<br />
                            se sídlem Český Šternberk 9, 257 26<br />
                            zastoupená Dominikem Maškem, jednatelem<br />
                            (dále jen „Zhotovitel“)
                        </p>
                        <address class="not-italic">
                            <strong>Kontakt:</strong><br />
                            Tel.:
                            <a
                                class="underline underline-offset-2"
                                href="tel:+420730587857"
                                >730 587 857</a
                            ><br />
                            E-mail:
                            <a
                                class="underline underline-offset-2"
                                href="mailto:info@wattino.eu"
                                >info@wattino.eu</a
                            ><br />
                            Adresa: Český Šternberk 9, 257 26
                        </address>
                    </header>

                    <section class="mb-12">
                        <h2
                            class="mb-5 text-xl font-semibold text-slate-950 dark:text-white"
                        >
                            1. DEFINICE POJMŮ
                        </h2>
                        <div class="mb-5 grid grid-cols-[3.25rem_1fr] gap-x-2">
                            <span>1.1.</span>
                            <p>
                                Mimo jinde v Podmínkách definované pojmy jsou
                                pro účely tohoto dokumentu užívány následující
                                pojmy s tímto významem:
                            </p>
                        </div>
                        <dl
                            class="mb-5 divide-y divide-slate-200 border-y border-slate-200 dark:divide-slate-700 dark:border-slate-700"
                        >
                            <div
                                v-for="definition in definitions"
                                :key="definition[0]"
                                class="grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-5"
                            >
                                <dt
                                    class="font-semibold text-slate-950 dark:text-white"
                                >
                                    {{ definition[0] }}
                                </dt>
                                <dd>{{ definition[1] }}</dd>
                            </div>
                        </dl>
                        <div class="grid grid-cols-[3.25rem_1fr] gap-x-2">
                            <span>1.2.</span>
                            <p>
                                Pokud není v Podmínkách uvedeno jinak, mají
                                slova v nich užitá s velkým počátečním písmenem
                                význam uvedený výše. Slova v jednotném čísle
                                zahrnují i množné číslo a naopak, nevyplývá-li z
                                kontextu jinak. Spotřebitelem se myslí
                                spotřebitel ve smyslu § 419 OZ, podnikatelem
                                podnikatel ve smyslu § 420 OZ.
                            </p>
                        </div>
                    </section>

                    <section
                        v-for="section in sections"
                        :key="section.number"
                        class="mb-12"
                    >
                        <h2
                            class="mb-5 text-xl font-semibold text-slate-950 dark:text-white"
                        >
                            {{ section.number }}. {{ section.title }}
                        </h2>
                        <div class="space-y-4">
                            <div
                                v-for="(paragraph, index) in section.paragraphs"
                                :key="index"
                                class="grid grid-cols-[3.25rem_1fr] gap-x-2"
                            >
                                <span
                                    >{{ section.number }}.{{ index + 1 }}.</span
                                >
                                <p>{{ paragraph }}</p>
                            </div>
                        </div>
                    </section>

                    <section class="mb-12">
                        <h2
                            class="mb-5 text-xl font-semibold text-slate-950 dark:text-white"
                        >
                            12. INFORMACE PRO SPOTŘEBITELE
                        </h2>
                        <div class="grid grid-cols-[3.25rem_1fr] gap-x-2">
                            <span>12.1.</span>
                            <div>
                                <p class="mb-3">
                                    Objednatele, který je zároveň spotřebitelem,
                                    Zhotovitel informuje, že:
                                </p>
                                <ul class="list-disc space-y-2 pl-5">
                                    <li
                                        v-for="item in consumerInformation"
                                        :key="item"
                                    >
                                        {{ item }}
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section class="mb-12">
                        <h2
                            class="mb-5 text-xl font-semibold text-slate-950 dark:text-white"
                        >
                            13. ZÁVĚREČNÁ USTANOVENÍ
                        </h2>
                        <div class="space-y-4">
                            <div
                                v-for="(paragraph, index) in finalProvisions"
                                :key="index"
                                class="grid grid-cols-[3.25rem_1fr] gap-x-2"
                            >
                                <span>13.{{ index + 1 }}.</span>
                                <p>{{ paragraph }}</p>
                            </div>
                        </div>
                        <p class="mt-8">V Praze dne [●]</p>
                    </section>

                    <section
                        class="border-t border-slate-300 pt-10 dark:border-slate-600"
                    >
                        <p class="mb-2 font-semibold">Příloha č. 1</p>
                        <h2
                            class="mb-3 text-xl font-semibold text-slate-950 dark:text-white"
                        >
                            VZOROVÝ FORMULÁŘ PRO ODSTOUPENÍ OD SMLOUVY
                        </h2>
                        <p class="mb-6 italic">
                            (vyplňte tento formulář a odešlete jej zpět pouze v
                            případě, že chcete odstoupit od smlouvy; použití
                            formuláře není povinné)
                        </p>
                        <div class="space-y-4">
                            <p>
                                <strong>Adresát:</strong> Treetino corp s.r.o.,
                                Český Šternberk 9, 257 26, e-mail:
                                info@wattino.eu
                            </p>
                            <p>
                                Oznamuji, že tímto odstupuji od smlouvy o
                                poskytnutí této služby: [●]
                            </p>
                            <p>Datum objednání: [●]</p>
                            <p>Jméno a příjmení spotřebitele: [●]</p>
                            <p>Adresa spotřebitele: [●]</p>
                            <p>
                                Podpis spotřebitele (pouze pokud je tento
                                formulář zasílán v listinné podobě): [●]
                            </p>
                            <p>Datum: [●]</p>
                        </div>
                    </section>
                </article>
            </div>
        </section>
    </DefaultLayout>
</template>
