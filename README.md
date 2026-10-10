# OpenDiscover <sub>with krishna</sub> 🛡️✨

![OpenDiscover Banner](public/banner.png)

**OpenDiscover** is a curated directory that helps you find, verify and trust open-source
software — apps, AI models, privacy tools and dev tools — and then sends you straight to the
**official upstream source**. We index metadata. We never host, repackage or distribute binaries.

> "Discover the code that powers the future."

**Live demo build:** [krishna3163.github.io/OpenDiscover](https://krishna3163.github.io/OpenDiscover/)

[![CI](https://github.com/krishna3163/OpenDiscover/actions/workflows/ci.yml/badge.svg)](https://github.com/krishna3163/OpenDiscover/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blueviolet.svg)](LICENSE)
![React 19](https://img.shields.io/badge/React-19-61dafb) ![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178c6) ![Vite](https://img.shields.io/badge/Vite-7-646cff)

---

## ✨ Features

### 🔍 Real search, not `includes()`
- Tokenised, accent-insensitive, typo-tolerant ranking across **title, tags, category, licence,
  platform, source and description** (`src/lib/search.ts`).
- Intent keywords are derived automatically — search `vpn`, `notes`, `llm`, `password manager`,
  `terminal` and get the projects that *mean* that, not just the ones that spell it.
- Faceted filters (category · licence · platform · source · Trust Score · verified-only),
  five sort orders, "load more" pagination and `<mark>` highlighting of why a result matched.
- **Every result set is a shareable URL**: `/?q=privacy+browser&sort=trust&license=GPL-3.0&verified=1`.
- Press `/` anywhere to jump to search, `Esc` to clear. Recent searches are remembered locally.

### 🛡️ Trust & transparency
- **Trust Score™ (0–100)** with a published rubric — licence family, maintenance age, community
  size, upstream verification, release signing.
- **Plain-English licence explainer** for MIT, Apache, GPL, AGPL, LGPL, MPL, BSD, CC0, Unlicense,
  RAIL/model licences — and an explicit ⚠️ *"Not open source"* flag for entries that are indexed
  only for awareness.
- Honest, derived signals: no decorative fake charts, no invented download numbers.

### ❤️ Your shortlist
- Save projects with one click; persisted in `localStorage`, synced across tabs, with its own page.

### 🤖 AI assistant that always answers
- Talks to Gemini over plain `fetch` with **full conversation history**, timeouts and aborts.
- **Proxy-ready**: point `VITE_AI_PROXY_URL` at your own function so the API key never ships to the
  browser (example worker in [`examples/ai-proxy`](examples/ai-proxy/)).
- **Offline fallback**: with no key at all, the assistant answers from the real catalogue using the
  same search ranking — so the chat is never dead in a demo or in CI.
- Chat history persists per conversation; markdown rendering is HTML-safe (no `dangerouslySetInnerHTML`).

### 🧭 Community & people
- Forum hub, per-category threads, staff roster, demo chat with a staff view and notification opt-in.
- Per-project discussion threads stored locally with seeded examples.

### ⚡ Engineering
- React 19 + TypeScript **strict**, Vite 7, route-level code splitting, vendor chunking.
- `ErrorBoundary` on every route, `404` page that suggests real projects, `ScrollToTop`, dynamic
  `document.title`, SEO/OG/JSON-LD meta, `robots.txt`, `sitemap.xml`, custom favicon.
- Accessibility: skip link, semantic landmarks, visible focus rings, `aria-pressed`/`aria-expanded`,
  `aria-live` result counts, and full `prefers-reduced-motion` support.
- ESLint 9 flat config + `tsc` + **100 Vitest tests** (including dataset-integrity and app smoke tests) run in
  GitHub Actions on every push and PR.
- The catalogue is exported to a real static API at build time: **`/data/projects.json`**.

---

## 🛠️ Tech stack

| Layer | Choice |
| --- | --- |
| UI | React 19, TypeScript (strict), React Router 7 |
| Build | Vite 7 (code-split per route, `manualChunks` for vendors) |
| Motion | Framer Motion (reduced-motion aware) |
| Styling | Vanilla CSS custom properties — one design system in `src/index.css`, no UI framework |
| Icons | Emoji, for zero weight |
| AI | Google Gemini REST API (or your proxy), with an offline catalogue fallback |
| Tests | Vitest |
| Quality | ESLint 9, `tsc --noEmit`, GitHub Actions |
| Hosting | GitHub Pages / Firebase / Cloud Run / any static host |

---

## 🏁 Getting started

### Prerequisites
- Node.js **20.19+** (or 22 LTS)
- npm 10+

### Install & run

```bash
git clone https://github.com/krishna3163/OpenDiscover.git
cd OpenDiscover
npm install
npm run dev          # http://localhost:5173
```

That's it — **no API key required**. Search, filters, favourites, categories, project pages and the
offline assistant all work out of the box.

### Optional: enable the AI model

```bash
cp .env.example .env
```

```dotenv
# Option A — local development only (the key is visible in the browser!)
VITE_GEMINI_API_KEY=your-key-from-aistudio.google.com
VITE_GEMINI_MODEL=gemini-2.0-flash

# Option B — production: keep the key on your server
VITE_AI_PROXY_URL=https://your-worker.example.com/api/chat
```

> ⚠️ Anything prefixed `VITE_` is bundled into the client and is **public**. For production use the
> proxy (Option B). See [SECURITY.md](SECURITY.md) and
> [`examples/ai-proxy`](examples/ai-proxy/).

### Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Dev server with HMR |
| `npm run build` | Exports the dataset, type-checks, builds `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` / `npm run lint:fix` | ESLint |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm test` / `npm run test:watch` | Unit tests |
| `npm run export:data` | Regenerate `public/data/projects.json` |
| `npm run deploy` | Build + publish to GitHub Pages (`gh-pages`) |

---

## 📁 Project structure

```
.
├── .github/            CI + Pages workflows, issue & PR templates
├── docs/               Deployment guide, roadmap
├── examples/ai-proxy/  Minimal proxy that keeps the Gemini key server-side
├── public/             favicon, robots.txt, sitemap.xml, 404.html, banner
├── scripts/            export-catalogue.mjs → public/data/projects.json
└── src/
    ├── components/     Header, Hero, ProjectCard, ProjectExplorer, TrustRing, Markdown, …
    ├── config/         demo.ts (non-secret demo config), site.ts (identity & links)
    ├── context/        auth · favorites · toast (context objects split from providers
    │                   so React Fast Refresh keeps working)
    ├── data/           projects.ts (the curated catalogue) + community.ts (demo forum)
    ├── hooks/          useDebounce
    ├── lib/            search · catalog · tags · routes · storage · time · ghPages (all pure)
    ├── pages/          one file per route, lazily loaded
    ├── services/       ai.ts (Gemini/proxy transport) + localAssistant.ts (offline fallback)
    └── types.ts        shared domain types
```

**Design rule:** anything that can be pure lives in `src/lib/` and gets a test. Components stay thin.

---

## 🧪 Adding a project

Edit [`src/data/projects.ts`](src/data/projects.ts) — search tags are derived for you:

```ts
{
  id: 612,
  title: "Your Project",
  description: "One honest sentence about what it does.",
  category: "Dev Tools",           // must be one of the six known categories
  license: "MIT",
  source: "GitHub",
  stars: "1.4k",
  verified: true,
  link: "https://github.com/you/your-project",   // official upstream only
  trustScore: 88,
  platforms: ["Linux", "Windows"],
  lastUpdated: "2 weeks ago"
}
```

`npm test` includes **dataset-integrity checks** — duplicate ids, non-official link hosts,
download portals, out-of-range Trust Scores, unparseable dates and proprietary entries marked
`verified` all fail the build. Details in [CONTRIBUTING.md](CONTRIBUTING.md).

---

## 🚀 Deploying

Full instructions (GitHub Pages with Actions, `gh-pages`, Firebase Hosting, Cloud Run + Docker,
Netlify/Vercel/Cloudflare, and how to wire the AI proxy) live in **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)**.

The repo already ships:
- `.github/workflows/ci.yml` — lint · typecheck · test · build on every push/PR
- `.github/workflows/deploy.yml` — build + publish to GitHub Pages on `main`
- `public/404.html` + `src/lib/ghPages.ts` — deep links survive a refresh on Pages
- `Dockerfile` + `nginx.conf` — production container with SPA routing

Set `VITE_BASE_PATH=/OpenDiscover/` when serving from a project page (the Pages workflow does this
for you).

---

## 🗺️ Roadmap

See **[docs/ROADMAP.md](docs/ROADMAP.md)** for the prioritised list: live GitHub/HF metadata sync,
compare view, light theme, real accounts, i18n, PWA/offline, and more.

---

## 📄 License

MIT © 2025 Krishna and the OpenDiscover contributors — see [LICENSE](LICENSE).

## 📨 Contact

- **Maintainer:** Krishna — [kk3163019@gmail.com](mailto:kk3163019@gmail.com)
- **GitHub:** [@krishna3163](https://github.com/krishna3163) · **LinkedIn:**
  [krishna0858](https://linkedin.com/in/krishna0858)
- **Report a bad listing:** [open an issue](https://github.com/krishna3163/OpenDiscover/issues/new/choose)
- **Security:** [SECURITY.md](SECURITY.md)

*Built with ❤️ for the open-source community.*
