/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Browser-visible Google AI Studio key. Treat as public — see SECURITY.md. */
  readonly VITE_GEMINI_API_KEY?: string;
  /** Model id used by the assistant. Defaults to `gemini-2.0-flash`. */
  readonly VITE_GEMINI_MODEL?: string;
  /** Optional server-side proxy that keeps the key off the client. */
  readonly VITE_AI_PROXY_URL?: string;
  /** Base path for GitHub Pages, e.g. `/OpenDiscover/`. */
  readonly VITE_BASE_PATH?: string;
  /** Comma separated display names that unlock the demo staff view. */
  readonly VITE_DEMO_ADMINS?: string;
  /** Public site URL used for SEO tags. */
  readonly VITE_SITE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
