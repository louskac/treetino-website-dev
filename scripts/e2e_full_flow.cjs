const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const ARTIFACT_DIR = '/Users/jakub/.gemini/antigravity/brain/27e4f311-0e5c-48bb-8d87-46e44ae73d2a';

async function run() {
  console.log('=== STARTING COMPLETE PRODUCTION E2E CLICK-THROUGH TEST ===');
  const browser = await chromium.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    acceptDownloads: true
  });
  
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('fail') || msg.text().includes('error')) {
      console.log('PAGE CONSOLE:', msg.type(), msg.text());
    }
  });

  // 1. Visit /app
  console.log('\n[STEP 1] Loading https://treetino.eu/app ...');
  await page.goto('https://treetino.eu/app', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  const step1 = path.join(ARTIFACT_DIR, 'step1_portal_login.png');
  await page.screenshot({ path: step1, fullPage: true });
  console.log('✓ Step 1 Screenshot:', step1);

  // 2. Open Registration
  console.log('\n[STEP 2] Navigating to Registration Form...');
  const registerBtn = page.locator('button:has-text("Register here"), button:has-text("Zaregistrujte se")').first();
  await registerBtn.click();
  await page.waitForTimeout(1000);

  const testId = Date.now().toString().slice(-6);
  const testEmail = `partner_${testId}@treetino-test.cz`;
  const testName = `Ing. Robert Král`;
  const testPass = 'PartnerSecure2026!';

  console.log(`Filling registration inputs for ${testEmail}...`);
  // Full Name
  const nameInput = page.locator('input[placeholder*="Smith"], input[placeholder*="Lustyk"], input[placeholder*="Jméno"]').first();
  if (await nameInput.isVisible()) {
    await nameInput.fill(testName);
  }

  // Email
  await page.locator('input[type="email"]').first().fill(testEmail);

  // Password & Confirm
  const pwInputs = page.locator('input[type="password"]');
  await pwInputs.nth(0).fill(testPass);
  await pwInputs.nth(1).fill(testPass);

  const step2 = path.join(ARTIFACT_DIR, 'step2_registration_filled.png');
  await page.screenshot({ path: step2, fullPage: true });
  console.log('✓ Step 2 Screenshot:', step2);

  // Submit registration
  console.log('Submitting Registration Form...');
  await page.locator('button[type="submit"]').first().click();

  // 3. NDA Modal
  console.log('\n[STEP 3] Waiting for Step 1: NDA Modal...');
  await page.locator('canvas').first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(1500);

  console.log('Filling NDA details...');
  const icoInput = page.locator('input[placeholder*="12345678"]').first();
  if (await icoInput.isVisible()) await icoInput.fill('27232433');

  const locInput = page.locator('input[placeholder*="Prague"], input[placeholder*="Praha"]').first();
  if (await locInput.isVisible()) await locInput.fill('Prague');

  const addrInput = page.locator('input[placeholder*="Main Street"], input[placeholder*="Václavské"], input[placeholder*="Address"]').first();
  if (await addrInput.isVisible()) await addrInput.fill('Duhová 2/1444, 140 53 Praha 4');

  // Draw signature on canvas
  console.log('Drawing electronic signature on NDA canvas...');
  const ndaCanvas = page.locator('canvas').first();
  const ndaBox = await ndaCanvas.boundingBox();
  if (ndaBox) {
    await page.mouse.move(ndaBox.x + 30, ndaBox.y + 30);
    await page.mouse.down();
    await page.mouse.move(ndaBox.x + 90, ndaBox.y + 60, { steps: 5 });
    await page.mouse.move(ndaBox.x + 150, ndaBox.y + 30, { steps: 5 });
    await page.mouse.move(ndaBox.x + 220, ndaBox.y + 70, { steps: 5 });
    await page.mouse.up();
  }

  // Agreement Checkbox
  const ndaCheck = page.locator('input[type="checkbox"]').first();
  await ndaCheck.check();

  const step3 = path.join(ARTIFACT_DIR, 'step3_nda_signed.png');
  await page.screenshot({ path: step3, fullPage: true });
  console.log('✓ Step 3 Screenshot:', step3);

  // Submit NDA
  console.log('Signing NDA...');
  await page.locator('button:has-text("Sign"), button:has-text("Podepsat"), button[type="submit"]').first().click();

  // 4. Mediation Agreement Modal
  console.log('\n[STEP 4] Waiting for Step 2: Commercial Mediation Modal...');
  await page.waitForTimeout(3000);
  await page.locator('canvas').first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(1000);

  console.log('Drawing signature on Mediation Agreement canvas...');
  const medCanvas = page.locator('canvas').first();
  const medBox = await medCanvas.boundingBox();
  if (medBox) {
    await page.mouse.move(medBox.x + 30, medBox.y + 30);
    await page.mouse.down();
    await page.mouse.move(medBox.x + 110, medBox.y + 50, { steps: 5 });
    await page.mouse.move(medBox.x + 190, medBox.y + 35, { steps: 5 });
    await page.mouse.up();
  }

  const medCheck = page.locator('input[type="checkbox"]').first();
  await medCheck.check();

  const step4 = path.join(ARTIFACT_DIR, 'step4_mediation_signed.png');
  await page.screenshot({ path: step4, fullPage: true });
  console.log('✓ Step 4 Screenshot:', step4);

  // Submit Mediation
  console.log('Signing Mediation Agreement...');
  await page.locator('button:has-text("Sign"), button:has-text("Podepsat"), button[type="submit"]').first().click();

  // 5. Video Onboarding Modal
  console.log('\n[STEP 5] Waiting for Step 3: Video Training Onboarding...');
  await page.waitForTimeout(3000);
  await page.locator('video').first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(1000);

  console.log('Completing video training modules...');
  // Complete Video 1
  await page.evaluate(() => {
    const v = document.querySelector('video');
    if (v) {
      v.currentTime = 999999;
      v.dispatchEvent(new Event('timeupdate'));
      v.dispatchEvent(new Event('ended'));
    }
  });
  await page.waitForTimeout(1500);

  // Switch to Module 2
  const mod2 = page.getByText(/Module 2|Modul 2/i).first();
  if (await mod2.isVisible()) {
    await mod2.click();
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
      const v = document.querySelector('video');
      if (v) {
        v.currentTime = 999999;
        v.dispatchEvent(new Event('timeupdate'));
        v.dispatchEvent(new Event('ended'));
      }
    });
    await page.waitForTimeout(1500);
  }

  const step5 = path.join(ARTIFACT_DIR, 'step5_video_onboarding_done.png');
  await page.screenshot({ path: step5, fullPage: true });
  console.log('✓ Step 5 Screenshot:', step5);

  // Click complete onboarding button
  console.log('Entering Partner Portal...');
  const finishTrainingBtn = page.getByRole('button', { name: /Complete|Enter|Dokončit|Vstoupit/i }).first();
  await finishTrainingBtn.click();

  // 6. Main Dashboard & 3D Configurator
  console.log('\n[STEP 6] Waiting for Main Dashboard & 3D Configurator...');
  await page.locator('aside').first().waitFor({ timeout: 25000 });
  await page.waitForTimeout(3000);

  const step6 = path.join(ARTIFACT_DIR, 'step6_portal_dashboard.png');
  await page.screenshot({ path: step6, fullPage: true });
  console.log('✓ Step 6 Screenshot:', step6);

  // 7. Place Unit Pin & Configure ROI Parameters
  console.log('\n[STEP 7] Configuring Energy Parameters & Placing Unit Pin...');
  
  // Set location and pin on the 3D map
  await page.evaluate(() => {
    const map3d = document.querySelector('gmp-map-3d');
    if (map3d) {
      map3d.dispatchEvent(new CustomEvent('gmp-click', {
        bubbles: true,
        composed: true,
        detail: {
          position: { lat: 50.0811, lng: 14.4512 }
        }
      }));
    }
  });
  await page.mouse.click(550, 480);
  await page.waitForTimeout(3000);

  // Adjust sliders
  const sliders = page.locator('input[type="range"]');
  const sliderCount = await sliders.count();
  if (sliderCount > 0) {
    console.log(`Found ${sliderCount} parameter sliders, adjusting...`);
    await sliders.nth(0).fill('6.5');
    await sliders.nth(0).dispatchEvent('change');
  }

  const step7 = path.join(ARTIFACT_DIR, 'step7_configured_parameters.png');
  await page.screenshot({ path: step7, fullPage: true });
  console.log('✓ Step 7 Screenshot:', step7);

  // 8. Calculate ROI Payback
  console.log('\n[STEP 8] Calculating Payback & Financial Return...');
  const calcBtn = page.locator('button:has-text("Calculate ROI"), button:has-text("Spočítat návratnost")').first();
  await calcBtn.click();
  
  // Wait for calculation results
  console.log('Waiting for ROI Analytics Bento Grid...');
  await page.locator('text=Payback Period, text=Ekonomická návratnost, text=Návratnost investice, text=Annual Production, text=Roční výroba').first().waitFor({ timeout: 20000 });
  await page.waitForTimeout(2000);

  const step8 = path.join(ARTIFACT_DIR, 'step8_payback_calculation.png');
  await page.screenshot({ path: step8, fullPage: true });
  console.log('✓ Step 8 Screenshot:', step8);

  // 9. Open PDF Offer Modal
  console.log('\n[STEP 9] Opening Offer Proposal Generator...');
  const exportBtn = page.locator('button:has-text("Create Offer"), button:has-text("Export Proposal"), button:has-text("Export PDF"), button:has-text("Exportovat"), button:has-text("Vytvořit nabídku")').first();
  await exportBtn.click();

  await page.locator('input[placeholder*="ACME"], input[placeholder*="Klient"]').first().waitFor({ timeout: 15000 });
  await page.waitForTimeout(1000);

  // Fill Client Details
  const clientInput = page.locator('input[placeholder*="ACME"], input[placeholder*="Klient"]').first();
  await clientInput.fill('ČEZ Prodej a.s.');

  const clientIco = page.locator('input[placeholder*="12345678"]').first();
  if (await clientIco.isVisible()) {
    await clientIco.fill('27232433');
    await page.waitForTimeout(1500); // Allow ARES lookup if triggered
  }

  const step9 = path.join(ARTIFACT_DIR, 'step9_offer_proposal_modal.png');
  await page.screenshot({ path: step9, fullPage: true });
  console.log('✓ Step 9 Screenshot:', step9);

  // 10. Generate and Download Final PDF
  console.log('\n[STEP 10] Generating Official PDF Proposal...');
  const downloadPromise = page.waitForEvent('download', { timeout: 60000 });

  const downloadPdfBtn = page.locator('button:has-text("Download PDF"), button:has-text("Stáhnout PDF")').first();
  await downloadPdfBtn.click();

  console.log('Waiting for PDF compilation from server...');
  const download = await downloadPromise;
  const suggestedName = await download.suggestedFilename();
  const pdfTargetPath = path.join(ARTIFACT_DIR, suggestedName);
  await download.saveAs(pdfTargetPath);

  console.log(`\n======================================================`);
  console.log(`✓ PDF SUCCESSFULLY COMPILED AND DOWNLOADED!`);
  console.log(`  File: ${pdfTargetPath}`);
  const stats = fs.statSync(pdfTargetPath);
  console.log(`  Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`======================================================\n`);

  await page.waitForTimeout(2000);
  const step10 = path.join(ARTIFACT_DIR, 'step10_full_journey_complete.png');
  await page.screenshot({ path: step10, fullPage: true });
  console.log('✓ Step 10 Screenshot:', step10);

  await browser.close();
}

run().catch(err => {
  console.error('FATAL E2E ERROR:', err);
  process.exit(1);
});
