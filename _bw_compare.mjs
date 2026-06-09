import { chromium } from 'playwright';
const story = process.argv[2] || 'select--select';
const sel = process.argv[3] || '.bui-select__control, [data-baseweb="select"]';
const openClick = process.argv[4]; // selector to click before capture
const urls = {
  original: `http://localhost:61000/?story=${story}&mode=preview`,
  clone:    `http://localhost:4200/bw/ladle?story=${story}&mode=preview`,
};
const props = ['font-size','font-weight','line-height','color','padding','background-color',
  'border','border-radius','box-shadow','width','height','display','align-items'];
const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport:{ width:1280, height:800 }, deviceScaleFactor:2 });
for (const [name, url] of Object.entries(urls)) {
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => { if (m.type()==='error') errs.push(m.text()); });
  p.on('pageerror', e => errs.push('PAGEERR: '+e.message));
  await p.goto(url, { waitUntil:'domcontentloaded', timeout:30000 });
  await p.waitForTimeout(2500);
  if (openClick) { try { await p.locator(openClick).first().click(); await p.waitForTimeout(400); } catch(e){ errs.push('clickfail '+e.message); } }
  await p.screenshot({ path:`/tmp/bw-compare/${name}.png`, fullPage:true });
  const data = await p.mainFrame().evaluate(([sel, props]) => {
    const r = el => { const b=el.getBoundingClientRect(); const cs=getComputedStyle(el);
      const o={ _box:`${Math.round(b.width)}x${Math.round(b.height)}` };
      for (const k of props) o[k]=cs.getPropertyValue(k); return o; };
    return [...document.querySelectorAll(sel)].slice(0,8).map(r);
  }, [sel, props]);
  console.log(`\n### ${name} (${url})`);
  if (errs.length) console.log('  CONSOLE ERRORS:', errs.slice(0,5));
  console.dir(data, { depth:null });
}
await browser.close();
