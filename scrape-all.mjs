import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:61000';
const DEST = '/home/azjob/workspace/app-pin/static/ladle';
const stories = JSON.parse(fs.readFileSync('/tmp/all-stories.json', 'utf8'));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });

let ok = 0, fail = 0, i = 0;
for (const [slug, key, name] of stories) {
  i++;
  const page = await ctx.newPage();
  const url = `${BASE}/?story=${key}&mode=preview`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    await page.waitForFunction(() => {
      const r = document.querySelector('#ladle-root') || document.querySelector('.ladle-root');
      return r && r.innerHTML.trim().length > 0;
    }, { timeout: 12000 }).catch(() => {});
    await page.waitForTimeout(400);

    const data = await page.evaluate(() => {
      const root = document.querySelector('#ladle-root') || document.querySelector('.ladle-root') || document.body;
      let css = '';
      for (const sheet of Array.from(document.styleSheets)) {
        try { for (const rule of Array.from(sheet.cssRules)) css += rule.cssText + '\n'; }
        catch (e) {}
      }
      return { html: root.innerHTML, css };
    });

    const dir = path.join(DEST, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${key}.html`), data.html);
    fs.writeFileSync(path.join(dir, `${key}.css`), data.css);
    const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${name} — ${key}</title>\n<style>\n${data.css}\n</style></head>\n<body>\n${data.html}\n</body></html>`;
    fs.writeFileSync(path.join(dir, `${key}.full.html`), full);
    await page.screenshot({ path: path.join(dir, `${key}.png`) }).catch(() => {});

    ok++;
    if (i % 10 === 0 || data.html.length === 0)
      console.log(`[${i}/${stories.length}] ✓ ${key} (html ${data.html.length}b, css ${data.css.length}b)`);
  } catch (e) {
    fail++;
    console.log(`[${i}/${stories.length}] ✗ ${key} -> ${e.message.split('\n')[0]}`);
  }
  await page.close();
}

await browser.close();
console.log(`\nDONE. ${ok} ok, ${fail} fail, out=${DEST}`);
