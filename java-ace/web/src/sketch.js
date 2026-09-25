// Excalidraw whiteboard, loaded on demand. Lesson diagrams arrive as Mermaid and become editable shapes.
import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { Excalidraw, convertToExcalidrawElements } from '@excalidraw/excalidraw';
import '@excalidraw/excalidraw/index.css';

window.EXCALIDRAW_ASSET_PATH = new URL('./', location.href).href; // fonts ship inside the app

export async function mountSketch(el, { storageKey, mermaid, dark }) {
  let saved;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { saved = null; }

  let timer, pending = null;
  const flush = () => {
    if (!pending) return;
    const [elements, appState, files] = pending;
    pending = null;
    const live = elements.filter(e => !e.isDeleted);
    if (!live.length && !localStorage.getItem(storageKey)) return; // don't save untouched blank boards
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        elements: live, files, updated: Date.now(),
        appState: { viewBackgroundColor: appState.viewBackgroundColor },
      }));
    } catch { /* storage full */ }
  };
  const onChange = (...args) => {
    pending = args;
    clearTimeout(timer);
    timer = setTimeout(flush, 500);
  };

  let gotApi;
  const apiReady = new Promise(r => { gotApi = r; });
  el.innerHTML = '';
  const root = createRoot(el);
  root.render(createElement(Excalidraw, {
    excalidrawAPI: gotApi,
    initialData: saved ? { elements: saved.elements, files: saved.files || {}, appState: saved.appState } : null,
    theme: dark ? 'dark' : 'light',
    onChange,
    // Downloads don't work inside the Android WebView, so hide the file/export actions; boards autosave.
    UIOptions: { canvasActions: { loadScene: false, saveToActiveFile: false, export: false, saveAsImage: false } },
  }));

  const api = await apiReady;
  if (!saved && mermaid) {
    // Text is measured during conversion, so Excalidraw's hand-drawn font must be loaded first.
    await document.fonts.load('20px Excalifont').catch(() => {});
    try {
      const { parseMermaidToExcalidraw } = await import('@excalidraw/mermaid-to-excalidraw');
      const { elements, files } = await parseMermaidToExcalidraw(mermaid, { themeVariables: { fontSize: '18px' } });
      if (files) api.addFiles(Object.values(files));
      api.updateScene({ elements: convertToExcalidrawElements(elements) });
    } catch { /* unsupported diagram type: start from a blank board */ }
  }
  requestAnimationFrame(() => api.scrollToContent(undefined, { fitToContent: true }));
  return () => { clearTimeout(timer); flush(); root.unmount(); };
}
