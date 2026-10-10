/**
 * Defensive wrappers around `localStorage`.
 *
 * Browsers throw in private mode, when storage is disabled, or when the quota
 * is full. None of those should white-screen the app.
 */

export const STORAGE_KEYS = {
  user: 'opendiscover_user',
  favorites: 'opendiscover_favorites',
  chat: (username: string) => `opendiscover_chat_${username.toLowerCase()}`,
  discussion: (projectId: number) => `opendiscover_discussion_${projectId}`,
  theme: 'opendiscover_theme',
  recentSearches: 'opendiscover_recent_searches',
  seenTour: 'opendiscover_seen_tour',
} as const;

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage(key: string, value: unknown): boolean {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStorage(key: string): void {
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

/** True when localStorage is usable at all. */
export function isStorageAvailable(): boolean {
  try {
    const probe = '__od_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return true;
  } catch {
    return false;
  }
}
