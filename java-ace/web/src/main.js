import './style.css';
import { modules, lessons, byId, moduleById, makeRenderer, esc, plainText } from './content.js';

// ---------- persistence ----------
const KEY = 'javaace:v1';
const store = (() => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } })();
store.done ||= {}; store.bookmarks ||= {}; store.quiz ||= {}; store.cards ||= {}; store.sessions ||= []; store.pos ||= {};
store.settings ||= { theme: 'auto', font: 1 };
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(store)); } catch { /* storage full or blocked */ } };

const day = (offset = 0) => new Date(Date.now() + offset * 864e5).toLocaleDateString('en-CA');
function touchStreak() {
  const s = store.streak ||= { day: null, count: 0 };
  if (s.day === day()) return;
  s.count = s.day === day(-1) ? s.count + 1 : 1;
  s.day = day();
  save();
}
const streak = () => (store.streak && [day(), day(-1)].includes(store.streak.day) ? store.streak.count : 0);

// ---------- theme ----------
const darkQuery = matchMedia('(prefers-color-scheme: dark)');
function applyTheme() {
  const t = store.settings.theme;
  const dark = t === 'dark' || (t === 'auto' && darkQuery.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document.documentElement.style.fontSize = `${store.settings.font * 100}%`;
  try { window.JavaAce?.setDark(dark); } catch { /* not inside the Android app */ }
}
darkQuery.addEventListener('change', () => { applyTheme(); route(); });
export const isDark = () => document.documentElement.dataset.theme === 'dark';

// ---------- helpers ----------
const app = document.getElementById('app');
const tabs = document.getElementById('tabs');
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pct = (a, b) => (b ? Math.round((a * 100) / b) : 0);
const doneIn = ls => ls.filter(l => store.done[l.id]).length;
const bar = (title, back, extra = '') =>
  `<header class="bar"><a class="back" href="${back}" aria-label="Back">‹</a><h1>${title}</h1>${extra}</header>`;
function toast(msg) {
  const t = Object.assign(document.createElement('div'), { className: 'toast', textContent: msg });
  document.body.append(t);
  setTimeout(() => t.remove(), 1800);
}
const SECTION_ICON = {
  'In One Line': '🎯', 'Mental Model': '🧠', Concept: '📖', Diagram: '✏️', Code: '💻', Walkthrough: '🔍',
  Traps: '⚠️', 'Tips & Tricks': '💡', 'Interview Q&A': '🎤', Quiz: '✅', Takeaways: '📌',
};
const scopeLessons = scope =>
  scope === 'all' ? lessons : scope === 'A' || scope === 'B' ? lessons.filter(l => moduleById[l.module].track === scope)
    : moduleById[scope]?.lessons || [];
const scopeName = scope =>
  scope === 'all' ? 'Everything' : scope === 'A' ? 'Your course' : scope === 'B' ? 'Interview essentials' : moduleById[scope]?.title || scope;
const scopeOptions = sel => [['all', 'Everything'], ['A', 'Your course (Track A)'], ['B', 'Interview essentials (Track B)'],
  ...modules.map(m => [m.id, `${m.icon} ${m.title}`])]
  .map(([v, t]) => `<option value="${v}"${v === sel ? ' selected' : ''}>${esc(t)}</option>`).join('');

// Renders one quiz question; `onAnswer(correct)` fires once.
function quizItem(item, render, inline, n) {
  return `<div class="quiz-item">
    <div class="qq"><b>Q${n}.</b> ${inline(item.title)}</div>${item.body ? render(item.body) : ''}
    <div class="opts">${item.options.map((o, j) => `<button type="button" class="opt" data-j="${j}">${inline(o.text)}</button>`).join('')}</div>
    <div class="explain" hidden>${render(item.explain)}</div></div>`;
}
function wireQuiz(el, item, onAnswer) {
  el.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
    if (el.classList.contains('answered')) return;
    el.classList.add('answered');
    const j = +b.dataset.j;
    el.querySelectorAll('.opt').forEach((o, k) => { if (item.options[k].correct) o.classList.add('right'); });
    if (!item.options[j].correct) b.classList.add('wrong');
    el.querySelector('.explain').hidden = false;
    onAnswer(item.options[j].correct);
  }));
}

// Loads Mermaid only when a page has diagrams.
async function drawDiagrams(root, codes) {
  if (!root.querySelector('figure.diagram')) return;
  const { renderDiagrams } = await import('./diagram.js');
  renderDiagrams(root, codes, isDark());
}

// ---------- flashcards (Leitner boxes) ----------
const INTERVAL = [0, 1, 3, 7, 14, 30, 60];
const cardsFor = ls => ls.flatMap(l => l.qa.map((qa, i) => ({ id: `${l.id}#${i}`, l, qa })));
const isDue = c => store.cards[c.id] && store.cards[c.id].due <= day();
function rateCard(id, rating) {
  const s = store.cards[id] || { box: 0 };
  s.box = rating === 'again' ? 1 : Math.min(6, s.box + (rating === 'easy' ? 2 : 1));
  s.due = day(rating === 'again' ? 0 : INTERVAL[s.box]);
  store.cards[id] = s;
  touchStreak();
  save();
}

// ---------- views ----------
function home() {
  const done = doneIn(lessons);
  const next = (byId[store.last] && !store.done[store.last] && byId[store.last]) || lessons.find(l => !store.done[l.id]) || lessons[0];
  const due = cardsFor(lessons).filter(isDue).length;
  const card = m => {
    const d = doneIn(m.lessons);
    return `<a class="mod card" href="#/m/${m.id}"><span class="mod-icon">${m.icon}</span><div class="mod-body">
      <b>${esc(m.title)}</b><small>${esc(m.blurb)}</small>
      <div class="meter"><i style="width:${pct(d, m.lessons.length)}%"></i></div>
      <small class="muted">${d}/${m.lessons.length} lessons</small></div></a>`;
  };
  const track = t => modules.filter(m => m.track === t && m.lessons.length).map(card).join('');
  app.innerHTML = `
    <header class="top"><div class="brand"><span class="logo">☕</span>Java Ace</div>
      <a class="icon-btn" href="#/search" aria-label="Search">🔍</a></header>
    ${next ? `<a class="hero card" href="#/l/${next.id}">
      <small>${store.last ? 'Continue' : 'Start here'} · ${esc(moduleById[next.module].title)}</small>
      <b>${esc(next.title)}</b><span class="go">Open lesson →</span></a>` : ''}
    <div class="stats">
      <div class="stat card"><b>${pct(done, lessons.length)}%</b><small>${done}/${lessons.length} lessons</small></div>
      <div class="stat card"><b>🔥 ${streak()}</b><small>day streak</small></div>
      <a class="stat card" href="#/cards/all"><b>🃏 ${due}</b><small>cards due</small></a>
    </div>
    <div class="quick">
      <a class="card" href="#/map">🗺️<span>Mind map</span></a>
      <a class="card" href="#/quiz/all">✅<span>Quiz</span></a>
      <a class="card" href="#/cards/all">🃏<span>Flashcards</span></a>
      <a class="card" href="#/interview">🎤<span>Mock interview</span></a>
    </div>
    <h2 class="track-h">Your course<small>Every example from your HungryCoders Java material, explained</small></h2>
    <div class="modules">${track('A')}</div>
    <h2 class="track-h">Interview essentials<small>What interviewers ask beyond the course</small></h2>
    <div class="modules">${track('B')}</div>`;
}

function moduleView(id) {
  const m = moduleById[id];
  if (!m) return notFound();
  const groups = [];
  for (const l of m.lessons) {
    let g = groups.find(x => x.name === l.group);
    if (!g) groups.push(g = { name: l.group, lessons: [] });
    g.lessons.push(l);
  }
  app.innerHTML = `${bar(`${m.icon} ${esc(m.title)}`, '#/')}
    <p class="blurb">${esc(m.blurb)}</p>
    <div class="actions">
      <a class="chip" href="#/map/${id}">🗺️ Mind map</a><a class="chip" href="#/cheat/${id}">📌 Cheat sheet</a>
      <a class="chip" href="#/quiz/${id}">✅ Quiz</a><a class="chip" href="#/cards/${id}">🃏 Flashcards</a>
    </div>
    ${groups.map(g => `${g.name ? `<h3 class="group">${esc(g.name)}</h3>` : ''}<div class="list card">${g.lessons.map(l => `
      <a class="row" href="#/l/${l.id}"><span class="num">${store.done[l.id] ? '✓' : l.index + 1}</span>
        <span class="row-title">${esc(l.title)}</span>${store.bookmarks[l.id] ? '<span>🔖</span>' : ''}<span class="chev">›</span></a>`).join('')}</div>`).join('')}`;
}

function lessonView(id) {
  const l = byId[id];
  if (!l) return notFound();
  const m = moduleById[l.module];
  store.last = id;
  save();
  const { render, inline, diagrams } = makeRenderer();
  const next = m.lessons[l.index + 1] || modules[modules.indexOf(m) + 1]?.lessons[0];
  const best = store.quiz[id];
  const body = s => {
    if (s.name === 'Interview Q&A') return `<p class="hint">Answer out loud first, then open the model answer.</p>` +
      l.qa.map(q => `<details class="qa"><summary><span class="lvl lvl-${q.level.toLowerCase()}">${q.level}</span>${inline(q.q)}</summary>
        <div class="ans">${render(q.a)}</div></details>`).join('');
    if (s.name === 'Quiz') return (best ? `<p class="hint">Last score: ${best.score}/${best.total}</p>` : '') +
      l.quiz.map((q, i) => quizItem(q, render, inline, i + 1)).join('') + '<p class="quiz-score" hidden></p>';
    const html = render(s.md);
    return s.name === 'Diagram' ? html + `<a class="chip recall" href="#/sketch/recall:${id}">🧠 Draw it from memory</a>` : html;
  };
  app.innerHTML = `${bar(esc(l.title), `#/m/${m.id}`, `<button type="button" class="icon-btn" id="bm" aria-label="Bookmark">${store.bookmarks[id] ? '🔖' : '📑'}</button>`)}
    <div class="crumbs">${m.icon} ${esc(m.title)} · Lesson ${l.index + 1} of ${m.lessons.length}</div>
    <nav class="toc">${l.sections.map((s, i) => `<a href="#" data-s="${i}">${SECTION_ICON[s.name] || ''} ${esc(s.name)}</a>`).join('')}</nav>
    ${l.sections.map((s, i) => `<section class="sec card" id="s${i}" data-name="${esc(s.name)}"><h2>${SECTION_ICON[s.name] || ''} ${esc(s.name)}</h2>${body(s)}</section>`).join('')}
    <div class="lesson-end">
      <button type="button" class="btn primary" id="done">${store.done[id] ? '✓ Completed' : 'Mark as complete'}</button>
      ${next ? `<a class="btn" href="#/l/${next.id}">Next: ${esc(next.title)} →</a>` : ''}
    </div>`;

  app.querySelector('.toc').addEventListener('click', e => {
    const a = e.target.closest('a[data-s]');
    if (!a) return;
    e.preventDefault();
    document.getElementById(`s${a.dataset.s}`).scrollIntoView({ behavior: 'smooth' });
  });
  app.querySelector('#bm').addEventListener('click', e => {
    if (store.bookmarks[id]) delete store.bookmarks[id]; else store.bookmarks[id] = Date.now();
    save();
    e.currentTarget.textContent = store.bookmarks[id] ? '🔖' : '📑';
    toast(store.bookmarks[id] ? 'Bookmarked' : 'Bookmark removed');
  });
  app.querySelector('#done').addEventListener('click', e => {
    store.done[id] = Date.now();
    touchStreak();
    save();
    e.currentTarget.textContent = '✓ Completed';
    toast('Lesson complete 🎉');
  });
  const quizSec = [...app.querySelectorAll('.sec')].find(s => s.dataset.name === 'Quiz');
  let score = 0, answered = 0;
  quizSec?.querySelectorAll('.quiz-item').forEach((el, i) => wireQuiz(el, l.quiz[i], ok => {
    score += ok; answered++;
    if (answered === l.quiz.length) {
      store.quiz[id] = { score, total: answered };
      touchStreak();
      save();
      const p = quizSec.querySelector('.quiz-score');
      p.hidden = false;
      p.textContent = `You scored ${score}/${answered}. ${score === answered ? 'Perfect!' : 'Review the explanations above.'}`;
    }
  }));
  app.querySelectorAll('[data-sketch]').forEach(b => b.addEventListener('click', () => { location.hash = `#/sketch/dg:${id}:${b.dataset.sketch}`; }));
  drawDiagrams(app, diagrams);
  if (store.pos[id]) requestAnimationFrame(() => window.scrollTo(0, store.pos[id]));
  return () => { store.pos[id] = window.scrollY; save(); };
}

function mapView(id) {
  const m = id && moduleById[id];
  if (id && !m) return notFound();
  const fix = s => s.replace(/\]\(lesson:/g, '](#/l/');
  const markdown = m ? fix(m.map) : `# ☕ Java Ace\n${modules.map(x => `## [${x.icon} ${x.title}](#/map/${x.id})\n` +
    fix(x.map).split('\n').filter(line => !/^# /.test(line)).map(line => (line.startsWith('#') ? `#${line}` : line)).join('\n')).join('\n')}`;
  app.className = 'full';
  app.innerHTML = `${bar(m ? `🗺️ ${esc(m.title)}` : '🗺️ Mind map of Java', m ? `#/m/${id}` : '#/',
    `<button type="button" class="icon-btn" id="fit" aria-label="Fit to screen">⤢</button>`)}
    <p class="hint map-hint">Tap a node to expand or collapse it · pinch to zoom · tap a title to open it</p>
    <div class="map-wrap"><svg id="mm"></svg></div>`;
  let mm;
  import('./mindmap.js').then(({ showMap }) => {
    mm = showMap(app.querySelector('#mm'), markdown, m ? 3 : 2);
    app.querySelector('#fit').addEventListener('click', () => mm.fit());
  });
  return () => mm?.destroy();
}

function practice() {
  const cards = cardsFor(lessons);
  const learned = cards.filter(c => (store.cards[c.id]?.box || 0) >= 4).length;
  const last = store.sessions[0];
  app.innerHTML = `<header class="top"><div class="brand">🎯 Practice</div></header>
    <div class="card pad">
      <h3>✅ Quiz</h3><p class="muted">10 random questions with explanations.</p>
      <select id="qs">${scopeOptions('all')}</select>
      <button type="button" class="btn primary" id="qgo">Start quiz</button>
    </div>
    <div class="card pad">
      <h3>🃏 Flashcards</h3><p class="muted">Spaced repetition over ${cards.length} interview questions. ${cards.filter(isDue).length} due today, ${learned} learned.</p>
      <select id="cs">${scopeOptions('all')}</select>
      <button type="button" class="btn primary" id="cgo">Study cards</button>
    </div>
    <div class="card pad">
      <h3>🎤 Mock interview</h3><p class="muted">Timed questions, model answers, and a report on your weak areas.${last ? ` Last score: ${last.score}%.` : ''}</p>
      <a class="btn primary" href="#/interview">Start an interview</a>
    </div>
    <div class="card pad">
      <h3>📌 Cheat sheets</h3><p class="muted">One page per module for last-minute revision.</p>
      <div class="actions">${modules.map(m => `<a class="chip" href="#/cheat/${m.id}">${m.icon} ${esc(m.title)}</a>`).join('')}</div>
    </div>`;
  app.querySelector('#qgo').onclick = () => { location.hash = `#/quiz/${app.querySelector('#qs').value}`; };
  app.querySelector('#cgo').onclick = () => { location.hash = `#/cards/${app.querySelector('#cs').value}`; };
}

function quizView(scope) {
  const pool = shuffle(scopeLessons(scope).flatMap(l => l.quiz.map(q => ({ l, q })))).slice(0, 10);
  if (!pool.length) return notFound();
  const { render, inline, diagrams } = makeRenderer();
  let i = 0, score = 0;
  const wrong = [];
  const show = () => {
    if (i === pool.length) {
      touchStreak();
      app.innerHTML = `${bar('Quiz results', '#/practice')}
        <div class="card pad center"><div class="big">${score}/${pool.length}</div><p>${scopeName(scope)}</p>
        <a class="btn primary" href="#/quiz/${scope}" onclick="location.reload()">Another round</a></div>
        ${wrong.length ? `<h3 class="group">Review these lessons</h3><div class="list card">${wrong.map(({ l, q }) => `
          <a class="row" href="#/l/${l.id}"><span class="row-title">${inline(q.title)}<small>${esc(l.title)}</small></span><span class="chev">›</span></a>`).join('')}</div>` : ''}`;
      return;
    }
    const { l, q } = pool[i];
    app.innerHTML = `${bar(`Quiz · ${i + 1}/${pool.length}`, '#/practice')}
      <div class="meter wide"><i style="width:${pct(i, pool.length)}%"></i></div>
      <div class="card pad"><small class="muted">${esc(moduleById[l.module].title)} · ${esc(l.title)}</small>${quizItem(q, render, inline, i + 1)}
      <button type="button" class="btn primary" id="next" hidden>${i + 1 === pool.length ? 'See results' : 'Next question →'}</button></div>`;
    wireQuiz(app.querySelector('.quiz-item'), q, ok => {
      score += ok;
      if (!ok) wrong.push(pool[i]);
      app.querySelector('#next').hidden = false;
    });
    app.querySelector('#next').onclick = () => { i++; show(); window.scrollTo(0, 0); };
    drawDiagrams(app, diagrams);
  };
  show();
}

function cardsView(scope) {
  const all = cardsFor(scopeLessons(scope));
  const due = shuffle(all.filter(isDue));
  const fresh = all.filter(c => !store.cards[c.id]).slice(0, 15);
  const queue = [...due, ...fresh];
  const { render, inline } = makeRenderer();
  let i = 0;
  const show = () => {
    if (i >= queue.length) {
      app.innerHTML = `${bar('Flashcards', '#/practice')}<div class="card pad center"><div class="big">🎉</div>
        <p>${queue.length ? `Session done: ${queue.length} cards reviewed.` : 'Nothing due right now.'}</p>
        <p class="muted">${all.filter(c => store.cards[c.id]).length} of ${all.length} cards started in ${esc(scopeName(scope))}.</p>
        <a class="btn" href="#/practice">Back to practice</a></div>`;
      return;
    }
    const c = queue[i];
    app.innerHTML = `${bar(`Flashcards · ${i + 1}/${queue.length}`, '#/practice')}
      <div class="card pad flash"><small class="muted">${esc(c.l.title)} · <span class="lvl lvl-${c.qa.level.toLowerCase()}">${c.qa.level}</span></small>
        <h3>${inline(c.qa.q)}</h3>
        <button type="button" class="btn primary" id="reveal">Show answer</button>
        <div class="ans" hidden>${render(c.qa.a)}</div></div>
      <div class="rate" hidden>
        <button type="button" class="btn bad" data-r="again">Again</button>
        <button type="button" class="btn" data-r="good">Good</button>
        <button type="button" class="btn good" data-r="easy">Easy</button></div>`;
    app.querySelector('#reveal').onclick = e => {
      e.currentTarget.hidden = true;
      app.querySelector('.ans').hidden = false;
      app.querySelector('.rate').hidden = false;
    };
    app.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
      rateCard(c.id, b.dataset.r);
      if (b.dataset.r === 'again') queue.push(c);
      i++;
      show();
      window.scrollTo(0, 0);
    });
  };
  show();
}

function interviewView() {
  app.innerHTML = `${bar('🎤 Mock interview', '#/practice')}
    <div class="card pad">
      <p>You'll get real interview questions one at a time. Answer out loud as you would in the interview, then compare with the model answer and rate yourself honestly.</p>
      <label>Topics <select id="is">${scopeOptions('all')}</select></label>
      <label>Level <select id="il"><option value="">Mixed</option><option>Basic</option><option>Intermediate</option><option>Advanced</option></select></label>
      <label>Questions <select id="in"><option>5</option><option selected>10</option><option>15</option><option>20</option></select></label>
      <button type="button" class="btn primary" id="igo">Start</button>
    </div>
    ${store.sessions.length ? `<h3 class="group">Past sessions</h3><div class="list card">${store.sessions.slice(0, 8).map(s => `
      <div class="row"><span class="row-title">${esc(s.scope)}<small>${new Date(s.ts).toLocaleString()}</small></span><b>${s.score}%</b></div>`).join('')}</div>` : ''}`;
  app.querySelector('#igo').onclick = () => {
    const scope = app.querySelector('#is').value, level = app.querySelector('#il').value;
    const pool = shuffle(cardsFor(scopeLessons(scope)).filter(c => !level || c.qa.level === level)).slice(0, +app.querySelector('#in').value);
    if (pool.length) runInterview(pool, scopeName(scope) + (level ? ` · ${level}` : ''));
  };
}

function runInterview(pool, label) {
  const { render, inline } = makeRenderer();
  const results = [];
  let i = 0, timer;
  const show = () => {
    clearInterval(timer);
    if (i === pool.length) return report();
    const c = pool[i];
    const start = Date.now();
    app.innerHTML = `${bar(`Question ${i + 1}/${pool.length}`, '#/interview', '<span class="timer" id="t">0:00</span>')}
      <div class="card pad flash"><small class="muted">${esc(moduleById[c.l.module].title)} · <span class="lvl lvl-${c.qa.level.toLowerCase()}">${c.qa.level}</span></small>
        <h3>${inline(c.qa.q)}</h3>
        <button type="button" class="btn primary" id="reveal">I've answered — show model answer</button>
        <div class="ans" hidden>${render(c.qa.a)}</div></div>
      <div class="rate" hidden>
        <button type="button" class="btn bad" data-r="0">❌ Missed</button>
        <button type="button" class="btn" data-r="0.5">🟡 Partly</button>
        <button type="button" class="btn good" data-r="1">✅ Nailed it</button></div>`;
    timer = setInterval(() => {
      const s = Math.floor((Date.now() - start) / 1000);
      const t = document.getElementById('t');
      if (t) t.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; else clearInterval(timer);
    }, 1000);
    app.querySelector('#reveal').onclick = e => {
      clearInterval(timer);
      e.currentTarget.hidden = true;
      app.querySelector('.ans').hidden = false;
      app.querySelector('.rate').hidden = false;
    };
    app.querySelectorAll('[data-r]').forEach(b => b.onclick = () => {
      const r = +b.dataset.r;
      results.push({ c, r, secs: Math.round((Date.now() - start) / 1000) });
      if (r < 1) rateCard(c.id, 'again'); // missed questions come back in flashcards
      i++;
      show();
      window.scrollTo(0, 0);
    });
  };
  const report = () => {
    const score = pct(results.reduce((a, x) => a + x.r, 0), results.length);
    store.sessions.unshift({ ts: Date.now(), scope: label, score });
    store.sessions.length = Math.min(store.sessions.length, 30);
    touchStreak();
    save();
    const byMod = {};
    for (const x of results) (byMod[x.c.l.module] ||= []).push(x.r);
    const weak = results.filter(x => x.r < 1);
    app.innerHTML = `${bar('Interview report', '#/practice')}
      <div class="card pad center"><div class="big">${score}%</div><p>${esc(label)}</p>
        <p class="muted">${score >= 80 ? 'Interview-ready on these topics.' : score >= 50 ? 'Good base — polish the weak spots below.' : 'Revisit the lessons below, then try again.'}</p></div>
      <h3 class="group">By topic</h3><div class="list card">${Object.entries(byMod).map(([mid, rs]) => `
        <a class="row" href="#/m/${mid}"><span class="row-title">${moduleById[mid].icon} ${esc(moduleById[mid].title)}</span><b>${pct(rs.reduce((a, b) => a + b, 0), rs.length)}%</b></a>`).join('')}</div>
      ${weak.length ? `<h3 class="group">Study these again</h3><p class="hint">They were added to your flashcards.</p><div class="list card">${weak.map(x => `
        <a class="row" href="#/l/${x.c.l.id}"><span class="row-title">${inline(x.c.qa.q)}<small>${esc(x.c.l.title)}</small></span><span class="chev">›</span></a>`).join('')}</div>` : ''}
      <a class="btn primary" href="#/interview">New interview</a>`;
  };
  show();
  return () => clearInterval(timer);
}

function cheatView(id) {
  const m = moduleById[id];
  if (!m) return notFound();
  const { render } = makeRenderer();
  const sec = (l, name) => l.sections.find(s => s.name === name)?.md || '';
  app.innerHTML = `${bar(`📌 ${esc(m.title)}`, `#/m/${id}`)}
    <p class="blurb">Cheat sheet — the one-liner, the tricks and the takeaways of every lesson.</p>
    ${m.lessons.map(l => `<section class="card pad cheat"><h3><a href="#/l/${l.id}">${esc(l.title)}</a></h3>
      ${render(sec(l, 'In One Line'))}
      <ul class="takeaways">${l.takeaways.map(t => `<li>${makeRenderer().inline(t)}</li>`).join('')}</ul>
      <details><summary>💡 Tips &amp; tricks</summary>${render(sec(l, 'Tips & Tricks'))}</details></section>`).join('')}`;
}

let searchIndex;
function searchView() {
  searchIndex ||= lessons.map(l => ({ l, text: plainText(l), qs: l.qa.map(q => q.q.toLowerCase()) }));
  app.innerHTML = `${bar('Search', '#/')}
    <input type="search" id="q" placeholder="Search lessons, concepts, interview questions…" autocomplete="off" />
    <div id="res" class="list card"></div>`;
  const input = app.querySelector('#q'), res = app.querySelector('#res');
  const run = () => {
    const q = input.value.trim().toLowerCase();
    if (q.length < 2) { res.innerHTML = '<p class="hint pad">Type at least 2 letters.</p>'; return; }
    const hits = [];
    for (const { l, text, qs } of searchIndex) {
      let score = l.title.toLowerCase().includes(q) ? 100 : 0;
      const qi = qs.findIndex(x => x.includes(q));
      if (qi >= 0) score += 20;
      const at = text.indexOf(q);
      if (at >= 0) score += 5;
      if (!score) continue;
      const snippet = qi >= 0 ? `🎤 ${l.qa[qi].q}` : at >= 0 ? `…${text.slice(Math.max(0, at - 50), at + 80)}…` : moduleById[l.module].title;
      hits.push({ l, score, snippet });
    }
    hits.sort((a, b) => b.score - a.score);
    res.innerHTML = hits.slice(0, 60).map(h => `<a class="row" href="#/l/${h.l.id}"><span class="row-title">${esc(h.l.title)}<small>${esc(h.snippet)}</small></span><span class="chev">›</span></a>`).join('')
      || '<p class="hint pad">No matches.</p>';
  };
  input.addEventListener('input', run);
  input.focus();
  run();
}

// ---------- sketchpad ----------
const SKETCH = 'javaace:sketch:';
function sketchTitle(key) {
  const [kind, rest] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
  if (kind === 'dg') { const i = rest.lastIndexOf(':'); return `${byId[rest.slice(0, i)]?.title || 'Lesson'} — diagram ${+rest.slice(i + 1) + 1}`; }
  if (kind === 'recall') return `${byId[rest]?.title || 'Lesson'} — from memory`;
  return `Board · ${new Date(+rest).toLocaleString()}`;
}
const mermaidBlocks = l => [...l.sections.map(s => s.md).join('\n').matchAll(/^```mermaid\n([\s\S]*?)^```/gm)].map(m => m[1]);

function sketchList() {
  const saved = Object.keys(localStorage).filter(k => k.startsWith(SKETCH)).map(k => {
    let data = {};
    try { data = JSON.parse(localStorage.getItem(k)); } catch { /* ignore */ }
    return { key: k.slice(SKETCH.length), updated: data.updated || 0 };
  }).sort((a, b) => b.updated - a.updated);
  app.innerHTML = `<header class="top"><div class="brand">✏️ Sketchpad</div></header>
    <div class="card pad">
      <p>A full Excalidraw whiteboard that works offline. Draw your own mental maps, redraw lesson diagrams from memory, or open any lesson diagram to annotate it.</p>
      <a class="btn primary" href="#/sketch/board:${Date.now()}">＋ New blank board</a>
    </div>
    <h3 class="group">Your sketches</h3>
    <div class="list card">${saved.map(s => `<div class="row"><a class="row-title" href="#/sketch/${esc(s.key)}">${esc(sketchTitle(s.key))}<small>${new Date(s.updated).toLocaleString()}</small></a>
      <button type="button" class="icon-btn" data-del="${esc(s.key)}" aria-label="Delete">🗑️</button></div>`).join('') || '<p class="hint pad">No sketches yet. Open a lesson diagram and tap “Open in Sketchpad”, or start a blank board.</p>'}</div>`;
  app.querySelectorAll('[data-del]').forEach(b => b.onclick = () => {
    if (!confirm('Delete this sketch?')) return;
    localStorage.removeItem(SKETCH + b.dataset.del);
    sketchList();
  });
}

function sketchView(key) {
  const [kind, rest] = [key.slice(0, key.indexOf(':')), key.slice(key.indexOf(':') + 1)];
  let mermaid = null, reference = [], back = '#/sketch';
  if (kind === 'dg') {
    const i = rest.lastIndexOf(':'), l = byId[rest.slice(0, i)];
    if (!l) return notFound();
    mermaid = mermaidBlocks(l)[+rest.slice(i + 1)];
    back = `#/l/${l.id}`;
  } else if (kind === 'recall') {
    const l = byId[rest];
    if (!l) return notFound();
    reference = mermaidBlocks(l);
    back = `#/l/${l.id}`;
  }
  app.className = 'full sketch';
  tabs.hidden = true;
  app.innerHTML = `${bar(esc(sketchTitle(key)), back, reference.length ? '<button type="button" class="chip" id="ref">👀 Reference</button>' : '')}
    ${kind === 'recall' ? '<p class="hint map-hint">Draw the lesson diagram from memory, then tap Reference to compare.</p>' : ''}
    <div id="board"><p class="hint pad">Loading Excalidraw…</p></div>
    <div id="refpanel" class="refpanel" hidden></div>`;
  let unmount;
  import('./sketch.js').then(async ({ mountSketch }) => {
    unmount = await mountSketch(app.querySelector('#board'), { storageKey: SKETCH + key, mermaid, dark: isDark() });
  });
  const refBtn = app.querySelector('#ref');
  if (refBtn) refBtn.onclick = async () => {
    const panel = app.querySelector('#refpanel');
    panel.hidden = !panel.hidden;
    if (!panel.hidden && !panel.innerHTML) {
      panel.innerHTML = reference.map((_, i) => `<figure class="diagram" data-i="${i}"><div class="dg-render"></div></figure>`).join('');
      drawDiagrams(panel, reference);
    }
  };
  return () => { unmount?.(); tabs.hidden = false; };
}

function meView() {
  const cards = cardsFor(lessons);
  const quizzes = Object.values(store.quiz);
  const bm = Object.keys(store.bookmarks).filter(id => byId[id]);
  const s = store.settings;
  const opt = (name, v, label) => `<button type="button" class="seg${s[name] === v ? ' on' : ''}" data-set="${name}" data-v="${v}">${label}</button>`;
  app.innerHTML = `<header class="top"><div class="brand">👤 Me</div></header>
    <div class="stats">
      <div class="stat card"><b>${doneIn(lessons)}</b><small>lessons done</small></div>
      <div class="stat card"><b>${pct(quizzes.reduce((a, q) => a + q.score, 0), quizzes.reduce((a, q) => a + q.total, 0))}%</b><small>quiz accuracy</small></div>
      <div class="stat card"><b>${cards.filter(c => (store.cards[c.id]?.box || 0) >= 4).length}</b><small>cards learned</small></div>
    </div>
    <h3 class="group">Bookmarks</h3>
    <div class="list card">${bm.map(id => `<a class="row" href="#/l/${id}"><span class="row-title">${esc(byId[id].title)}<small>${esc(moduleById[byId[id].module].title)}</small></span><span class="chev">›</span></a>`).join('') || '<p class="hint pad">Tap 📑 on a lesson to bookmark it.</p>'}</div>
    <h3 class="group">Settings</h3>
    <div class="card pad settings">
      <div>Theme <span class="segs">${opt('theme', 'auto', 'Auto')}${opt('theme', 'light', 'Light')}${opt('theme', 'dark', 'Dark')}</span></div>
      <div>Text size <span class="segs">${opt('font', 0.9, 'S')}${opt('font', 1, 'M')}${opt('font', 1.12, 'L')}${opt('font', 1.25, 'XL')}</span></div>
      <button type="button" class="btn bad" id="reset">Reset all progress</button>
    </div>
    <p class="hint center">Java Ace · ${lessons.length} lessons · ${lessons.reduce((a, l) => a + l.qa.length, 0)} interview questions · ${lessons.reduce((a, l) => a + l.quiz.length, 0)} quiz questions</p>`;
  app.querySelectorAll('[data-set]').forEach(b => b.onclick = () => {
    s[b.dataset.set] = b.dataset.set === 'font' ? +b.dataset.v : b.dataset.v;
    save();
    applyTheme();
    meView();
  });
  app.querySelector('#reset').onclick = () => {
    if (!confirm('Erase lessons done, quiz scores, flashcards and interview history? Sketches are kept.')) return;
    for (const k of ['done', 'bookmarks', 'quiz', 'cards', 'sessions', 'pos', 'streak', 'last']) delete store[k];
    Object.assign(store, { done: {}, bookmarks: {}, quiz: {}, cards: {}, sessions: [], pos: {} });
    save();
    meView();
  };
}

function notFound() {
  app.innerHTML = `${bar('Not found', '#/')}<p class="pad">That page doesn't exist.</p>`;
}

// ---------- router ----------
const ROUTES = [
  [/^\/$/, home], [/^\/m\/([\w-]+)$/, moduleView], [/^\/l\/([\w-]+\/[\w-]+)$/, lessonView],
  [/^\/map(?:\/([\w-]+))?$/, mapView], [/^\/practice$/, practice], [/^\/quiz\/([\w-]+)$/, quizView],
  [/^\/cards\/([\w-]+)$/, cardsView], [/^\/interview$/, interviewView], [/^\/cheat\/([\w-]+)$/, cheatView],
  [/^\/search$/, searchView], [/^\/sketch$/, sketchList], [/^\/sketch\/(.+)$/, sketchView], [/^\/me$/, meView],
];
const TABS = [['#/', '📚', 'Learn', /^\/($|m\/|l\/|cheat|search)/], ['#/map', '🗺️', 'Maps', /^\/map/],
  ['#/practice', '🎯', 'Practice', /^\/(practice|quiz|cards|interview)/], ['#/sketch', '✏️', 'Sketch', /^\/sketch/], ['#/me', '👤', 'Me', /^\/me/]];
let cleanup = null;
function route() {
  const path = decodeURIComponent(location.hash.slice(1)) || '/';
  try { cleanup?.(); } catch { /* ignore */ }
  cleanup = null;
  app.className = '';
  for (const [re, view] of ROUTES) {
    const m = path.match(re);
    if (!m) continue;
    tabs.innerHTML = TABS.map(([href, icon, label, active]) =>
      `<a href="${href}" class="${active.test(path) ? 'on' : ''}"><span>${icon}</span>${label}</a>`).join('');
    window.scrollTo(0, 0);
    cleanup = view(...m.slice(1)) || null;
    return;
  }
  location.replace('#/');
}

document.addEventListener('click', e => {
  const b = e.target.closest('button.copy');
  if (!b) return;
  navigator.clipboard?.writeText(b.closest('.code').querySelector('pre.src').innerText)
    .then(() => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy'; }, 1200); }, () => toast('Copy not allowed here'));
});
window.addEventListener('hashchange', route);
applyTheme();
route();
