import { chromium } from 'playwright';
const key = process.argv[2] || 'pagination--pagination';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1100, height: 600 } });
await p.goto(`http://localhost:61000/?story=${key}&mode=preview`, { waitUntil: 'networkidle', timeout: 30000 });
await p.waitForTimeout(800);
const html = await p.evaluate(() => {
  const r = document.querySelector('#ladle-root') || document.body;
  return r.innerHTML;
});
await p.screenshot({ path: `/tmp/${key}.png` });
console.log('--- innerHTML ---\n' + html.slice(0, 4000));
await b.close();
