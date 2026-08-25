<!DOCTYPE html>
<html lang="cs">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Dohoda o mlčenlivosti (NDA) - Treetino corp s.r.o.</title>
    <style>
        @page {
            margin: 13mm 14mm 13mm 14mm;
        }

        body {
            font-family: 'DejaVu Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 7.6pt;
            line-height: 1.28;
            color: #1a1a1a;
            margin: 0;
            padding: 0;
        }

        /* Running Header & Footer */
        .page-header {
            position: fixed;
            top: -10mm;
            left: 0;
            right: 0;
            height: 8mm;
            border-bottom: 1px solid #cbd5e1;
            padding-bottom: 1mm;
        }

        .page-header table {
            width: 100%;
            border-collapse: collapse;
        }

        .header-logo {
            height: 14px;
            vertical-align: middle;
        }

        .header-title {
            text-align: right;
            font-size: 6.2pt;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.8px;
            vertical-align: middle;
            font-weight: bold;
        }

        .page-footer {
            position: fixed;
            bottom: -10mm;
            left: 0;
            right: 0;
            height: 7mm;
            border-top: 1px solid #cbd5e1;
            padding-top: 1.2mm;
        }

        .page-footer table {
            width: 100%;
            border-collapse: collapse;
            font-size: 6.2pt;
            color: #64748b;
        }

        .footer-left {
            text-align: left;
        }

        .footer-center {
            text-align: center;
            font-weight: bold;
            letter-spacing: 0.5px;
        }

        .footer-right {
            text-align: right;
        }

        .page-number:before {
            content: "Strana " counter(page);
        }

        /* Document Title */
        .doc-header {
            text-align: center;
            margin-top: 0;
            margin-bottom: 2mm;
            padding-bottom: 1.5mm;
            border-bottom: 1.5px solid #0284c7;
        }

        .doc-badge {
            display: inline-block;
            font-size: 6pt;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #0284c7;
            background: #e0f2fe;
            padding: 1.5px 6px;
            border-radius: 3px;
            margin-bottom: 1px;
        }

        .doc-title {
            font-size: 10.5pt;
            font-weight: bold;
            color: #0f172a;
            margin: 1.5px 0;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            line-height: 1.15;
        }

        .doc-subtitle {
            font-size: 6.8pt;
            color: #475569;
            margin: 0;
            font-style: italic;
        }

        /* Section & Article Headings */
        h2.article-title {
            font-size: 7.8pt;
            font-weight: bold;
            color: #0f172a;
            margin-top: 2mm;
            margin-bottom: 1mm;
            padding-bottom: 0.5mm;
            border-bottom: 1px solid #cbd5e1;
            text-transform: uppercase;
            letter-spacing: 0.2px;
            page-break-after: avoid;
        }

        p {
            margin: 0 0 1mm 0;
            text-align: justify;
        }

        p.clause {
            margin-bottom: 1mm;
        }

        ul, ol {
            margin: 0 0 1mm 0;
            padding-left: 3.5mm;
        }

        li {
            margin-bottom: 0.6mm;
            text-align: justify;
        }

        /* Parties Box Grid */
        .parties-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 2.5mm 0;
            margin-bottom: 1.5mm;
            page-break-inside: avoid;
        }

        .party-col {
            width: 50%;
            vertical-align: top;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 1.8mm 2.2mm;
            font-size: 6.9pt;
            line-height: 1.25;
        }

        .party-col.provider {
            border-left: 3px solid #0284c7;
        }

        .party-col.recipient {
            border-left: 3px solid #0284c7;
            background: #fafaf9;
        }

        .party-heading {
            font-size: 7.4pt;
            font-weight: bold;
            color: #0f172a;
            margin-bottom: 1mm;
            padding-bottom: 0.6mm;
            border-bottom: 1px solid #e2e8f0;
            text-transform: uppercase;
        }

        .party-row {
            margin-bottom: 0.5mm;
        }

        .party-label {
            color: #64748b;
            font-size: 6.5pt;
            display: inline-block;
            width: 25mm;
            font-weight: bold;
        }

        .party-value {
            color: #0f172a;
            font-weight: bold;
        }

        .fill-field {
            margin-bottom: 0.8mm;
        }

        .fill-field-label {
            font-size: 6pt;
            color: #64748b;
            font-weight: bold;
            text-transform: uppercase;
        }

        .fill-field-dots {
            border-bottom: 1px dotted #64748b;
            height: 8px;
            margin-top: 0.3px;
        }

        /* Signatures Section */
        .signatures-container {
            margin-top: 2.5mm;
            page-break-inside: avoid;
        }

        .signatures-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 2.5mm 0;
        }

        .signature-box {
            width: 50%;
            vertical-align: top;
            border: 1px solid #cbd5e1;
            border-radius: 4px;
            padding: 1.8mm 2.2mm;
            background: #ffffff;
            font-size: 6.9pt;
            line-height: 1.3;
        }

        .sig-header {
            font-weight: bold;
            font-size: 7.3pt;
            color: #0f172a;
            margin-bottom: 1mm;
            padding-bottom: 0.6mm;
            border-bottom: 1px solid #e2e8f0;
            text-transform: uppercase;
        }

        /* Digital Signature Box */
        .digi-sig-box {
            border: 1px solid #93c5fd;
            background: #f0f9ff;
            border-radius: 3px;
            padding: 1.5mm 2mm;
            margin: 1mm 0;
        }

        .digi-sig-table {
            width: 100%;
            border-collapse: collapse;
        }

        .digi-name {
            font-size: 10pt;
            font-weight: bold;
            color: #0f172a;
            line-height: 1.05;
            vertical-align: middle;
            width: 40%;
        }

        .digi-meta {
            font-size: 5.8pt;
            color: #334155;
            line-height: 1.25;
            vertical-align: middle;
            border-left: 1px solid #bae6fd;
            padding-left: 2mm;
        }

        .partner-sig-space {
            height: 13mm;
            position: relative;
            margin: 1mm 0;
            border-bottom: 1px dashed #94a3b8;
            text-align: center;
        }

        .sig-stamp-text {
            font-size: 5.8pt;
            color: #94a3b8;
            padding-top: 4.5mm;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .sig-meta {
            margin-top: 1mm;
            font-size: 6.7pt;
            color: #475569;
            line-height: 1.3;
        }
    </style>
</head>
<body>

    <!-- Running Header -->
    <div class="page-header">
        <table>
            <tr>
                <td>
                    <img src="{{ public_path('img/branding/logo-type.svg') }}" class="header-logo" alt="Treetino">
                </td>
                <td class="header-title">
                    Dohoda o mlčenlivosti (NDA) &bull; Obchodní zástupce / Partner
                </td>
            </tr>
        </table>
    </div>

    <!-- Running Footer -->
    <div class="page-footer">
        <table>
            <tr>
                <td class="footer-left">
                    Treetino corp s.r.o. | IČO: 10800107
                </td>
                <td class="footer-center">
                    DŮVĚRNÉ / CONFIDENTIAL
                </td>
                <td class="footer-right">
                    <span class="page-number"></span>
                </td>
            </tr>
        </table>
    </div>

    <!-- Document Header -->
    <div class="doc-header">
        <div class="doc-badge">Právní dokument &bull; Non-Disclosure Agreement (NDA)</div>
        <div class="doc-title">Dohoda o mlčenlivosti, ochraně informací<br>a zákazu jejich zneužití</div>
        <div class="doc-subtitle">
            uzavřená dle ustanovení § 1746 odst. 2 a § 1730 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů
        </div>
    </div>

    <!-- Článek I -->
    <h2 class="article-title">I. Smluvní strany</h2>

    <p style="margin-bottom: 1.2mm;">Níže uvedeného dne, měsíce a roku uzavírají tuto Dohodu o mlčenlivosti, ochraně informací a zákazu jejich zneužití (dále jen „<strong>Dohoda</strong>“) tyto Smluvní strany:</p>

    <table class="parties-table">
        <tr>
            <!-- Poskytovatel -->
            <td class="party-col provider">
                <div class="party-heading">1.1 Poskytovatel (Treetino)</div>
                <div class="party-row"><span class="party-label">Obchodní firma:</span><span class="party-value">Treetino corp s.r.o.</span></div>
                <div class="party-row"><span class="party-label">IČO:</span><span class="party-value">10800107</span></div>
                <div class="party-row"><span class="party-label">Sídlo:</span><span class="party-value">Vlčetín 62, Bílá 463 43</span></div>
                <div class="party-row"><span class="party-label">Zastoupena:</span><span class="party-value">Dominikem Maškem, jednatelem</span></div>
                <div class="party-row"><span class="party-label">Rejstřík:</span><span class="party-value">KS v Ústí nad Labem, C 48430</span></div>
                <div class="party-row"><span class="party-label">E-mail:</span><span class="party-value">info@treetino.com</span></div>
                <div class="party-row" style="margin-top: 0.6mm; font-size: 6.2pt; color: #64748b; font-style: italic;">
                    (dále jen jako „<strong>Poskytovatel</strong>“ nebo „<strong>Treetino</strong>“)
                </div>
            </td>

            <!-- Příjemce / Obchodní partner -->
            <td class="party-col recipient">
                <div class="party-heading">1.2 Příjemce (Obchodní zástupce / Partner)</div>
                
                <div class="fill-field">
                    <div class="fill-field-label">Obchodní firma / Jméno a příjmení:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field">
                    <div class="fill-field-label">IČO / Datum narození (RČ):</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field">
                    <div class="fill-field-label">DIČ (je-li plátce DPH):</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field">
                    <div class="fill-field-label">Sídlo / Trvalé bydliště:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field">
                    <div class="fill-field-label">Zastoupen(a) / Jednající pan/paní:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field">
                    <div class="fill-field-label">E-mail a telefonní kontakt:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="fill-field" style="margin-bottom: 0;">
                    <div class="fill-field-label">Bankovní spojení / Číslo účtu:</div>
                    <div class="fill-field-dots"></div>
                </div>

                <div class="party-row" style="margin-top: 0.6mm; font-size: 6.2pt; color: #64748b; font-style: italic;">
                    (dále jen jako „<strong>Příjemce</strong>“ nebo „<strong>Obchodní partner</strong>“)
                </div>
            </td>
        </tr>
    </table>

    <p style="font-size: 6.5pt; color: #64748b; margin-bottom: 1.5mm;">
        (Poskytovatel a Příjemce dále společně také jen jako „<strong>Smluvní strany</strong>“, nebo každý samostatně jako „<strong>Smluvní strana</strong>“)
    </p>

    <!-- Článek II -->
    <h2 class="article-title">II. Preambule a účel dohody</h2>
    
    <p class="clause"><strong>2.1</strong> Smluvní strany vedou jednání o navázání a realizaci obchodní a technické spolupráce, v jejímž rámci bude Příjemce jako obchodní zástupce, prodejce, distributor nebo partnerská společnost vyvíjet obchodní činnost, zejména vyhledávat obchodní příležitosti, zprostředkovávat prodej, prezentovat, propagovat a zajišťovat distribuci nebo instalaci produktů a technologií společnosti Treetino (zejména autonomních větrných a solárních stromů Treetino V1, Treetino V2, vertikálních větrných mikroturbín T1 a souvisejícího příslušenství) a využívat obchodní software a kalkulační nástroje Poskytovatele (Treetino Pricing App, CRM, partnerský portál a konfigurační nástroje) – dále jen „<strong>Vzájemná spolupráce</strong>“.</p>

    <p class="clause"><strong>2.2</strong> Za účelem jednání o Vzájemné spolupráci a jejího následného řádného výkonu bude Poskytovatel Příjemci zpřístupňovat vysoce důvěrné obchodní, cenové, technické, vývojové, strategické, klientské a provozní informace a know-how, které představují cenné obchodní tajemství a duševní vlastnictví Poskytovatele a mají zásadní hospodářskou hodnotu.</p>

    <p class="clause"><strong>2.3</strong> Účelem této Dohody je stanovení přesných a závazných podmínek pro ochranu důvěrných informací a obchodního tajemství Poskytovatele, vymezení povinností Příjemce při nakládání s těmito informacemi, zákaz jejich neoprávněného užití, vyzrazení, šíření či zpřístupnění třetím osobám a stanovení právních následků a sankcí v případě jejich porušení.</p>

    <!-- Článek III -->
    <h2 class="article-title">III. Vymezení důvěrných informací a obchodního tajemství</h2>

    <p class="clause"><strong>3.1</strong> <strong>Důvěrnými informacemi</strong> se pro účely této Dohody rozumí veškeré informace, skutečnosti, data, podklady, materiály a know-how jakékoliv povahy (technické, obchodní, finanční, cenové, právní, výrobní, strategické, provozní či organizační), bez ohledu na formu a způsob jejich zachycení nebo sdělení (ústně, písemně, elektronicky, v podobě výkresů, 3D CAD modelů, zdrojových kódů či předvedením prototypů a softwaru), které Poskytovatel Příjemci přímo či nepřímo zpřístupnil, sdělil, předal nebo které se Příjemce v souvislosti s jednáním či Vzájemnou spoluprací dozvěděl (dále jen „<strong>Důvěrné informace</strong>“).</p>

    <p class="clause"><strong>3.2</strong> Za Důvěrné informace a <strong>obchodní tajemství</strong> Poskytovatele ve smyslu ustanovení § 504 a § 1730 občanského zákoníku se považují zejména, nikoliv však výlučně:</p>
    <ul>
        <li><strong>Obchodní, cenové a finanční informace:</strong> prodejní i nákupní ceníky, struktura marží a slev, provizní řády a odměňovací modely prodejců, kalkulační matice a vzorce, cenové nabídky připravované pro zákazníky, obchodní a marketingové strategie, obchodní pipeline a plány expanze na trhy;</li>
        <li><strong>Klientská a partnerská data:</strong> databáze poptávek, kontaktů a identifikačních údajů stávajících i potenciálních zákazníků, rozpracované obchodní případy (leads), historie komunikace s klienty, záznamy v CRM a obchodních evidencích, a podmínky sjednané s dodavateli;</li>
        <li><strong>Technická dokumentace a know-how:</strong> výrobní a konstrukční výkresy, 3D CAD modely, schémata zapojení, technické parametry větrných a solárních stromů, materiálové specifikace kompozitů, aerodynamické profily mikroturbín, řešení střídačů, řídicí elektroniky a bateriových systémů;</li>
        <li><strong>Software, digitální aktiva a přístupy:</strong> veškeré zdrojové i binární kódy, databázové struktury, webové a cloudové aplikace (zejména Treetino Pricing / Sales App), přístupová rozhraní (API), jakož i veškeré přístupové údaje (uživatelská jména, hesla, tokeny a certifikáty) přidělené Příjemci;</li>
        <li><strong>Strategické a organizační informace:</strong> informace o patentech, užitných a průmyslových vzorech v přípravě, investičních jednáních, smluvních vztazích s partnery a interních provozních postupech.</li>
    </ul>

    <p class="clause"><strong>3.3</strong> Důvěrnou informací je rovněž samotná existence této Dohody, skutečnost, že mezi Smluvními stranami probíhají jednání, a veškerý obsah a parametry Vzájemné spolupráce.</p>

    <p class="clause"><strong>3.4</strong> Veškeré informace uvedené v tomto článku jsou dále souhrnně označovány jako „<strong>Chráněné informace</strong>“. Má se za to, že veškeré informace předané Poskytovatelem Příjemci jsou Chráněnými informacemi, ledaže Poskytovatel výslovně písemně prohlásí opak.</p>

    <!-- Článek IV -->
    <h2 class="article-title">IV. Závazky Příjemce a pravidla ochrany informací</h2>

    <p class="clause"><strong>4.1</strong> Příjemce se tímto neodvolatelně zavazuje:</p>
    <ul>
        <li>Zachovávat o všech Chráněných informacích nejpřísnější mlčenlivost a chránit je s péčí řádného hospodáře a nejvyšší možnou mírou obezřetnosti;</li>
        <li>Užívat Chráněné informace výhradně a pouze za účelem plnění dohodnuté Vzájemné spolupráce a výhradně ve prospěch Poskytovatele;</li>
        <li>Neposkytnout, nesdělit, nezpřístupnit, nerozšiřovat, nepublikovat ani neumožnit přístup k Chráněným informacím žádné třetí osobě bez předchozího výslovného písemného souhlasu Poskytovatele;</li>
        <li>Nevyužít Chráněné informace (včetně získaného know-how, kalkulačních modelů a klientských databází) ve svůj vlastní prospěch ani ve prospěch jakékoliv třetí osoby, zejména nevyvíjet přímou ani nepřímou konkurenční činnost vůči Poskytovateli a nevyvíjet ani nenabízet obdobná technická či obchodní řešení;</li>
        <li>Nečinit žádné kroky směřující k obcházení Poskytovatele (<strong>zákaz obcházení / non-circumvention</strong>), zejména nekontaktovat napřímo klienty, poptávající osoby či dodavatele Poskytovatele za účelem uzavření obchodu mimo Poskytovatele.</li>
    </ul>

    <p class="clause"><strong>4.2 Omezení okruhu osob:</strong> Příjemce je oprávněn zpřístupnit Chráněné informace pouze těm svým statutárním orgánům, zaměstnancům a odborným poradcům, kteří tyto informace nezbytně nutně potřebují k výkonu Vzájemné spolupráce (princip <em>need-to-know</em>). Příjemce je povinen tyto osoby předem prokazatelně a písemně zavázat mlčenlivostí ve stejném rozsahu jako dle této Dohody, přičemž za jakékoliv porušení těmito osobami odpovídá Příjemce tak, jako by se porušení dopustil sám.</p>

    <p class="clause"><strong>4.3 Technická a bezpečnostní ochrana:</strong> Příjemce se zavazuje zabezpečit veškerá technická zařízení (počítače, mobilní telefony, tablety), ze kterých přistupuje k softwaru a systémům Poskytovatele, silnými přístupovými hesly a dvoufaktorovým ověřením (2FA). Příjemce nesmí sdělit své přístupové údaje žádné další osobě a nesmí ukládat Chráněné informace na veřejná či nezabezpečená cloudová úložiště.</p>

    <p class="clause"><strong>4.4 Oznamovací povinnost:</strong> V případě zjištění jakéhokoliv neoprávněného přístupu, úniku, ztráty či vyzrazení Chráněných informací je Příjemce povinen neprodleně (nejpozději do 24 hodin) písemně informovat Poskytovatele a poskytnout mu veškerou součinnost k nápravě.</p>

    <!-- Článek V -->
    <h2 class="article-title">V. Výjimky ze závazku mlčenlivosti</h2>

    <p class="clause"><strong>5.1</strong> Povinnost mlčenlivosti dle této Dohody se nevztahuje na informace, které: (a) byly v době jejich zpřístupnění prokazatelně veřejně známé, nebo se staly veřejně známými jinak než v důsledku porušení této Dohody; (b) měl Příjemce prokazatelně k dispozici již před jejich poskytnutím Poskytovatelem; (c) byly uvolněny ze závazku mlčenlivosti písemným souhlasem Poskytovatele; (d) je Příjemce povinen zpřístupnit na základě kogentních právních předpisů nebo pravomocného rozhodnutí soudu či orgánu veřejné moci (s povinností předem písemně informovat Poskytovatele a minimalizovat rozsah sdělovaných dat).</p>

    <!-- Článek VI -->
    <h2 class="article-title">VI. Duševní vlastnictví a nakládání s podklady</h2>

    <p class="clause"><strong>6.1</strong> Veškerá práva k Chráněným informacím, obchodnímu tajemství, patentům, užitným vzorům, ochranným známkám, autorským dílům, konstrukčním řešením, know-how, databázím a softwarovým nástrojům zůstávají výlučným majetkem Poskytovatele. Poskytnutí informací nezakládá žádné licenční ani patentové oprávnění.</p>

    <p class="clause"><strong>6.2 Vrácení a skartace podkladů:</strong> Příjemce je povinen na písemnou výzvu Poskytovatele nebo nejpozději do 5 (pěti) pracovních dnů od ukončení Vzájemné spolupráce vrátit Poskytovateli veškeré hmotné materiály, nosiče dat, výkresy, vzorky a dokumenty a veškeré digitální kopie a záznamy trvale a nevratně vymazat/skartovat ze všech svých zařízení.</p>

    <!-- Článek VII -->
    <h2 class="article-title">VII. Smluvní pokuta a odpovědnost za škodu</h2>

    <p class="clause"><strong>7.1</strong> Poruší-li Příjemce jakoukoliv povinnost stanovenou v této Dohodě (zejména poruší-li povinnost mlčenlivosti, zpřístupní-li Chráněné informace třetí osobě, zneužije-li Chráněné informace pro vlastní prospěch či prospěch třetích osob, poruší-li zákaz obcházení/konkurence nebo nesplní-li povinnost vrácení podkladů), je Příjemce povinen zaplatit Poskytovateli <strong>smluvní pokutu ve výši 100.000 Kč (slovy: jedno sto tisíc korun českých)</strong> za každý jednotlivý případ porušení. V případě trvajícího porušení se sjednává smluvní pokuta ve výši <strong>5.000 Kč</strong> za každý započatý den trvání porušení.</p>

    <p class="clause"><strong>7.2</strong> Smluvní pokuta je splatná do 14 (čtrnácti) kalendářních dnů ode dne doručení písemné výzvy k její úhradě Příjemci.</p>

    <p class="clause"><strong>7.3 Náhrada škody:</strong> Ujednáním o smluvní pokutě ani jejím zaplacením není nijak dotčeno ani omezeno právo Poskytovatele na náhradu způsobené škody, jiné majetkové i nemajetkové újmy a ušlého zisku v plné výši. Smluvní strany výslovně <strong>vylučují aplikaci ustanovení § 2050 občanského zákoníku</strong> a sjednávají, že náhrada škody je vymahatelná v plném rozsahu vedle smluvní pokuty.</p>

    <!-- Článek VIII -->
    <h2 class="article-title">VIII. Doba trvání a účinnost dohody</h2>

    <p class="clause"><strong>8.1</strong> Tato Dohoda nabývá platnosti a účinnosti dnem jejího podpisu oběma Smluvními stranami a uzavírá se na <strong>dobu neurčitou</strong>.</p>

    <p class="clause"><strong>8.2</strong> Závazek k ochraně Chráněných informací a zachování mlčenlivosti trvá po celou dobu trvání jednání i samotné Vzájemné spolupráce Smluvních stran a dále po dobu <strong>5 (pěti) let</strong> od faktického ukončení veškeré Vzájemné spolupráce; v případě informací tvořících obchodní tajemství ve smyslu § 504 občanského zákoníku a know-how Poskytovatele trvá závazek mlčenlivosti po celou dobu existence tohoto obchodního tajemství bez časového omezení.</p>

    <!-- Článek IX -->
    <h2 class="article-title">IX. Závěrečná ustanovení</h2>

    <p class="clause"><strong>9.1</strong> Právní vztahy založené touto Dohodou se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník. Případné spory budou rozhodovány věcně a místně příslušnými obecnými soudy České republiky podle sídla Poskytovatele.</p>

    <p class="clause"><strong>9.2</strong> Veškeré změny a doplňky této Dohody vyžadují písemnou formu dodatků podepsaných oběma Smluvními stranami. Neplatnost některého ustanovení se nedotýká platnosti ostatních ustanovení (salvátorská klauzule).</p>

    <p class="clause"><strong>9.3</strong> Tato Dohoda je vyhotovena ve dvou stejnopisech s platností originálu (po jednom pro každou stranu), popřípadě v jednom elektronickém vyhotovení opatřeném elektronickými podpisy obou Smluvních stran.</p>

    <!-- Podpisy -->
    <div class="signatures-container">
        <p style="margin-bottom: 2mm; font-size: 7.4pt; font-weight: bold;">
            Na důkaz svobodného, vážného a srozumitelného projevu vůle připojují Smluvní strany své podpisy:
        </p>

        <table class="signatures-table">
            <tr>
                <!-- Poskytovatel (Treetino with Dominik Mašek signature) -->
                <td class="signature-box">
                    <div class="sig-header">Za Treetino corp s.r.o. (Poskytovatel)</div>
                    
                    <div style="margin-top: 0.8mm; font-size: 7.2pt; color: #0f172a; font-weight: bold;">
                        Dominik Mašek
                    </div>
                    <div style="font-size: 6.8pt; color: #475569; margin-bottom: 1.2mm;">
                        V Bílé / Praze dne: 21. 7. 2026
                    </div>

                    <!-- Actual Handwritten Signature Image -->
                    <div style="border: 1px dashed #94a3b8; border-radius: 4px; background: #fafafa; height: 16mm; text-align: center;">
                        <img src="{{ public_path('img/legal/dominik-signature.png') }}" style="height: 13mm; margin-top: 1.5mm;" alt="Podpis Dominik Mašek">
                    </div>

                    <div class="sig-meta">
                        <strong>Dominik Mašek</strong><br>
                        Jednatel, Treetino corp s.r.o.
                    </div>
                </td>

                <!-- Obchodní partner -->
                <td class="signature-box">
                    <div class="sig-header">Za Příjemce (Obchodního partnera / Prodejce)</div>
                    
                    <div style="margin-top: 0.8mm; font-size: 7.2pt; color: #64748b; font-style: italic;">
                        [ Obchodní partner / Firma ]
                    </div>
                    <div style="font-size: 6.8pt; color: #475569; margin-bottom: 1.2mm;">
                        V ........................................ dne: ............................
                    </div>

                    <div class="partner-sig-space" style="border: 1px dashed #cbd5e1; border-radius: 4px; background: #fafafa; height: 16mm; text-align: center;">
                        <div class="sig-stamp-text">
                            [ Vlastnoruční / Digitální podpis ]
                        </div>
                    </div>

                    <div class="sig-meta">
                        Jméno a příjmení: .................................................<br>
                        Funkce / Oprávnění: .................................................
                    </div>
                </td>
            </tr>
        </table>
    </div>

</body>
</html>
