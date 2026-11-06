/**
 * Renders the /clients station app documents to PDF and captures review screenshots.
 *
 *   npm run build:website && node scripts/export_clients_reports_pdf.js
 *
 * Output file names must match `documentUrls()` in resources/js/custom/clients/stationApp.ts.
 */
import { chromium } from 'playwright';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, '../public');
const docsDir = path.resolve(publicDir, 'docs');
const desktopDir = '/Users/jakub/Desktop';
const shotsDir = process.env.SHOTS_DIR || '/Users/jakub/.gemini/antigravity/brain/d2729ae6-19e1-42d7-809a-5c09b56869ab/scratch/review';
const PORT = 4193;

const DOCUMENTS = [
    { query: 'print=offer&station=IPRAGU1761&lang=cs', file: 'Treetino_IPRAGU1761_Cenova_nabidka_Strom_V2.pdf', shot: 'offer' },
    { query: 'print=study&station=IPRAGU1761&qty=1&lang=cs', file: 'Treetino_IPRAGU1761_Technicka_studie_1x_Strom_V2.pdf', shot: 'study1x' },
    { query: 'print=study&station=IPRAGU1761&qty=2&lang=cs', file: 'Treetino_IPRAGU1761_Technicka_studie_2x_Strom_V2.pdf', shot: 'study2x' },
    {
        query: 'print=offer&station=ISTOCH13&lang=cs',
        file: 'Treetino_ISTOCH13_Cenova_nabidka_2x_V2_V1.pdf',
        legacyAlias: 'Treetino_ISTOCH13_Cenova_nabidka_Strom_V2.pdf',
        shot: 'stochov_offer',
    },
    { query: 'print=study&station=ISTOCH13&qty=1&lang=cs', file: 'Treetino_ISTOCH13_Technicka_studie_2x_Strom_V2.pdf', shot: 'stochov_study_2x_v2' },
    { query: 'print=study&station=ISTOCH13&qty=2&lang=cs', file: 'Treetino_ISTOCH13_Technicka_studie_2x_Strom_V1.pdf', shot: 'stochov_study_2x_v1' },
    { query: 'print=offer&station=D3882832837&lang=cs', file: 'Treetino_D3882832837_Cenova_nabidka_3x_Strom_V1.pdf', shot: 'mkovo_offer' },
    { query: 'print=study&station=D3882832837&qty=1&lang=cs', file: 'Treetino_D3882832837_Technicka_studie_3x_Strom_V1.pdf', shot: 'mkovo_study_3x_v1' },
    { query: 'print=study&station=D3882832837&qty=2&lang=cs', file: 'Treetino_D3882832837_Technicka_studie_1x_Strom_V1.pdf', shot: 'mkovo_study_1x_v1' },
];

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.pdf': 'application/pdf',
};

function startStaticServer(port) {
    const indexHtml = fs.readFileSync(path.join(publicDir, 'index.html'));
    const server = http.createServer((req, res) => {
        const cleanUrl = decodeURIComponent((req.url || '/').split('?')[0]);
        const filePath = path.join(publicDir, cleanUrl);
        if (cleanUrl !== '/' && fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
            res.writeHead(200, { 'Content-Type': MIME[path.extname(filePath)] || 'application/octet-stream' });
            res.end(fs.readFileSync(filePath));
            return;
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(indexHtml);
    });
    return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

async function settle(page) {
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(600);
}

async function dismissCookies(page) {
    const btn = page.locator('button:has-text("Přijmout vše"), button:has-text("Accept all")');
    if ((await btn.count()) > 0) {
        await btn.first().click().catch(() => {});
        await page.waitForTimeout(400);
    }
}

(async () => {
    fs.mkdirSync(docsDir, { recursive: true });
    fs.mkdirSync(shotsDir, { recursive: true });

    const server = await startStaticServer(PORT);
    const browser = await chromium.launch({ headless: true });
    const errors = [];

    try {
        /* 1. PDFs + per-page screenshots */
        const docPage = await browser.newPage({ viewport: { width: 1000, height: 1300 }, deviceScaleFactor: 2 });
        docPage.on('pageerror', (e) => errors.push(e.message));

        for (const doc of DOCUMENTS) {
            await docPage.goto(`http://localhost:${PORT}/clients?${doc.query}`, { waitUntil: 'networkidle' });
            await settle(docPage);

            const out = path.join(docsDir, doc.file);
            await docPage.pdf({ path: out, preferCSSPageSize: true, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } });
            fs.copyFileSync(out, path.join(desktopDir, doc.file));
            if (doc.legacyAlias) {
                fs.copyFileSync(out, path.join(docsDir, doc.legacyAlias));
                fs.copyFileSync(out, path.join(desktopDir, doc.legacyAlias));
            }
            console.log('PDF', doc.file, (fs.statSync(out).size / 1024).toFixed(0), 'KB');

            const sheets = docPage.locator('.pdf-sheet');
            const n = await sheets.count();
            for (let i = 0; i < n; i++) {
                await sheets.nth(i).screenshot({ path: path.join(shotsDir, `${doc.shot}_p${i + 1}.png`) });
            }
        }
        await docPage.close();

        /* 2. App screenshots (CS & EN) */
        for (const vp of [
            { name: 'desktop', width: 1440, height: 900 },
            { name: 'mobile', width: 390, height: 844 },
        ]) {
            const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: vp.name === 'mobile' ? 2 : 1 });
            page.on('pageerror', (e) => errors.push(e.message));
            await page.goto(`http://localhost:${PORT}/clients?lang=cs`, { waitUntil: 'networkidle' });
            await settle(page);
            await dismissCookies(page);
            await page.waitForTimeout(1000);
            await page.screenshot({ path: path.join(shotsDir, `app_${vp.name}_map_cs.png`) });

            await page.locator('button:has-text("Stochov")').first().click();
            await page.waitForTimeout(1200);
            await page.screenshot({ path: path.join(shotsDir, `app_${vp.name}_stochov_v2_cs.png`) });

            await page.locator('button[role="radio"]:has-text("2× Strom V1")').click();
            await page.waitForTimeout(600);
            await page.screenshot({ path: path.join(shotsDir, `app_${vp.name}_stochov_v1_cs.png`) });

            if (vp.name === 'desktop') {
                await page.goto(`http://localhost:${PORT}/clients?station=D3882832837&lang=cs`, { waitUntil: 'networkidle' });
                await settle(page);
                await dismissCookies(page);
                await page.waitForTimeout(1000);
                await page.screenshot({ path: path.join(shotsDir, `app_desktop_mkovo_cs.png`) });
                await page.evaluate(() => {
                    const scroller = document.querySelector('aside .overflow-y-auto');
                    if (scroller) scroller.scrollTop = scroller.scrollHeight;
                });
                await page.waitForTimeout(400);
                await page.screenshot({ path: path.join(shotsDir, `app_desktop_mkovo_campaign_cs.png`) });

                await page.goto(`http://localhost:${PORT}/clients?station=ISTOCH13&lang=en`, { waitUntil: 'networkidle' });
                await settle(page);
                await dismissCookies(page);
                await page.waitForTimeout(1000);
                await page.screenshot({ path: path.join(shotsDir, `app_desktop_stochov_en.png`) });
            }
            await page.close();
        }
    } finally {
        await browser.close();
        server.close();
    }

    if (errors.length) {
        console.error('Page errors:\n' + errors.join('\n'));
        process.exitCode = 1;
    }
    console.log('Screenshots in', shotsDir);
})();
