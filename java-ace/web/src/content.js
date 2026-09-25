// Loads every lesson, module, original example and recorded output at build time, and renders lesson Markdown.
import { Marked } from 'marked';
import hljs from 'highlight.js/lib/core';
import java from 'highlight.js/lib/languages/java';
import xml from 'highlight.js/lib/languages/xml';
import bash from 'highlight.js/lib/languages/bash';
import { parseLesson, parseModule } from './parse.js';

hljs.registerLanguage('java', java);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('bash', bash);
hljs.registerAliases(['shell', 'sh', 'console'], { languageName: 'bash' });

const raw = o => Object.fromEntries(Object.entries(o).map(([k, v]) => [k.replace(/^(\.\.\/)+/, ''), v]));
const lessonFiles = raw(import.meta.glob('../../content/*/[0-9]*.md', { query: '?raw', import: 'default', eager: true }));
const moduleFiles = raw(import.meta.glob('../../content/*/_module.md', { query: '?raw', import: 'default', eager: true }));
const sources = raw(import.meta.glob('../../source-material/**/*', { query: '?raw', import: 'default', eager: true }));
const outputs = raw(import.meta.glob('../../outputs/**/*.txt', { query: '?raw', import: 'default', eager: true }));
const varies = new Set(Object.keys(raw(import.meta.glob('../../outputs/**/*.varies', { query: '?raw', eager: true }))));

export const modules = [];
export const lessons = [];
export const byId = {};

for (const path of Object.keys(moduleFiles).sort()) {
  const id = path.split('/')[1];
  modules.push({ ...parseModule(id, moduleFiles[path]), lessons: [] });
}
for (const path of Object.keys(lessonFiles).sort()) {
  const [, mod, file] = path.split('/');
  const lesson = parseLesson(`${mod}/${file.slice(0, -3)}`, lessonFiles[path]);
  let m = modules.find(x => x.id === mod);
  if (!m) modules.push(m = { ...parseModule(mod, ''), lessons: [] });
  lesson.index = m.lessons.length;
  m.lessons.push(lesson);
}
modules.sort((a, b) => a.id.localeCompare(b.id));
for (const m of modules) for (const l of m.lessons) { lessons.push(l); byId[l.id] = l; }
export const moduleById = Object.fromEntries(modules.map(m => [m.id, m]));

// ---------- Markdown ----------
export const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function highlight(code, lang) {
  if (lang && hljs.getLanguage(lang)) return hljs.highlight(code, { language: lang }).value;
  return esc(code);
}

function codeBlock(code, lang, numbered) {
  code = code.replace(/\n+$/, '');
  const gutter = numbered ? `<pre class="gutter" aria-hidden="true">${code.split('\n').map((_, i) => i + 1).join('\n')}</pre>` : '';
  return `<div class="code${numbered ? ' numbered' : ''}">${gutter}<pre class="src"><code class="hljs lang-${esc(lang || 'text')}">${highlight(code, lang)}</code></pre><button class="copy" type="button" aria-label="Copy code">Copy</button></div>`;
}

const CALLOUTS = { TIP: '💡 Tip', WARNING: '⚠️ Watch out', ERRATA: '🐞 Errata — fix in the original', NOTE: '📝 Note', INTERVIEW: '🎤 Say this in the interview' };

export function exampleHtml(path) {
  const src = sources[`source-material/${path}`];
  if (src == null) return `<p class="error">Missing example ${esc(path)}</p>`;
  const base = path.replace(/\.[^.]+$/, '');
  const out = outputs[`outputs/${base}.txt`];
  const lang = path.endsWith('.xml') ? 'xml' : 'java';
  let html = `<div class="example"><div class="ex-head">📄 ${esc(path)}<span>from your course</span></div>${codeBlock(src, lang, true)}`;
  if (out != null) {
    const varying = varies.has(`outputs/${base}.varies`);
    html += `<details class="predict"><summary>🤔 Predict the output, then tap to reveal</summary>
      <div class="out-label">Real output (JDK 21)${varying ? ' — <b>changes between runs</b>' : ''}</div>
      ${out.trim() ? codeBlock(out, 'output') : '<p class="muted">This program prints nothing.</p>'}</details>`;
  }
  return html + '</div>';
}

export function makeRenderer() {
  const diagrams = [];
  const md = new Marked({
    gfm: true,
    renderer: {
      code({ text, lang }) {
        lang = (lang || '').trim().split(/\s/)[0];
        if (lang === 'mermaid') {
          diagrams.push(text);
          return `<figure class="diagram" data-i="${diagrams.length - 1}"><div class="dg-render"><span class="muted">Drawing…</span></div>
            <figcaption><button type="button" class="chip" data-sketch="${diagrams.length - 1}">✏️ Open in Sketchpad</button></figcaption></figure>`;
        }
        return codeBlock(text, lang, false);
      },
      blockquote({ tokens }) {
        const html = this.parser.parse(tokens);
        const m = html.match(/^<p>\[!(\w+)\]\s*/);
        if (m && CALLOUTS[m[1]]) return `<aside class="callout c-${m[1].toLowerCase()}"><b>${CALLOUTS[m[1]]}</b><p>${html.slice(m[0].length)}</aside>`;
        return `<blockquote>${html}</blockquote>`;
      },
      link({ href, tokens }) {
        const text = this.parser.parseInline(tokens);
        if (href.startsWith('lesson:')) return `<a href="#/l/${esc(href.slice(7))}">${text}</a>`;
        return `<a href="${esc(href)}" target="_blank" rel="noopener">${text}</a>`;
      },
      table(token) {
        return `<div class="table-wrap">${defaultTable.call(this, token)}</div>`;
      },
    },
  });
  // Swap `@example path` lines for the example block before Markdown sees them.
  const render = src => md.parse(src.replace(/^@example\s+(\S+)\s*$/gm, (_, p) => `\n<div class="ex-slot" data-path="${esc(p)}"></div>\n`))
    .replace(/<div class="ex-slot" data-path="([^"]+)"><\/div>/g, (_, p) => exampleHtml(p.replace(/&amp;/g, '&')));
  return { render, inline: s => md.parseInline(s), diagrams };
}

function defaultTable(token) {
  const cell = (c, tag) => `<${tag}${c.align ? ` style="text-align:${c.align}"` : ''}>${this.parser.parseInline(c.tokens)}</${tag}>`;
  return `<table><thead><tr>${token.header.map(c => cell(c, 'th')).join('')}</tr></thead><tbody>${
    token.rows.map(r => `<tr>${r.map(c => cell(c, 'td')).join('')}</tr>`).join('')}</tbody></table>`;
}

// Plain text of a lesson for search.
export function plainText(l) {
  return (l.title + '\n' + l.sections.map(s => s.md).join('\n'))
    .replace(/```[\s\S]*?```/g, ' ').replace(/[#>*`_|\[\]()-]+/g, ' ').replace(/\s+/g, ' ').toLowerCase();
}
