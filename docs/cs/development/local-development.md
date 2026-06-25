# Lokální vývoj

## Požadavky

Nainstalujte PHP 8.3+, Composer 2, Node.js 22, npm a databázi přijatelnou pro lokální prostředí. Produkce a testování podobné produkci mají používat MySQL.

Požadovaná PHP rozšíření zahrnují běžná rozšíření Laravelu a podporu MySQL: `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `hash`, `mbstring`, `openssl`, `pdo`, `pdo_mysql`, `session`, `tokenizer` a `xml`.

## První nastavení

Z kořene repozitáře spusťte:

```bash
composer install
cp .env.example .env
php artisan key:generate
npm install
```

V `.env` nastavte databázi, odesílání pošty a Stripe a poté spusťte:

```bash
php artisan migrate
php artisan translations:sync
npm run build
```

Soubor `.env` ani přístupové údaje necommitujte.

Zkratka Composeru pro nastavení nainstaluje závislosti, vytvoří chybějící `.env`, vygeneruje aplikační klíč, provede migrace, nainstaluje npm balíčky a sestaví frontend:

```bash
composer setup
```

Před použitím této zkratky proti jiné než jednorázové databázi zkontrolujte `.env`.

## Vývojové procesy

Server Laravelu, posluchač databázové fronty, prohlížeč logů a vývojový server Vite spustíte společně:

```bash
composer dev
```

Příkaz běží do zastavení a při ukončení jednoho procesu ukončí i ostatní.

Varianta vývoje se serverovým vykreslováním:

```bash
composer dev:ssr
```

SSR je v sestavení repozitáře volitelné. Pokud se v prostředí používá, musí v něm proces Inertia SSR zůstat spuštěný.

## Užitečné aplikační příkazy

```bash
php artisan route:list
php artisan migrate:status
php artisan translations:sync
php artisan translations:sync --force
php artisan admin:create --name="Content Admin" --email="admin@example.com"
php artisan optimize:clear
```

`translations:sync` doplňuje chybějící hodnoty katalogu a zachovává databázové úpravy. Volba `--force` přepíše existující hodnoty verzovaným katalogem, proto ji používejte uvážlivě.

`admin:create` bezpečně vyžádá heslo a jeho potvrzení. Heslo správce musí mít alespoň 12 znaků.

## Proměnné prostředí používané aplikací

Mezi důležité proměnné patří:

| Proměnná | Účel |
| --- | --- |
| `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL` | Identita Laravelu a běhové chování |
| `APP_LOCALE`, `APP_FALLBACK_LOCALE` | Výchozí a záložní jazyk |
| `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Připojení k databázi |
| `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION` | Stavové služby Laravelu |
| `MAIL_*` | Doručování ověřovacích e-mailů a obnovy hesla |
| `STRIPE_KEY`, `STRIPE_SECRET` | Serverová konfigurace Stripe |
| `VITE_STRIPE_KEY` | Veřejný klíč Stripe sestavený do prohlížeče |
| `VITE_APP_NAME` | Název aplikace dostupný pro Vite/SSR |

Po změně hodnot používaných dlouho běžícími procesy nebo Vite restartujte workery a znovu sestavte frontend.
