// Fails the build when public/data disagrees with what lib/engine.js reads.
import { readFileSync } from 'node:fs';
const read = f => JSON.parse(readFileSync(new URL(`../public/data/${f}`, import.meta.url)));
const meta = read('index.json');
const bad = [];
const LENSES = ['advaita', 'vishishtadvaita', 'shaiva', 'bhakti', 'practice', 'bhaktiyoga']; // keep in step with LENS in lib/engine.js
if (meta.length !== 18) bad.push(`index.json has ${meta.length} chapters, expected 18`);
for (const m of meta) {
  if (!m.name || !m.teaching || !Array.isArray(m.reflections)) bad.push(`index.json chapter ${m.chapter}: missing name/teaching/reflections`);
  const vs = read(`chapter-${String(m.chapter).padStart(2, '0')}.json`).verses;
  if (vs.length !== m.verses_count) bad.push(`chapter ${m.chapter}: ${vs.length} verses, index says ${m.verses_count}`);
  vs.forEach((v, i) => {
    if (v.verse !== i + 1) bad.push(`chapter ${m.chapter}: position ${i + 1} holds verse ${v.verse}`);
    for (const w of v.views || []) if (!LENSES.includes(w.lens)) bad.push(`chapter ${m.chapter} verse ${v.verse}: unknown lens ${w.lens}`);
    for (const k of ['devanagari', 'transliteration', 'essence', 'translation'])
      if (v[k] == null) bad.push(`chapter ${m.chapter} verse ${v.verse}: missing ${k}`);
  });
}
if (bad.length) { console.error(bad.join('\n')); process.exit(1); }
console.log(`data ok: ${meta.length} chapters`);
