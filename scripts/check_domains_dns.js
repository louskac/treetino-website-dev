import { execSync } from 'child_process';

const domains = ['treetino.eu', 'www.treetino.eu', 'treetino.com', 'www.treetino.com', 'treetino.cz', 'www.treetino.cz'];

console.log('=== Checking Domain Status on Vercel ===');

let allVerified = true;

for (const domain of ['treetino.eu', 'treetino.com', 'treetino.cz']) {
  try {
    const output = execSync(`npx vercel domains inspect ${domain}`, { encoding: 'utf8' });
    if (output.includes('WARNING! This Domain is not configured properly')) {
      console.log(`❌ ${domain}: Not yet pointing to Vercel (76.76.21.21)`);
      allVerified = false;
    } else {
      console.log(`✅ ${domain}: Fully verified on Vercel Edge!`);
    }
  } catch (err) {
    console.error(`Error inspecting ${domain}:`, err.message);
    allVerified = false;
  }
}

if (allVerified) {
  console.log('\n🎉 ALL DOMAINS ARE FULLY CONNECTED AND VERIFIED ON VERCEL!');
} else {
  console.log('\n⏳ Waiting for DNS updates in Active24...');
}
