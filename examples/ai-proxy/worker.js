/**
 * Minimal AI proxy for OpenDiscover — keeps the Gemini API key server-side.
 *
 * Deploy:
 *   npm i -g wrangler        (or use npx)
 *   wrangler secret put GEMINI_API_KEY
 *   wrangler deploy
 *
 * Then set `VITE_AI_PROXY_URL=https://<your-worker>.workers.dev` in the app's `.env`.
 *
 * The contract matches `src/services/ai.ts` → `callProxy()`:
 *   POST { system: string, messages: [{ role: 'user'|'model', text: string }] }
 *   200  { text: string, model: string }
 */

const API_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-2.0-flash';
const MAX_MESSAGES = 12;
const MAX_CHARS = 4000;

// Simple in-memory rate limit per IP (resets when the isolate is recycled).
const hits = new Map();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 20;

/** Comma-separated list of browser origins allowed to call this worker. */
function allowedOrigins(env) {
  return String(env.ALLOWED_ORIGINS_ENV ?? '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function corsHeaders(origin, env) {
  const allowList = allowedOrigins(env);
  const allowed = allowList.length === 0 || allowList.includes(origin);
  return {
    'Access-Control-Allow-Origin': allowed ? origin : allowList[0] ?? '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin',
  };
}

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';
    const cors = corsHeaders(origin, env);

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== 'POST') {
      return Response.json({ error: 'Use POST' }, { status: 405, headers: cors });
    }

    const key = env.GEMINI_API_KEY;
    if (!key) {
      return Response.json({ error: 'Proxy is missing GEMINI_API_KEY' }, { status: 500, headers: cors });
    }

    const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
    if (rateLimited(ip)) {
      return Response.json({ error: 'Rate limit exceeded — try again in a minute' }, { status: 429, headers: cors });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return Response.json({ error: 'Invalid JSON body' }, { status: 400, headers: cors });
    }

    const system = typeof body.system === 'string' ? body.system.slice(0, 20_000) : '';
    const messages = Array.isArray(body.messages) ? body.messages.slice(-MAX_MESSAGES) : [];

    const contents = messages
      .filter((m) => m && typeof m.text === 'string' && (m.role === 'user' || m.role === 'model'))
      .map((m) => ({ role: m.role, parts: [{ text: m.text.slice(0, MAX_CHARS) }] }));

    if (contents.length === 0) {
      return Response.json({ error: 'No messages supplied' }, { status: 400, headers: cors });
    }

    const upstream = await fetch(`${API_ROOT}/${MODEL}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify({
        systemInstruction: system ? { parts: [{ text: system }] } : undefined,
        contents,
        generationConfig: { temperature: 0.7, topP: 0.95, maxOutputTokens: 800 },
      }),
    });

    if (!upstream.ok) {
      const detail = await upstream.text().catch(() => '');
      // Never leak the upstream error body (it can echo request metadata).
      console.error('upstream failure', upstream.status, detail.slice(0, 300));
      return Response.json(
        { error: `Upstream request failed (${upstream.status})` },
        { status: 502, headers: cors },
      );
    }

    const payload = await upstream.json();
    const text = (payload.candidates?.[0]?.content?.parts ?? [])
      .map((part) => part.text ?? '')
      .join('')
      .trim();

    if (!text) {
      return Response.json({ error: 'Model returned an empty reply' }, { status: 502, headers: cors });
    }

    return Response.json(
      { text, model: MODEL },
      {
        headers: { ...cors, 'Cache-Control': 'no-store' },
      },
    );
  },
};
