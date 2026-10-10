# AI proxy example (Cloudflare Worker)

Keeps the Google API key **off the browser** so the OpenDiscover assistant can be used in
production without handing your quota to every visitor.

```
Browser ──POST {system, messages}──▶ Worker (holds GEMINI_API_KEY) ──▶ Gemini REST API
```

## Deploy

```bash
cd examples/ai-proxy
npx wrangler secret put GEMINI_API_KEY     # paste the key from aistudio.google.com/apikey
npx wrangler deploy                        # prints your worker URL
```

Optional: restrict callers by setting an env var in `wrangler.toml`:

```toml
[vars]
ALLOWED_ORIGINS_ENV = "https://krishna3163.github.io,http://localhost:5173"
```

## Wire it into the app

```dotenv
# .env (never committed)
VITE_AI_PROXY_URL=https://opendiscover-ai-proxy.<your-subdomain>.workers.dev
```

`src/services/ai.ts` detects the proxy automatically and switches mode from `local`/`direct` to
`proxy`. The chat header shows which mode is active.

## What the worker does for you

- `OPTIONS` preflight + strict CORS (allow-list configurable)
- Rate limiting per IP (20 requests/minute) — tune to taste
- Trims history to the last 12 messages / 4 000 chars so prompts stay cheap
- Never echoes upstream error bodies back to the browser
- No key in the client bundle, no key in URLs (sent via the `x-goog-api-key` header)

## Other hosts

The same ~80 lines port directly to a Vercel/Netlify function, an Express route, a FastAPI
endpoint or a Cloud Run service — the only contract is the JSON shape above.
