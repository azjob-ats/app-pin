const { chromium } = require('playwright');
const https = require('https');

const ANGULAR = 'http://localhost:4200/bw/ladle';

const stories = [
  'file-uploader--file-uploader',
  'file-uploader--item-preview',
  'file-uploader--label-hint',
  'file-uploader--long-loading',
  'file-uploader--long-loading-multiple-files',
  'file-uploader--overrides',
  'file-uploader--upload-restrictions',
  'file-uploader-basic--file-uploader',
  'file-uploader-basic--pre-drop',
  'file-uploader-basic--post-drop',
  'file-uploader-basic--spinner',
  'file-uploader-basic--progress-bar',
  'file-uploader-basic--error',
  'file-uploader-basic--disabled',
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
    const angularUrl = `${ANGULAR}/?story=${story}`;
    const page = await browser.newPage();

    await page.goto(angularUrl, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);

    const shot = await page.screenshot({ fullPage: true });
    require('fs').writeFileSync(`/tmp/fu-angular-${story.replace(/--/g, '-')}.png`, shot);

    try {
      await page.addScriptTag({ content: axeScript });
      const axeResult = await page.evaluate(() =>
        window.axe.run({ runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa'] } })
      );
      const violations = axeResult.violations.filter(v => v.impact !== 'minor');
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
