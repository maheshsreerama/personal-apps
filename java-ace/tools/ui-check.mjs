// Opens the built app in headless Chromium at phone size: visits every screen and every lesson,
// waits for diagrams, and fails on page errors or diagrams that did not render.
// Usage: (cd web && npx vite build && npx vite preview --port 4173 &) ; node tools/ui-check.mjs [http://localhost:4173] [screenshot-dir]
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const { chromium } = createRequire(join(root, 'web/package.json'))('playwright');
const base = process.argv[2] || 'http://localhost:4173';
const shots = process.argv[3];
if (shots) mkdirSync(shots, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, colorScheme: 'light' });
const problems = [];
let where = '';
page.on('pageerror', e => problems.push(`${where}: page error: ${e.message}`));
page.on('console', m => { if (m.type() === 'error') problems.push(`${where}: console: ${m.text().slice(0, 200)}`); });

async function visit(hash, name, ready) {
  where = hash;
  await page.goto(`${base}/${hash}`);
  if (ready) await ready();
  else await page.waitForTimeout(300);
  if (shots && name) await page.screenshot({ path: join(shots, `${name}.png`) });
}
async function diagramsDone() {
  await page.waitForFunction(() => [...document.querySelectorAll('.dg-render')].every(d => d.querySelector('svg, .dg-error')), null, { timeout: 30000 })
    .catch(() => problems.push(`${where}: diagrams timed out`));
  const bad = await page.$$eval('.dg-error', els => els.length);
  if (bad) problems.push(`${where}: ${bad} diagram(s) failed to render`);
}

await visit('#/', 'home');
const lessonIds = await page.$$eval('a.mod', as => as.map(a => a.getAttribute('href').slice(4)))
  .then(async mods => {
    const out = [];
    for (const m of mods) {
      await page.goto(`${base}/#/m/${m}`);
      out.push(...await page.$$eval('a.row', as => as.map(a => a.getAttribute('href').slice(4))));
    }
    return out;
  });
await visit('#/m/a01-oop', 'module');
for (const [i, id] of lessonIds.entries()) {
  await visit(`#/l/${id}`, i === 0 ? 'lesson' : null, diagramsDone);
  const quiz = await page.$$('.quiz-item');
  if (!quiz.length) problems.push(`${where}: no quiz rendered`);
}
if (shots) {
  await visit(`#/l/${lessonIds[0]}`, null, diagramsDone);
  for (const sec of ['Diagram', 'Code', 'Interview Q&A', 'Quiz']) {
    await page.$eval(`.sec[data-name="${sec}"]`, el => el.scrollIntoView());
    await page.screenshot({ path: join(shots, `lesson-${sec.replace(/\W+/g, '').toLowerCase()}.png`) });
  }
}
await visit('#/map', 'mindmap', () => page.waitForSelector('#mm .markmap-node', { timeout: 20000 }).then(() => page.waitForTimeout(1200)));
await visit('#/practice', 'practice');
await visit('#/quiz/all', 'quiz');
await visit('#/cards/all', 'cards');
await visit('#/interview', 'interview');
await visit('#/cheat/a01-oop', 'cheat');
await visit('#/me', 'me');
await visit('#/sketch', 'sketch-list');
await visit('#/sketch/board:1', 'sketch-board', () => page.waitForSelector('.excalidraw', { timeout: 30000 }).then(() => page.waitForTimeout(1500)));
const dg = lessonIds.find(Boolean);
await visit(`#/sketch/dg:${dg}:0`, 'sketch-diagram', () => page.waitForSelector('.excalidraw', { timeout: 30000 }).then(() => page.waitForTimeout(2500)));
await page.emulateMedia({ colorScheme: 'dark' });
await visit(`#/l/${dg}`, 'lesson-dark', diagramsDone);
await visit('#/', 'home-dark');

await browser.close();
console.log(`${lessonIds.length} lessons checked`);
if (problems.length) { console.error(problems.map(p => '✗ ' + p).join('\n')); process.exit(1); }
console.log('✓ no problems');
