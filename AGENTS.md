# gita-next rules (mined 2026-07-09)

<!-- distill:start -->
1. pnpm; gate every push on `pnpm build`.
2. Reader features live in lib/engine.js + app/globals.css — no React state in the reading flow.
3. Changing chapter JSON or engine ⇒ bump `V` in public/sw.js in the same commit.
4. Persistence only via the engine's `store` wrapper.
Subagents: paste .claude/skills/gitanext-project-lessons/references/delegation-digest.md verbatim into every delegation.
<!-- distill:end -->
