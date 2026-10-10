# Roadmap — what to add next

Prioritised, with the "why" and the rough shape of each change. Items marked ✅ are already done.

---

## Done in this pass ✅

- 🔒 Secrets out of the repo (`.env` untracked, `.env.example`, SECURITY.md, credentials removed
  from `LoginPage.tsx`)
- 🔍 Real search engine: tokenised + fuzzy + intent tags, faceted filters, 5 sort orders,
  shareable URLs, highlighting, `/` shortcut, recent searches
- ❤️ Favourites/shortlist with cross-tab sync and its own page
- 🤖 AI assistant rewritten: no deprecated SDK, current model, conversation history, timeouts,
  proxy support, **offline fallback** so it works with no key
- 🧭 404 page, ErrorBoundary, route-level code splitting, ScrollToTop, dynamic titles
- ♿ Accessibility: skip link, focus rings, ARIA states, `aria-live` results, reduced-motion support
- 📈 SEO: meta/OG/JSON-LD, favicon, robots.txt, sitemap.xml
- 🧪 87 unit tests including **dataset-integrity** checks; CI on every push/PR
- 📦 `/data/projects.json` static API generated at build time
- 📚 README, CONTRIBUTING, SECURITY, LICENSE (MIT), deployment guide, issue/PR templates
- 🚀 GitHub Pages deep-link support, Dockerfile + nginx.conf

---

## P0 — before this is a real product

### 1. Live metadata instead of hand-typed numbers ⭐ biggest credibility win
Stars and "last updated" are currently typed by hand and go stale in weeks.

- Add `scripts/sync-metadata.mjs` that reads each `link`, resolves the repo
  (`GET https://api.github.com/repos/{owner}/{repo}`, Hugging Face API, F-Droid API) and rewrites
  `stars`, `lastUpdated`, `license`, `archived`.
- Run it in CI on a schedule (`on: schedule`) and open a PR when data changes — the diff *is* the
  audit trail.
- Store `repoOwner`/`repoName` in the dataset so resolution is exact, and cache responses to stay
  inside unauthenticated rate limits (or use a `GITHUB_TOKEN` secret).
- Auto-flag archived/dead repos instead of leaving them listed.

### 2. Compute the Trust Score, don't type it
Right now it's a number a human picks. Make it reproducible:

```
score = 30·licenseIsOsi + 25·freshness(lastCommit) + 20·community(stars, contributors, releases)
      + 15·verifiedUpstream + 10·signedReleases
```

Publish the breakdown on the project page ("why 92?") — that turns a badge into evidence.

### 3. A real backend for anything social
Comments, chat and the forum are `localStorage` simulations. Pick one and make it real:

| Option | Effort | Good for |
| --- | --- | --- |
| **Supabase** (Postgres + Auth + Realtime, free tier) | 1–2 days | chat, comments, accounts, favourites sync |
| Firebase Firestore + Auth | 1–2 days | same, Google-centric |
| Cloudflare Workers + D1/KV | 2–3 days | edge-first, cheap |
| Embedded **Discourse/Flarum** for the forum | hours | forum only, mature moderation |

Suggested first slice: real accounts (OAuth via GitHub) → sync favourites → per-project comments →
then chat with presence.

### 4. Submit → review → publish pipeline
The Google Form is a dead end for contributors. Replace with:

- a form that validates the URL, fetches licence/stars via the API, previews the card, and
- opens a **pre-filled PR** against `src/data/projects.ts` (or writes to a `submissions` table),
- a maintainer review queue page, with "approve → merged into the catalogue".

---

## P1 — high value, moderate effort

### 5. Compare view
Select 2–3 projects → side-by-side table (licence family, Trust Score, maintenance, platforms,
stars) + a shareable `/compare?ids=1,2,3` URL. Great for "Signal vs Session vs SimpleX".

### 6. Curated collections / "alternatives to X"
`src/data/collections.ts`: *"Open alternatives to Google Workspace"*, *"Local AI stack"*,
*"De-Googled Android"*. Collections are the highest-intent entry point for new visitors and are
pure data — no backend needed.

### 7. Light theme + theme toggle
Tokens are already CSS variables: add `[data-theme="light"]` overrides, a toggle in the header,
`prefers-color-scheme` detection and persistence (`STORAGE_KEYS.theme` is already reserved).

### 8. Fill the catalogue gaps
Missing intents that the search tests prove return zero results:

- **VPN / networking:** WireGuard, OpenVPN, ProtonVPN Android, RiseupVPN, Outline, Nebula, Pi-hole,
  AdGuard Home, Tailscale (note: source-available, not OSI — would need the "not open source" flag)
- **Self-hosted:** Nextcloud, Immich, Vaultwarden, Jellyfin, Home Assistant, Gitea, Uptime Kuma
- **Password/2FA:** Aegis, Ente Auth, Bitwarden mobile
- **Media:** VLC, MPV, KoReader, Calibre
- **Dev tools:** Neovim, Zed, ripgrep, fzf, lazygit, Postman-alternatives (Bruno, Yaak)
- **AI tooling:** Ollama, llama.cpp, vLLM, Hugging Face Transformers, ComfyUI, Whisper.cpp, LocalAI

Each entry should carry a real upstream link — the dataset test will reject anything else.

### 9. PWA / offline
`vite-plugin-pwa`: installable, offline-first catalogue (the dataset is already local), share-target
for "share this repo → is it open source?".

### 10. i18n (Hindi first)
`react-i18next` with `en` + `hi`. Given the audience, Hindi/Hinglish is a real differentiator.
Structure strings in one `locales/` folder; keep the dataset English-only to start.

---

## P2 — polish & scale

- **Virtualised grid** (`@tanstack/react-virtual`) once the catalogue passes ~300 items
- **Command palette** (`⌘K`) over projects, categories and actions
- **RSS/Atom feed** of newly listed + recently updated projects (static file, generated in `prebuild`)
- **OpenGraph images per project** (`@vercel/og` style) for nice link previews
- **Analytics that respects the premise** — Plausible/Umami or self-hosted Matomo, never ad trackers
- **Design tokens → CSS Modules or vanilla-extract** to retire the remaining inline styles
  (`AdSpace`, a few one-off layout props)
- **Storybook** for the card/badge/chip system
- **Playwright E2E**: search → filter → open project → favourite → reload (catches routing regressions)
- **Bundle budget** in CI (`size-limit`), keep the main chunk < 120 kB gzip
- **Dependency freshness**: Renovate or Dependabot
- **CODEOWNERS + branch protection** so `main` needs a green CI run
- **Trust Score leaderboard page** (`/top`) and a "new this week" page (`/new`)
- **API v1** (`api.opendiscover.dev`) once a backend exists: `/projects`, `/projects/:id`,
  `/search?q=`, `/categories`, with ETag caching and a documented rate limit

---

## Nice-to-have / experimental

- **"Is this repo open source?" bookmarklet/extension** — paste any URL, get licence + Trust Score
- **LLM-powered weekly digest**: summarise newly listed projects into a newsletter
- **Badge for maintainers**: `[![Listed on OpenDiscover](badge.svg)](link)` they can put in their README
- **License compatibility checker**: "can I combine MIT + GPL-3.0 in my app?"
- **Accessibility audit** with axe-core in CI
- **Dark-pattern detector** for listed apps (telemetry, forced sign-in) — hard, but very on-brand

---

## Suggested order for the next two weeks

1. Metadata sync script + scheduled CI (kills stale data — the #1 trust risk)
2. Computed Trust Score with a visible breakdown
3. Fill catalogue gaps (VPN, self-hosted, dev tools) — ~25 new verified entries
4. Compare view + collections (pure frontend, high perceived value)
5. Supabase spike: real auth + synced favourites + comments
