# Local development

## Prerequisites

Install PHP 8.3+, Composer 2, Node.js 22, npm, and a database accepted by the local environment. Production and production-like testing should use MySQL.

Required PHP extensions include common Laravel extensions plus MySQL support: `ctype`, `curl`, `dom`, `fileinfo`, `filter`, `hash`, `mbstring`, `openssl`, `pdo`, `pdo_mysql`, `session`, `tokenizer`, and `xml`.

## Initial setup

From the repository root:

```bash
composer install
cp .env.example .env
php artisan key:generate
npm install
```

Configure the database, mail transport, and Stripe settings in `.env`, then run:

```bash
php artisan migrate
php artisan translations:sync
npm run build
```

Do not commit `.env` or credentials.

The Composer setup shortcut performs dependency installation, creates `.env` if absent, generates an application key, runs migrations, installs npm packages, and builds assets:

```bash
composer setup
```

Review `.env` before using the shortcut against any non-disposable database.

## Development processes

Start the Laravel server, database queue listener, log viewer, and Vite development server together:

```bash
composer dev
```

The command runs until stopped and terminates the other processes if one exits.

For the server-side-rendering development variant:

```bash
composer dev:ssr
```

SSR is optional in the repository build. If it is used in an environment, the Inertia SSR process must remain running there.

## Useful application commands

```bash
php artisan route:list
php artisan migrate:status
php artisan translations:sync
php artisan translations:sync --force
php artisan admin:create --name="Content Admin" --email="admin@example.com"
php artisan optimize:clear
```

`translations:sync` adds missing catalog values and preserves database edits. The `--force` option overwrites existing values from the committed catalog and should therefore be used deliberately.

`admin:create` prompts securely for a password and confirmation. Administrator passwords must be at least 12 characters.

## Environment settings used by the application

Important variables include:

| Variable | Purpose |
| --- | --- |
| `APP_NAME`, `APP_ENV`, `APP_KEY`, `APP_DEBUG`, `APP_URL` | Core Laravel identity and runtime behavior |
| `APP_LOCALE`, `APP_FALLBACK_LOCALE` | Default and fallback language |
| `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD` | Database connection |
| `SESSION_DRIVER`, `CACHE_STORE`, `QUEUE_CONNECTION` | Stateful Laravel services |
| `MAIL_*` | Verification and password-reset email delivery |
| `STRIPE_KEY`, `STRIPE_SECRET` | Server-side Stripe configuration |
| `VITE_STRIPE_KEY` | Stripe publishable key compiled into the browser bundle |
| `VITE_APP_NAME` | Application name available to Vite/SSR |

Restart workers and rebuild frontend assets after changing settings consumed by long-running processes or Vite.
