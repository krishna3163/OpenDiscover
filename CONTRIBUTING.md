# Contributing to OpenDiscover

Thanks for helping make open-source software easier to find and trust! 🛡️

## Quick start

```bash
git clone https://github.com/krishna3163/OpenDiscover.git
cd OpenDiscover
npm install
cp .env.example .env      # then fill in only what you need
npm run dev               # http://localhost:5173
```

The app runs with **zero configuration** — search, filters, categories, favourites and
routing all work offline from the bundled dataset. The only thing that needs a key is
the AI assistant (see [SECURITY.md](SECURITY.md)).

## Useful scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Type-check + production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` / `lint:fix` | ESLint (flat config) |
| `npm run typecheck` | `tsc --noEmit` across the project |
| `npm test` | Unit tests (Vitest) |
| `npm run deploy` | Build + publish to GitHub Pages via `gh-pages` |

**Please make sure `npm run lint`, `npm run typecheck` and `npm test` all pass before
opening a pull request** — CI runs exactly those three plus a build.

## Adding a project to the directory

Projects live in [`src/data/projects.ts`](src/data/projects.ts).

1. Pick the next free `id` inside the block for that category.
2. Fill in **every** required field (`title`, `description`, `category`, `license`,
   `source`, `stars`, `verified`, `link`, `trustScore`, `platforms`, `lastUpdated`)
   and add 3–6 lowercase `tags` so search can find it.
3. `link` must point at the **official upstream** source — never a mirror or a
   re-hosted binary.
4. `stars` uses the short form (`"45k"`, `"1.2k"`); the parser in
   [`src/lib/search.ts`](src/lib/search.ts) turns it into a number for sorting.
5. Keep `trustScore` honest — see the rubric below.

### Trust Score rubric (0–100)

| Signal | Weight |
| --- | --- |
| OSI-approved or documented model license | 30 |
| Active maintenance (commit in last ~3 months) | 25 |
| Community size (stars, contributors, releases) | 20 |
| Verified upstream source / official org | 15 |
| Reproducible builds or signed releases | 10 |

## Project structure

```
src/
├── components/     Reusable UI (Header, ProjectCard, ProjectExplorer, …)
├── context/        React context providers (auth, favourites, toasts)
├── data/           The curated project dataset
├── hooks/          Small reusable hooks (useDebounce, …)
├── lib/            Pure logic — search scoring, sorting, filters (unit tested)
├── pages/          Route-level views
└── services/       External integrations (AI assistant)
```

## Conventions

- **TypeScript strict mode** is on; avoid `any`.
- Prefer semantic HTML (`button`, `nav`, `main`) and keep the UI keyboard-reachable
  with a visible `:focus-visible` ring.
- Colours, radii and shadows come from the CSS custom properties in
  [`src/index.css`](src/index.css) — don't hard-code hex values in components.
- Keep components small; move non-trivial logic into `src/lib/` and add a test.
- No secrets, no real user data, no committed `.env` (it is git-ignored).
- Commits follow [Conventional Commits](https://www.conventionalcommits.org/):
  `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`.

## Pull request checklist

- [ ] Focused change, clear title, "why" explained in the description
- [ ] `npm run lint && npm run typecheck && npm test && npm run build` all pass
- [ ] New logic has tests; new UI is reachable by keyboard and on mobile
- [ ] No secrets, API keys or large binaries added
- [ ] Screenshot/recording attached for visible UI changes

## Reporting a bad listing

If a listed project is mis-licensed, dead, or is not actually open source, open an
issue with the **"Bad listing"** template — those get priority, because trust is the
whole point of this site.

## Code of conduct

Be kind, assume good faith, and critique code rather than people. Harassment of any
kind results in a ban.
