# गीता — a sacred book you scroll through

**Live:** https://gita.rpandox.com/

A mobile-first reader for the Bhagavad Gita: one shloka per screen, scroll-snap
vertical feed, tap to unfold meaning, chapter-end interstitials, quiet progress.
No accounts, no gamification. Reading position persists in localStorage.

The chapter index (tap the footer) expands each chapter into a grid of verse
numbers — jump straight to any shloka, not just the chapter start.

## Run

```bash
pnpm install
pnpm dev         # http://localhost:3000
pnpm build && pnpm start
```

(`npm` works too — substitute `npm run dev` etc.)

## Deploy

Runs at https://gita.rpandox.com on the Pandox server as a small nginx container. Every push to `main` is checked,
built into an image and deployed by CI (`.github/workflows/ci.yml`); the server side lives in `deploy/`. How it
works, how to roll back and how it was installed: [docs/DEPLOY.md](docs/DEPLOY.md).

```bash
docker build -t gita-next . && docker run --rm -p 3400:3400 gita-next   # the production image, locally
```

Installable as a PWA; `public/sw.js` stores all 18 chapter files, the fonts and the page's own scripts for fully
offline reading after the first visit. From a reader's second visit the app offers to install itself.

## Structure

- `lib/engine.js` — the reader engine (palettes, abstract chapter forms,
  scroll-snap feed with windowed rendering, ink-bloom expand overlay,
  chapter index, position/read-state persistence). Mounted by the
  `app/reader.jsx` client component.
- `app/globals.css` — design system: 18 chapter palettes via CSS variables,
  Tiro Devanagari Sanskrit embedded from `/public/fonts`.
- `public/data/index.json` — chapter meta (name, meaning, teaching,
  3 reflection questions, verse counts).
- `public/data/chapter-NN.json` — canonical verse data, lazy-loaded per chapter.

## Verse schema (`chapter-NN.json → verses[]`)

```json
{
  "chapter": 2, "verse": 47,
  "speaker": "श्रीभगवानुवाच",            // उवाच rubric, or null
  "devanagari": "…", "transliteration": "…",   // IAST
  "hook": "the question this verse answers",
  "essence": "one line shown on the card",
  "translation": "Swami Sivananda",
  "explanation": "…",                      // व्याख्या
  "views": [{ "lens": "advaita", "text": "…" }],   // दृष्टिभेद, see lenses below
  "refs": [{ "source": "Kaṭha Upaniṣad 1.2.18", "note": "…" }],  // optional
  "connection": "…", "reflection": "…", "background": "…",
  "anvaya": [{ "word": "कर्मणि", "iast": "karmaṇi", "meaning": "in action",
               "base": "कर्मन् · action, deed",
               "form": "noun, neuter, locative singular (in/on)",
               "parts": "compounds only" }],
  "checked": "SGV",                        // editions the text matches: Supersite, GRETIL critical ed., Vedicscriptures
  "text_note": "variant reading or data note"   // optional
}
```

Lenses: `advaita` (Śaṅkara), `vishishtadvaita` (Rāmānuja), `shaiva` (Abhinavagupta),
`bhakti` (Śrīdhara), `practice` (Sivananda), `bhaktiyoga` (Mukundananda). Labels live in
`LENS` in `lib/engine.js`.

The teaching overlay has two tabs: **teaching** (hook, translation, explanation, ways of
seeing, scriptures cited, thread, reflection, background, sources) and **word by word**.
All fields except the four on the card are optional and the reader skips what is missing.
After changing anything in `public/data`, bump `V` in `public/sw.js`.

## Sources and audit

All 701 verses were audited in November 2026: text against three editions, teachings
against the classical commentaries. Method, sources, every correction and what is still
unverified are in [docs/AUDIT.md](docs/AUDIT.md).

- Verse text and transliteration: vedicscriptures/bhagavad-gita dataset, corrected against
  Gita Supersite (IIT Kanpur) and the BORI critical edition (GRETIL).
- Translation: Swami Sivananda.
- Ways of seeing: paraphrased from Śaṅkara, Rāmānuja, Abhinavagupta, Śrīdhara, Sivananda
  and Swami Mukundananda (holy-bhagavad-gita.org), each credited on the card.
- Hooks, essence lines, explanations, threads, reflections and word notes: written for this app.
