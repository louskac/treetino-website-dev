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

  // Scroll to #comparison
  await page.evaluate(() => {
    const el = document.getElementById('comparison');
    if (el) el.scrollIntoView();
  });
  await page.waitForTimeout(1000);

  // Screenshot Strom V2 Comparison Section
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/live_v2_comparison_aligned.png' });

  // Scroll to bottom CTA
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight - 1000);
  });
  await page.waitForTimeout(1000);

  // Screenshot Strom V2 CTA Section
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/live_v2_cta_custom_pic.png' });

  // Navigate to Turbine Product Page
  await page.goto('https://treetino-website-dev.vercel.app/products/turbine');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  // Scroll to bottom CTA
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight - 1000);
  });
  await page.waitForTimeout(1000);

  // Screenshot Turbine CTA Section
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/live_turbine_cta_custom_pic.png' });

  console.log('Live Vercel V2 comparison & CTA section screenshots taken successfully!');
  await browser.close();
})();
