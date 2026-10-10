/**
 * Pure search, filter and sort logic for the project catalogue.
 *
 * Everything here is side-effect free so it can be unit tested (`npm test`)
 * and reused by the AI assistant, the explorer UI and category pages.
 */
import type { Project, ProjectFilters, SortKey, TrustTier } from '../types';

/* ------------------------------------------------------------------ *
 * Parsing helpers
 * ------------------------------------------------------------------ */

/**
 * Turn a short-form community metric into a number so lists can be sorted.
 * `"45k" → 45000`, `"1.2k" → 1200`, `"3m" → 3000000`, `undefined → 0`.
 */
export function parseStars(raw?: string | number): number {
  if (typeof raw === 'number') return Number.isFinite(raw) ? raw : 0;
  if (!raw) return 0;

  const match = raw.toString().trim().toLowerCase().replace(/,/g, '').match(/^(\d+(?:\.\d+)?)\s*([km]?)$/);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  const multiplier = match[2] === 'k' ? 1_000 : match[2] === 'm' ? 1_000_000 : 1;
  return Math.round(value * multiplier);
}

/** Format a number back into the short form used across the UI. */
export function formatStars(count: number): string {
  if (count >= 1_000_000) return `${trim(count / 1_000_000)}m`;
  if (count >= 1_000) return `${trim(count / 1_000)}k`;
  return String(count);
}

function trim(value: number): string {
  return Number(value.toFixed(1)).toString();
}

/**
 * Convert `"2 weeks ago"` / `"3 days ago"` / `"1 month ago"` into an age in
 * days. Unknown or missing values sort as "very old" (999).
 */
export function recencyDays(lastUpdated?: string): number {
  if (!lastUpdated) return 999;
  const text = lastUpdated.toLowerCase();
  if (text.includes('today') || text.includes('just now')) return 0;
  if (text.includes('yesterday')) return 1;

  const match = text.match(/(\d+(?:\.\d+)?)\s*(hour|day|week|month|year)/);
  if (!match) return 999; // unparseable → treat as stale rather than "fresh"

  const amount = parseFloat(match[1]);
  const unit = match[2];

  const perUnit: Record<string, number> = {
    hour: 1 / 24,
    day: 1,
    week: 7,
    month: 30,
    year: 365,
  };
  return Math.round(amount * (perUnit[unit] ?? 1));
}

/** Lowercase + strip accents so `"café"` matches `"cafe"`. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

/** Split into searchable tokens, dropping punctuation and empty strings. */
export function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9+.#]+/)
    .filter((token) => token.length > 0);
}

/* ------------------------------------------------------------------ *
 * Relevance scoring
 * ------------------------------------------------------------------ */

/**
 * Fuzzy subsequence match: every character of `needle` must appear in
 * `haystack` in order. Returns a 0–1 score that rewards matches which are
 * close together and start early (so `"trb"` → `"tor browser"` beats
 * `"trb"` → `"some toolbar blob"`).
 */
export function subsequenceScore(haystack: string, needle: string): number {
  if (!needle) return 0;
  const hay = normalize(haystack);
  const ndl = normalize(needle);
  if (hay.length < ndl.length) return 0;

  let matched = 0;
  let first = -1;
  let last = -1;

  for (let i = 0; i < hay.length && matched < ndl.length; i += 1) {
    if (hay[i] === ndl[matched]) {
      if (first === -1) first = i;
      last = i;
      matched += 1;
    }
  }

  if (matched < ndl.length) return 0;

  const span = last - first + 1;
  const density = ndl.length / span; // 1 === the needle appears contiguously
  const positionBonus = 1 - first / Math.max(hay.length, 1);
  return Math.max(0, Math.min(1, density * 0.75 + positionBonus * 0.25));
}

/**
 * Pure function words that carry no search intent. Dropping them from the
 * query means "browser for android" behaves like "browser android" instead of
 * demanding that every result also contains the word "for".
 */
const QUERY_STOPWORDS = new Set([
  'a','an','the','and','or','but','if','of','to','in','on','at','by','for','from','with','without','into','onto',
  'is','are','was','were','be','been','am','do','does','did','can','could','should','would','will','shall','may',
  'i','me','my','we','our','you','your','it','its','this','that','these','those','there','here','as','so','than',
  'then','also','just','very','really','some','any','all','each','every','please','need','want','looking','find',
  'search','show','give','list','best','top','good','new','free',
]);

/** Query tokens with function words removed (never empties the list). */
export function queryTokens(query: string): string[] {
  const tokens = tokenize(query);
  const meaningful = tokens.filter((token) => !QUERY_STOPWORDS.has(token));
  return meaningful.length > 0 ? meaningful : tokens;
}

/** All searchable text for a project, pre-normalised. */
function haystacks(project: Project) {
  return {
    title: normalize(project.title),
    description: normalize(project.description),
    category: normalize(project.category),
    tags: normalize((project.tags ?? []).join(' ')),
    meta: normalize(`${project.license} ${project.source} ${(project.platforms ?? []).join(' ')}`),
  };
}

/**
 * Score a project against a free-text query. `0` means "no match at all";
 * higher is better. Used both for filtering and for relevance sorting.
 */
export function scoreProject(project: Project, query: string): number {
  const tokens = queryTokens(query);
  const compact = normalize(query).replace(/\s+/g, ' ').trim();
  if (tokens.length === 0) return 0;

  const hay = haystacks(project);
  const titleTokens = tokenize(project.title);

  let total = 0;
  let matched = 0;
  let strong = false;

  for (const token of tokens) {
    let best = 0;

    // Exact / prefix title matches dominate.
    if (hay.title === token) best = Math.max(best, 1000);
    else if (titleTokens.includes(token)) best = Math.max(best, 500);
    else if (titleTokens.some((t) => t.startsWith(token))) best = Math.max(best, 320);
    else if (hay.title.includes(token)) best = Math.max(best, 220);

    // Tag matches are almost as good as a title hit.
    const tagList = hay.tags.split(' ');
    if (tagList.includes(token)) best = Math.max(best, 300);
    else if (hay.tags.includes(token)) best = Math.max(best, 180);

    if (hay.category.includes(token)) best = Math.max(best, 160);
    if (hay.meta.includes(token)) best = Math.max(best, 140);
    if (hay.description.includes(token)) best = Math.max(best, 100);

    // Last resort: fuzzy subsequence on the title (typo tolerance).
    if (best === 0 && token.length >= 3) {
      const fuzzy = subsequenceScore(project.title, token);
      if (fuzzy > 0.55) best = Math.round(70 * fuzzy);
    }

    if (best > 0) {
      matched += 1;
      total += best;
      if (best >= 300) strong = true;
    }
  }

  if (matched === 0) return 0;

  /**
   * How many query words must match:
   *  - 1–2 words: all of them (so "browser kubernetes" is not a browser search),
   *  - 3+ words: at least half, but a strong title/tag hit can rescue a long
   *    query where the visitor padded it with noise.
   */
  const required = tokens.length <= 2 ? tokens.length : Math.ceil(tokens.length / 2);
  if (matched < required) {
    const rescued = strong && tokens.length >= 3 && matched >= Math.ceil(tokens.length / 3);
    if (!rescued) return 0;
  }

  // Reward covering more of the query, then bonus a verbatim title phrase.
  const coverage = matched / tokens.length;
  let score = total * (0.5 + 0.5 * coverage);
  if (tokens.length > 1 && hay.title.includes(compact)) score += 250;

  return Math.round(score);
}

/* ------------------------------------------------------------------ *
 * Filtering
 * ------------------------------------------------------------------ */

/** True when the project satisfies every active filter (query excluded). */
export function matchesFilters(project: Project, filters: ProjectFilters): boolean {
  if (filters.category && project.category !== filters.category) return false;
  if (filters.verifiedOnly && !project.verified) return false;

  const minTrust = filters.minTrust ?? 0;
  if (minTrust > 0 && (project.trustScore ?? 0) < minTrust) return false;

  if (filters.licenses?.length) {
    const license = normalize(project.license);
    const wanted = filters.licenses.map(normalize);
    if (!wanted.some((w) => license === w || license.includes(w))) return false;
  }

  if (filters.platforms?.length) {
    const owned = (project.platforms ?? []).map(normalize);
    if (!filters.platforms.some((p) => owned.includes(normalize(p)))) return false;
  }

  if (filters.sources?.length) {
    const wanted = filters.sources.map(normalize);
    if (!wanted.includes(normalize(project.source))) return false;
  }

  if (filters.tags?.length) {
    const owned = (project.tags ?? []).map(normalize);
    if (!filters.tags.some((t) => owned.includes(normalize(t)))) return false;
  }

  return true;
}

/* ------------------------------------------------------------------ *
 * Sorting
 * ------------------------------------------------------------------ */

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'relevance', label: 'Best match' },
  { key: 'trust', label: 'Trust Score' },
  { key: 'stars', label: 'Most popular' },
  { key: 'updated', label: 'Recently updated' },
  { key: 'name', label: 'Name (A–Z)' },
];

/** Sort a copy of the list. `relevance` needs the query that produced it. */
export function sortProjects(projects: Project[], sort: SortKey, query = ''): Project[] {
  const list = [...projects];

  switch (sort) {
    case 'trust':
      return list.sort(
        (a, b) => (b.trustScore ?? 0) - (a.trustScore ?? 0) || a.title.localeCompare(b.title),
      );
    case 'stars':
      return list.sort((a, b) => parseStars(b.stars) - parseStars(a.stars) || a.title.localeCompare(b.title));
    case 'updated':
      return list.sort((a, b) => recencyDays(a.lastUpdated) - recencyDays(b.lastUpdated));
    case 'name':
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case 'relevance':
    default: {
      if (!query.trim()) {
        // No query: fall back to a sensible "trending" order — trust first,
        // popularity as the tie-breaker.
        const trending = (p: Project) => (p.trustScore ?? 0) * 0.6 + parseStars(p.stars) / 1000;
        return list.sort((a, b) => trending(b) - trending(a) || a.title.localeCompare(b.title));
      }
      return list.sort(
        (a, b) => scoreProject(b, query) - scoreProject(a, query) || a.title.localeCompare(b.title),
      );
    }
  }
}

/* ------------------------------------------------------------------ *
 * The one call the UI needs
 * ------------------------------------------------------------------ */

export interface SearchResult {
  projects: Project[];
  total: number;
  /** Score map keyed by project id — handy for highlighting matches. */
  scores: Map<number, number>;
}

/** Filter by facets, rank by the free-text query, then sort. */
export function searchProjects(
  projects: Project[],
  filters: ProjectFilters = {},
  sort: SortKey = 'relevance',
): SearchResult {
  const query = filters.query?.trim() ?? '';
  const scores = new Map<number, number>();

  const matched = projects.filter((project) => {
    if (!matchesFilters(project, filters)) return false;
    if (!query) return true;

    const score = scoreProject(project, query);
    if (score === 0) return false;
    scores.set(project.id, score);
    return true;
  });

  return {
    projects: sortProjects(matched, sort, query),
    total: matched.length,
    scores,
  };
}

/** Distinct facet values with counts, used to render the filter panel. */
export function getFacets(projects: Project[]) {
  const count = (values: string[]) => {
    const map = new Map<string, number>();
    for (const value of values) map.set(value, (map.get(value) ?? 0) + 1);
    return [...map.entries()]
      .map(([value, total]) => ({ value, total }))
      .sort((a, b) => b.total - a.total || a.value.localeCompare(b.value));
  };

  return {
    categories: count(projects.map((p) => p.category)),
    licenses: count(projects.map((p) => p.license)),
    sources: count(projects.map((p) => p.source)),
    platforms: count(projects.flatMap((p) => p.platforms ?? [])),
    tags: count(projects.flatMap((p) => p.tags ?? [])),
  };
}

/* ------------------------------------------------------------------ *
 * Presentation helpers
 * ------------------------------------------------------------------ */

/** Turn a Trust Score into a label + colour for badges and rings. */
export function trustTier(score: number): TrustTier {
  if (score >= 90) return { label: 'Excellent', color: '#10b981' };
  if (score >= 80) return { label: 'Strong', color: '#34d399' };
  if (score >= 70) return { label: 'Good', color: '#f59e0b' };
  if (score >= 50) return { label: 'Fair', color: '#fb923c' };
  return { label: 'Caution', color: '#ef4444' };
}

/** Which filters are currently active (used for the "clear all" chip row). */
export function activeFilterCount(filters: ProjectFilters): number {
  let count = 0;
  if (filters.query?.trim()) count += 1;
  if (filters.category) count += 1;
  if (filters.verifiedOnly) count += 1;
  if ((filters.minTrust ?? 0) > 0) count += 1;
  count += filters.licenses?.length ?? 0;
  count += filters.platforms?.length ?? 0;
  count += filters.sources?.length ?? 0;
  count += filters.tags?.length ?? 0;
  return count;
}

/** Serialise filters into URL search params so results are shareable. */
export function filtersToParams(filters: ProjectFilters, sort: SortKey): URLSearchParams {
  const params = new URLSearchParams();
  const set = (key: string, values?: string[]) => {
    if (values?.length) params.set(key, values.join(','));
  };

  if (filters.query?.trim()) params.set('q', filters.query.trim());
  if (filters.category) params.set('category', filters.category);
  set('license', filters.licenses);
  set('platform', filters.platforms);
  set('source', filters.sources);
  set('tag', filters.tags);
  if ((filters.minTrust ?? 0) > 0) params.set('trust', String(filters.minTrust));
  if (filters.verifiedOnly) params.set('verified', '1');
  if (sort !== 'relevance') params.set('sort', sort);

  return params;
}

/** Inverse of {@link filtersToParams}. */
export function paramsToFilters(params: URLSearchParams): { filters: ProjectFilters; sort: SortKey } {
  const list = (key: string) => {
    const raw = params.get(key);
    return raw ? raw.split(',').map((v) => v.trim()).filter(Boolean) : undefined;
  };

  const sortParam = params.get('sort') as SortKey | null;
  const knownSorts: SortKey[] = ['relevance', 'trust', 'stars', 'updated', 'name'];

  return {
    filters: {
      query: params.get('q') ?? undefined,
      category: params.get('category') ?? undefined,
      licenses: list('license'),
      platforms: list('platform'),
      sources: list('source'),
      tags: list('tag'),
      minTrust: params.get('trust') ? Number(params.get('trust')) : undefined,
      verifiedOnly: params.get('verified') === '1',
    },
    sort: sortParam && knownSorts.includes(sortParam) ? sortParam : 'relevance',
  };
}
