---
name: gitanext-architecture
description: Architecture map and ranked problems for gita-next (Bhagavad Gita PWA — Next.js 15 static shell, vanilla-JS scroll-snap reader engine, precaching service worker, localStorage persistence, Netlify). Use when making design decisions in this repo — changing the service worker/cache strategy, chapter data schema, engine rendering/windowing, or offline behavior — or when asked about risks/debt. Details in references/arch-problems.md.
---

# gita-next architecture

verified-as-of: 77ee8db 2026-07-09 · written-for: claude-fable-5 · validated-on: claude-fable-5
Reviewer findings spot-checked by orchestrator (sw.js and engine.js read directly); no separate adversary agent (repo size didn't warrant one).

## System map

- `app/page.jsx` → `app/reader.jsx` (single client component, `booted` ref guard) → `lib/engine.js` (~650 LOC vanilla JS: palettes, windowed feed, expand overlay, index modal, keyboard nav, position tracking).
- Data: `public/data/index.json` + 18 chapter JSONs, lazy-fetched per chapter, cached in-memory (Map) + localStorage (`gita-ch-NN`).
- PWA: `public/sw.js` (23 LOC) precaches everything, cache-first with fallback-to-`/`; `layout.jsx` registers it, errors silently swallowed.
- Deploy: Netlify auto on main push; no env vars, no backend, no logging/analytics.

## Design rules

1. Reader features live in the vanilla engine, not React — the React layer is a mount shell only. A feature PR that adds React state/components to the reading flow is architecture drift.
2. Cache-first SW means **the deploy is not the release** — returning users get updates only when `V` in sw.js changes. Bump it with any content/engine change.
3. All persistence goes through the `store` try/catch wrapper — never call localStorage directly.
4. Optional verse fields (anvaya, explanation, transliteration on ch3–18) render conditionally.
5. Keep total precache small (<3MB target): it downloads on first visit.

## What is sound and must not regress

- Windowed rendering (±6 sections) keeps a ~720-section feed cheap.
- Offline-first: full precache = complete offline reading after first visit.
- `prefers-reduced-motion` support; store wrapper never crashes the app.
- Zero-error delivery history: `pnpm build` gate before every push.

Ranked problems: `references/arch-problems.md`.

## Changelog
- 2026-07-09: created from combined review + orchestrator spot-check.
