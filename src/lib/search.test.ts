import { describe, expect, it } from 'vitest';
import type { Project } from '../types';
import {
  activeFilterCount,
  filtersToParams,
  formatStars,
  getFacets,
  matchesFilters,
  normalize,
  paramsToFilters,
  parseStars,
  recencyDays,
  scoreProject,
  searchProjects,
  sortProjects,
  subsequenceScore,
  tokenize,
  trustTier,
} from './search';

const project = (overrides: Partial<Project> = {}): Project => ({
  id: 1,
  title: 'Brave Browser',
  description: 'A privacy-focused browser with a built-in ad blocker.',
  category: 'Privacy & Security',
  license: 'MPL-2.0',
  source: 'GitHub',
  stars: '45k',
  verified: true,
  link: 'https://github.com/brave/brave-browser',
  trustScore: 92,
  platforms: ['Linux', 'Windows', 'Android'],
  lastUpdated: '2 weeks ago',
  tags: ['browser', 'privacy'],
  ...overrides,
});

const CATALOGUE: Project[] = [
  project(),
  project({
    id: 2,
    title: 'Termux',
    description: 'Android terminal emulator and Linux environment.',
    category: 'Mobile Apps',
    license: 'GPL-3.0',
    source: 'F-Droid',
    stars: '30k',
    trustScore: 94,
    platforms: ['Android'],
    lastUpdated: '2 months ago',
    tags: ['terminal', 'cli'],
    link: 'https://f-droid.org/packages/com.termux/',
  }),
  project({
    id: 3,
    title: 'Llama 3 (8B)',
    description: 'Open access large language model from Meta.',
    category: 'AI / ML Models',
    license: 'Llama Community',
    source: 'Hugging Face',
    stars: '1.2k',
    trustScore: 88,
    verified: false,
    platforms: ['Python'],
    lastUpdated: '3 days ago',
    tags: ['llm', 'ai'],
    link: 'https://huggingface.co/meta-llama/Meta-Llama-3-8B',
  }),
];

describe('parseStars', () => {
  it('parses short forms', () => {
    expect(parseStars('45k')).toBe(45_000);
    expect(parseStars('1.2k')).toBe(1_200);
    expect(parseStars('3m')).toBe(3_000_000);
    expect(parseStars('600')).toBe(600);
    expect(parseStars(1234)).toBe(1234);
  });

  it('is defensive about junk input', () => {
    expect(parseStars(undefined)).toBe(0);
    expect(parseStars('')).toBe(0);
    expect(parseStars('lots')).toBe(0);
    expect(parseStars(Number.NaN)).toBe(0);
  });

  it('round-trips with formatStars', () => {
    expect(formatStars(parseStars('45k'))).toBe('45k');
    expect(formatStars(parseStars('1.2k'))).toBe('1.2k');
    expect(formatStars(600)).toBe('600');
  });
});

describe('recencyDays', () => {
  it('converts human ages into days', () => {
    expect(recencyDays('3 days ago')).toBe(3);
    expect(recencyDays('2 weeks ago')).toBe(14);
    expect(recencyDays('1 month ago')).toBe(30);
    expect(recencyDays('2 months ago')).toBe(60);
    expect(recencyDays('yesterday')).toBe(1);
    expect(recencyDays('today')).toBe(0);
  });

  it('treats unknown values as stale so they sort last', () => {
    expect(recencyDays(undefined)).toBe(999);
    expect(recencyDays('whenever')).toBe(999);
  });
});

describe('text helpers', () => {
  it('normalizes case and accents', () => {
    expect(normalize('  Café Browser ')).toBe('cafe browser');
  });

  it('tokenizes on punctuation but keeps meaningful symbols', () => {
    expect(tokenize('GPL-3.0 only!')).toEqual(['gpl', '3.0', 'only']);
    expect(tokenize('C++ tooling')).toEqual(['c++', 'tooling']);
  });

  it('scores contiguous subsequences higher than scattered ones', () => {
    expect(subsequenceScore('brave', 'brave')).toBeGreaterThan(subsequenceScore('browser vault engine', 'brave'));
    expect(subsequenceScore('brave', 'xyz')).toBe(0);
    expect(subsequenceScore('', 'a')).toBe(0);
  });
});

describe('scoreProject', () => {
  it('ranks an exact title match above a description match', () => {
    expect(scoreProject(CATALOGUE[0], 'brave')).toBeGreaterThan(scoreProject(CATALOGUE[1], 'android'));
  });

  it('matches on tags, so intent words work', () => {
    expect(scoreProject(CATALOGUE[1], 'terminal')).toBeGreaterThan(0);
    expect(scoreProject(CATALOGUE[2], 'llm')).toBeGreaterThan(0);
  });

  it('requires every token to match (AND semantics)', () => {
    expect(scoreProject(CATALOGUE[0], 'browser privacy')).toBeGreaterThan(0);
    expect(scoreProject(CATALOGUE[0], 'browser kubernetes')).toBe(0);
  });

  it('tolerates typos through fuzzy matching', () => {
    expect(scoreProject(CATALOGUE[0], 'brav')).toBeGreaterThan(0);
  });

  it('returns 0 for an empty query', () => {
    expect(scoreProject(CATALOGUE[0], '')).toBe(0);
  });
});

describe('matchesFilters', () => {
  it('filters by category, license, platform and source', () => {
    expect(matchesFilters(CATALOGUE[0], { category: 'Privacy & Security' })).toBe(true);
    expect(matchesFilters(CATALOGUE[0], { category: 'Mobile Apps' })).toBe(false);
    expect(matchesFilters(CATALOGUE[0], { licenses: ['MPL'] })).toBe(true);
    expect(matchesFilters(CATALOGUE[0], { platforms: ['android'] })).toBe(true);
    expect(matchesFilters(CATALOGUE[1], { sources: ['F-Droid'] })).toBe(true);
  });

  it('honours verifiedOnly and minTrust', () => {
    expect(matchesFilters(CATALOGUE[2], { verifiedOnly: true })).toBe(false);
    expect(matchesFilters(CATALOGUE[2], { minTrust: 90 })).toBe(false);
    expect(matchesFilters(CATALOGUE[1], { minTrust: 90 })).toBe(true);
  });
});

describe('sortProjects', () => {
  it('sorts by trust, popularity, recency and name', () => {
    expect(sortProjects(CATALOGUE, 'trust')[0].title).toBe('Termux');
    expect(sortProjects(CATALOGUE, 'stars')[0].title).toBe('Brave Browser');
    expect(sortProjects(CATALOGUE, 'updated')[0].title).toBe('Llama 3 (8B)');
    expect(sortProjects(CATALOGUE, 'name')[0].title).toBe('Brave Browser');
  });

  it('does not mutate the input array', () => {
    const copy = [...CATALOGUE];
    sortProjects(copy, 'name');
    expect(copy[0]).toBe(CATALOGUE[0]);
  });

  it('ranks by relevance when a query is supplied', () => {
    expect(sortProjects(CATALOGUE, 'relevance', 'llama')[0].id).toBe(3);
  });
});

describe('searchProjects', () => {
  it('combines query, facets and sorting', () => {
    const result = searchProjects(CATALOGUE, { query: 'android', platforms: ['Android'] }, 'trust');
    // Termux matches the text *and* the facet; Brave matches via its platform list.
    expect(result.projects.map((p) => p.id)).toEqual([2, 1]);
    expect(result.total).toBe(2);
  });

  it('returns everything (trending order) for an empty query', () => {
    const result = searchProjects(CATALOGUE, {});
    expect(result.total).toBe(3);
    expect(result.projects[0].trustScore).toBeGreaterThanOrEqual(88);
  });

  it('exposes per-project relevance scores', () => {
    const result = searchProjects(CATALOGUE, { query: 'browser' });
    expect(result.scores.get(1)).toBeGreaterThan(0);
    expect(result.scores.get(2)).toBeUndefined();
  });
});

describe('getFacets', () => {
  it('counts facet values', () => {
    const facets = getFacets(CATALOGUE);
    expect(facets.categories).toContainEqual({ value: 'Mobile Apps', total: 1 });
    expect(facets.platforms.find((f) => f.value === 'Android')?.total).toBe(2);
    expect(facets.licenses.map((f) => f.value)).toContain('GPL-3.0');
  });
});

describe('trustTier', () => {
  it('maps scores onto labels and colours', () => {
    expect(trustTier(95).label).toBe('Excellent');
    expect(trustTier(84).label).toBe('Strong');
    expect(trustTier(72).label).toBe('Good');
    expect(trustTier(55).label).toBe('Fair');
    expect(trustTier(10).label).toBe('Caution');
    expect(trustTier(95).color).toMatch(/^#/);
  });
});

describe('URL round-trip', () => {
  it('counts active filters', () => {
    expect(activeFilterCount({})).toBe(0);
    expect(activeFilterCount({ query: 'vpn', verifiedOnly: true, licenses: ['MIT', 'GPL-3.0'] })).toBe(4);
  });

  it('serialises and parses the same state', () => {
    const filters: Parameters<typeof filtersToParams>[0] = {
      query: 'privacy browser',
      licenses: ['GPL-3.0'],
      platforms: ['Android'],
      sources: ['F-Droid'],
      minTrust: 80,
      verifiedOnly: true,
    };
    const params = filtersToParams(filters, 'trust');
    const parsed = paramsToFilters(params);

    expect(parsed.sort).toBe('trust');
    expect(parsed.filters.query).toBe('privacy browser');
    expect(parsed.filters.licenses).toEqual(['GPL-3.0']);
    expect(parsed.filters.platforms).toEqual(['Android']);
    expect(parsed.filters.sources).toEqual(['F-Droid']);
    expect(parsed.filters.minTrust).toBe(80);
    expect(parsed.filters.verifiedOnly).toBe(true);
  });

  it('falls back to a known sort for garbage input', () => {
    expect(paramsToFilters(new URLSearchParams('sort=banana')).sort).toBe('relevance');
  });
});
