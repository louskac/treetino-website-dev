# Development guide

Treetino is a Laravel 13 application with an Inertia 2 and Vue 3 frontend. It uses TypeScript, Vite, Tailwind CSS, MySQL in production, Stripe payments, and Dompdf invoices.

## Contents

- [Architecture](architecture.md)
- [Local development](local-development.md)
- [Data and integrations](data-and-integrations.md)
- [Testing and quality](testing.md)
- [Manual Ubuntu deployment](deployment.md)

## Runtime baseline

- PHP 8.3 or newer
- Composer 2
- Node.js 22 and npm
- MySQL for deployed environments

The application’s web entry point is `public/index.php`, and frontend assets are built from `resources/js/app.ts` into `public/build`.
