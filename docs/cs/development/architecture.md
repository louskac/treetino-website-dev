# Architektura

## Tok požadavku

Apache předává aplikační požadavky Laravelu přes `public/index.php`. Laravel směruje požadavky do kontrolerů nebo stránek Inertia. Inertia serializuje vlastnosti stránky a Vue načte odpovídající komponentu z `resources/js/pages`. Vite sestavuje TypeScript, Vue, CSS a odkazované frontendové soubory.

```text
Prohlížeč -> Apache -> Laravel route -> kontroler -> Inertia odpověď -> Vue stránka
                                  |                           |
                                  +-> model/služba -> MySQL
```

Blade se používá pro kořenový dokument Inertia a šablonu PDF faktury. Hlavní uživatelské rozhraní není vícestránková aplikace vykreslovaná šablonami Blade.

## Mapa repozitáře

| Cesta | Účel |
| --- | --- |
| `app/Http/Controllers` | Obsluha veřejných požadavků, nastavení zákazníků, administrace, pokladny a integrací |
| `app/Http/Middleware` | Jazyk, vzhled, vlastnosti Inertia a middleware správcovské relace |
| `app/Models` | Záznamy zákazníků, správců, předobjednávek, zpráv a překladů |
| `app/Services/TranslationService.php` | Synchronizace, načítání, stav a mezipaměť překladů |
| `config` | Konfigurace Laravelu, lokalizace, služeb a katalogu překladů |
| `database/migrations` | Historie databázového schématu |
| `resources/js/pages` | Vue stránky na úrovni rout |
| `resources/js/custom` | Vlastní sekce webu a ovládací prvky konfigurátoru |
| `resources/js/components` | Sdílené aplikační a UI komponenty |
| `resources/js/types` | Sdílené TypeScript modely a definice produktů |
| `routes` | Veřejné, zákaznické, správcovské a konzolové routy |
| `tests` | Funkční a jednotkové testy PHPUnit |

Generované soubory Wayfinder v `resources/js/actions` a `resources/js/routes` poskytují typovaný frontendový přístup ke kontrolerům a routám Laravelu. Regenerujte je běžným postupem Vite/Wayfinder; nejsou zdrojovou definicí rout.

## Oblasti rout

- `routes/web.php` definuje veřejné stránky, pokladnu, předobjednávky, kontakt a zákaznickou nástěnku.
- `routes/settings.php` definuje autentizované routy profilu, zabezpečení, hesla a vzhledu.
- `routes/admin.php` definuje nezávislé přihlášení správce, nástěnku, překlady a odhlášení.
- Laravel Fortify poskytuje registraci zákazníků, přihlášení, obnovení hesla, ověření e-mailu, potvrzení hesla a dvoufaktorové routy.
- Laravel vystavuje `/up` jako endpoint kontroly stavu.

Efektivní seznam rout zobrazíte příkazy:

```bash
php artisan route:list --except-vendor
php artisan route:list
```

## Hranice autentizace

Jsou nakonfigurovány dva relační guardy:

- `web` používá `App\Models\User` pro zákazníky;
- `admin` používá `App\Models\Admin` pro správce.

Administraci chrání middleware `admin.auth` a `admin.guest`. Přihlášení zákazníka neposkytuje správcovský přístup a správcovská relace neautentizuje zákaznický guard.

Fortify zajišťuje registraci zákazníků, obnovení hesla, ověření e-mailu a potvrzené dvoufaktorové ověření. Middleware `verified` chrání smazání účtu a nastavení související se zabezpečením.

## Sdílený stav frontendu

`HandleInertiaRequests` sdílí s každou stránkou Inertia:

- název aplikace;
- identitu aktuálního zákazníka a správce;
- aktuální jazyk, záložní jazyk, dostupné jazyky a překladové zprávy;
- zprávy o úspěchu;
- stav postranního panelu.

Inicializace Vue instaluje Inertia, Vue I18n, Ziggy a plugin souhlasu s cookies. Při navigaci nahrazuje zprávy aktuálního jazyka a aktualizuje jazyk dokumentu.

## Konvence frontendu

Komponenty na úrovni rout patří do `resources/js/pages`. Vlastní znovupoužitelné sekce webu jsou v `resources/js/custom`, obecné ovládací prvky v `resources/js/components` a `resources/js/components/ui`.

Metadata produktů a kroků jsou soustředěna v `resources/js/types/products.ts`. Stav konfigurátoru udržuje `resources/js/pages/Configurator/Index.vue` a předává jej komponentám jednotlivých kroků. Identifikátory produktů musí odpovídat backendové validaci a hodnotám databáze:

- `strom-v1`
- `strom-v2`
- `turbina`

Pro importy používejte existující aliasy, například `@/`, a zachovejte TypeScript typy vlastností stránek a konfiguračních polí.
