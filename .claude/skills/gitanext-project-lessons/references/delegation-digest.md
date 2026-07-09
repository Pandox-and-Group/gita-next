# Working method — gita-next (paste verbatim into every delegation)

written-for: claude-sonnet-5 (12-line budget) · by judge: claude-fable-5 · verified-as-of: 77ee8db 2026-07-09
NOTE: cheap-tier replays could not run (session limit); lines 4–8 are judge predictions
[REASONED] — Phase 6 confirms or retires them.

1. pnpm only. Verify before push: `pnpm build` (the repo's only gate — every clean commit used it).
2. Reader features go in lib/engine.js + app/globals.css (vanilla DOM). No React components/state in the reading flow.
3. Any commit that changes chapter JSON or engine behavior ⇒ bump `V` in public/sw.js in the SAME commit (static cache-first SW; deploys don't reach returning users otherwise).
4. Persistence only via the `store` wrapper (engine.js:103–104); keys: gita-pos/read/marks/tapped/ch-NN. Never raw localStorage.
5. Optional verse fields (anvaya, explanation, transliteration on ch3–18) render conditionally — check presence before emitting HTML.
6. Deep links / startup changes must compose with position-restore (engine.js:305–311) — URL param wins over stored gita-pos, then falls back.
7. Touching the chapter loader (engine.js:83–91) ⇒ add .catch that clears the pending entry and renders retry text; never leave "…" stubs.
8. Keep total precache <3MB; every new asset added to sw.js CORE downloads on first visit.
9. Bug report ⇒ `git log --oneline -- <file>` first; reproduce at HEAD before patching (cross-repo sonnet failure mode).
10. Label claims VERIFIED / REASONED / ASSUMED; quote `pnpm build` output or the claim doesn't count.

## Named review gates (judge pre-commitments)
- Diff adds React state/components to the reader flow ⇒ REJECT (architecture drift).
- Diff changes chapter data or engine without bumping sw.js `V` ⇒ REJECT.
- Raw `localStorage.` call outside the store wrapper ⇒ REJECT.
- Build output not quoted ⇒ REJECT.

## Not handed down
- Taste on the palette/animation system (18 hand-tuned chapter palettes) — visual judgment.
