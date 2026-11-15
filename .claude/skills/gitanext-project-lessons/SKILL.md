---
name: gitanext-project-lessons
description: Environment facts, working recipes, and risk notes for gita-next (rpandox/gita-next — Bhagavad Gita PWA at bhagawadgita.netlify.app; Next.js 15 shell + vanilla-JS engine in lib/engine.js, static chapter JSON, service worker, localStorage persistence). Use when working in this repo — adding features to the reader engine, touching public/sw.js or chapter data, debugging stale content after deploy, bookmarks/position not persisting, or verse cards stuck on "…".
---

# gita-next project lessons

Repo: `rpandox/gita-next` · verified-as-of: 77ee8db 2026-07-09 ·
written-for: claude-fable-5 · validated-on: claude-fable-5

## Environment facts (VERIFIED at 77ee8db)

- **pnpm** repo. Next.js 15 + React 19, but the app is ONE client component (`app/reader.jsx`) mounting a ~650-line **vanilla-JS engine** (`lib/engine.js`). No API routes; fully static.
- New features go into `lib/engine.js` + `app/globals.css` — every shipped feature (splash, bookmarks, verse grid) was a 2-file change. Do NOT introduce React components/state for reader features; the engine owns the DOM.
- Data: `public/data/index.json` + `chapter-01..18.json` (~1.6MB). Chapters 1–2 fully enriched (anvaya/explanation); 3–18 base verse + Sivananda translation only — render optional fields conditionally.
- Persistence (all via the try/catch `store` wrapper, engine.js:103–104): `gita-pos` (position), `gita-read` (chapter-end read set), `gita-marks` (bookmarks "ch:verse"), `gita-tapped` (hint), `gita-ch-NN` (chapter JSON cache).
- Rendering: windowed scroll-snap feed ±6 sections of ~720 (engine.js:152–157); 18 hardcoded chapter palettes animate CSS variables; `prefers-reduced-motion` respected.
- SW: `public/sw.js`, static cache version `gita-v1`, precaches ALL chapter JSON + fonts, cache-first for every GET incl. `/`.
- Deploy: Netlify auto-build on main push (`pnpm build`, publish `.next`, @netlify/plugin-nextjs) → https://bhagawadgita.netlify.app/.

## Recipes that worked (2 sessions, 0 tool errors, 4 clean commits)

- Feature flow: read engine.js section for the touched behavior → implement in engine.js + globals.css → `pnpm build` (gate: "Build passes") → commit with feature breakdown → push main (auto-deploys).
- Bootstrap flow (commit f126360): .gitignore FIRST (node_modules, .next, *.woff2 exclusions verified before commit) → gh repo create → push → README live-link + netlify.toml.

## Known risks (see gitanext-architecture → references/arch-problems.md)

1. **Stale deploys:** `gita-v1` static SW version + cache-first `/` ⇒ returning visitors can stay on old HTML/data indefinitely. If/then: ANY deploy that changes chapter JSON or engine behavior ⇒ bump `V` in public/sw.js (or derive from build hash) in the same commit.
2. Chapter fetch rejection leaves "…" stubs forever (engine.js:89–91 has no .catch) — add retry/error text if touching the loader.
3. Safari Private: store writes silently no-op — bookmarks/position vanish per reload (by design of the wrapper; don't "fix" by removing the try/catch).

## Changelog
- 2026-07-09: created from full-history distill (2 sessions, 4 commits, 0 incidents — success-mining + review).
