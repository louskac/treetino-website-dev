import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const PITCH_URL = process.env.PITCH_URL || 'http://127.0.0.1:8000/pitch';
const TARGET_FILES = [
    path.join(rootDir, 'public/treetino-pitchdeck.pdf'),
    path.join(rootDir, 'public/pitch_disrupt.pdf'),
];

async function generate() {
    console.log(`Connecting to ${PITCH_URL}...`);
    const browser = await chromium.launch();
    const page = await browser.newPage({
        viewport: { width: 1920, height: 1080 },
    });

    await page.goto(PITCH_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2000);

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

    await browser.close();

    const pdfBuffer = fs.readFileSync(tmpPdf);
    for (const target of TARGET_FILES) {
        fs.writeFileSync(target, pdfBuffer);
        console.log(`Updated ${path.relative(rootDir, target)} (${pdfBuffer.length} bytes)`);
    }

    console.log('Pitch deck PDF export completed successfully.');
}

generate().catch((err) => {
    console.error('PDF export failed:', err);
    process.exit(1);
});
