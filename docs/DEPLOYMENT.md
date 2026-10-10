# Deployment guide

OpenDiscover is a static SPA (Vite + React). Any static host works. The only two things that make
deployments differ are:

1. **`base` path** — set `VITE_BASE_PATH` when the site is not served from a domain root.
2. **AI key** — never ship a real key in the bundle; use a proxy (last section).

---

## 1. GitHub Pages (recommended, already wired up)

### Option A — GitHub Actions (automatic)

`.github/workflows/deploy.yml` builds and publishes on every push to `main`:

1. Repo → **Settings → Pages → Source: GitHub Actions**.
2. Push to `main`. The workflow sets `VITE_BASE_PATH=/OpenDiscover/` automatically.
3. Site: `https://<username>.github.io/OpenDiscover/`

### Option B — `gh-pages` branch (manual)

```bash
# one-time: tell Vite the site lives under /<repo-name>/
echo "VITE_BASE_PATH=/OpenDiscover/" >> .env
npm run deploy      # builds and pushes dist/ to the gh-pages branch
```

Then **Settings → Pages → Source: Deploy from a branch → `gh-pages` / `/ (root)`**.

### Deep links on Pages

GitHub Pages cannot rewrite URLs, so a refresh on `/project/42` would 404. Two files solve it:

- `public/404.html` re-bounces the real path to `/?/project/42`
- `src/lib/ghPages.ts` (called from `main.tsx`) restores the path before the router mounts

Nothing to configure — it works on Pages and is a no-op everywhere else.

---

## 2. Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting      # public dir: dist · SPA: Yes · GitHub auto-deploy: optional
npm run build              # leave VITE_BASE_PATH empty ('/')
firebase deploy
```

---

## 3. Cloud Run / any Docker host

A production container is included (`Dockerfile` + `nginx.conf`, multi-stage, nginx serves the SPA
with correct `try_files` fallback):

```bash
docker build -t opendiscover .
docker run -p 8080:80 opendiscover

# or straight to Cloud Run
gcloud run deploy opendiscover --source . --region us-central1 --allow-unauthenticated
```

---

## 4. Netlify / Vercel / Cloudflare Pages

| Host | Build command | Output dir | Notes |
| --- | --- | --- | --- |
| Netlify | `npm run build` | `dist` | Add a `_redirects` with `/* /index.html 200` |
| Vercel | `npm run build` | `dist` | Framework preset: Vite |
| Cloudflare Pages | `npm run build` | `dist` | SPA fallback is automatic |

Set `VITE_BASE_PATH=/` (or leave it unset) for all three — they serve from a domain root.

---

## 5. Keeping the AI key server-side (do this for production)

Any `VITE_*` value ends up in the shipped JavaScript, so a browser-visible Gemini key can be copied
by any visitor and billed to you.

**Proxy pattern:**

```
Browser ──POST {messages}──▶ Your proxy (holds GEMINI_API_KEY) ──▶ Google API
```

A ready-to-deploy Cloudflare Worker lives in [`examples/ai-proxy/`](../examples/ai-proxy/):

```bash
cd examples/ai-proxy
npx wrangler secret put GEMINI_API_KEY
npx wrangler deploy
```

Then point the app at it:

```dotenv
VITE_AI_PROXY_URL=https://opendiscover-ai.<your-subdomain>.workers.dev
```

`src/services/ai.ts` picks the mode automatically:

| Mode | Trigger | Key location |
| --- | --- | --- |
| `proxy` | `VITE_AI_PROXY_URL` set | server only ✅ |
| `direct` | `VITE_GEMINI_API_KEY` set | browser ⚠️ dev only |
| `local` | neither | no key needed — answers from the catalogue ✅ |

Whichever mode you use, also:
- restrict the key to the Generative Language API in Google Cloud Console,
- add rate limiting + an origin check on the proxy,
- cap prompt length (the app already trims history to 12 turns / 4 000 chars).

---

## 6. Post-deploy checklist

- [ ] `npm run lint && npm run typecheck && npm test && npm run build` all green
- [ ] `.env` is **not** committed (`git status` should not list it)
- [ ] If a key was ever committed: revoke it, purge history, re-issue (see [SECURITY.md](../SECURITY.md))
- [ ] Homepage, one category page, one project page and `/favorites` all load on a hard refresh
- [ ] `/data/projects.json` returns the catalogue
- [ ] Lighthouse mobile score checked (Performance / Accessibility / SEO)
- [ ] `VITE_SITE_URL`, `index.html` OG tags and `public/sitemap.xml` point at the real domain
