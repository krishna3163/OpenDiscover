/**
 * Shared domain types for OpenDiscover.
 *
 * These live outside `components/` on purpose: the dataset, the search library
 * and the UI all depend on them, and none of them should depend on a component.
 */

/** Every category that currently exists in the dataset. */
export const CATEGORY_NAMES = [
  'AI / ML Models',
  'Open Source Apps',
  'Privacy & Security',
  'Productivity',
  'Dev Tools',
  'Mobile Apps',
] as const;

export type CategoryName = (typeof CATEGORY_NAMES)[number];

export interface Project {
  /** Stable numeric id used in `/project/:id` URLs. */
  id: number;
  title: string;
  description: string;
  category: CategoryName;
  /** SPDX-ish identifier as published upstream, e.g. `MIT`, `GPL-3.0`. */
  license: string;
  /** Where the project is published: GitHub, F-Droid, Hugging Face, … */
  source: string;
  /** Short-form community size, e.g. `"45k"`. Parsed for sorting. */
  stars: string;
  /** Did we confirm the upstream repo and license? */
  verified: boolean;
  /** Official upstream URL — never a mirror or a re-hosted binary. */
  link: string;
  /** OpenDiscover Trust Score™, 0–100. See CONTRIBUTING.md for the rubric. */
  trustScore?: number;
  platforms?: string[];
  /** Human readable age of the last release/commit, e.g. `"2 weeks ago"`. */
  lastUpdated?: string;
  /** Lowercase keywords that make the project findable in search. */
  tags?: string[];
}

/** Options a visitor can pick in the explorer UI. */
export type SortKey = 'relevance' | 'trust' | 'stars' | 'updated' | 'name';

export interface ProjectFilters {
  query?: string;
  category?: string;
  licenses?: string[];
  platforms?: string[];
  sources?: string[];
  tags?: string[];
  /** Hide everything below this Trust Score. */
  minTrust?: number;
  verifiedOnly?: boolean;
}

export interface TrustTier {
  label: string;
  /** CSS colour used for the score badge / progress ring. */
  color: string;
}
