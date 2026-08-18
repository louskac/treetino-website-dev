import dns from 'dns';
import { promisify } from 'util';

const resolve4 = promisify(dns.resolve4);
const resolveCname = promisify(dns.resolveCname);

const domains = [
  { apex: 'treetino.eu', www: 'www.treetino.eu' },
  { apex: 'treetino.com', www: 'www.treetino.com' },
  { apex: 'treetino.cz', www: 'www.treetino.cz' },
];

const VERCEL_IP = '76.76.21.21';
const isVercel = (ip) => ip === VERCEL_IP || ip.startsWith('76.76.21.') || ip.startsWith('66.33.60.');

async function check() {
  console.log('=== Checking Live DNS Records for Active24 Domains ===\n');

  for (const d of domains) {
    let apexOk = false;
    let wwwOk = false;

    // Check Apex A Record
    try {
      const ips = await resolve4(d.apex);
      console.log(`[${d.apex}] A record IPs: ${ips.join(', ')}`);
      if (ips.includes(VERCEL_IP)) {
        apexOk = true;
      }
    } catch (e) {
      console.log(`[${d.apex}] A record lookup error: ${e.message}`);
    }

    // Check WWW CNAME / A Record
    try {
      const ips = await resolve4(d.www);
      console.log(`[${d.www}] Resolved IPs: ${ips.join(', ')}`);
      if (ips.some(isVercel)) {
        wwwOk = true;
      }
    } catch (e) {
      console.log(`[${d.www}] Lookup error: ${e.message}`);
    }

    console.log(`Status for ${d.apex}: Apex -> ${apexOk ? '✅ CONNECTED TO VERCEL' : '❌ POINTS TO OLD IP'}, WWW -> ${wwwOk ? '✅ CONNECTED TO VERCEL' : '❌ POINTS TO OLD IP'}\n`);
  }
}

check();
