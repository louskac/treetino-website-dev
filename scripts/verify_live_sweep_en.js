import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Navigate to site and set app_locale to 'en' in localStorage
  await page.goto('https://treetino-website-dev.vercel.app');
  await page.evaluate(() => {
    localStorage.setItem('app_locale', 'en');
  });
  await page.reload();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Navigate to Collaboration Page in English
  await page.goto('https://treetino-website-dev.vercel.app/collaboration');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  // Screenshot Collaboration Page on Vercel Live
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/live_collaboration_en_verified.png' });

  // Scroll to Footer on Collaboration Page
  await page.evaluate(() => {
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(1000);

  // Screenshot Footer on Vercel Live in English
  await page.screenshot({ path: '/Users/jakub/.gemini/antigravity/brain/a6fed319-5e97-416f-875a-9903af9a80d1/live_footer_en_verified.png' });

  console.log('Live Vercel EN localized screenshots taken successfully!');
  await browser.close();
})();
