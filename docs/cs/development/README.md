# Vývojářská příručka

Treetino je aplikace v Laravelu 13 s frontendem Inertia 2 a Vue 3. Používá TypeScript, Vite, Tailwind CSS, v produkci MySQL, platby Stripe a faktury Dompdf.

## Obsah

- [Architektura](architecture.md)
- [Lokální vývoj](local-development.md)
- [Data a integrace](data-and-integrations.md)
- [Testování a kvalita](testing.md)
- [Ruční nasazení na Ubuntu](deployment.md)

## Základní běhové prostředí

- PHP 8.3 nebo novější
- Composer 2
- Node.js 22 a npm
- MySQL pro nasazená prostředí

Webovým vstupním bodem aplikace je `public/index.php`. Frontendové soubory se sestavují z `resources/js/app.ts` do `public/build`.
