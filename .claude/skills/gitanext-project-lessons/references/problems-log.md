# gita-next — problems log

Mined 2026-07-09 from 2 sessions (2026-06-16, ~790KB) + 4 commits at HEAD 77ee8db.

## Incidents

**None.** Both sessions completed with zero `is_error:true` tool results, zero
frustration-lexicon hits, zero user corrections, and 4 clean pushes to main.
(grep evidence: `grep -c '"is_error":true'` = 0 across both JSONLs.)

## Success catalog (what to repeat)

1. **Feature sprint pattern (commits 77ee8db, 92c1355):** every feature = lib/engine.js + app/globals.css only. Design localStorage schema → implement in vanilla engine → `pnpm build` gate → commit with feature breakdown → push (Netlify auto-deploys). Both features landed first-try.
2. **Bootstrap pattern (f126360, 0cf05c0):** .gitignore written and VERIFIED before the initial commit (node_modules, .next, *.woff2, .env all excluded — checked, not assumed) → `gh repo create` → push → README live-link + netlify.toml in a follow-up commit.
3. **Build-gate discipline:** "Build passes. Done." preceded every push (session 2ff20c12#123,189).

## Risks carried forward (from review, not incidents)

The top item — static `gita-v1` SW version + cache-first `/` means deploys don't
reach returning visitors — is the one most likely to become this repo's first
real incident. See gitanext-architecture references/arch-problems.md rank 1.

## Meta-lesson

This repo is the control group: small scope + one-engine architecture + a single
verify gate (`pnpm build`) produced a zero-incident history. When sibling repos
add rules, this is what the rules are trying to reproduce.
