import React from 'react';
import { Link } from 'react-router-dom';
import { STAFF_ROSTER } from '../config/demo';
import { useAuth } from '../context/auth';
import { COMMUNITY_STATS, FORUM_CATEGORIES, recentActivity, threadsForCategory } from '../data/community';
import { DISCUSSIONS_URL } from '../lib/routes';

/**
 * Community hub.
 *
 * Forum content is simulated (see `src/data/community.ts`), so the page links
 * out to GitHub Discussions for anything that needs to be real.
 */
export const CommunityPage: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const activity = recentActivity(4);

  return (
    <div className="container community-layout">
      <div>
        <header className="page-banner">
          <h1>Community Hub</h1>
          <p>
            Welcome to the OpenDiscover forums{user ? `, ${user.name}` : ''}. Be kind, cite upstream sources, and keep
            licence talk factual.
          </p>
          <p className="notice notice-warning">
            Forum threads below are <strong>demo data</strong> — there is no backend yet. Real conversation happens on{' '}
            <a href={DISCUSSIONS_URL} target="_blank" rel="noopener noreferrer">
              GitHub Discussions
            </a>
            .
          </p>
        </header>

        <div className="card forum-card">
          <h2 className="forum-card-head">Forums</h2>
          <ul className="forum-list">
            {FORUM_CATEGORIES.map((category) => {
              const threads = threadsForCategory(category.slug);
              return (
                <li key={category.slug} className="forum-row">
                  <span className="forum-icon" aria-hidden="true">
                    {category.icon}
                  </span>
                  <div className="forum-main">
                    <h3>
                      <Link to={`/community/${category.slug}`}>{category.title}</Link>
                    </h3>
                    <p>{category.description}</p>
                  </div>
                  <div className="forum-counts">
                    <strong>{threads.length}</strong>
                    <span>threads</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <section className="detail-block" aria-labelledby="activity-heading">
          <div className="section-head-row">
            <h2 id="activity-heading" className="section-title">
              Recently updated in the index
            </h2>
            <Link to="/?sort=updated" className="btn btn-outline">
              View all
            </Link>
          </div>
          <ul className="activity-list">
            {activity.map((item) => (
              <li key={item.id} className="card activity-row">
                <span className="activity-dot" aria-hidden="true" />
                <div>
                  <Link to={`/project/${item.id}`}>{item.title}</Link>
                  <span className="activity-meta">
                    {item.category} · updated {item.when}
                  </span>
                </div>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                  Upstream ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <aside className="community-sidebar">
        <div className="card">
          <h3 className="section-title">
            <span className="status-dot" aria-hidden="true" /> Staff online
          </h3>
          <ul className="staff-list">
            {STAFF_ROSTER.map((member) => (
              <li key={member.handle}>
                <span className="avatar" aria-hidden="true">
                  {member.name.charAt(0)}
                </span>
                <span className="staff-meta">
                  <strong>{member.name}</strong>
                  <small>{member.role}</small>
                </span>
                <Link to={`/chat/${encodeURIComponent(member.name)}`} className="btn btn-outline btn-sm">
                  Chat
                </Link>
              </li>
            ))}
          </ul>
          {!isAuthenticated && (
            <p className="notice">
              <Link to="/login">Log in</Link> to open a chat (demo auth, no real account needed).
            </p>
          )}
        </div>

        <div className="card">
          <h3 className="section-title">Index stats</h3>
          <dl className="stat-list">
            <div>
              <dt>Projects listed</dt>
              <dd>{COMMUNITY_STATS.projects}</dd>
            </div>
            <div>
              <dt>Verified listings</dt>
              <dd>{COMMUNITY_STATS.verified}</dd>
            </div>
            <div>
              <dt>Forum categories</dt>
              <dd>{COMMUNITY_STATS.categories}</dd>
            </div>
            <div>
              <dt>Demo threads</dt>
              <dd>{COMMUNITY_STATS.threads}</dd>
            </div>
          </dl>
        </div>

        <div className="card">
          <h3 className="section-title">House rules</h3>
          <ol className="rules-list">
            <li>Link to official upstream sources, never mirrors.</li>
            <li>No piracy, cracked builds or licence circumvention.</li>
            <li>Critique the code, not the person.</li>
            <li>Flag bad listings — accuracy is the whole product.</li>
          </ol>
        </div>
      </aside>
    </div>
  );
};

export default CommunityPage;
