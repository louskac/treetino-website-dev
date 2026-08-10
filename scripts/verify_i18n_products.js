import { chromium } from 'playwright';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // Navigate to V1 and switch locale to English
    await page.goto('http://127.0.0.1:8000/products/treetino-v1');
    await page.evaluate(() => {
        localStorage.setItem('app_locale', 'en');
    });
    await page.reload();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/v1_en_full.png', fullPage: true });

    // Navigate to V2 in English
    await page.goto('http://127.0.0.1:8000/products/treetino-v2');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/v2_en_full.png', fullPage: true });

    // Navigate to Turbine in English
    await page.goto('http://127.0.0.1:8000/products/turbine');
    await page.waitForTimeout(1000);
    await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/turbine_en_full.png', fullPage: true });

    await browser.close();
    console.log('Screenshots generated successfully!');
})();
