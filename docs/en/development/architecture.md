# Architecture

## Request flow

Apache sends application requests to Laravel through `public/index.php`. Laravel routes requests to controllers or Inertia pages. Inertia serializes page props, and Vue resolves the matching component from `resources/js/pages`. Vite builds the TypeScript, Vue, CSS, and referenced frontend assets.

```text
Browser -> Apache -> Laravel route -> controller -> Inertia response -> Vue page
                              |                         |
                              +-> model/service -> MySQL
```

Blade is used for the Inertia root document and the PDF invoice template. The primary UI is not a Blade-rendered multi-page application.

## Repository map

| Path | Purpose |
| --- | --- |
| `app/Http/Controllers` | Public, customer-setting, administrator, checkout, and integration request handlers |
| `app/Http/Middleware` | Locale, appearance, Inertia props, and administrator-session middleware |
| `app/Models` | User, administrator, preorder, message, and translation records |
| `app/Services/TranslationService.php` | Translation synchronization, lookup, status, and caching |
| `config` | Laravel, localization, service, and translation-catalog configuration |
| `database/migrations` | Database schema history |
| `resources/js/pages` | Route-level Vue pages |
| `resources/js/custom` | Site-specific Vue sections and configurator controls |
| `resources/js/components` | Shared application and UI components |
| `resources/js/types` | Shared TypeScript models and product definitions |
| `routes` | Public, customer-settings, administrator, and console routes |
| `tests` | PHPUnit feature and unit tests |

Generated Wayfinder files under `resources/js/actions` and `resources/js/routes` provide typed frontend access to Laravel controllers and routes. Regenerate them through the normal Vite/Wayfinder workflow; do not treat them as the source definition of a route.

## Route areas

- `routes/web.php` defines public pages, checkout, preorders, contact, and the customer dashboard.
- `routes/settings.php` defines authenticated profile, security, password, and appearance routes.
- `routes/admin.php` defines the independent administrator login, dashboard, translations, and logout routes.
- Laravel Fortify supplies customer registration, login, password reset, email verification, password confirmation, and two-factor routes.
- Laravel exposes `/up` as the health endpoint.

Inspect the effective route table with:

```bash
php artisan route:list --except-vendor
php artisan route:list
```

## Authentication boundaries

Two session guards are configured:

- `web` uses `App\Models\User` for customers;
- `admin` uses `App\Models\Admin` for administrators.

The `admin.auth` and `admin.guest` middleware protect the administrator area. Customer authentication does not grant administrator access, and an administrator session does not authenticate the customer guard.

Fortify provides customer registration, password reset, email verification, and confirmed two-factor authentication. Verified middleware protects account deletion and security-related settings.

## Shared frontend state

`HandleInertiaRequests` shares these values with every Inertia page:

- application name;
- current customer and administrator identities;
- current locale, fallback locale, available locales, and translation messages;
- success flash messages;
- sidebar state.

The Vue bootstrap installs Inertia, Vue I18n, Ziggy, and the cookie-consent plugin. On navigation it replaces the current locale messages and updates the document language.

## Frontend conventions

Route-level components live in `resources/js/pages`. Site-specific reusable sections live under `resources/js/custom`, while generic controls live under `resources/js/components` and `resources/js/components/ui`.

Product and step metadata is centralized in `resources/js/types/products.ts`. Configurator state is maintained by `resources/js/pages/Configurator/Index.vue` and passed into step components. Keep product identifiers aligned with backend validation and database values:

- `strom-v1`
- `strom-v2`
- `turbina`

Use the existing aliases such as `@/` for imports and preserve TypeScript types for page props and configuration fields.
