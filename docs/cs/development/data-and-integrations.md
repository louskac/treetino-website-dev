# Data a integrace

## Hlavní datový model

| Model | Tabulka | Důležité vztahy a účel |
| --- | --- | --- |
| `User` | `users` | Identita zákazníka; má předobjednávky a zprávy; může mít ID zákazníka Stripe |
| `Admin` | `admins` | Nezávislá identita správce |
| `Preorder` | `preorders` | Patří zákazníkovi; ukládá UUID, produkt, konfiguraci, částku, stav a identifikátory Stripe |
| `Message` | `messages` | Volitelně patří zákazníkovi; ukládá kontaktní údaje a stav přečtení/odpovědi |
| `TranslationKey` | `translation_keys` | Jedinečná skupina a klíč překladu; má jazykové překlady |
| `Translation` | `translations` | Patří překladovému klíči; ukládá jednu jazykovou hodnotu a stav synchronizace |

Laravel používá databázové tabulky také pro relace, mezipaměť, úlohy fronty, neúspěšné úlohy, dávky úloh a tokeny obnovení hesla.

## Životní cyklus předobjednávky

1. Prohlížeč odešle e-mail, typ produktu a kompletní konfiguraci na `POST /checkout`.
2. Laravel požadavek ověří a najde nebo vytvoří zákazníka podle e-mailu.
3. Pokud zákazník dosud nemá záznam Stripe, vytvoří se zákazník Stripe.
4. Laravel vytvoří čekající předobjednávku před vyžádáním PaymentIntentu.
5. Stripe vrátí klientské tajemství; Laravel uloží ID PaymentIntentu a vrátí klientské tajemství a UUID předobjednávky.
6. Stripe Elements potvrdí platbu v prohlížeči.
7. Potvrzovací stránka načte předobjednávku podle UUID.

Rezervační částky se ukládají v nejmenší měnové jednotce:

- Strom V1: `1200000` = 12 000 Kč;
- Strom V2: `1200000` = 12 000 Kč;
- větrná turbína: `600000` = 6 000 Kč.

ID produktů, rezervační částky, frontendové definice produktů a backendová validace jsou nyní definovány v kódu. Při změně produktu nebo ceny aktualizujte všechny odpovídající definice společně.

## Konfigurační payload

Konfigurace předobjednávky se ukládá jako JSON. Podle produktu může obsahovat barvu konstrukce, barvu listů, styl fotovoltaických listů, konektivitu, baterii, nabíjecí doplňky, přítomnost turbín, velikost turbíny, uchycení, design stromu a vybranou dotaci.

Dříve uložené payloady považujte za historické záznamy. Při vývoji konfiguračních polí udržujte potvrzovací stránku a fakturu kompatibilní se staršími tvary payloadu.

## Generování faktury

`POST /preorders/invoice` přijímá UUID předobjednávky, načte předobjednávku a zákazníka, vykreslí `resources/views/pdf/invoice.blade.php` pomocí Dompdf a vrátí PDF formátu A4 ke stažení.

Přibalená písma DM Sans v `storage/fonts` podporují vykreslení faktury. Po změně CSS faktury nebo souborového systému nasazení ověřte dostupnost písem a výstup PDF.

## Kontaktní zprávy

`POST /contact` ověřuje jméno, e-mail a zprávu. Pokud existuje zákazník se zadaným e-mailem, zpráva obdrží jeho ID; jinak zůstane `user_id` prázdné. Smazání zákazníka nastaví `user_id` souvisejících zpráv na null a obsah zpráv nesmaže.

## Lokalizace

Podporované jazyky jsou `cs` a `en`. Volba jazyka se ukládá do relace a dlouhodobého cookie `locale`. `SetLocale` vybírá aktuální jazyk každého požadavku.

`config/translation_catalog.php` je verzovaný základ. `TranslationService` sestaví základní zprávy a překryje je jazykovými hodnotami z MySQL. Výsledné zprávy jsou pro každý jazyk uloženy v mezipaměti na 24 hodin.

Synchronizace vloží chybějící klíče a hodnoty. Úpravy správce nastaví `synced_at` na null, vymažou mezipaměť zpráv a objeví se ve stavu nástěnky. Běžná synchronizace potvrdí živé úpravy bez jejich přepsání. Vynucená synchronizace je nahradí katalogem.

Zástupné symboly používají syntaxi `{name}`. Všechny jazykové hodnoty jednoho klíče musí obsahovat stejnou množinu názvů.

## E-mail

Ověření zákaznického e-mailu a obnovení hesla závisí na nastaveném maileru Laravelu. Lokálně je užitečný logovací mailer, ale nasazené prostředí potřebuje skutečný způsob doručování a adresu odesílatele patřící doméně aplikace.
