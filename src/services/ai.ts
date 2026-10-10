/**
 * AI assistant transport.
 *
 * Three modes, picked automatically:
 *   1. **Proxy**   — `VITE_AI_PROXY_URL` is set. The key lives on your server.
 *                     This is the only safe option for production.
 *   2. **Direct**  — `VITE_GEMINI_API_KEY` is set. Calls the Google REST API
 *                     from the browser. Fine for local development, but the key
 *                     is bundled into the client and therefore public.
 *   3. **Local**   — nothing configured. `localAssistant` answers from the
 *                     catalogue, so the feature still works in demos and CI.
 *
 * No SDK dependency: a single `fetch` keeps the bundle small and avoids the
 * deprecated `@google/generative-ai` package (and the retired `gemini-pro`
 * model it defaulted to).
 */
import { PROJECTS_DB } from '../data/projects';
import { localAssistantReply } from './localAssistant';

export type AssistantMode = 'proxy' | 'direct' | 'local';

export interface ChatTurn {
  /** `user` is the visitor, `model` is the assistant. */
  role: 'user' | 'model';
  text: string;
}

export interface AssistantReply {
  text: string;
  mode: AssistantMode;
}

const API_ROOT = 'https://generativelanguage.googleapis.com/v1beta/models';
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_HISTORY_TURNS = 12;

const apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim() ?? '';
const proxyUrl = import.meta.env.VITE_AI_PROXY_URL?.trim() ?? '';
const model = import.meta.env.VITE_GEMINI_MODEL?.trim() || 'gemini-2.0-flash';

export const assistantMode: AssistantMode = proxyUrl ? 'proxy' : apiKey ? 'direct' : 'local';
export const isAssistantConfigured = assistantMode !== 'local';

/** Compact context so the model recommends things we actually list. */
const CATALOGUE_CONTEXT = PROJECTS_DB.map(
  (project) =>
    `- ${project.title} [${project.category}] ${project.license} ★${project.stars} trust:${project.trustScore ?? '?'} — ${project.description}`,
).join('\n');

const SYSTEM_INSTRUCTION = `You are the official assistant for OpenDiscover, a directory of open-source software.
You help visitors find apps, AI models and tools they can trust. You never host or distribute binaries — you only link to official upstream sources.

Available projects:
${CATALOGUE_CONTEXT}

Rules:
1. Recommend only projects from the list above. Include the project name in **bold** and its upstream link.
2. Rank by fit for the visitor's need, then mention Trust Score and licence in one short line.
3. If nothing matches, say so plainly and suggest the closest alternative or the /submit page.
4. Explain licences in plain English; never give legal advice.
5. Be concise: at most 5 recommendations, short lines, markdown lists. No preamble.
6. If asked about OpenDiscover itself: it is an MIT-licensed, client-side React + TypeScript demo whose data lives in src/data/projects.ts.`;

/** Trim history so requests stay small and cheap. */
function recentHistory(history: ChatTurn[]): ChatTurn[] {
  return history.slice(-MAX_HISTORY_TURNS).map((turn) => ({
    role: turn.role === 'user' ? 'user' : 'model',
    text: turn.text.slice(0, 4000),
  }));
}

/** Combine the caller's signal with a hard request timeout. */
function timeoutSignal(external?: AbortSignal): AbortSignal {
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  if (!external) return timeout;
  if (typeof AbortSignal.any === 'function') return AbortSignal.any([external, timeout]);

  const controller = new AbortController();
  const forward = () => controller.abort();
  if (external.aborted || timeout.aborted) forward();
  external.addEventListener('abort', forward, { once: true });
  timeout.addEventListener('abort', forward, { once: true });
  return controller.signal;
}

async function callProxy(userMessage: string, history: ChatTurn[], signal?: AbortSignal): Promise<string> {
  const response = await fetch(proxyUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system: SYSTEM_INSTRUCTION,
      messages: [...recentHistory(history), { role: 'user', text: userMessage }],
    }),
    signal: timeoutSignal(signal),
  });

  if (!response.ok) {
    throw new Error(`Assistant proxy responded with ${response.status}`);
  }

  const payload = (await response.json()) as { text?: string; reply?: string; message?: string };
  const text = payload.text ?? payload.reply ?? payload.message;
  if (!text) throw new Error('Assistant proxy returned an empty reply');
  return text;
}

async function callGemini(userMessage: string, history: ChatTurn[], signal?: AbortSignal): Promise<string> {
  const response = await fetch(`${API_ROOT}/${model}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // Sending the key in a header keeps it out of URLs, logs and referrers.
      'x-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents: [
        ...recentHistory(history).map((turn) => ({ role: turn.role, parts: [{ text: turn.text }] })),
        { role: 'user', parts: [{ text: userMessage }] },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        maxOutputTokens: 800,
      },
      safetySettings: [
        'HARM_CATEGORY_HARASSMENT',
        'HARM_CATEGORY_HATE_SPEECH',
        'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        'HARM_CATEGORY_DANGEROUS_CONTENT',
      ].map((category) => ({ category, threshold: 'BLOCK_ONLY_HIGH' })),
    }),
    signal: timeoutSignal(signal),
  });

  if (!response.ok) {
    const detail = await response.json().catch(() => null);
    const message =
      (detail as { error?: { message?: string } } | null)?.error?.message ?? `HTTP ${response.status}`;
    throw new Error(message);
  }

  const payload = (await response.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] }; finishReason?: string }[];
    promptFeedback?: { blockReason?: string };
  };

  if (payload.promptFeedback?.blockReason) {
    throw new Error(`Request blocked by safety filters (${payload.promptFeedback.blockReason})`);
  }

  const text = (payload.candidates?.[0]?.content?.parts ?? [])
    .map((part) => part.text ?? '')
    .join('')
    .trim();

  if (!text) throw new Error('The model returned an empty reply');
  return text;
}

/**
 * Ask the assistant something.
 *
 * Never throws: on any failure it degrades to the local catalogue engine so
 * the chat UI always has something to show.
 */
export async function askAssistant(
  userMessage: string,
  history: ChatTurn[] = [],
  signal?: AbortSignal,
): Promise<AssistantReply> {
  const message = userMessage.trim();
  if (!message) return { text: 'Type a question and I will search the catalogue.', mode: 'local' };

  try {
    if (assistantMode === 'proxy') return { text: await callProxy(message, history, signal), mode: 'proxy' };
    if (assistantMode === 'direct') return { text: await callGemini(message, history, signal), mode: 'direct' };
  } catch (error) {
    const reason = error instanceof Error ? error.message : 'unknown error';
    console.warn('[OpenDiscover] assistant request failed, falling back to local engine:', reason);
    return {
      text: `⚠️ The AI endpoint is unavailable (${reason}).\n\nFalling back to the offline catalogue search:\n\n${localAssistantReply(
        message,
      )}`,
      mode: 'local',
    };
  }

  return { text: localAssistantReply(message), mode: 'local' };
}

/** Explains the current mode in the UI (used by the chat header). */
export function describeAssistantMode(): string {
  switch (assistantMode) {
    case 'proxy':
      return `Connected through your proxy (${model})`;
    case 'direct':
      return `Connected to Google AI · ${model}`;
    default:
      return 'Offline mode — answering from the local catalogue. Add VITE_AI_PROXY_URL or VITE_GEMINI_API_KEY for full AI replies.';
  }
}

export default askAssistant;
