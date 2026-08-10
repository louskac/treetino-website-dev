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

  // Navigate to Configurator
  await page.goto('https://treetino-website-dev.vercel.app/configurator/strom-v1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1500);

  // Scroll right panel to connectivity step
  await page.evaluate(() => {
    const headings = Array.from(document.querySelectorAll('p'));
    const conn = headings.find(h => h.textContent && h.textContent.includes('PREMIUM CONNECTIVITY'));
    if (conn) conn.scrollIntoView();
  });
  await page.waitForTimeout(1000);

  // Screenshot Configurator Connectivity Step on Vercel Live
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/live_configurator_connectivity_fixed.png' });

  console.log('Live Vercel Configurator connectivity screenshot taken successfully!');
  await browser.close();
})();
