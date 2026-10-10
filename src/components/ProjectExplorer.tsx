import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PROJECTS_DB } from '../data/projects';
import { useDebounce } from '../hooks/useDebounce';
import { CATEGORY_ROUTES } from '../lib/routes';
import {
  activeFilterCount,
  filtersToParams,
  getFacets,
  paramsToFilters,
  searchProjects,
  SORT_OPTIONS,
} from '../lib/search';
import { readStorage, STORAGE_KEYS, writeStorage } from '../lib/storage';
import type { CategoryName, ProjectFilters, SortKey } from '../types';
import { ProjectCard } from './ProjectCard';

export interface ProjectExplorerProps {
  /** Lock the explorer to one category (used by the category pages). */
  category?: CategoryName;
  title?: string;
  description?: string;
  /** Keep state in `?q=&sort=&license=…` so any result set is shareable. */
  syncUrl?: boolean;
  /** Cards rendered before "Load more" appears. */
  pageSize?: number;
  suggestions?: string[];
}

const DEFAULT_SUGGESTIONS = ['privacy browser', 'offline music', 'llama', 'terminal', 'notes', 'vpn'];

/** Remember the last few searches so returning visitors can repeat them. */
function useRecentSearches(enabled: boolean) {
  const [recent, setRecent] = useState<string[]>(() =>
    enabled ? readStorage<string[]>(STORAGE_KEYS.recentSearches, []) : [],
  );

  const record = useCallback((query: string) => {
    const term = query.trim();
    if (term.length < 3) return;
    setRecent((prev) => {
      const next = [term, ...prev.filter((item) => item.toLowerCase() !== term.toLowerCase())].slice(0, 6);
      writeStorage(STORAGE_KEYS.recentSearches, next);
      return next;
    });
  }, []);

  return { recent, record };
}

/**
 * The discovery surface.
 *
 * The **URL is the source of truth**: `?q=vpn&sort=trust&license=GPL-3.0`.
 * That makes every result set shareable/bookmarkable, keeps Back working, and
 * lets the hero search box drive the same state.
 */
export const ProjectExplorer: React.FC<ProjectExplorerProps> = ({
  category,
  title,
  description,
  syncUrl = true,
  pageSize = 12,
  suggestions = DEFAULT_SUGGESTIONS,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const { filters: urlFilters, sort: urlSort } = useMemo(() => paramsToFilters(searchParams), [searchParams]);
  const filters = useMemo<ProjectFilters>(
    () => ({ ...urlFilters, category: category ?? urlFilters.category }),
    [urlFilters, category],
  );
  const sort = urlSort;

  const [visible, setVisible] = useState(pageSize);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState(filters.query ?? '');
  const debouncedDraft = useDebounce(draft, 180);
  const { recent, record } = useRecentSearches(syncUrl);

  /** Write a partial change back to the URL (replace: no history spam). */
  const patch = useCallback(
    (next: Partial<ProjectFilters>, nextSort: SortKey = sort) => {
      const merged: ProjectFilters = { ...filters, ...next };
      // The route already encodes the category — don't duplicate it in the query.
      const forUrl: ProjectFilters = category ? { ...merged, category: undefined } : merged;
      const params = filtersToParams(forUrl, nextSort);
      if (syncUrl) setSearchParams(params, { replace: true });
    },
    [category, filters, setSearchParams, sort, syncUrl],
  );

  // Typing → URL (debounced).
  useEffect(() => {
    if (debouncedDraft !== (filters.query ?? '')) patch({ query: debouncedDraft || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedDraft]);

  // URL changed elsewhere (hero search, a chip, Back button) → input follows.
  useEffect(() => {
    const query = filters.query ?? '';
    setDraft((current) => (current === query ? current : query));
  }, [filters.query]);

  const result = useMemo(() => searchProjects(PROJECTS_DB, filters, sort), [filters, sort]);

  const facets = useMemo(
    () => getFacets(PROJECTS_DB.filter((project) => (category ? project.category === category : true))),
    [category],
  );

  // Reset pagination whenever the result set changes.
  const resultSignature = `${filters.query ?? ''}|${filters.category ?? ''}|${(filters.licenses ?? []).join()}|${(
    filters.platforms ?? []
  ).join()}|${(filters.sources ?? []).join()}|${filters.minTrust ?? 0}|${filters.verifiedOnly ? 1 : 0}|${sort}`;
  useEffect(() => setVisible(pageSize), [resultSignature, pageSize]);

  // `/` focuses search from anywhere, Escape clears it.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing = !!target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);

      if (event.key === '/' && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === 'Escape' && target === inputRef.current) {
        setDraft('');
        inputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const toggleIn = useCallback(
    (key: 'licenses' | 'platforms' | 'sources', value: string) => {
      const current = filters[key] ?? [];
      const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
      patch({ [key]: next.length ? next : undefined } as Partial<ProjectFilters>);
    },
    [filters, patch],
  );

  const reset = useCallback(() => {
    setDraft('');
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const activeCount = activeFilterCount({ ...filters, category: undefined });
  const shown = result.projects.slice(0, visible);
  const hasMore = visible < result.projects.length;

  return (
    <section className="container explorer" id="project-list" aria-labelledby="explorer-heading">
      {(title || description) && (
        <header className="explorer-head">
          <h2 id="explorer-heading">{title}</h2>
          {description ? <p>{description}</p> : null}
        </header>
      )}

      <form
        className="explorer-toolbar"
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          record(draft);
          patch({ query: draft || undefined });
        }}
      >
        <div className="search-field">
          <span className="search-icon" aria-hidden="true">
            🔍
          </span>
          <label className="sr-only" htmlFor="explorer-search">
            Search projects
          </label>
          <input
            ref={inputRef}
            type="search"
            id="explorer-search"
            className="search-input"
            placeholder={`Search ${PROJECTS_DB.length} projects — “privacy browser”, “llama”, “offline music”`}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={() => record(draft)}
            autoComplete="off"
            spellCheck={false}
          />
          {draft ? (
            <button type="button" className="search-clear" onClick={() => setDraft('')} aria-label="Clear search">
              ✕
            </button>
          ) : (
            <kbd className="search-kbd" aria-hidden="true">
              /
            </kbd>
          )}
        </div>

        <label className="sort-field">
          <span className="sr-only">Sort results</span>
          <select className="sort-select" value={sort} onChange={(event) => patch({}, event.target.value as SortKey)}>
            {SORT_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                Sort: {option.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          className="btn btn-outline filter-toggle"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          aria-controls="explorer-filters"
        >
          ⚙ Filters{activeCount ? ` · ${activeCount}` : ''}
        </button>
      </form>

      {filtersOpen && (
        <div className="card explorer-filters" id="explorer-filters">
          {!category && facets.categories.length > 0 && (
            <FilterGroup label="Category">
              <ChipRow>
                {facets.categories.map((facet) => (
                  <Chip
                    key={facet.value}
                    label={facet.value}
                    count={facet.total}
                    active={filters.category === facet.value}
                    onClick={() =>
                      patch({ category: filters.category === facet.value ? undefined : (facet.value as CategoryName) })
                    }
                  />
                ))}
              </ChipRow>
            </FilterGroup>
          )}

          <FilterGroup label="License">
            <ChipRow>
              {facets.licenses.map((facet) => (
                <Chip
                  key={facet.value}
                  label={facet.value}
                  count={facet.total}
                  active={(filters.licenses ?? []).includes(facet.value)}
                  onClick={() => toggleIn('licenses', facet.value)}
                />
              ))}
            </ChipRow>
          </FilterGroup>

          <FilterGroup label="Platform">
            <ChipRow>
              {facets.platforms.map((facet) => (
                <Chip
                  key={facet.value}
                  label={facet.value}
                  count={facet.total}
                  active={(filters.platforms ?? []).includes(facet.value)}
                  onClick={() => toggleIn('platforms', facet.value)}
                />
              ))}
            </ChipRow>
          </FilterGroup>

          <FilterGroup label="Source">
            <ChipRow>
              {facets.sources.map((facet) => (
                <Chip
                  key={facet.value}
                  label={facet.value}
                  count={facet.total}
                  active={(filters.sources ?? []).includes(facet.value)}
                  onClick={() => toggleIn('sources', facet.value)}
                />
              ))}
            </ChipRow>
          </FilterGroup>

          <FilterGroup label={`Minimum Trust Score · ${filters.minTrust ?? 0}+`}>
            <input
              type="range"
              min={0}
              max={95}
              step={5}
              value={filters.minTrust ?? 0}
              onChange={(event) => patch({ minTrust: Number(event.target.value) || undefined })}
              className="trust-range"
              aria-label="Minimum Trust Score"
            />
            <label className="switch">
              <input
                type="checkbox"
                checked={!!filters.verifiedOnly}
                onChange={(event) => patch({ verifiedOnly: event.target.checked || undefined })}
              />
              <span>Verified projects only</span>
            </label>
          </FilterGroup>

          <div className="filter-actions">
            <button type="button" className="btn btn-outline" onClick={reset} disabled={activeCount === 0}>
              Reset filters
            </button>
          </div>
        </div>
      )}

      {!filters.query && recent.length > 0 && (
        <ChipRow className="recent-row">
          <span className="recent-label">Recent:</span>
          {recent.map((term) => (
            <Chip key={term} label={term} active={false} onClick={() => setDraft(term)} />
          ))}
        </ChipRow>
      )}

      <div className="results-meta" aria-live="polite">
        <p>
          <strong>{result.total}</strong> {result.total === 1 ? 'project' : 'projects'}
          {filters.query?.trim() ? ` for “${filters.query.trim()}”` : ''}
          {category ? ` in ${category}` : ''}
        </p>
        {!filters.query && activeCount === 0 && (
          <ChipRow>
            {suggestions.slice(0, 5).map((term) => (
              <Chip key={term} label={term} active={false} onClick={() => setDraft(term)} />
            ))}
          </ChipRow>
        )}
      </div>

      {shown.length > 0 ? (
        <>
          <div className="grid-cols-auto">
            {shown.map((project) => (
              <ProjectCard key={project.id} project={project} highlight={filters.query} />
            ))}
          </div>

          {hasMore && (
            <div className="load-more">
              <button type="button" className="btn btn-outline" onClick={() => setVisible((v) => v + pageSize)}>
                Load {Math.min(pageSize, result.projects.length - visible)} more
              </button>
              <span className="load-more-count">
                Showing {visible} of {result.projects.length}
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="empty-state">
          <div aria-hidden="true" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
            🔎
          </div>
          <h3>No projects match those filters</h3>
          <p>
            Try a broader search, drop a filter, or{' '}
            <a href={CATEGORY_ROUTES[0].path}>browse a category</a>. Know something we should list?{' '}
            <a href="/submit">Submit it</a>.
          </p>
          <button type="button" className="btn btn-primary" onClick={reset}>
            Reset search & filters
          </button>
        </div>
      )}
    </section>
  );
};

/* ------------------------------------------------------------------ *
 * Local presentational helpers
 * ------------------------------------------------------------------ */

const FilterGroup: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="filter-group">
    <h4 className="filter-label">{label}</h4>
    {children}
  </div>
);

const ChipRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={className ? `chip-row ${className}` : 'chip-row'}>{children}</div>
);

interface ChipProps {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, count, active, onClick }) => (
  <button type="button" className={`chip${active ? ' chip-active' : ''}`} onClick={onClick} aria-pressed={active}>
    {label}
    {typeof count === 'number' ? <span className="chip-count">{count}</span> : null}
  </button>
);

export default ProjectExplorer;
