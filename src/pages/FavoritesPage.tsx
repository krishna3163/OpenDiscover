import React from 'react';
import { Link } from 'react-router-dom';
import { ProjectCard } from '../components/ProjectCard';
import { useFavorites } from '../context/favorites';
import { useToast } from '../context/toast';
import { CATALOGUE_STATS } from '../lib/catalog';
import { sortProjects } from '../lib/search';

/**
 * The visitor's shortlist. Stored locally, so it survives reloads and works
 * across tabs — but it is not synced to an account (there is no backend yet).
 */
export const FavoritesPage: React.FC = () => {
  const { projects, count, clear, persisted } = useFavorites();
  const toast = useToast();
  const sorted = React.useMemo(() => sortProjects(projects, 'trust'), [projects]);

  if (count === 0) {
    return (
      <div className="container page-narrow">
        <div className="card empty-state">
          <div aria-hidden="true" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>
            🤍
          </div>
          <h1>Your shortlist is empty</h1>
          <p>
            Tap the heart on any project to save it here. Favourites are stored in this browser —{' '}
            {CATALOGUE_STATS.projects} projects are waiting.
          </p>
          <div className="btn-row">
            <Link to="/" className="btn btn-primary">
              Discover projects
            </Link>
            <Link to="/ai-models" className="btn btn-outline">
              Browse AI models
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3rem 1.5rem' }}>
      <header className="page-head">
        <div>
          <h1>Your Favourites</h1>
          <p className="page-subtitle">
            {count} saved {count === 1 ? 'project' : 'projects'} · sorted by Trust Score
          </p>
        </div>
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => {
            clear();
            toast.info('Shortlist cleared');
          }}
        >
          Clear all
        </button>
      </header>

      {!persisted && (
        <p className="notice notice-warning">
          Your browser is blocking local storage, so this shortlist will disappear when you close the tab.
        </p>
      )}

      <div className="grid-cols-auto">
        {sorted.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default FavoritesPage;
