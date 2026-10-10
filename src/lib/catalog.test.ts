import { describe, expect, it } from 'vitest';
import {
  CATALOGUE_STATS,
  CATEGORIES,
  getLicenseInfo,
  getProjectById,
  getProjectsByCategory,
  getRelatedProjects,
  isOpenSourceLicense,
  LICENSE_KIND_LABEL,
} from './catalog';
import { CATEGORY_ROUTES } from './routes';
import { PROJECTS_DB } from '../data/projects';

describe('category metadata', () => {
  it('has a unique path per category', () => {
    const paths = CATEGORIES.map((category) => category.path);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it('stays in sync with the route table', () => {
    const routePaths = CATEGORY_ROUTES.map((route) => route.path).sort();
    expect(CATEGORIES.map((category) => category.path).sort()).toEqual(routePaths);
  });

  it('covers every category used in the dataset', () => {
    const datasetCategories = new Set(PROJECTS_DB.map((project) => project.category));
    const known = new Set(CATEGORIES.map((category) => category.name));
    for (const category of datasetCategories) expect(known.has(category), category).toBe(true);
  });
});

describe('getLicenseInfo', () => {
  it('explains common open-source licences', () => {
    expect(getLicenseInfo('MIT').kind).toBe('permissive');
    expect(getLicenseInfo('Apache-2.0').kind).toBe('permissive');
    expect(getLicenseInfo('GPL-3.0').kind).toBe('copyleft');
    expect(getLicenseInfo('AGPL-3.0').kind).toBe('copyleft');
    expect(getLicenseInfo('MPL-2.0').kind).toBe('weak-copyleft');
    expect(getLicenseInfo('Unlicense').kind).toBe('public-domain');
  });

  it('tolerates casing and spacing differences', () => {
    expect(getLicenseInfo('gpl-3.0').kind).toBe('copyleft');
    expect(getLicenseInfo('  Apache 2.0 ').kind).toBe('permissive');
    expect(getLicenseInfo('AGPLv3').kind).toBe('copyleft');
  });

  it('recognises AI model licences', () => {
    expect(getLicenseInfo('CreativeML Open RAIL++-M').kind).toBe('model');
    expect(getLicenseInfo('Llama Community').kind).toBe('model');
    expect(getLicenseInfo('Gemma Terms').kind).toBe('model');
    expect(getLicenseInfo('Tongyi Qianwen').kind).toBe('model');
  });

  it('flags proprietary software as not open source', () => {
    const info = getLicenseInfo('Proprietary');
    expect(info.kind).toBe('proprietary');
    expect(isOpenSourceLicense(info.kind)).toBe(false);
    expect(LICENSE_KIND_LABEL[info.kind]).toBe('Not open source');
  });

  it('falls back gracefully for unknown licences', () => {
    const info = getLicenseInfo('Something We Have Never Seen');
    expect(info.kind).toBe('other');
    expect(info.summary.length).toBeGreaterThan(20);
  });

  it('always returns a summary for every licence in the dataset', () => {
    for (const project of PROJECTS_DB) {
      expect(getLicenseInfo(project.license).summary.length, project.license).toBeGreaterThan(20);
    }
  });
});

describe('lookups', () => {
  it('finds projects by id, string id and junk', () => {
    const first = PROJECTS_DB[0];
    expect(getProjectById(first.id)?.title).toBe(first.title);
    expect(getProjectById(String(first.id))?.id).toBe(first.id);
    expect(getProjectById('nope')).toBeUndefined();
    expect(getProjectById(undefined)).toBeUndefined();
    expect(getProjectById(999999)).toBeUndefined();
  });

  it('filters by category', () => {
    const mobile = getProjectsByCategory('Mobile Apps');
    expect(mobile.length).toBeGreaterThan(0);
    expect(mobile.every((project) => project.category === 'Mobile Apps')).toBe(true);
  });

  it('returns related projects without the project itself', () => {
    const target = PROJECTS_DB[0];
    const related = getRelatedProjects(target, 4);
    expect(related.length).toBeGreaterThan(0);
    expect(related.length).toBeLessThanOrEqual(4);
    expect(related.some((project) => project.id === target.id)).toBe(false);
  });

  it('prefers the same category for related projects', () => {
    const target = PROJECTS_DB.find((project) => project.category === 'AI / ML Models')!;
    const related = getRelatedProjects(target, 4);
    expect(related.filter((project) => project.category === target.category).length).toBeGreaterThan(0);
  });
});

describe('catalogue stats', () => {
  it('aggregates honestly', () => {
    expect(CATALOGUE_STATS.projects).toBe(PROJECTS_DB.length);
    expect(CATALOGUE_STATS.verified).toBe(PROJECTS_DB.filter((project) => project.verified).length);
    expect(CATALOGUE_STATS.averageTrust).toBeGreaterThan(0);
    expect(CATALOGUE_STATS.averageTrust).toBeLessThanOrEqual(100);
    expect(CATALOGUE_STATS.totalStars).toBeGreaterThan(0);
    expect(CATALOGUE_STATS.updatedLast30Days).toBeLessThanOrEqual(PROJECTS_DB.length);
  });
});
