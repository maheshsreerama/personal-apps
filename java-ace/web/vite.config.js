import { defineConfig } from 'vite';
import { cpSync } from 'node:fs';

// Excalidraw loads its hand-drawn fonts at runtime from EXCALIDRAW_ASSET_PATH; ship them offline
// (all but the 13 MB CJK fallback font).
for (const f of ['Assistant', 'Cascadia', 'ComicShanns', 'Excalifont', 'Liberation', 'Lilita', 'Nunito', 'Virgil'])
  cpSync(`node_modules/@excalidraw/excalidraw/dist/prod/fonts/${f}`, `public/fonts/${f}`, { recursive: true });

export default defineConfig({
  base: './',
  define: { 'process.env.IS_PREACT': JSON.stringify('false') },
  server: { fs: { allow: ['..'] } },
  build: {
    outDir: '../android/app/src/main/assets/www',
    emptyOutDir: true,
    chunkSizeWarningLimit: 6000,
  },
});
