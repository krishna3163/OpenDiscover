import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { PROJECTS_DB } from '../data/projects';
import { isStorageAvailable, readStorage, STORAGE_KEYS, writeStorage } from '../lib/storage';
import { FavoritesContext, type FavoritesContextValue } from './favorites';

function loadInitialIds(): number[] {
  if (typeof window === 'undefined') return [];
  const stored = readStorage<number[]>(STORAGE_KEYS.favorites, []);
  return Array.isArray(stored) ? stored.filter((id): id is number => typeof id === 'number') : [];
}

/**
 * Favourites ("shortlist") provider.
 *
 * Client-side only: ids are stored in `localStorage` and kept in sync across
 * open tabs through the `storage` event.
 */
export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ids, setIds] = useState<number[]>(loadInitialIds);
  const persisted = useMemo(() => (typeof window === 'undefined' ? false : isStorageAvailable()), []);

  // Persist changes (external system → effect is fine, no setState here).
  useEffect(() => {
    if (persisted) writeStorage(STORAGE_KEYS.favorites, ids);
  }, [ids, persisted]);

  // Follow changes made in another tab.
  useEffect(() => {
    if (!persisted) return;
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEYS.favorites || !event.newValue) return;
      try {
        const next = JSON.parse(event.newValue) as number[];
        if (Array.isArray(next)) setIds(next.filter((id) => typeof id === 'number'));
      } catch {
        /* ignore malformed payloads */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [persisted]);

  const add = useCallback((id: number) => setIds((prev) => (prev.includes(id) ? prev : [...prev, id])), []);
  const remove = useCallback((id: number) => setIds((prev) => prev.filter((existing) => existing !== id)), []);
  const toggle = useCallback(
    (id: number) => setIds((prev) => (prev.includes(id) ? prev.filter((existing) => existing !== id) : [...prev, id])),
    [],
  );
  const clear = useCallback(() => setIds([]), []);
  const isFavorite = useCallback((id: number) => ids.includes(id), [ids]);

  const projects = useMemo(() => {
    const byId = new Map(PROJECTS_DB.map((project) => [project.id, project]));
    return ids.map((id) => byId.get(id)).filter((project): project is (typeof PROJECTS_DB)[number] => !!project);
  }, [ids]);

  const value = useMemo<FavoritesContextValue>(
    () => ({ ids, count: ids.length, projects, isFavorite, toggle, add, remove, clear, persisted }),
    [ids, projects, isFavorite, toggle, add, remove, clear, persisted],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};

export default FavoritesProvider;
