# Konfigurátor a rezervace

## Zahájení konfigurace

Otevřete `/configurator` nebo použijte tlačítko konfigurace na produktové stránce. Vyberte jeden ze tří dostupných produktů:

- Strom V1;
- Strom V2;
- větrná turbína.

`[[SCREENSHOT]] - Výběr všech tří produktů v konfigurátoru`

Konfigurátor zobrazuje informace o výkonu produktu a provede vás možnostmi platnými pro vybraný produkt.

## Konfigurace Stromu V1

Konfigurace Stromu V1 obsahuje:

1. barvu konstrukce;
2. barvu listů;
3. design fotovoltaických listů;
4. konektivitu;
5. baterii;
6. počet nabíječek pro elektromobily a požadavek na nabíječku elektrokol;
7. výběr dotace a souhrn objednávky.

## Konfigurace Stromu V2

Konfigurace Stromu V2 obsahuje:

1. konfiguraci větrných turbín;
2. design stromu;
3. barvu konstrukce;
4. barvu listů;
5. design fotovoltaických listů;
6. konektivitu;
7. baterii;
8. počet nabíječek pro elektromobily a požadavek na nabíječku elektrokol;
9. výběr dotace a souhrn objednávky.

## Konfigurace větrné turbíny

Konfigurace větrné turbíny obsahuje:

1. velikost turbíny;
2. typ uchycení;
3. barvu turbíny;
4. výběr dotace a souhrn objednávky.

K procházení kroků použijte tlačítka **Další** a **Zpět**. Změnou vybraného produktu se konfigurace nastaví na výchozí hodnoty tohoto produktu.

`[[SCREENSHOT]] - Krok konfigurátoru s aktuálně vybranou možností`

## Odhad dotace a financování

Souhrn používá vybranou dotaci, odhadovanou měsíční úsporu, počáteční vklad, dobu financování a roční úrokovou sazbu k zobrazení orientačního výpočtu. Tento výpočet je pouze informativní a je oddělený od platby rezervace.

`[[SCREENSHOT]] - Souhrn konfigurace s odhadem dotace a financování`

## Rezervace produktu

Aktuální rezervační platby jsou:

- Strom V1: 12 000 Kč;
- Strom V2: 12 000 Kč;
- větrná turbína: 6 000 Kč.

Postup rezervace nakonfigurovaného produktu:

1. zkontrolujte souhrn konfigurace;
2. otevřete rezervační pokladnu;
3. zadejte platnou e-mailovou adresu;
4. zadejte platební údaje do platebního formuláře Stripe;
5. jednou odešlete platbu a počkejte na potvrzení.

`[[SCREENSHOT]] - Rezervační pokladna s e-mailem a platebními poli Stripe`

Web pro zadaný e-mail vytvoří nebo znovu použije zákaznický záznam a založí předobjednávku s vybranou konfigurací. Rezervační platba je zpracována službou Stripe v českých korunách.

Během zpracování platby stránku nezavírejte ani formulář neodesílejte opakovaně.

## Výsledek platby a faktura

Po úspěšném dokončení platby web otevře stránku potvrzení předobjednávky určenou UUID rezervace. Stránka zobrazuje údaje rezervace a nakonfigurované možnosti.

Pomocí akce pro fakturu na této stránce stáhnete PDF fakturu k rezervaci.

`[[SCREENSHOT]] - Stránka úspěšné předobjednávky se souhrnem a stažením faktury`

Odkaz na potvrzení si uschovejte. Obsahuje identifikátor rezervace používaný k načtení potvrzení a faktury.
