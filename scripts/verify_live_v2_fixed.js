import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Set locale to English
  await page.goto('https://treetino-website-dev.vercel.app/locale/en');
  await page.waitForTimeout(1000);

  // Navigate to Strom V2 Product Page
  await page.goto('https://treetino-website-dev.vercel.app/products/treetino-v2');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  // Scroll to #numbers
  await page.evaluate(() => {
    const el = document.getElementById('numbers');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1000);

  // Screenshot Strom V2 Product Page numbers section on Vercel Live
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/live_v2_numbers_fixed.png' });

  console.log('Live Vercel V2 numbers section screenshot taken successfully!');
  await browser.close();
})();
