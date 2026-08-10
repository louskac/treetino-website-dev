import { chromium } from 'playwright';
import path from 'path';

const ARTIFACT_DIR = '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    console.log('Navigating to homepage...');
    await page.goto('https://treetino-website-dev.vercel.app', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_home_before_click.png'), fullPage: false });

    console.log('Clicking product page link...');
    const productLink = page.locator('a[href*="/products/"]').first();
    await productLink.scrollIntoViewIfNeeded();
    const href = await productLink.getAttribute('href');
    console.log('Target URL:', href);

    await productLink.click();
    await page.waitForTimeout(3000);

    console.log('Current URL after click:', page.url());
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_product_v1_opened.png'), fullPage: false });

    console.log('Navigating directly to /products/treetino-v2...');
    await page.goto('https://treetino-website-dev.vercel.app/products/treetino-v2', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'live_product_v2_opened.png'), fullPage: false });

    await browser.close();
    console.log('Navigation test completed!');
})();
