/* ═══════════ Interview Prep 84 — offline tracker ═══════════
   State lives entirely in localStorage. Nothing leaves the device except
   an explicit backup, which goes out through the Android share sheet. */

const KEY = 'ip84.v1';
const DAY_MS = 86400000;
/* Leitner-ish revision ladder, in days. A clean solve promotes, a hint holds,
   a miss knocks you back to the bottom. */
const LADDER = [1, 2, 4, 8, 16, 30];
const VERDICT = { 1: 'N', 2: '~', 3: 'Y' };
const RUBRICS = {
  DSA: ["Clarified before writing code", "Reached the right approach", "Stated complexity unprompted",
        "Code ran & handled the edges", "Narrated throughout"],
  LLD: ["Scoped requirements in 5 minutes", "Clean class model", "Open for extension",
        "Working, tested code in time", "Explained the trade-offs"],
  HLD: ["Estimated scale first", "Clear API & data model", "Justified the storage choice",
        "Handled failure & growth", "Closed on trade-offs"],
  BEH: ["Story actually answered it", "S-T-A-R structure held", "Concrete numbers",
        "Owned your part", "Under two minutes"]
};
const KINDS = { DSA: 'DSA', LLD: 'Machine coding', HLD: 'HLD', BEH: 'Behavioral' };
const SHORT = { DSA: 'DSA', LLD: 'Coding', HLD: 'HLD', BEH: 'Behavioral' };

/* ── state ──────────────────────────────────────────────── */
const blank = () => ({ v: 1, start: null, blocks: {}, probs: {}, mocks: [], notes: {} });

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return blank();
    return Object.assign(blank(), JSON.parse(raw));
  } catch (e) { return blank(); }
}
let S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { toast('Could not save'); } }

let tab = 'today';
let filter = 'all';
let openWeeks = {};

/* ── dates ──────────────────────────────────────────────── */
const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * DAY_MS / 1440).toISOString().slice(0, 10);
const midnight = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));

/** Which plan day today is. 0 when no start date has been set yet. */
function today() {
  if (!S.start) return 0;
  const n = Math.floor((midnight(iso(new Date())) - midnight(S.start)) / DAY_MS) + 1;
  return clamp(n, 1, 84);
}
function dateOf(day) { return new Date(midnight(S.start) + (day - 1) * DAY_MS); }
const fmt = d => d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });

/* ── derived ────────────────────────────────────────────── */
const blocksOf = d => D[d].b;
const isDone = (d, i) => !!S.blocks[d + ':' + i];
const doneCount = d => blocksOf(d).reduce((a, _, i) => a + (isDone(d, i) ? 1 : 0), 0);
const dayPct = d => doneCount(d) / blocksOf(d).length;
const dayComplete = d => doneCount(d) === blocksOf(d).length;
const minutesOf = d => blocksOf(d).reduce((a, b) => a + b[1], 0);
const minutesDone = d => blocksOf(d).reduce((a, b, i) => a + (isDone(d, i) ? b[1] : 0), 0);
const weekOf = d => Math.ceil(d / 7);
const isGate = d => GATES.indexOf(d) >= 0;

/** Problems whose revision has come round, oldest debt first. */
function dueList(day) {
  return Object.keys(S.probs)
    .filter(k => S.probs[k].due <= day)
    .sort((a, b) => S.probs[a].due - S.probs[b].due || a.localeCompare(b));
}

/** Record a verdict and schedule the next look at it. */
function rate(name, score, pattern) {
  const day = today() || 1;
  const p = S.probs[name] || { d: day, n: 0, box: 0, hist: [], pat: pattern || '', note: '' };
  if (pattern && !p.pat) p.pat = pattern;
  p.s = score;
  p.n++;
  p.last = day;
  p.box = score === 3 ? Math.min(p.box + 1, LADDER.length - 1) : score === 2 ? Math.max(p.box, 0) : 0;
  p.due = day + LADDER[p.box];
  p.hist = (p.hist || []).concat([[day, score]]).slice(-8);
  S.probs[name] = p;
  save();
  toast(score === 3 ? 'Clean — back in ' + LADDER[p.box] + 'd' : score === 2 ? 'Shaky — back in ' + LADDER[p.box] + 'd' : 'Missed — back tomorrow');
}

/* streak: consecutive fully-checked days ending at today (or yesterday, if today is untouched) */
function streak() {
  const t = today();
  if (!t) return 0;
  let end = dayComplete(t) ? t : t - 1, n = 0;
  for (let d = end; d >= 1; d--) { if (!dayComplete(d)) break; n++; }
  return n;
}

/* ── tiny DOM helpers ───────────────────────────────────── */
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const pct = n => Math.round(n * 100) + '%';
let toastT;
function toast(msg) {
  const t = $('#toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('on'), 1700);
}

/* ── header ─────────────────────────────────────────────── */
function header() {
  const t = today();
  if (!t) {
    $('#hDay').textContent = '—';
    $('#hTitle').textContent = 'Not started';
    $('#hSub').textContent = 'Pick your Day 1';
    ring(0);
    document.documentElement.style.setProperty('--acc', PH[0].hex);
    return;
  }
  const ph = phOf(t);
  document.documentElement.style.setProperty('--acc', ph.hex);
  $('#hDay').textContent = t;
  $('#hTitle').textContent = D[t].t;
  $('#hSub').textContent = 'Phase ' + ph.n + ' · Wk ' + weekOf(t) + ' · ' + DOW[(t - 1) % 7] +
    ' · ' + (minutesOf(t) / 60).toFixed(1).replace('.0', '') + 'h';
  ring(dayPct(t));
}
function ring(f) {
  const C = 97.4;
  $('#hRing').setAttribute('stroke-dashoffset', (C * (1 - f)).toFixed(1));
  $('#hRing').style.color = 'var(--acc)';
  $('#hPct').textContent = pct(f);
}

/* ── fragments ──────────────────────────────────────────── */
function blockRows(d) {
  return blocksOf(d).map((b, i) => {
    const on = isDone(d, i);
    return '<div class="row' + (on ? ' done' : '') + '" data-a="blk" data-d="' + d + '" data-i="' + i + '">' +
      '<div class="chk' + (on ? ' on' : '') + '"></div>' +
      '<div class="txt">' + esc(b[0]) + '</div>' +
      '<div class="tag">' + b[1] + 'm</div></div>';
  }).join('');
}

function probRow(name, pattern, showMeta, showPat) {
  const p = S.probs[name];
  const t = today() || 1;
  let meta = '';
  if (p) {
    const due = p.due - t;
    const label = due <= 0 ? 'due now' : 'in ' + due + 'd';
    meta = '<span class="pmeta' + (due <= 0 ? ' due' : '') + '">' +
      (p.pat && showPat !== false ? esc(p.pat) + ' · ' : '') + 'x' + p.n + ' · ' + label + '</span>';
  } else if (showMeta) {
    meta = '<span class="pmeta">not attempted</span>';
  }
  return '<div class="prow">' +
    '<div class="pname" data-a="prob" data-p="' + esc(name) + '">' + esc(name) + meta + '</div>' +
    '<button class="ext" data-a="ext" data-p="' + esc(name) + '" aria-label="Search the web">&#8599;</button>' +
    '<div class="verd">' + [1, 2, 3].map(s =>
      '<button data-a="score" data-s="' + s + '" data-p="' + esc(name) + '" data-pat="' + esc(pattern || '') + '"' +
      (p && p.s === s ? ' class="on"' : '') + '>' + VERDICT[s] + '</button>').join('') +
    '</div></div>';
}

/* ── TODAY ──────────────────────────────────────────────── */
function viewToday() {
  const t = today();
  if (!t) return setupCard();
  const day = D[t], ph = phOf(t);
  let h = '';

  if (isGate(t)) {
    h += '<div class="ban gate"><div class="ban-t">Phase ' + ph.n + ' gate — ' + esc(ph.name) + '</div>' +
      '<div class="hint">Score every round type 1–5 before you move on. A gate you walk through ' +
      'without scoring is a gate you did not pass.</div>' +
      '<div class="acts" style="margin-top:10px"><button class="btn sm pri" data-a="mock">Log a mock</button></div></div>';
  }

  const due = dueList(t);
  if (due.length) {
    h += '<div class="ban due"><div class="ban-t">' + due.length + ' revision' + (due.length > 1 ? 's' : '') + ' due</div>' +
      '<div class="hint">Cold, from a blank file. Re-rate honestly — the ladder only works if you do.</div></div>' +
      '<div class="card" style="margin-bottom:20px">' + due.slice(0, 8).map(n => probRow(n, S.probs[n].pat)).join('') +
      (due.length > 8 ? '<div class="note">+ ' + (due.length - 8) + ' more in the LOG tab</div>' : '') + '</div>';
  }

  h += '<div class="sec"><div class="lblrow"><div class="lbl">Day ' + t + ' · ' + esc(day.t) + '</div>' +
    '<button class="act" data-a="jump">Jump to day</button></div>' +
    '<div class="card blocks"><div class="strip"><div class="bar"><i style="width:' + pct(dayPct(t)) + '"></i></div>' +
    '<div class="pc">' + minutesDone(t) + ' / ' + minutesOf(t) + 'm</div></div>' +
    blockRows(t) + '</div></div>';

  if (day.p.length) {
    h += '<div class="sec"><div class="lbl">Problems — ' + day.p.length + '</div><div class="card">' +
      day.p.map(n => probRow(n, day.t, true, false)).join('') + '</div>' +
      '<div class="hint" style="margin-top:8px">N = missed or needed the solution · ~ = needed a hint · Y = clean, unaided</div></div>';
  }

  const note = S.notes[t] || '';
  h += '<div class="sec"><div class="lblrow"><div class="lbl">Day note</div>' +
    '<button class="act" data-a="note" data-d="' + t + '">' + (note ? 'Edit' : 'Add') + '</button></div>' +
    '<div class="card">' + (note ? '<div class="note">' + esc(note) + '</div>' :
      '<div class="empty">What broke today, and what you will do about it.</div>') + '</div></div>';

  h += '<div class="sec"><div class="acts">' +
    '<button class="btn" data-a="mock">Log a mock</button>' +
    '<button class="btn ' + (dayComplete(t) ? '' : 'pri') + '" data-a="allblk" data-d="' + t + '">' +
    (dayComplete(t) ? 'Uncheck day' : 'Check off day') + '</button></div></div>';
  return h;
}

function setupCard() {
  return '<div class="sec"><div class="card pad">' +
    '<h3 class="disp">84 days, five phases.</h3>' +
    '<p class="hint" style="margin:8px 0 14px">Foundations, structures, an interview-ready sprint, ' +
    'a season of real loops, then a peak and a close. Pick the date you start — every day, gate and ' +
    'revision is counted from it. You can change it later without losing anything.</p>' +
    '<div class="acts"><button class="btn pri" data-a="start">Set my Day 1</button></div></div></div>' +
    '<div class="sec"><div class="lbl">The shape of it</div><div class="card">' +
    PH.map(p => '<div class="phrow"><span class="phdot" style="background:' + p.hex + '"></span>' +
      '<span class="nm">Phase ' + p.n + ' — ' + esc(p.name) + '</span>' +
      '<span class="pc">wk ' + p.wk + '</span></div>').join('') + '</div></div>';
}

/* ── PLAN ───────────────────────────────────────────────── */
function viewPlan() {
  const t = today();
  let cells = '';
  for (let d = 1; d <= 84; d++) {
    const f = dayPct(d), ph = phOf(d);
    cells += '<div class="cell' + (d === t ? ' today' : '') + (isGate(d) ? ' gate' : '') + (f === 1 ? ' full' : '') +
      '" data-a="day" data-d="' + d + '"><i style="height:' + pct(f) + ';background:' + ph.hex + '"></i>' +
      '<span>' + d + '</span></div>';
  }
  let h = '<div class="sec"><div class="lblrow"><div class="lbl">84 days</div>' +
    '<button class="act" data-a="start">' + (S.start ? 'Day 1 · ' + fmt(dateOf(1)) : 'Set Day 1') + '</button></div>' +
    '<div class="grid84">' + cells + '</div>' +
    '<div class="gridkey">' + PH.map(p => '<span><b style="background:' + p.hex + '"></b>P' + p.n + ' ' + esc(p.name) + '</span>').join('') +
    '<span><b style="background:transparent;border:1px solid var(--p4)"></b>gate</span></div></div>';

  h += '<div class="sec"><div class="lbl">Weeks</div>';
  for (let w = 1; w <= 12; w++) {
    const days = [], first = (w - 1) * 7 + 1;
    let done = 0, total = 0;
    for (let d = first; d < first + 7; d++) { days.push(d); done += doneCount(d); total += blocksOf(d).length; }
    const open = openWeeks[w] || (t && weekOf(t) === w && openWeeks[w] !== false);
    h += '<div class="wk' + (open ? ' open' : '') + '">' +
      '<button class="wk-h" data-a="wk" data-w="' + w + '"><span class="wk-n">W' + w + '</span>' +
      '<span class="wk-t">' + esc(WEEKS[w - 1]) + '</span>' +
      '<span class="wk-b"><span class="bar"><i style="width:' + pct(done / total) + ';background:' + phOf(first).hex + '"></i></span></span></button>' +
      '<div class="wk-body">' + days.map(d =>
        '<button class="dayrow" data-a="day" data-d="' + d + '"><b>' + d + '</b>' +
        '<span>' + esc(D[d].t) + '</span>' +
        (d === t ? '<span class="pill">today</span>' : dayComplete(d) ? '<span class="pill gd">done</span>' :
          doneCount(d) ? '<span class="pill">' + doneCount(d) + '/' + blocksOf(d).length + '</span>' : '') +
        '</button>').join('') + '</div></div>';
  }
  return h + '</div>';
}

/* ── LOG ────────────────────────────────────────────────── */
function viewLog() {
  const t = today() || 1;
  const all = Object.keys(S.probs);
  const pass = n => {
    const p = S.probs[n];
    return filter === 'all' || (filter === 'due' && p.due <= t) || (filter === 'red' && p.s === 1) ||
      (filter === 'amber' && p.s === 2) || (filter === 'green' && p.s === 3);
  };
  const list = all.filter(pass).sort((a, b) => S.probs[a].due - S.probs[b].due || a.localeCompare(b));
  const count = f => all.filter(n => { const p = S.probs[n]; return f === 'all' || (f === 'due' && p.due <= t) || (f === 'red' && p.s === 1) || (f === 'amber' && p.s === 2) || (f === 'green' && p.s === 3); }).length;

  let h = '<div class="sec"><div class="lblrow"><div class="lbl">Problem log — ' + all.length + '</div>' +
    '<button class="act" data-a="addprob">+ Add a problem</button></div>' +
    '<div class="chips">' + [['all', 'ALL'], ['due', 'DUE'], ['red', 'N'], ['amber', '~'], ['green', 'Y']].map(f =>
      '<button data-a="filter" data-f="' + f[0] + '"' + (filter === f[0] ? ' class="on"' : '') + '>' +
      f[1] + ' ' + count(f[0]) + '</button>').join('') + '</div>';

  h += '<div class="card">' + (list.length ? list.map(n => probRow(n, S.probs[n].pat)).join('') :
    '<div class="empty">' + (all.length ? 'Nothing in this filter.' :
      'Rate a problem on the TODAY tab and it lands here, with a revision date attached.') + '</div>') + '</div>';

  h += '<div class="hint" style="margin-top:10px">The ladder: a clean solve pushes the next look out to ' +
    LADDER.join(', ') + ' days. A hint holds it where it is. A miss brings it back tomorrow.</div></div>';
  return h;
}

/* ── STATS ──────────────────────────────────────────────── */
function viewStats() {
  const t = today();
  let daysDone = 0, minsDone = 0, totalBlocks = 0, blocksDone = 0;
  for (let d = 1; d <= 84; d++) {
    if (dayComplete(d)) daysDone++;
    minsDone += minutesDone(d);
    totalBlocks += blocksOf(d).length;
    blocksDone += doneCount(d);
  }
  const names = Object.keys(S.probs);
  const clean = names.filter(n => S.probs[n].s === 3).length;

  let h = '<div class="sec"><div class="kpis">' +
    kpi(daysDone, 'days complete') +
    kpi(streak(), 'day streak') +
    kpi((minsDone / 60).toFixed(0) + 'h', 'hours logged') +
    kpi(names.length, 'problems logged') +
    kpi(names.length ? pct(clean / names.length) : '—', 'clean & unaided') +
    kpi(S.mocks.length, 'mocks scored') +
    '</div></div>';

  h += '<div class="sec"><div class="lbl">Phases</div><div class="card">' +
    PH.map(p => {
      const from = PH[PH.indexOf(p) - 1] ? PH[PH.indexOf(p) - 1].end + 1 : 1;
      let dn = 0, tot = 0;
      for (let d = from; d <= p.end; d++) { dn += doneCount(d); tot += blocksOf(d).length; }
      return '<div class="phrow"><span class="phdot" style="background:' + p.hex + '"></span>' +
        '<span class="nm">' + esc(p.name) + '</span>' +
        '<span class="wk-b"><span class="bar"><i style="width:' + pct(dn / tot) + ';background:' + p.hex + '"></i></span></span>' +
        '<span class="pc">' + pct(dn / tot) + '</span></div>';
    }).join('') + '</div></div>';

  /* pattern breakdown, worst first — this is the list you actually work from */
  const byPat = {};
  names.forEach(n => {
    const p = S.probs[n], k = p.pat || 'Ad hoc';
    byPat[k] = byPat[k] || { n: 0, clean: 0 };
    byPat[k].n++; if (p.s === 3) byPat[k].clean++;
  });
  const pats = Object.keys(byPat).sort((a, b) => byPat[a].clean / byPat[a].n - byPat[b].clean / byPat[b].n);
  h += '<div class="sec"><div class="lbl">Patterns — weakest first</div><div class="card">' +
    (pats.length ? pats.map(k => {
      const v = byPat[k], f = v.clean / v.n;
      return '<div class="phrow"><span class="phdot" style="background:' +
        (f >= .8 ? 'var(--ok)' : f >= .5 ? 'var(--warn)' : 'var(--bad)') + '"></span>' +
        '<span class="nm">' + esc(k) + '</span>' +
        '<span class="pc">' + v.clean + '/' + v.n + '</span></div>';
    }).join('') : '<div class="empty">Rate a few problems first.</div>') + '</div></div>';

  h += '<div class="sec"><div class="lblrow"><div class="lbl">Mocks — ' + S.mocks.length + '</div>' +
    '<button class="act" data-a="mock">+ Log a mock</button></div><div class="card">' +
    (S.mocks.length ? S.mocks.slice().sort((a, b) => b.day - a.day).map((m, i) => {
      const vals = Object.keys(m.sc).map(k => m.sc[k]);
      const avg = vals.reduce((a, b) => a + b, 0) / (vals.length || 1);
      return '<div class="mrow" data-a="mockopen" data-i="' + S.mocks.indexOf(m) + '"><b>d' + m.day + '</b>' +
        '<span class="nm">' + esc(KINDS[m.kind] || m.kind) + (m.note ? '<span class="pmeta">' + esc(m.note.slice(0, 60)) + '</span>' : '') + '</span>' +
        '<span class="sc" style="color:' + (avg >= 4 ? 'var(--ok)' : avg >= 3 ? 'var(--warn)' : 'var(--bad)') + '">' +
        avg.toFixed(1) + '</span></div>';
    }).join('') : '<div class="empty">No mock is a mock until it is scored.</div>') + '</div></div>';

  h += '<div class="sec"><div class="lbl">Data</div><div class="card pad">' +
    '<div class="hint">' + (S.start ? 'Day 1 was ' + fmt(dateOf(1)) + ' · day 84 is ' + fmt(dateOf(84)) +
      (t ? ' · you are on day ' + t : '') : 'No start date set.') + '</div>' +
    '<div class="acts" style="margin-top:12px"><button class="btn sm" data-a="start">Start date</button>' +
    '<button class="btn sm" data-a="export">Back up</button>' +
    '<button class="btn sm" data-a="import">Restore</button></div>' +
    '<div class="acts"><button class="btn sm" data-a="reset">Erase everything</button></div></div></div>';
  return h;
}
const kpi = (b, s) => '<div class="kpi"><b>' + b + '</b><span>' + s + '</span></div>';

/* ── render ─────────────────────────────────────────────── */
function render() {
  header();
  const v = { today: viewToday, plan: viewPlan, log: viewLog, stats: viewStats }[tab];
  $('#view').innerHTML = v();
  document.querySelectorAll('.nav button').forEach(b => b.classList.toggle('on', b.dataset.tab === tab));
  if (tab !== 'today') window.scrollTo(0, 0);
}

/* ── sheets ─────────────────────────────────────────────── */
function sheet(html) { $('#sheet').innerHTML = html; $('#ov').hidden = false; }
function closeSheet() { $('#ov').hidden = true; $('#sheet').innerHTML = ''; }
const sheetOpen = () => !$('#ov').hidden;

function daySheet(d) {
  const day = D[d], ph = phOf(d);
  sheet('<h3 class="disp">Day ' + d + ' — ' + esc(day.t) + '</h3>' +
    '<div class="hint">Phase ' + ph.n + ' · week ' + weekOf(d) + ' · ' + minutesOf(d) + ' minutes' +
    (S.start ? ' · ' + fmt(dateOf(d)) : '') + '</div>' +
    '<div class="card blocks" style="margin-bottom:14px">' + blockRows(d) + '</div>' +
    (day.p.length ? '<div class="lbl">Problems</div><div class="card" style="margin-bottom:14px">' +
      day.p.map(n => probRow(n, day.t, true, false)).join('') + '</div>' : '') +
    (S.notes[d] ? '<div class="lbl">Note</div><div class="card" style="margin-bottom:14px"><div class="note">' + esc(S.notes[d]) + '</div></div>' : '') +
    '<div class="acts"><button class="btn" data-a="note" data-d="' + d + '">Note</button>' +
    '<button class="btn pri" data-a="close">Done</button></div>');
}

function probSheet(name) {
  const p = S.probs[name];
  const t = today() || 1;
  const hist = p && p.hist ? p.hist.map(h => 'd' + h[0] + ' ' + VERDICT[h[1]]).join('  ·  ') : '—';
  sheet('<h3 class="disp">' + esc(name) + '</h3>' +
    '<div class="hint">' + (p ? esc(p.pat || 'Ad hoc') + ' · attempted ' + p.n + '× · next look ' +
      (p.due <= t ? 'now' : 'day ' + p.due) : 'Not attempted yet') + '</div>' +
    '<div class="fld"><label>Verdict</label><div class="seg">' +
    [[1, 'N — missed'], [2, '~ — hint'], [3, 'Y — clean']].map(s =>
      '<button data-a="score" data-p="' + esc(name) + '" data-s="' + s[0] + '"' +
      (p && p.s === s[0] ? ' class="on"' : '') + '>' + s[1] + '</button>').join('') + '</div></div>' +
    (p ? '<div class="fld"><label>History</label><div class="hint mono">' + hist + '</div></div>' : '') +
    '<div class="fld"><label>Note — the thing you keep forgetting</label>' +
    '<textarea id="pnote" placeholder="The cue that should have fired, the edge case you missed…">' +
    esc(p && p.note ? p.note : '') + '</textarea></div>' +
    '<div class="acts"><button class="btn" data-a="savepnote" data-p="' + esc(name) + '">Save note</button>' +
    '<button class="btn pri" data-a="close">Close</button></div>' +
    (p ? '<div class="acts"><button class="btn sm" data-a="delprob" data-p="' + esc(name) + '">Remove from log</button></div>' : ''));
}

function noteSheet(d) {
  sheet('<h3 class="disp">Day ' + d + ' note</h3>' +
    '<div class="hint">Recognition failure or execution failure? Write the one you would want to read back on day 84.</div>' +
    '<div class="fld"><textarea id="dnote" style="min-height:140px">' + esc(S.notes[d] || '') + '</textarea></div>' +
    '<div class="acts"><button class="btn" data-a="close">Cancel</button>' +
    '<button class="btn pri" data-a="savednote" data-d="' + d + '">Save</button></div>');
}

let mockDraft = null;
function mockSheet(idx) {
  const editing = idx != null && S.mocks[idx];
  mockDraft = editing ? JSON.parse(JSON.stringify(S.mocks[idx])) :
    { day: today() || 1, kind: 'DSA', sc: {}, note: '' };
  paintMock(idx);
}
function paintMock(idx) {
  const m = mockDraft;
  const rows = RUBRICS[m.kind].map((q, i) =>
    '<div class="rub"><p>' + esc(q) + '</p><div class="scores">' +
    [1, 2, 3, 4, 5].map(s => '<button data-a="rub" data-i="' + i + '" data-s="' + s + '"' +
      (m.sc[i] === s ? ' class="on"' : '') + '>' + s + '</button>').join('') + '</div></div>').join('');
  sheet('<h3 class="disp">' + (idx != null ? 'Mock — day ' + m.day : 'Score a mock') + '</h3>' +
    '<div class="hint">Score it the way the interviewer would, not the way you would like to remember it.</div>' +
    '<div class="fld"><label>Round</label><div class="seg">' +
    Object.keys(KINDS).map(k => '<button data-a="mkind" data-k="' + k + '"' +
      (m.kind === k ? ' class="on"' : '') + '>' + esc(SHORT[k]) + '</button>').join('') + '</div></div>' +
    '<div class="fld"><label>Rubric — 1 to 5</label><div class="card pad">' + rows + '</div></div>' +
    '<div class="fld"><label>What to fix</label><textarea id="mnote" placeholder="One sentence. The thing you will drill tomorrow.">' + esc(m.note) + '</textarea></div>' +
    '<div class="acts"><button class="btn" data-a="close">Cancel</button>' +
    '<button class="btn pri" data-a="savemock" data-i="' + (idx == null ? '' : idx) + '">Save</button></div>' +
    (idx != null ? '<div class="acts"><button class="btn sm" data-a="delmock" data-i="' + idx + '">Delete</button></div>' : ''));
}

function startSheet() {
  const cur = S.start || iso(new Date());
  sheet('<h3 class="disp">Day 1</h3>' +
    '<div class="hint">Everything — the grid, the gates, the revision ladder — counts from this date. ' +
    'Changing it moves the calendar, not your log.</div>' +
    '<div class="fld"><label>Start date</label><input type="date" id="sdate" value="' + cur + '"></div>' +
    '<div class="acts"><button class="btn" data-a="close">Cancel</button>' +
    '<button class="btn pri" data-a="savestart">Save</button></div>' +
    '<div class="acts"><button class="btn sm" data-a="starttoday">Start today</button></div>');
}

function jumpSheet() {
  sheet('<h3 class="disp">Jump to a day</h3>' +
    '<div class="hint">Read ahead, or catch up on one you skipped. The TODAY tab always follows the calendar.</div>' +
    '<div class="fld"><label>Day 1–84</label><input type="text" inputmode="numeric" id="jday" placeholder="' + (today() || 1) + '"></div>' +
    '<div class="acts"><button class="btn" data-a="close">Cancel</button>' +
    '<button class="btn pri" data-a="dojump">Open</button></div>');
}

function addProbSheet() {
  sheet('<h3 class="disp">Add a problem</h3>' +
    '<div class="hint">Anything you solved outside the plan — a company-tagged question, something from a mock. ' +
    'It joins the same revision ladder.</div>' +
    '<div class="fld"><label>Name</label><input type="text" id="pn" placeholder="Word Ladder II"></div>' +
    '<div class="fld"><label>Pattern</label><input type="text" id="pp" placeholder="Graphs, BFS"></div>' +
    '<div class="fld"><label>How did it go?</label><div class="seg">' +
    [[1, 'N — missed'], [2, '~ — hint'], [3, 'Y — clean']].map(s =>
      '<button data-a="addscore" data-s="' + s[0] + '">' + s[1] + '</button>').join('') + '</div></div>' +
    '<div class="acts"><button class="btn" data-a="close">Cancel</button></div>');
}

function exportSheet() {
  const json = JSON.stringify(S);
  sheet('<h3 class="disp">Back up</h3>' +
    '<div class="hint">Your whole log, as text. Share it to yourself — mail, notes, anywhere — and paste it ' +
    'into Restore on any device.</div>' +
    '<div class="fld"><textarea id="exp" readonly style="min-height:160px;font-size:11px" class="mono">' + esc(json) + '</textarea></div>' +
    '<div class="acts"><button class="btn" data-a="close">Close</button>' +
    '<button class="btn pri" data-a="share">Share</button></div>');
}

function importSheet() {
  sheet('<h3 class="disp">Restore</h3>' +
    '<div class="hint">Paste a backup. This replaces everything currently in the app.</div>' +
    '<div class="fld"><textarea id="imp" style="min-height:160px;font-size:11px" class="mono" placeholder="{&quot;v&quot;:1,…}"></textarea></div>' +
    '<div class="acts"><button class="btn" data-a="close">Cancel</button>' +
    '<button class="btn pri" data-a="doimport">Replace my data</button></div>');
}

/* ── actions ────────────────────────────────────────────── */
const ACT = {
  tab(el) { tab = el.dataset.tab; render(); },
  close() { closeSheet(); },

  blk(el) {
    const d = +el.dataset.d, i = +el.dataset.i, k = d + ':' + i;
    if (S.blocks[k]) delete S.blocks[k]; else S.blocks[k] = 1;
    save();
    if (sheetOpen()) daySheet(d);
    render();
  },
  allblk(el) {
    const d = +el.dataset.d, all = dayComplete(d);
    blocksOf(d).forEach((_, i) => { if (all) delete S.blocks[d + ':' + i]; else S.blocks[d + ':' + i] = 1; });
    save();
    if (!all && dayComplete(d)) toast('Day ' + d + ' done — streak ' + streak());
    render();
  },
  score(el) {
    rate(el.dataset.p, +el.dataset.s, el.dataset.pat);
    if (sheetOpen()) { const s = $('#sheet'); if (s.querySelector('#pnote')) probSheet(el.dataset.p); else if (s.querySelector('.blocks')) daySheet(currentDay); }
    render();
  },
  prob(el) { probSheet(el.dataset.p); },
  ext(el) { window.open('https://leetcode.com/problemset/?search=' + encodeURIComponent(el.dataset.p), '_blank'); },
  day(el) { currentDay = +el.dataset.d; daySheet(currentDay); },
  wk(el) { const w = el.dataset.w; openWeeks[w] = !el.closest('.wk').classList.contains('open'); render(); },
  filter(el) { filter = el.dataset.f; render(); },

  note(el) { noteSheet(+el.dataset.d); },
  savednote(el) {
    const d = +el.dataset.d, v = $('#dnote').value.trim();
    if (v) S.notes[d] = v; else delete S.notes[d];
    save(); closeSheet(); render();
  },
  savepnote(el) {
    const n = el.dataset.p;
    if (!S.probs[n]) S.probs[n] = { d: today() || 1, n: 0, box: 0, hist: [], pat: '', due: (today() || 1) + 1 };
    S.probs[n].note = $('#pnote').value.trim();
    save(); closeSheet(); render(); toast('Saved');
  },
  delprob(el) { delete S.probs[el.dataset.p]; save(); closeSheet(); render(); toast('Removed'); },

  addprob() { addProbSheet(); },
  addscore(el) {
    const n = $('#pn').value.trim();
    if (!n) { toast('Give it a name'); return; }
    rate(n, +el.dataset.s, $('#pp').value.trim() || 'Ad hoc');
    closeSheet(); tab = 'log'; render();
  },

  mock() { mockSheet(null); },
  mockopen(el) { mockSheet(+el.dataset.i); },
  mkind(el) { mockDraft.note = ($('#mnote') || {}).value || mockDraft.note; mockDraft.kind = el.dataset.k; mockDraft.sc = {}; paintMock(null); },
  rub(el) {
    mockDraft.note = ($('#mnote') || {}).value || mockDraft.note;
    mockDraft.sc[el.dataset.i] = +el.dataset.s;
    const idx = $('#sheet').querySelector('[data-a="delmock"]');
    paintMock(idx ? +idx.dataset.i : null);
  },
  savemock(el) {
    mockDraft.note = $('#mnote').value.trim();
    if (!Object.keys(mockDraft.sc).length) { toast('Score it first'); return; }
    if (el.dataset.i === '') S.mocks.push(mockDraft); else S.mocks[+el.dataset.i] = mockDraft;
    save(); closeSheet(); tab = 'stats'; render(); toast('Mock scored');
  },
  delmock(el) { S.mocks.splice(+el.dataset.i, 1); save(); closeSheet(); render(); },

  start() { startSheet(); },
  savestart() {
    const v = $('#sdate').value;
    if (!v) { toast('Pick a date'); return; }
    S.start = v; save(); closeSheet(); render();
  },
  starttoday() { S.start = iso(new Date()); save(); closeSheet(); render(); },

  jump() { jumpSheet(); },
  dojump() {
    const n = parseInt($('#jday').value, 10);
    if (!n || n < 1 || n > 84) { toast('1 to 84'); return; }
    currentDay = n; daySheet(n);
  },

  export() { exportSheet(); },
  share() {
    const json = JSON.stringify(S);
    if (window.Shell && Shell.share) Shell.share(json, 'Interview Prep 84 backup');
    else { $('#exp').select(); document.execCommand('copy'); toast('Copied'); }
  },
  import() { importSheet(); },
  doimport() {
    try {
      const o = JSON.parse($('#imp').value);
      if (!o || typeof o !== 'object' || !('blocks' in o)) throw 0;
      S = Object.assign(blank(), o);
      save(); closeSheet(); render(); toast('Restored');
    } catch (e) { toast('That is not a backup'); }
  },
  reset() {
    sheet('<h3 class="disp">Erase everything?</h3>' +
      '<div class="hint">Every checked block, every problem verdict, every mock and note. There is no undo — ' +
      'back up first if you are not sure.</div>' +
      '<div class="acts"><button class="btn pri" data-a="close">Keep it</button>' +
      '<button class="btn" data-a="reset2">Erase</button></div>');
  },
  reset2() { S = blank(); save(); closeSheet(); tab = 'today'; render(); toast('Erased'); }
};
let currentDay = 1;

document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]');
  if (!el) return;
  const fn = ACT[el.dataset.a];
  if (fn) { e.preventDefault(); fn(el); }
});
$('#ov').addEventListener('click', e => { if (e.target.id === 'ov') closeSheet(); });

/* Android hardware back: close a sheet, then fall back to the TODAY tab, then exit. */
window.appBack = function () {
  if (sheetOpen()) { closeSheet(); return true; }
  if (tab !== 'today') { tab = 'today'; render(); return true; }
  return false;
};

/* A day can roll over while the app sits in the background. */
document.addEventListener('visibilitychange', () => { if (!document.hidden) render(); });

render();
