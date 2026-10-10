import { createContext, useContext } from 'react';
import type { Project } from '../types';

export interface FavoritesContextValue {
  /** Favourite project ids, in the order they were added. */
  ids: number[];
  count: number;
  projects: Project[];
  isFavorite: (id: number) => boolean;
  toggle: (id: number) => void;
  add: (id: number) => void;
  remove: (id: number) => void;
  clear: () => void;
  /** True when localStorage is blocked, so the UI can warn instead of lying. */
  persisted: boolean;
}

export const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

/** Access the visitor's saved projects (persisted in `localStorage`). */
export function useFavorites(): FavoritesContextValue {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside <FavoritesProvider>');
  }
  return context;
}
