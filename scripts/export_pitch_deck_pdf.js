import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:8000';

const DECKS = [
    {
        url: `${BASE_URL}/pitch`,
        targets: [
            path.join(rootDir, 'public/treetino-pitchdeck.pdf'),
            path.join(rootDir, 'public/pitch_disrupt.pdf'),
        ],
    },
    {
        url: `${BASE_URL}/pitch-hackathon`,
        targets: [path.join(rootDir, 'public/treetino-hackathon-pitchdeck.pdf')],
    },
    {
        url: `${BASE_URL}/pitch-fintech`,
        targets: [path.join(rootDir, 'public/treetino-fintech-pitchdeck.pdf')],
    },
];

async function generate() {
    const browser = await chromium.launch();

    for (const deck of DECKS) {
        console.log(`Connecting to ${deck.url}...`);
        const page = await browser.newPage({
            viewport: { width: 1920, height: 1080 },
        });

        await page.goto(deck.url, { waitUntil: 'load' });
        await page.evaluate(async () => {
            await document.fonts.ready;
            await Promise.all(
                Array.from(document.images)
                    .filter((img) => !img.complete)
                    .map((img) => new Promise((res) => { img.onload = img.onerror = res; })),
            );
        });
        await page.waitForTimeout(2500);

        const tmpPdf = path.join(rootDir, 'scratch/pitch_export.pdf');
        fs.mkdirSync(path.dirname(tmpPdf), { recursive: true });

        await page.pdf({
            path: tmpPdf,
            width: '1920px',
            height: '1080px',
            printBackground: true,
            preferCSSPageSize: true,
            margin: { top: 0, right: 0, bottom: 0, left: 0 },
        });

        await page.close();

        const pdfBuffer = fs.readFileSync(tmpPdf);
        for (const target of deck.targets) {
            fs.writeFileSync(target, pdfBuffer);
            console.log(`Updated ${path.relative(rootDir, target)} (${pdfBuffer.length} bytes)`);
        }
    }

    await browser.close();
    console.log('Pitch deck PDF export completed successfully.');
}

generate().catch((err) => {
    console.error('PDF export failed:', err);
    process.exit(1);
});
