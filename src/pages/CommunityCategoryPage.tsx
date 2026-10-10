import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { FORUM_CATEGORIES, threadsForCategory } from '../data/community';
import { DISCUSSIONS_URL } from '../lib/routes';

/** Accept both `/community/announcements` and the older title-based slug. */
function resolveCategory(categoryId?: string) {
  if (!categoryId) return undefined;
  const decoded = decodeURIComponent(categoryId).toLowerCase().trim();
  const dashed = decoded.replace(/\s+/g, '-');
  return FORUM_CATEGORIES.find((category) => {
    const titleSlug = category.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    return category.slug === dashed || titleSlug === dashed || titleSlug.startsWith(dashed);
  });
}

/** Single forum category: thread list plus an honest "this is demo data" note. */
export const CommunityCategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { isAuthenticated } = useAuth();

  const category = resolveCategory(categoryId);
  const threads = useMemo(() => (category ? threadsForCategory(category.slug) : []), [category]);

  if (!category) {
    return (
      <div className="container page-narrow">
        <div className="card empty-state">
          <h1>Unknown forum category</h1>
          <p>
            <code>{categoryId}</code> is not one of our forum categories.
          </p>
          <Link to="/community" className="btn btn-primary">
            ← Back to Community
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem' }}>
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/community">Community</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{category.title}</span>
      </nav>

      <header className="page-head">
        <div>
          <h1>
            <span aria-hidden="true">{category.icon}</span> {category.title}
          </h1>
          <p className="page-subtitle">{category.description}</p>
        </div>
        <a href={DISCUSSIONS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
          Start a real thread ↗
        </a>
      </header>

      <p className="notice notice-warning">
        These threads are generated from the catalogue for the demo — replies are not stored anywhere. Use{' '}
        <a href={DISCUSSIONS_URL} target="_blank" rel="noopener noreferrer">
          GitHub Discussions
        </a>{' '}
        for a conversation that persists.
      </p>

      <div className="card forum-card">
        <div className="thread-head">
          <span>Topic</span>
          <span className="num">Replies</span>
          <span className="num">Views</span>
          <span className="last">Last activity</span>
        </div>

        <ul className="thread-list">
          {threads.map((thread) => (
            <li key={thread.id} className="thread-row">
              <div className="thread-main">
                <Link to={`/project/${thread.id}`} className="thread-title">
                  {thread.pinned && <span className="badge badge-warning">Pinned</span>} {thread.title}
                </Link>
                <span className="thread-meta">
                  Started by <strong>{thread.author}</strong> · links to the project page
                </span>
              </div>
              <span className="num">{thread.replies}</span>
              <span className="num">{thread.views.toLocaleString()}</span>
              <span className="last">{thread.lastActivity}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="login-footnote">
        {isAuthenticated
          ? 'Signed in — but remember this forum is local demo data only.'
          : 'Want to chat instead? Log in and message a staff member from the community sidebar.'}
      </p>
    </div>
  );
};

export default CommunityCategoryPage;
