import React from 'react';
import { useFavorites } from '../context/favorites';
import { useToast } from '../context/toast';
import { getProjectById } from '../lib/catalog';

interface FavoriteButtonProps {
  projectId: number;
  /** `'icon'` is the compact heart used on cards, `'full'` adds a label. */
  variant?: 'icon' | 'full';
}

/**
 * Shortlist ("favourite") toggle.
 * Persisted locally, announced to screen readers, and confirmed with a toast.
 */
export const FavoriteButton: React.FC<FavoriteButtonProps> = ({ projectId, variant = 'icon' }) => {
  const { isFavorite, toggle, persisted } = useFavorites();
  const toast = useToast();
  const active = isFavorite(projectId);
  const project = getProjectById(projectId);

  const handleClick = (event: React.MouseEvent) => {
    // Cards link to the detail page; don't trigger that navigation.
    event.preventDefault();
    event.stopPropagation();

    toggle(projectId);
    const next = !active;

    if (!persisted) {
      toast.info('Saved for this session only', 'Your browser is blocking local storage.');
      return;
    }
    if (next) toast.success('Added to favourites', project?.title);
    else toast.info('Removed from favourites', project?.title);
  };

  if (variant === 'full') {
    return (
      <button
        type="button"
        className={`btn ${active ? 'btn-primary' : 'btn-outline'} favorite-btn`}
        onClick={handleClick}
        aria-pressed={active}
      >
        <span aria-hidden="true">{active ? '❤' : '🤍'}</span> {active ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      className="favorite-icon"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? `Remove ${project?.title ?? 'project'} from favourites` : `Save ${project?.title ?? 'project'} to favourites`}
      title={active ? 'Remove from favourites' : 'Save to favourites'}
    >
      <span aria-hidden="true">{active ? '❤' : '🤍'}</span>
    </button>
  );
};

export default FavoriteButton;
