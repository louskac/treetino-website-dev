const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = '/Users/jakub/.gemini/antigravity/brain/27e4f311-0e5c-48bb-8d87-46e44ae73d2a';

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('BROWSER PAGE ERROR:', err.message));

  console.log('Navigating to https://treetino.eu/app ...');
  const response = await page.goto('https://treetino.eu/app', { waitUntil: 'networkidle', timeout: 30000 });
  console.log('Response status:', response.status());

  await page.waitForTimeout(3000);

  // Take screenshot 1: Main pricing screen loaded
  const screen1Path = path.join(ARTIFACT_DIR, 'screen1_app_loaded.png');
  await page.screenshot({ path: screen1Path, fullPage: true });
  console.log('Saved screenshot 1 to:', screen1Path);

  // Check if root has content
  const rootHtml = await page.$eval('#root', el => el.innerHTML);
  console.log('Root innerHTML length:', rootHtml.length);
  if (rootHtml.length === 0) {
    console.error('ERROR: Page is still blank!');
    await browser.close();
    process.exit(1);
  }

  console.log('Page loaded successfully! Root has content.');
  await browser.close();
}

run().catch(err => {
  console.error('Test script failed:', err);
  process.exit(1);
});
