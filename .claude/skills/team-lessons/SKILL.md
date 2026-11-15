---
name: team-lessons
description: Append-only lesson ledger for gita-next — captured mistakes/corrections in symptom → wrong-instinct → correct-move form. Consult when a bug feels familiar; append via /capture-lesson. Consolidation promotes entries to the project skills; never overwrite existing entries.
---

# Team lessons (append-only)

## 2026-07-09 — full-history distill run

No incidents mined (2 sessions, 0 tool errors, 0 user corrections — clean feature sprint).
Seed entries below come from the architecture review + orchestrator judgment; they are
predictions to confirm or retire, not observed failures.

- **Symptom:** "I deployed but users still see the old version" (or: new verses not appearing for returning visitors).
  **Wrong instinct:** debug Netlify build/cache settings.
  **Correct move:** bump `V` in public/sw.js — the static `gita-v1` cache-first SW serves the old shell + data until the version changes.
  **Why:** [REASONED — sev-4 arch problem #1, not yet observed in the wild]
  <sub>evidence: sw.js:1,14–22 · verified-as-of: 77ee8db 2026-07-09 · written-for: any · validated-on: claude-fable-5 · hits: 0 (prediction)</sub>

- **Symptom:** feature request for the reader (share, settings, new card content).
  **Wrong instinct:** add React components/hooks — it's a Next.js app after all.
  **Correct move:** implement in lib/engine.js + app/globals.css (vanilla DOM); every shipped feature was a 2-file change there. React layer is a mount shell only.
  <sub>evidence: commits 77ee8db, 92c1355 (2-file changes) · verified-as-of: 77ee8db · written-for: claude-sonnet-5 · validated-on: claude-fable-5 · hits: 0 (prediction)</sub>
