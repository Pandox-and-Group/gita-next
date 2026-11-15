# gita-next rules (mined 2026-07-09)

<!-- distill:start -->
1. pnpm; gate every push on `pnpm build`.
2. Reader features live in lib/engine.js + app/globals.css — no React state in the reading flow.
3. Changing chapter JSON, engine or `public/remind.js` ⇒ bump `V` in public/sw.js in the same commit.
4. Persistence only via the engine's `store` wrapper.
Subagents: paste .claude/skills/gitanext-project-lessons/references/delegation-digest.md verbatim into every delegation.
<!-- distill:end -->

## Since November 2026

- A push to `main` deploys to https://gita.rpandox.com (CI builds the image, the server pulls it). Read
  `docs/DEPLOY.md` before touching `deploy/`, `Dockerfile`, `nginx.conf` or the workflow.
- The verse data was audited against outside sources; `docs/AUDIT.md` says what is verified and what is not. Do not
  add an attribution ("Shankara says…", "the tradition holds…") without a source in hand.
- Readers' own data (plan, place, saved shlokas, streak) must survive every update: add fields, never rename or
  reuse a storage key, and keep `gita-state` out of the service worker's cache clean-up. README, "Reading plan".
- The repository is public: no server addresses, keys or personal details in commits.
