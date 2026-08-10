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

  // Scroll right panel down
  await page.evaluate(() => {
    const panels = document.querySelectorAll('div');
    for (const p of panels) {
      if (p.scrollHeight > 1500) {
        p.scrollTop = 1600;
      }
    }
  });
  await page.waitForTimeout(1000);

  // Screenshot Configurator Connectivity Step on Vercel Live
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/live_configurator_connectivity_step04.png' });

  console.log('Step 04 screenshot taken!');
  await browser.close();
})();
