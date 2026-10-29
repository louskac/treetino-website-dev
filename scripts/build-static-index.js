import fs from 'fs';
import path from 'path';

const manifestPath = path.resolve('public/build/manifest.json');

if (fs.existsSync(manifestPath)) {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
    const appEntry = manifest['resources/js/app.ts'];

    if (appEntry) {
        const jsFile = `/build/${appEntry.file}`;
        const cssFiles = (appEntry.css || []).map(c => `<link rel="stylesheet" href="/build/${c}">`).join('\n    ');

        const html = `<!DOCTYPE html>
<html lang="cs">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Treetino — Chytrý energetický strom | Smart Solar &amp; Wind Energy Tree</title>
    <meta name="description" content="Treetino je patentovaný chytrý energetický strom kombinující solární listy, vertikální větrné mikroturbíny, bateriové úložiště a dobíjení elektromobilů na půdorysu pouhého 1 m².">
    <meta name="application-name" content="Treetino">
    <meta name="apple-mobile-web-app-title" content="Treetino">
    <meta name="theme-color" content="#09090b">
    <link rel="canonical" href="https://www.treetino.eu/">

    <!-- Favicons & Apple Touch Icon -->
    <link rel="icon" href="/favicon.ico" sizes="48x48">
    <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png">
    <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

    <!-- Open Graph / iMessage / WhatsApp / LinkedIn -->
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="Treetino">
    <meta property="og:url" content="https://www.treetino.eu/">
    <meta property="og:title" content="Treetino — Chytrý energetický strom | Smart Solar &amp; Wind Energy Tree">
    <meta property="og:description" content="Patentovaný hybridní energetický strom kombinující solární a větrnou energii, bateriové úložiště a EV dobíjení na půdorysu 1 m².">
    <meta property="og:image" content="https://www.treetino.eu/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="Treetino — Chytrý energetický strom">

    <!-- X / Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="@treetino_corp">
    <meta name="twitter:title" content="Treetino — Chytrý energetický strom | Smart Solar &amp; Wind Energy Tree">
    <meta name="twitter:description" content="Patentovaný hybridní energetický strom kombinující solární a větrnou energii, bateriové úložiště a EV dobíjení na půdorysu 1 m².">
    <meta name="twitter:image" content="https://www.treetino.eu/og-image.jpg">

    <!-- Google Search Structured Data -->
    <script type="application/ld+json">
    {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "name": "Treetino",
                "legalName": "Treetino corp s.r.o.",
                "url": "https://www.treetino.eu",
                "logo": "https://www.treetino.eu/apple-touch-icon.png",
                "sameAs": [
                    "https://x.com/treetino_corp",
                    "https://www.linkedin.com/company/treetino/"
                ]
            },
            {
                "@type": "WebSite",
                "name": "Treetino",
                "url": "https://www.treetino.eu/"
            }
        ]
    }
    </script>

    ${cssFiles}
    <style>
        html, body { background-color: #09090b; margin: 0; padding: 0; }
    </style>
</head>
<body class="font-sans antialiased bg-background text-foreground">
    <div id="app"></div>
    <script type="module" src="${jsFile}"></script>
</body>
</html>`;

        fs.writeFileSync(path.resolve('public/index.html'), html);
        console.log('Successfully generated public/index.html with dark theme background and SEO metadata!');
    }
}

