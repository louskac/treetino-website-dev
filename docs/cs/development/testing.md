# Testování a kvalita

## Kompletní kontroly projektu

Před sloučením nebo nasazením spusťte kontrolu CI z Composeru:

```bash
composer ci:check
```

Spouští kontrolu formátování PHP, lint frontendu, kontrolu Prettieru, TypeScriptu a testovací sadu.

## Jednotlivé kontroly

```bash
composer test
composer lint:check
npm run lint:check
npm run format:check
npm run types:check
npm run build
```

Použití formátování lokálně:

```bash
composer lint
npm run format
npm run lint
```

Frontendový lint používá `--fix`; výsledné změny zkontrolujte.

## Testovací sada PHPUnit

Funkční testy pokrývají autentizaci zákazníka, ověření, obnovení a potvrzení hesla, dvoufaktorové výzvy, nastavení profilu a zabezpečení, změnu jazyka, přístup na nástěnku, autentizaci a vytvoření správce a správu překladů.

Testy používající `RefreshDatabase` znovu vytvářejí databázový stav. Testovací prostředí nikdy nesměrujte na produkční nebo sdílenou databázi.

Jeden test spustíte například:

```bash
php artisan test --filter=TranslationManagementTest
```

## Průběžná integrace

GitHub Actions nyní kontroluje formátování PHP a kvalitu frontendu a spouští testovací sadu na PHP 8.3, 8.4 a 8.5. Testovací workflow instaluje závislosti Node.js 22 a před PHPUnit sestaví produkční frontend.

CI ověřuje repozitář, ale nenasazuje jej. Produkční vydání se řídí ruční [příručkou nasazení](deployment.md).

## Kontrolní seznam změny

Při změně rout, modelů, konfigurace produktů, překladů, pokladny nebo chování účtů:

1. přidejte nebo upravte cílené testy;
2. spusťte příslušnou testovací třídu;
3. spusťte `composer ci:check`;
4. sestavte frontend;
5. při změně viditelného chování aktualizujte anglickou i českou dokumentaci.
