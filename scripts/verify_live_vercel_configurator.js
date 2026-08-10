import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Set locale to English via session/cookie or visit /locale/en
  await page.goto('https://treetino-website-dev.vercel.app/locale/en');
  await page.waitForTimeout(1000);

  // Navigate to Configurator
  await page.goto('https://treetino-website-dev.vercel.app/configurator/strom-v1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  // Screenshot Strom V1 Configurator on Vercel Live
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/live_vercel_configurator_en.png', fullPage: true });

  console.log('Live Vercel Configurator screenshot taken successfully!');
  await browser.close();
})();
