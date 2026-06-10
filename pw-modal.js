const { chromium } = require('playwright');
const https = require('https');

const ANGULAR = 'http://localhost:4200/bw/ladle';

const stories = [
  'modal--modal',
  'modal--modal-uncloseable',
  'modal--modal-select',
  'modal--modal-rtl',
];

let axeScript = null;
function fetchAxe() {
  return new Promise((resolve, reject) => {
    https.get('https://cdnjs.cloudflare.com/ajax/libs/axe-core/4.9.1/axe.min.js', res => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

(async () => {
  axeScript = await fetchAxe();
  const browser = await chromium.launch();
  let errors = [];

  for (const story of stories) {
    const page = await browser.newPage();
    await page.goto(`${ANGULAR}/?story=${story}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(800);

    const shot = await page.screenshot({ fullPage: true });
    require('fs').writeFileSync(`/tmp/modal-${story.replace(/--/g, '-')}.png`, shot);

    try {
      await page.addScriptTag({ content: axeScript });
      const result = await page.evaluate(() =>
        window.axe.run({ runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })
      );
      const violations = result.violations.filter(v => v.impact !== 'minor');
      if (violations.length > 0) {
        errors.push(`AXE [${story}]: ${violations.map(v => v.id + '(' + v.impact + ')').join(', ')}`);
        violations.forEach(v => console.error(`  ↳ ${v.id}: ${v.description} (${v.nodes.length} nodes)`));
      } else {
        console.log(`✅ ${story} — AXE OK`);
      }
    } catch(e) {
      errors.push(`AXE error [${story}]: ${e.message}`);
    }

    await page.close();
  }

  await browser.close();

  if (errors.length) {
    console.error('\nFAILURES:');
    errors.forEach(e => console.error(' •', e));
    process.exit(1);
  } else {
    console.log('\nAll stories verified ✅');
  }
})();
