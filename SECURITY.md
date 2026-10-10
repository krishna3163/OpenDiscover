# Security Policy

OpenDiscover is a *discovery* service: it links to official project sources and never
hosts binaries. That does not mean the codebase has no security surface — this document
describes what is expected of contributors and what to do when you find a problem.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security problems.

- Email: **kk3163019@gmail.com** (subject: `[OpenDiscover] security`)
- We aim to acknowledge reports within 72 hours and to ship a fix or mitigation quickly.
- You will be credited in the release notes unless you ask to stay anonymous.

## Known limitations of the current demo (by design)

These are intentional properties of a client-only demo build, listed here so nobody
mistakes them for production security:

| Area | Status | Notes |
| --- | --- | --- |
| Authentication | **Mock, client-side only** | `AuthContext` stores a user object in `localStorage`. There is no server, no password check and no session. Never put real credentials in this codebase. |
| Demo staff accounts | Non-secret | Admin/staff mode is granted by *display name* (`VITE_DEMO_ADMINS`). Passwords are not checked and must not be added. |
| OTP step | Simulated | Any 6-digit code is accepted in demo mode. |
| AI API key | Browser-visible if set | Any `VITE_*` variable is bundled into the client and readable by visitors. Use the proxy described below for anything with a quota or a bill attached. |
| Comments / chat | Local only | Nothing is persisted to a backend. |

## Keeping the AI key safe

A key placed in `.env` is compiled into the JavaScript bundle — treat it as public.

**Recommended production setup (proxy):**

1. Deploy a tiny serverless function (Cloudflare Worker, Vercel/Netlify function,
   Cloud Run) that holds `GEMINI_API_KEY` as a *server-side* secret.
2. The function accepts `{ messages }`, calls Google's API, and returns the text.
3. Set `VITE_AI_PROXY_URL` to that endpoint. `src/services/ai.ts` will use the proxy
   automatically and never read a key from the browser.
4. Add rate limiting, an origin check and a max prompt length to the proxy.
5. Restrict the key in Google Cloud Console to the Generative Language API only.

**If a key was ever committed**, assume it is compromised:

```bash
# 1. Revoke it in https://aistudio.google.com/apikey
# 2. Purge it from history (rewrites SHAs – coordinate with other contributors)
git filter-repo --path .env --invert-paths
# 3. Force-push and re-issue a fresh key
```

## Content-safety rules for the directory

- Only index projects with a publicly accessible source repository and a recognisable
  license (OSI-approved, or a documented model license for weights).
- Never link to repackaged binaries, mirrors of paid software, or "cracked" builds.
- Link to the *official* upstream repository or store listing (GitHub, GitLab,
  F-Droid, Hugging Face), not to third-party download portals.
- External links must keep `rel="noopener noreferrer"`.

## Supported versions

| Version | Supported |
| --- | --- |
| `main` (latest) | ✅ |
| older tags | ❌ best effort only |
