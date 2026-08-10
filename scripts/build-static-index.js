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
    <title>Treetino</title>
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">
    ${cssFiles}
    <style>
        html, body { background-color: #09090b; color: #ffffff; margin: 0; padding: 0; }
    </style>
</head>
<body class="font-sans antialiased bg-stone-950 text-white">
    <div id="app"></div>
    <script type="module" src="${jsFile}"></script>
</body>
</html>`;

        fs.writeFileSync(path.resolve('public/index.html'), html);
        console.log('Successfully generated public/index.html with dark theme background!');
    }
}
