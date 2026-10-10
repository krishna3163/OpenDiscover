import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ProjectCard } from '../components/ProjectCard';
import { PROJECTS_DB } from '../data/projects';
import { searchProjects } from '../lib/search';
import { ISSUE_URL } from '../lib/routes';

/**
 * Catch-all route. Suggests real projects instead of a dead end, and echoes
 * the path that failed so bug reports are actionable.
 */
export const NotFoundPage: React.FC = () => {
  const { pathname } = useLocation();

  // Maybe the visitor meant to search for the missing path segment.
  const guess = useMemo(() => {
    const term = decodeURIComponent(pathname.split('/').filter(Boolean).pop() ?? '').replace(/[-_]/g, ' ');
    if (term.length < 3) return [];
    return searchProjects(PROJECTS_DB, { query: term }, 'relevance').projects.slice(0, 3);
  }, [pathname]);

  return (
    <div className="container page-narrow">
      <div className="card empty-state">
        <div className="notfound-code" aria-hidden="true">
          404
        </div>
        <h1>This page is not in the index</h1>
        <p>
          We could not find <code>{pathname}</code>. The link may be old, or the project may have been renamed.
        </p>

        {guess.length > 0 && (
          <>
            <h2 className="notfound-sub">Did you mean one of these?</h2>
            <div className="grid-cols-auto">
              {guess.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </>
        )}

        <div className="btn-row">
          <Link to="/" className="btn btn-primary">
            ← Back to Discover
          </Link>
          <Link to="/open-source-apps" className="btn btn-outline">
            Browse apps
          </Link>
          <a href={ISSUE_URL} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
            Report a broken link
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
