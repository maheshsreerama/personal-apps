/* Renders app/src/main/assets/plan.js to PLAN.md — the same 84 days, readable on GitHub.
   Usage: node tools/plan_to_md.js  (run from the interview-prep/ directory) */
const fs = require('fs');
const path = require('path');
const src = fs.readFileSync(path.join(__dirname, '../app/src/main/assets/plan.js'), 'utf8');
eval(src + ';global.D=D;global.PH=PH;global.WEEKS=WEEKS;global.GATES=GATES;global.phOf=phOf;');

const hrs = m => (m / 60).toFixed(1).replace('.0', '');
let out = ['# The 84-day plan', '',
  'Five phases, twelve weeks, ' + Object.keys(D).length + ' days. Every seventh day consolidates; ' +
  'days ' + GATES.join(', ') + ' are phase gates you score yourself through.', '',
  '| Phase | Weeks | Focus |', '| --- | --- | --- |'];
PH.forEach(p => out.push('| ' + p.n + ' | ' + p.wk + ' | ' + p.name + ' |'));
out.push('');

for (let w = 1; w <= 12; w++) {
  out.push('## Week ' + w + ' — ' + WEEKS[w - 1], '');
  for (let d = (w - 1) * 7 + 1; d <= w * 7; d++) {
    const day = D[d], mins = day.b.reduce((a, b) => a + b[1], 0);
    out.push('### Day ' + d + " — " + day.t + '  ·  ' + hrs(mins) + 'h', '');
    day.b.forEach(b => out.push('- **' + b[1] + 'm** — ' + b[0]));
    if (day.p.length) out.push('', 'Problems: ' + day.p.map(p => '`' + p + '`').join(', '));
    out.push('');
  }
}
fs.writeFileSync(path.join(__dirname, '../PLAN.md'), out.join('\n'));
console.log('PLAN.md written:', out.length, 'lines');
