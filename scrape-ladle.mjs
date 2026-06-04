import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const BASE = 'http://localhost:61000';
const DEST = '/mnt/c/Users/azjob/Downloads/static/ladle';
const keys = JSON.parse(fs.readFileSync('/tmp/key-stories.json', 'utf8'));

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 } });

let ok = 0, fail = 0;
for (const [slug, key] of keys) {
  const page = await ctx.newPage();
  const url = `${BASE}/?story=${key}&mode=preview`;
  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
    // wait for ladle root to render content
    await page.waitForFunction(() => {
      const r = document.querySelector('[data-storyloaded], #ladle-root, .ladle-root');
      return r && r.innerHTML.trim().length > 0;
    }, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(600);

    const data = await page.evaluate(() => {
      const root = document.querySelector('#ladle-root') || document.querySelector('.ladle-root') || document.body;
      // collect all injected CSS (styletron + style tags + linked sheets rules)
      let css = '';
      for (const sheet of Array.from(document.styleSheets)) {
        try {
          for (const rule of Array.from(sheet.cssRules)) css += rule.cssText + '\n';
        } catch (e) { /* cross-origin */ }
      }
      return { html: root.innerHTML, css, title: document.title };
    });

    const dir = path.join(DEST, slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${key}.html`), data.html);
    fs.writeFileSync(path.join(dir, `${key}.css`), data.css);
    // full standalone snapshot
    const full = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>${key}</title>\n<style>\n${data.css}\n</style></head>\n<body>\n${data.html}\n</body></html>`;
    fs.writeFileSync(path.join(dir, `${key}.full.html`), full);

    ok++;
    console.log(`✓ ${slug.padEnd(22)} ${key}  (html ${data.html.length}b, css ${data.css.length}b)`);
  } catch (e) {
    fail++;
    console.log(`✗ ${slug.padEnd(22)} ${key}  -> ${e.message.split('\n')[0]}`);
  }
  await page.close();
}

await browser.close();
console.log(`\nDone. ${ok} ok, ${fail} fail.`);
