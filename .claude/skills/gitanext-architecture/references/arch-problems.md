# gita-next — ranked architecture problems

Combined review 2026-07-09 at HEAD 77ee8db; top claims spot-checked by the orchestrator
against public/sw.js and lib/engine.js. Scores: severity(1-5) × effort(1-5). Sized to a
small hobby PWA.

**Status 2026-11-15:** ranks 1, 2 and 3 are fixed (network-first pages and a retried chapter download in commit a0be9cf; the page's own scripts stored at install and a one-time reload for missing script files in f6d0636). The rest stand as written.

| Rank | Problem | Sev | Effort | Failure scenario | Evidence / verdict |
|---|---|---|---|---|---|
| 1 | **Static SW cache version + cache-first `/`** — deploys don't reach returning visitors | 4 | 2 | User visits Jan 1; ch2 updated Jan 2; user sees old verses AND old app shell indefinitely (`/` is precached and served cache-first) | sw.js:1,14–22 · UPGRADED from sev 3 on spot-check: `/` itself is cache-first, so even hashed Next assets don't save the shell |
| 2 | **Chapter fetch rejection → permanent "…" stub** — no .catch, no retry; pending map entry persists | 3 | 3 | Offline/hiccup while loading a non-prefetched chapter → card stuck on "…" until full reload | engine.js:89–91 · UPHELD |
| 3 | **SW fetch fallback redirects to `/`** on any failed match — loses reading position for non-cached requests | 2 | 1 | Offline miss → user silently served the home shell | sw.js:21 · UPHELD |
| 4 | **Safari Private / quota: store writes silently no-op** — bookmarks/position vanish per reload | 2 | 2 | Private-mode user loses stars + position every session; no hint shown | engine.js:103–104 · DOWNGRADED from 3: try/catch exists, no crash; session-scope state works |
| 5 | **No error observability at all** (SW registration and store errors swallowed) | 2 | 2 | Any breakage invisible until a user complains | layout.jsx:20, engine.js:104 · UPHELD |
| 6 | **`dn()` devanagari mapper passes through non-digits** | 1 | 1 | Malformed `"verse":"47a"` renders "४७a" | engine.js:59–60 · UPHELD (requires bad data) |
| 7 | **Hydration `booted` guard could strand an empty div** on a hydration mismatch | 1 | 1 | Edge-case Next 15 mismatch → blank app until refresh | reader.jsx:8–10 · DOWNGRADED: Next auto-recovers in practice |
| 8 | **Dark-only palettes ignore prefers-color-scheme** | 1 | 2 | Light-mode OS chrome vs dark app — cosmetic | globals.css · UPHELD (design choice) |
| 9 | **Ch 3–18 unconditional field rendering** — blank sections if optional fields absent | 1 | 1 | Missing transliteration → empty line in card | engine.js:124 · UPHELD (render conditionally when touched) |

## Short remediation plan

1. Version the SW cache per deploy: `const V = 'gita-' + BUILD_ID` (inject at build) or bump manually with every content commit; add `self.addEventListener('message')` skip-waiting handshake so returning tabs refresh. ~1h. **This is the only urgent item.**
2. `.catch` on the chapter fetch: clear the pending entry, render a "tap to retry" line. ~1h.
3. Change SW fallback from `caches.match('/')` to a proper offline response for non-navigation requests. ~30min.

Everything else: cosmetic/backlog for a hobby app.
