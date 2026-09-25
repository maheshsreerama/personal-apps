// Checks every lesson against content/README.md and that every original example is taught.
// Usage: node tools/verify.mjs            (everything, incl. coverage of all 141 examples)
//        node tools/verify.mjs a03-col    (only modules whose folder starts with the argument)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parseLesson, parseModule } from '../web/src/parse.js';

const root = new URL('..', import.meta.url).pathname;
const only = process.argv[2];
const walk = d => readdirSync(d, { withFileTypes: true })
  .flatMap(e => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]);

const errors = [];
const used = {};
const lessonIds = new Set();
const links = [];
let lessons = 0, qa = 0, quiz = 0;
for (const dir of readdirSync(join(root, 'content')).filter(d => /^[ab]\d\d-/.test(d)).sort()) {
  if (only && !dir.startsWith(only)) continue;
  const modPath = join(root, 'content', dir, '_module.md');
  if (!existsSync(modPath)) errors.push(`${dir}: missing _module.md`);
  else {
    const mod = parseModule(dir, readFileSync(modPath, 'utf8'));
    mod.errors.forEach(e => errors.push(`${dir}/_module.md: ${e}`));
    for (const m of mod.map.matchAll(/\(lesson:([^)]+)\)/g)) links.push([dir, m[1]]);
  }
  for (const f of readdirSync(join(root, 'content', dir)).filter(f => /^\d\d.*\.md$/.test(f)).sort()) {
    const id = `${dir}/${f.slice(0, -3)}`;
    const l = parseLesson(id, readFileSync(join(root, 'content', dir, f), 'utf8'));
    lessons++; qa += l.qa.length; quiz += l.quiz.length; lessonIds.add(id);
    l.errors.forEach(e => errors.push(`${id}: ${e}`));
    for (const s of l.sections) for (const m of s.md.matchAll(/\(lesson:([^)]+)\)/g)) links.push([id, m[1]]);
    for (const ex of l.examples) {
      if (!existsSync(join(root, 'source-material', ex))) errors.push(`${id}: @example ${ex} does not exist`);
      (used[ex] ||= []).push(id);
    }
  }
}
for (const [from, id] of links)  // with a module filter, only links into the checked modules can be resolved
  if (!lessonIds.has(id) && (!only || id.startsWith(only))) errors.push(`${from}: links to unknown lesson ${id}`);
for (const [ex, ids] of Object.entries(used)) if (ids.length > 1) errors.push(`${ex} is used by several lessons: ${ids.join(', ')}`);
if (!only) {
  for (const f of walk(join(root, 'source-material'))) {
    const rel = relative(join(root, 'source-material'), f);
    if (!used[rel]) errors.push(`not taught anywhere: source-material/${rel}`);
  }
}
console.log(`${lessons} lessons, ${qa} interview Q&As, ${quiz} quiz questions, ${Object.keys(used).length} examples covered`);
if (errors.length) {
  console.error(errors.map(e => '✗ ' + e).join('\n'));
  console.error(`${errors.length} problem(s)`);
  process.exit(1);
}
console.log('✓ all good');
