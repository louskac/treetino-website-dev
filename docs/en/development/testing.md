# Testing and quality

## Full project checks

Run the Composer CI check before merging or deploying:

```bash
composer ci:check
```

It runs PHP formatting checks, frontend linting, Prettier checks, TypeScript checks, and the test suite.

## Individual checks

```bash
composer test
composer lint:check
npm run lint:check
npm run format:check
npm run types:check
npm run build
```

To apply formatting locally:

```bash
composer lint
npm run format
npm run lint
```

The frontend lint command uses `--fix`; inspect the resulting changes.

## PHPUnit suite

The feature tests cover customer authentication, verification, password reset and confirmation, two-factor challenges, profile and security settings, locale changes, dashboard access, administrator authentication and creation, and translation management.

Tests that use `RefreshDatabase` rebuild database state. Never point the test environment at a production or shared database.

Run a focused test with:

```bash
php artisan test --filter=TranslationManagementTest
```

## Continuous integration

GitHub Actions currently checks PHP formatting/frontend quality and runs the test suite across PHP 8.3, 8.4, and 8.5. The test workflow installs Node.js 22 dependencies and builds production assets before PHPUnit.

CI validates the repository but does not deploy it. Production releases follow the manual [deployment guide](deployment.md).

## Change checklist

When changing routes, models, product configuration, translations, checkout, or account behavior:

1. add or update focused tests;
2. run the relevant test class;
3. run `composer ci:check`;
4. build assets;
5. update both English and Czech documentation if user-visible behavior changed.
