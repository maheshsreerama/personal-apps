// Parses every ```mermaid block in content/ with the real Mermaid library in headless Chromium.
// Usage: node tools/check-diagrams.mjs [module-prefix]      (run `npm install` in web/ first)
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';

const root = new URL('..', import.meta.url).pathname;
const require = createRequire(join(root, 'web/package.json'));
const { chromium } = require('playwright');
const only = process.argv[2] || '';

const blocks = [];
for (const dir of readdirSync(join(root, 'content')).filter(d => /^[ab]\d\d-/.test(d) && d.startsWith(only))) {
  for (const f of readdirSync(join(root, 'content', dir)).filter(f => f.endsWith('.md'))) {
    const src = readFileSync(join(root, 'content', dir, f), 'utf8');
    for (const m of src.matchAll(/^```mermaid\n([\s\S]*?)^```/gm)) blocks.push({ where: `${dir}/${f}`, code: m[1] });
  }
}
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage();
await page.setContent('<html><body></body></html>');
await page.addScriptTag({ path: require.resolve('mermaid/dist/mermaid.min.js') });
const failures = await page.evaluate(async blocks => {
  mermaid.initialize({ startOnLoad: false });
  const bad = [];
  for (const b of blocks) {
    try { await mermaid.parse(b.code); } catch (e) { bad.push({ where: b.where, code: b.code, error: String(e.message || e).slice(0, 300) }); }
  }
  return bad;
}, blocks);
await browser.close();
for (const f of failures) console.error(`✗ ${f.where}\n${f.code}\n  → ${f.error}\n`);
console.log(`${blocks.length} diagrams checked, ${failures.length} failed`);
process.exit(failures.length ? 1 : 0);
