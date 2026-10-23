/**
 * Derived catalogue data: category metadata, license explanations, lookups.
 *
 * Components should import from here instead of hand-rolling arrays, so a new
 * category or license only has to be added in one place.
 */
import { PROJECTS_DB } from '../data/projects';
import { CATEGORY_NAMES, type CategoryName, type Project } from '../types';
import { parseStars, recencyDays } from './search';

export interface CategoryMeta {
  name: CategoryName;
  /** Route the category links to. */
  path: string;
  icon: string;
  blurb: string;
}

export const CATEGORIES: CategoryMeta[] = [
  {
    name: 'AI / ML Models',
    path: '/ai-models',
    icon: '🤖',
    blurb: 'Open-weight models, inference engines and AI playgrounds.',
  },
  {
    name: 'Open Source Apps',
    path: '/open-source-apps',
    icon: '📦',
    blurb: 'Everyday apps with public source code and honest licenses.',
  },
  {
    name: 'Privacy & Security',
    path: '/privacy',
    icon: '🛡️',
    blurb: 'Tools that protect your data, identity and metadata.',
  },
  {
    name: 'Productivity',
    path: '/productivity',
    icon: '⚡',
    blurb: 'Notes, files, calendars and workflow tools that respect you.',
  },
  {
    name: 'Dev Tools',
    path: '/dev-tools',
    icon: '🧑‍💻',
    blurb: 'Editors, shells, containers and build tooling.',
  },
  {
    name: 'Mobile Apps',
    path: '/mobile-apps',
    icon: '📱',
    blurb: 'Open Android apps, including F-Droid and Shizuku-friendly picks.',
  },
  {
    name: 'Morphe Patches',
    path: '/morphe',
    icon: '⚡',
    blurb: 'Community patch bundles, ad-free mods and automated builds.',
  },
];

export const CATEGORY_BY_PATH = new Map(CATEGORIES.map((c) => [c.path, c]));
export const CATEGORY_BY_NAME = new Map(CATEGORIES.map((c) => [c.name, c]));

/** Keeps {@link CATEGORY_NAMES} and {@link CATEGORIES} from drifting apart. */
export const ALL_CATEGORY_NAMES: CategoryName[] = [...CATEGORY_NAMES];

/* ------------------------------------------------------------------ *
 * Licenses
 * ------------------------------------------------------------------ */

export type LicenseKind = 'permissive' | 'copyleft' | 'weak-copyleft' | 'model' | 'public-domain' | 'proprietary' | 'other';

export interface LicenseInfo {
  kind: LicenseKind;
  /** One-line plain-English explanation shown in tooltips and detail pages. */
  summary: string;
  /** Can you use it in a closed-source commercial product? */
  commercialUse: boolean;
  /** Must derivative works stay open source? */
  shareAlike: boolean;
  url?: string;
}

const LICENSE_TABLE: Record<string, LicenseInfo> = {
  mit: {
    kind: 'permissive',
    summary: 'Use, modify and distribute freely — even commercially — as long as the copyright notice ships with it.',
    commercialUse: true,
    shareAlike: false,
    url: 'https://opensource.org/license/mit',
  },
  'apache-2.0': {
    kind: 'permissive',
    summary: 'Permissive like MIT, plus an explicit patent grant from contributors. State significant changes you make.',
    commercialUse: true,
    shareAlike: false,
    url: 'https://opensource.org/license/apache-2-0',
  },
  'bsd-2-clause': {
    kind: 'permissive',
    summary: 'Very permissive: keep the copyright notice and disclaimer, do almost anything else.',
    commercialUse: true,
    shareAlike: false,
  },
  'bsd-3-clause': {
    kind: 'permissive',
    summary: 'BSD-2 plus one rule: you may not use the authors’ names to endorse your product.',
    commercialUse: true,
    shareAlike: false,
  },
  isc: {
    kind: 'permissive',
    summary: 'Functionally equivalent to MIT, written in fewer words.',
    commercialUse: true,
    shareAlike: false,
  },
  'mpl-2.0': {
    kind: 'weak-copyleft',
    summary: 'File-level copyleft: changed MPL files must stay open, the rest of your app may stay closed.',
    commercialUse: true,
    shareAlike: true,
    url: 'https://opensource.org/license/mpl-2-0',
  },
  'lgpl-3.0': {
    kind: 'weak-copyleft',
    summary: 'You may link to this library from closed-source software, but modifications to the library itself must be shared.',
    commercialUse: true,
    shareAlike: true,
  },
  'lgpl-2.1': {
    kind: 'weak-copyleft',
    summary: 'Older LGPL: dynamic linking from proprietary software is fine; changes to the library must be released.',
    commercialUse: true,
    shareAlike: true,
  },
  'gpl-2.0': {
    kind: 'copyleft',
    summary: 'Strong copyleft: anything you distribute that builds on this must also be GPL-licensed with source available.',
    commercialUse: true,
    shareAlike: true,
  },
  'gpl-3.0': {
    kind: 'copyleft',
    summary: 'Strong copyleft plus anti-tivoisation and patent protections. Derivatives must be GPL-3.0 too.',
    commercialUse: true,
    shareAlike: true,
    url: 'https://opensource.org/license/gpl-3-0',
  },
  'agpl-3.0': {
    kind: 'copyleft',
    summary: 'GPL, extended to network use: if you run a modified version as a service, you must offer its source to users.',
    commercialUse: true,
    shareAlike: true,
    url: 'https://opensource.org/license/agpl-v3',
  },
  'unlicense': {
    kind: 'public-domain',
    summary: 'Dedicated to the public domain. No conditions at all.',
    commercialUse: true,
    shareAlike: false,
  },
  'cc0-1.0': {
    kind: 'public-domain',
    summary: 'Creative Commons Zero: public-domain dedication, typically used for data and assets.',
    commercialUse: true,
    shareAlike: false,
  },
  proprietary: {
    kind: 'proprietary',
    summary:
      'Not open source: the source code is not published. This entry is indexed for awareness only — compare it against the open alternatives in the same category before you rely on it.',
    commercialUse: true,
    shareAlike: false,
  },
};

/** Licence kinds that satisfy this directory's "open source only" promise. */
export function isOpenSourceLicense(kind: LicenseKind): boolean {
  return kind !== 'proprietary' && kind !== 'other';
}

const FALLBACK: LicenseInfo = {
  kind: 'other',
  summary:
    'This licence is not in our explainer yet. Read the LICENSE file upstream before redistributing, since the exact terms vary.',
  commercialUse: true,
  shareAlike: false,
};

/** Look up plain-English license info, tolerating odd spellings. */
export function getLicenseInfo(license: string): LicenseInfo {
  const key = license.trim().toLowerCase();
  const direct = LICENSE_TABLE[key] ?? LICENSE_TABLE[key.replace(/\s+/g, '-')];
  if (direct) return direct;

  const prefix = (needle: string) => LICENSE_TABLE[Object.keys(LICENSE_TABLE).find((k) => k.startsWith(needle)) ?? ''];

  if (key.includes('agpl')) return prefix('agpl') ?? FALLBACK;
  if (key.includes('lgpl')) return prefix('lgpl') ?? FALLBACK;
  if (key.includes('gpl')) return prefix('gpl') ?? FALLBACK;
  if (key.includes('apache')) return prefix('apache') ?? FALLBACK;
  if (key.includes('mit')) return prefix('mit') ?? FALLBACK;
  if (key.includes('bsd')) return prefix('bsd') ?? FALLBACK;
  if (key.includes('mpl')) return prefix('mpl') ?? FALLBACK;
  if (key.includes('unlicense')) return prefix('unlicense') ?? FALLBACK;
  if (key.includes('proprietary') || key.includes('closed source') || key.includes('commercial only')) {
    return LICENSE_TABLE.proprietary;
  }
  if (key.includes('cc0')) return prefix('cc0') ?? FALLBACK;

  if (key.includes('creative') || key.includes('rail') || key.includes('openrail')) {
    return {
      kind: 'model',
      summary:
        'An open model licence (RAIL family): weights and outputs are usable, with ethical-use restrictions rather than source-code conditions.',
      commercialUse: true,
      shareAlike: false,
      url: 'https://www.licenses.ai/blog/2022/8/26/bigscience-open-rail-m-license',
    };
  }

  if (key.includes('llama') || key.includes('gemma') || key.includes('qwen') || key.includes('tongyi')) {
    return {
      kind: 'model',
      summary:
        'A vendor model licence: weights are openly downloadable, but usage is bound by an acceptable-use policy and (for large deployments) a registration step.',
      commercialUse: true,
      shareAlike: false,
    };
  }

  return FALLBACK;
}

export const LICENSE_KIND_LABEL: Record<LicenseKind, string> = {
  permissive: 'Permissive',
  copyleft: 'Strong copyleft',
  'weak-copyleft': 'Weak copyleft',
  model: 'Model licence',
  'public-domain': 'Public domain',
  proprietary: 'Not open source',
  other: 'Unrecognised',
};

/* ------------------------------------------------------------------ *
 * Lookups
 * ------------------------------------------------------------------ */

export function getProjectById(id: number | string | undefined): Project | undefined {
  const numeric = Number(id);
  if (!Number.isFinite(numeric)) return undefined;
  return PROJECTS_DB.find((project) => project.id === numeric);
}

export function getProjectsByCategory(category: string): Project[] {
  return PROJECTS_DB.filter((project) => project.category === category);
}

/**
 * "More like this" — same category first, then shared platforms/tags, with a
 * light boost for a similar Trust Score.
 */
export function getRelatedProjects(project: Project, limit = 4): Project[] {
  const tags = new Set((project.tags ?? []).map((t) => t.toLowerCase()));
  const platforms = new Set((project.platforms ?? []).map((p) => p.toLowerCase()));

  return PROJECTS_DB.filter((candidate) => candidate.id !== project.id)
    .map((candidate) => {
      let score = 0;
      if (candidate.category === project.category) score += 6;
      if (candidate.license === project.license) score += 2;
      if (candidate.source === project.source) score += 1;
      score += (candidate.tags ?? []).filter((t) => tags.has(t.toLowerCase())).length * 2;
      score += (candidate.platforms ?? []).filter((p) => platforms.has(p.toLowerCase())).length;
      score -= Math.abs((candidate.trustScore ?? 0) - (project.trustScore ?? 0)) / 25;
      return { candidate, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.candidate);
}

/* ------------------------------------------------------------------ *
 * Site-wide stats (used on the home page and in the footer)
 * ------------------------------------------------------------------ */

export const CATALOGUE_STATS = (() => {
  const totalStars = PROJECTS_DB.reduce((sum, project) => sum + parseStars(project.stars), 0);
  const verified = PROJECTS_DB.filter((project) => project.verified).length;
  const averageTrust =
    PROJECTS_DB.reduce((sum, project) => sum + (project.trustScore ?? 0), 0) / (PROJECTS_DB.length || 1);
  const fresh = PROJECTS_DB.filter((project) => recencyDays(project.lastUpdated) <= 30).length;

  return {
    projects: PROJECTS_DB.length,
    categories: new Set(PROJECTS_DB.map((project) => project.category)).size,
    licenses: new Set(PROJECTS_DB.map((project) => project.license)).size,
    verified,
    totalStars,
    averageTrust: Math.round(averageTrust),
    updatedLast30Days: fresh,
  };
})();
