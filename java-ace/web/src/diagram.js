// Mermaid, loaded on demand, drawn in Excalidraw's hand-drawn style.
import mermaid from 'mermaid';
import { esc } from './content.js';

let theme = null, n = 0;

export async function renderDiagrams(root, codes, dark) {
  if (theme !== dark) {
    mermaid.initialize({
      startOnLoad: false,
      look: 'handDrawn',
      handDrawnSeed: 7,
      theme: dark ? 'dark' : 'neutral',
      fontFamily: 'Virgil, "Comic Sans MS", cursive',
      securityLevel: 'strict',
    });
    theme = dark;
  }
  await document.fonts.load('16px Virgil').catch(() => {});
  for (const fig of root.querySelectorAll('figure.diagram')) {
    const box = fig.querySelector('.dg-render');
    const code = codes[+fig.dataset.i];
    const id = `dg${++n}`;
    try {
      box.innerHTML = (await mermaid.render(id, code)).svg;
      // Wide diagrams would shrink to unreadable text on a phone; keep them at >= 70% size and let them scroll.
      const svg = box.querySelector('svg');
      const natural = parseFloat(svg.style.maxWidth) || svg.viewBox.baseVal?.width || 0;
      if (natural * 0.7 > box.clientWidth) Object.assign(svg.style, { width: `${natural * 0.7}px`, maxWidth: 'none' });
    } catch {
      document.getElementById(`d${id}`)?.remove(); // Mermaid leaves its error graphic in <body>
      box.innerHTML = `<pre class="dg-error">${esc(code)}</pre>`;
    }
  }
}
