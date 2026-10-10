import React from 'react';
import { Link } from 'react-router-dom';
import { MAINTAINER } from '../config/site';
import { useAuth } from '../context/auth';
import { useFavorites } from '../context/favorites';
import { CATALOGUE_STATS } from '../lib/catalog';
import { REPO_URL } from '../lib/routes';
import { readStorage, STORAGE_KEYS } from '../lib/storage';

/**
 * Profile page.
 *
 * Shows the signed-in demo session when there is one (favourites, role,
 * session age) and always credits the real maintainer underneath.
 */
export const ProfilePage: React.FC = () => {
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const { count, projects } = useFavorites();
  const recentSearches = readStorage<string[]>(STORAGE_KEYS.recentSearches, []);

  const joined = user?.joinedAt ? new Date(user.joinedAt) : null;

  return (
    <div className="container page-narrow profile-page">
      {isAuthenticated && user && (
        <section className="card profile-card" aria-labelledby="session-heading">
          <span className="profile-avatar" aria-hidden="true">
            {(user.name || 'U').charAt(0).toUpperCase()}
          </span>
          <h1 id="session-heading">{user.name}</h1>
          <p className="page-subtitle">{user.email}</p>

          <div className="chip-row profile-badges">
            <span className={`badge ${isStaff ? 'badge-staff' : 'badge-muted'}`}>
              {isStaff ? 'Demo staff' : 'Guest session'}
            </span>
            <span className="badge badge-muted">Local session</span>
            {joined && <span className="badge badge-muted">Since {joined.toLocaleDateString()}</span>}
          </div>

          <dl className="stat-list stat-list-inline">
            <div>
              <dt>Favourites</dt>
              <dd>{count}</dd>
            </div>
            <div>
              <dt>Searches saved</dt>
              <dd>{recentSearches.length}</dd>
            </div>
            <div>
              <dt>Projects available</dt>
              <dd>{CATALOGUE_STATS.projects}</dd>
            </div>
          </dl>

          {recentSearches.length > 0 && (
            <div className="profile-searches">
              <h2 className="section-title">Recent searches</h2>
              <div className="chip-row">
                {recentSearches.map((term) => (
                  <Link key={term} to={`/?q=${encodeURIComponent(term)}`} className="chip">
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {count > 0 && (
            <div className="profile-searches">
              <h2 className="section-title">Top of your shortlist</h2>
              <ul className="mini-list">
                {projects.slice(0, 3).map((project) => (
                  <li key={project.id}>
                    <Link to={`/project/${project.id}`}>{project.title}</Link>
                    <span>{project.category}</span>
                  </li>
                ))}
              </ul>
              <Link to="/favorites" className="btn btn-outline">
                Open favourites →
              </Link>
            </div>
          )}

          <p className="notice notice-warning">
            This session lives only in your browser (<code>localStorage</code>). There is no server, so nothing syncs
            between devices — and nothing you type here is uploaded anywhere.
          </p>

          <div className="btn-row">
            <Link to="/favorites" className="btn btn-outline">
              Your favourites
            </Link>
            <button type="button" className="btn btn-ghost" onClick={logout}>
              Log out
            </button>
          </div>
        </section>
      )}

      <section className="card profile-card" aria-labelledby="maintainer-heading">
        <span className="profile-avatar profile-avatar-maintainer" aria-hidden="true">
          {MAINTAINER.initial}
        </span>
        <h1 id="maintainer-heading">{MAINTAINER.name}</h1>
        <p className="page-subtitle">{MAINTAINER.role}</p>

        <ul className="link-list">
          {MAINTAINER.links.map((link) => (
            <li key={link.label}>
              <a href={link.href} target={link.href.startsWith('mailto:') ? undefined : '_blank'} rel="noopener noreferrer">
                <span aria-hidden="true">{link.icon}</span>
                <span className="link-meta">
                  <small>{link.label}</small>
                  <strong>{link.value}</strong>
                </span>
                <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ul>

        <blockquote className="maintainer-quote">“{MAINTAINER.quote}”</blockquote>

        <div className="btn-row">
          <a href={REPO_URL} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
            ★ Star OpenDiscover
          </a>
          {!isAuthenticated && (
            <Link to="/login" className="btn btn-outline">
              Try the demo sign-in
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
