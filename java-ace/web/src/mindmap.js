// Markmap mind maps, loaded on demand. No plugins, so nothing is fetched from a CDN.
import { Transformer } from 'markmap-lib';
import { Markmap } from 'markmap-view';

const transformer = new Transformer([]);

export function showMap(svg, markdown, level) {
  const { root } = transformer.transform(markdown);
  return Markmap.create(svg, { initialExpandLevel: level, duration: 300, maxWidth: 280, spacingVertical: 10, paddingX: 10 }, root);
}
