// Pure lesson parser, shared by the app and tools/verify.mjs (no DOM here).

export const SECTIONS = ['In One Line', 'Mental Model', 'Concept', 'Diagram', 'Code', 'Walkthrough',
  'Traps', 'Tips & Tricks', 'Interview Q&A', 'Quiz', 'Takeaways'];
export const LEVELS = ['Basic', 'Intermediate', 'Advanced'];

export function frontMatter(src) {
  const m = src.replace(/\r/g, '').match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: {}, body: src };
  const meta = {};
  for (const line of m[1].split('\n')) {
    const i = line.indexOf(':');
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  return { meta, body: src.slice(m[0].length) };
}

// Walks lines, telling the callback whether each line is inside a fenced code block.
function eachLine(md, fn) {
  let fence = null;
  for (const line of md.split('\n')) {
    const f = line.match(/^\s*(`{3,}|~{3,})/);
    if (fence) {
      fn(line, true);
      if (f && f[1][0] === fence[0] && f[1].length >= fence.length && !line.trim().slice(f[1].length)) fence = null;
    } else {
      if (f) fence = f[1];
      fn(line, !!f);
    }
  }
}

// Splits Markdown at headings of `level`, ignoring headings inside code fences.
// Returns [{ title, body }]; the first entry (title null) is whatever precedes the first heading.
export function splitHeadings(md, level) {
  const mark = '#'.repeat(level) + ' ';
  const out = [];
  let cur = { title: null, lines: [] };
  eachLine(md, (line, code) => {
    if (!code && line.startsWith(mark)) {
      out.push(cur);
      cur = { title: line.slice(mark.length).trim(), lines: [] };
    } else cur.lines.push(line);
  });
  out.push(cur);
  return out.map(s => ({ title: s.title, body: s.lines.join('\n').trim() }));
}

function parseQuizItem(title, body) {
  const q = [], options = [], explain = [];
  eachLine(body, (line, code) => {
    const o = !code && line.match(/^- \[( |x|X)\] (.*)$/);
    const e = !code && line.match(/^> ?(.*)$/);
    if (o) options.push({ text: o[2].trim(), correct: o[1] !== ' ' });
    else if (e && options.length) explain.push(e[1]);
    else q.push(line);
  });
  return { title, body: q.join('\n').trim(), options, explain: explain.join('\n').trim() };
}

export function parseLesson(id, src) {
  const { meta, body } = frontMatter(src.replace(/\r/g, ''));
  const errors = [];
  const parts = splitHeadings(body, 2);
  const sections = parts.slice(1).map(p => ({ name: p.title, md: p.body }));
  const names = sections.map(s => s.name);
  if (names.join('|') !== SECTIONS.join('|'))
    errors.push(`sections must be exactly: ${SECTIONS.join(', ')} — found: ${names.join(', ')}`);
  if (parts[0].body) errors.push('text found before the first ## section');
  if (!meta.title) errors.push('front matter needs a title');
  const sec = name => sections.find(s => s.name === name)?.md || '';

  const qa = splitHeadings(sec('Interview Q&A'), 3).slice(1).map(p => {
    const m = p.title.match(/^\[(\w+)\]\s*(.+)$/);
    if (!m || !LEVELS.includes(m[1])) errors.push(`Q&A "${p.title}" must start with [Basic], [Intermediate] or [Advanced]`);
    if (!p.body) errors.push(`Q&A "${p.title}" has no answer`);
    return { level: m ? m[1] : 'Basic', q: m ? m[2] : p.title, a: p.body };
  });
  const quiz = splitHeadings(sec('Quiz'), 3).slice(1).map(p => parseQuizItem(p.title, p.body));
  quiz.forEach(item => {
    const right = item.options.filter(o => o.correct).length;
    if (item.options.length < 2 || right !== 1) errors.push(`quiz "${item.title}" needs 2+ options with exactly one [x]`);
    if (!item.explain) errors.push(`quiz "${item.title}" needs a > explanation`);
  });
  const takeaways = sec('Takeaways').split('\n').filter(l => /^[-*] /.test(l)).map(l => l.slice(2).trim());
  const examples = [...body.matchAll(/^@example\s+(\S+)\s*$/gm)].map(m => m[1]);

  if (sections.length === SECTIONS.length) {
    if (qa.length < 5) errors.push(`only ${qa.length} interview questions (need 5+)`);
    if (quiz.length < 4) errors.push(`only ${quiz.length} quiz questions (need 4+)`);
    if (takeaways.length < 3) errors.push(`only ${takeaways.length} takeaways (need 3+)`);
    if (!/```mermaid/.test(sec('Diagram'))) errors.push('Diagram section needs a ```mermaid block');
    if (!examples.length && !/```java/.test(sec('Code'))) errors.push('Code section needs @example or a ```java block');
  }
  return { id, module: id.split('/')[0], title: meta.title || id, group: meta.group || '', sections, qa, quiz, takeaways, examples, errors };
}

export function parseModule(id, src) {
  const { meta, body } = frontMatter(src.replace(/\r/g, ''));
  const errors = ['title', 'icon', 'blurb'].filter(k => !meta[k]).map(k => `_module.md needs ${k}`);
  return { id, title: meta.title || id, icon: meta.icon || '📘', blurb: meta.blurb || '', track: id[0].toUpperCase(), map: body.trim(), errors };
}
