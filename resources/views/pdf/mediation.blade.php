<!DOCTYPE html>
<html lang="cs">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Smlouva o zprostředkování - Treetino corp s.r.o.</title>
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
            margin-top: 2.2mm;
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

        .partner-sig-space {
            height: 14mm;
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
                    Smlouva o zprostředkování &bull; Obchodní zástupce / Partner
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
        <div class="doc-badge">Právní dokument &bull; Obchodní zastoupení</div>
        <div class="doc-title">Smlouva o zprostředkování</div>
        <div class="doc-subtitle">
            uzavřená podle § 2445 a násl. zákona č. 89/2012 Sb., občanský zákoník, ve znění pozdějších předpisů
        </div>
    </div>

    <!-- Článek I -->
    <h2 class="article-title">I. Smluvní strany</h2>

    <p style="margin-bottom: 1.2mm;">Níže uvedeného dne, měsíce a roku uzavírají tuto Smlouvu o zprostředkování (dále jen „<strong>Smlouva</strong>“) tyto Smluvní strany:</p>

    <table class="parties-table">
        <tr>
            <!-- Zájemce -->
            <td class="party-col provider">
                <div class="party-heading">1.1 Zájemce (Treetino)</div>
                <div class="party-row"><span class="party-label">Obchodní firma:</span><span class="party-value">Treetino corp s.r.o.</span></div>
                <div class="party-row"><span class="party-label">IČO:</span><span class="party-value">10800107</span></div>
                <div class="party-row"><span class="party-label">DIČ:</span><span class="party-value">CZ10800107</span></div>
                <div class="party-row"><span class="party-label">Sídlo:</span><span class="party-value">Vlčetín 62, Bílá 463 43</span></div>
                <div class="party-row"><span class="party-label">Zastoupena:</span><span class="party-value">Dominikem Maškem, jednatelem</span></div>
                <div class="party-row"><span class="party-label">Rejstřík:</span><span class="party-value">KS v Ústí nad Labem, C 48430</span></div>
                <div class="party-row"><span class="party-label">E-mail:</span><span class="party-value">info@treetino.com</span></div>
                <div class="party-row" style="margin-top: 0.6mm; font-size: 6.2pt; color: #64748b; font-style: italic;">
                    (dále jen jako „<strong>Zájemce</strong>“ nebo „<strong>Treetino</strong>“)
                </div>
            </td>

            <!-- Zprostředkovatel -->
            <td class="party-col recipient">
                <div class="party-heading">1.2 Zprostředkovatel (Partner / Prodejce)</div>
                
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
                    (dále jen jako „<strong>Zprostředkovatel</strong>“ nebo „<strong>Partner</strong>“)
                </div>
            </td>
        </tr>
    </table>

    <p style="font-size: 6.5pt; color: #64748b; margin-bottom: 1.5mm;">
        (Zájemce a Zprostředkovatel dále společně také jen jako „<strong>Smluvní strany</strong>“, nebo každý samostatně jako „<strong>Smluvní strana</strong>“)
    </p>

    <!-- Článek II -->
    <h2 class="article-title">II. Předmět smlouvy</h2>
    
    <p class="clause"><strong>2.1</strong> Zprostředkovatel se touto smlouvou zavazuje vyvíjet činnost směřující k tomu, aby Zájemce měl příležitost uzavřít s třetími osobami (dále jen „<strong>Klienti</strong>“) kupní smlouvy nebo smlouvy o dílo na dodávku produktů a systémů Zájemce.</p>

    <p class="clause"><strong>2.2</strong> Předmětem zprostředkování jsou výhradně inovativní produkty Zájemce prezentované na webové stránce www.treetino.com (případně www.treetino.eu), a to konkrétně autonomní hybridní stromy <strong>Treetino V1</strong>, <strong>Treetino V2</strong>, samostatné vertikální větrné mikroturbíny a související technologické příslušenství (dále jen „<strong>Produkty</strong>“).</p>

    <p class="clause"><strong>2.3</strong> Zprostředkovatel je oprávněn Produkty aktivně nabízet, prezentovat a vyhledávat zájemce na dohodnutém území. Zprostředkovatel však není bez předchozí písemné plné moci oprávněn za Zájemce uzavírat jakékoliv smlouvy ani přijímat peněžitá či jiná plnění.</p>

    <!-- Článek III -->
    <h2 class="article-title">III. Provize a platební podmínky</h2>

    <p class="clause"><strong>3.1</strong> Za obstarání příležitosti k uzavření smlouvy s Klientem náleží Zprostředkovateli provize ve výši <strong>3 % z čisté prodejní ceny bez DPH</strong> u každého takto realizovaného obchodu, případně provize odpovídající zařazení Zprostředkovatele ve výkonnostní třídě B2B partnerského portálu (Silver, Gold, Platinum). Nárok na tuto provizi vzniká Zprostředkovateli ve stejné výši i v případě, že Zprostředkovatel zajistí prokazatelný kontakt a ověřenou poptávku (lead) a samotné finální smluvní jednání dokončí Zájemce.</p>

    <p class="clause"><strong>3.2</strong> Nárok na provizi vzniká Zprostředkovateli výlučně v okamžiku, kdy Klient v plné výši uhradí Zájemci první vystavenou fakturu (např. zálohovou fakturu či platbu za první etapu) vztahující se k předmětnému obchodu.</p>

    <p class="clause"><strong>3.3</strong> Provize je splatná na základě daňového dokladu (faktury) řádně vystaveného Zprostředkovatelem. Lhůta splatnosti činí 14 kalendářních dnů ode dne, kdy byla příslušná platba od Klienta prokazatelně připsána na bankovní účet Zájemce.</p>

    <!-- Článek IV -->
    <h2 class="article-title">IV. Ochrana práv, know-how a mlčenlivost (NDA)</h2>

    <p class="clause"><strong>4.1 Práva duševního vlastnictví:</strong> Zprostředkovatel výslovně bere na vědomí, že Produkty a technologie Treetino podléhají patentové ochraně, ochraně průmyslových vzorů, užitných vzorů a ochranných známek ve vlastnictví Zájemce. Zprostředkovatel nesmí Produkty napodobovat, reverzně analyzovat (reverse engineering) ani poskytnout součinnost třetí osobě k neoprávněnému využití technologií Zájemce.</p>

    <p class="clause"><strong>4.2 Obchodní tajemství a důvěrné informace:</strong> Veškeré obchodní, technické, kalkulační a finanční informace, včetně informací o cenotvorbě, provizních schématech, kalkulačních modelech v aplikaci Treetino Pricing a databázích klientů, se kterými se Zprostředkovatel seznámí, tvoří přísně chráněné obchodní tajemství Zájemce.</p>

    <p class="clause"><strong>4.3 Závazek mlčenlivosti:</strong> Zprostředkovatel se zavazuje zachovávat absolutní mlčenlivost o všech důvěrných informacích po celou dobu trvání této smlouvy a po dobu 5 (pěti) let po jejím zániku; v případě informací tvořících obchodní tajemství bez časového omezení.</p>

    <!-- Článek V -->
    <h2 class="article-title">V. Smluvní pokuty a náhrada škody</h2>

    <p class="clause"><strong>5.1</strong> V případě porušení povinností stanovených v čl. IV. této smlouvy je Zprostředkovatel povinen uhradit Zájemci smluvní pokutu ve výši <strong>500.000 Kč (slovy: pět set tisíc korun českých)</strong> za každý jednotlivý případ porušení.</p>

    <p class="clause"><strong>5.2</strong> Ujednáním o smluvní pokutě ani jejím uhrazením není dotčen nárok Zájemce na náhradu způsobené škody v plné výši, přesahuje-li výše vzniklé škody sjednanou smluvní pokutu.</p>

    <!-- Článek VI -->
    <h2 class="article-title">VI. Doba trvání a závěrečná ustanovení</h2>

    <p class="clause"><strong>6.1</strong> Tato smlouva se uzavírá na dobu neurčitou. Smlouvu lze ukončit písemnou výpovědí kterékoliv ze Smluvních stran i bez uvedení důvodu s výpovědní dobou 1 měsíc, která počíná běžet prvním dnem kalendářního měsíce následujícího po doručení výpovědi.</p>

    <p class="clause"><strong>6.2</strong> Právní vztahy založené touto smlouvou se řídí právním řádem České republiky, zejména zákonem č. 89/2012 Sb., občanský zákoník. Případné spory budou řešeny věcně a místně příslušným soudem podle sídla Zájemce.</p>

    <p class="clause"><strong>6.3</strong> Smlouva je vyhotovena ve dvou stejnopisech s platností originálu, z nichž každá Smluvní strana obdrží po jednom vyhotovení, popřípadě v elektronickém vyhotovení opatřeném elektronickými podpisy obou Smluvních stran.</p>

    <p class="clause"><strong>6.4</strong> Smluvní strany prohlašují, že si tuto smlouvu před jejím podpisem přečetly, porozuměly jejímu obsahu a uzavírají ji ze své svobodné a vážné vůle, na důkaz čehož připojují své podpisy.</p>

    <!-- Podpisy -->
    <div class="signatures-container">
        <p style="margin-bottom: 2mm; font-size: 7.4pt; font-weight: bold;">
            Na důkaz svobodného a vážného projevu vůle připojují Smluvní strany své podpisy:
        </p>

        <table class="signatures-table">
            <tr>
                <!-- Zájemce (Treetino with Dominik Mašek signature) -->
                <td class="signature-box">
                    <div class="sig-header">Za Treetino corp s.r.o. (Zájemce)</div>
                    
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

                <!-- Zprostředkovatel -->
                <td class="signature-box">
                    <div class="sig-header">Za Zprostředkovatele (Partnera)</div>
                    
                    <div style="margin-top: 0.8mm; font-size: 7.2pt; color: #64748b; font-style: italic;">
                        [ Obchodní zástupce / Partner ]
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
