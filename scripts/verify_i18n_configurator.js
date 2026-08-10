import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Set locale to English via session/cookie or visit /locale/en
  await page.goto('http://127.0.0.1:8000/locale/en');
  await page.waitForTimeout(500);

  // Navigate to Configurator
  await page.goto('http://127.0.0.1:8000/configurator/strom-v1');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Screenshot Strom V1 Configurator
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/configurator_v1_en.png', fullPage: true });

  // Navigate to Strom V2 Configurator
  await page.goto('http://127.0.0.1:8000/configurator/strom-v2');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Screenshot Strom V2 Configurator
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/configurator_v2_en.png', fullPage: true });

  // Navigate to Turbine Configurator
  await page.goto('http://127.0.0.1:8000/configurator/turbina');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Screenshot Turbine Configurator
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/configurator_turbine_en.png', fullPage: true });

  console.log('Configurator screenshots taken successfully!');
  await browser.close();
})();
