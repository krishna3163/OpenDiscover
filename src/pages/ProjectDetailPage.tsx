import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { DiscussionSection } from '../components/DiscussionSection';
import { FavoriteButton } from '../components/FavoriteButton';
import { ProjectList } from '../components/ProjectList';
import { TrustRing } from '../components/TrustRing';
import { useToast } from '../context/toast';
import {
  CATEGORY_BY_NAME,
  getLicenseInfo,
  getProjectById,
  getRelatedProjects,
  isOpenSourceLicense,
  LICENSE_KIND_LABEL,
} from '../lib/catalog';
import { ISSUE_URL } from '../lib/routes';
import { formatStars, parseStars, recencyDays, trustTier } from '../lib/search';

/**
 * Project detail page.
 *
 * Every claim on this page is derived from the dataset (licence family,
 * maintenance age, community size) rather than hard-coded, because a directory
 * that talks about trust cannot afford decorative fiction.
 */
export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const project = getProjectById(id);
  const toast = useToast();

  if (!project) {
    return (
      <div className="container page-narrow">
        <div className="card empty-state">
          <h1>Project not found</h1>
          <p>
            No listing has the id <code>{id}</code>. It may have been removed or the link is out of date.
          </p>
          <div className="btn-row">
            <Link to="/" className="btn btn-primary">
              ← Back to Discover
            </Link>
            <Link to="/submit" className="btn btn-outline">
              Suggest this project
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const license = getLicenseInfo(project.license);
  const score = project.trustScore ?? 0;
  const tier = trustTier(score);
  const category = CATEGORY_BY_NAME.get(project.category);
  const related = getRelatedProjects(project, 3);
  const daysSinceUpdate = recencyDays(project.lastUpdated);
  const stars = parseStars(project.stars);
  const shareUrl = `${window.location.origin}${window.location.pathname}`;

  const signals = [
    {
      ok: project.verified,
      label: 'Verified upstream source',
      detail: project.verified
        ? `Listed from the official ${project.source} page.`
        : 'Upstream owner not yet confirmed — check the repository before relying on it.',
    },
    {
      ok: isOpenSourceLicense(license.kind),
      label: `${LICENSE_KIND_LABEL[license.kind]} licence`,
      detail: license.summary,
    },
    {
      ok: daysSinceUpdate <= 90,
      label: daysSinceUpdate <= 90 ? 'Actively maintained' : 'Maintenance unclear',
      detail:
        daysSinceUpdate <= 90
          ? `Updated ${project.lastUpdated} — within the last 3 months.`
          : `Last recorded update: ${project.lastUpdated ?? 'unknown'}.`,
    },
    {
      ok: stars >= 1000,
      label: `Community size · ${formatStars(stars)} stars`,
      detail: stars >= 1000 ? 'A large user base usually means faster security fixes.' : 'Smaller community — review the issue tracker activity yourself.',
    },
  ];

  // https://github.com/owner/repo -> https://github.com/sponsors/owner
  const sponsorUrl = (() => {
    const match = /^https:\/\/github\.com\/([^/]+)/.exec(project.link);
    return match ? `https://github.com/sponsors/${match[1]}` : null;
  })();

  const reportUrl = `${ISSUE_URL}?template=bad_listing.md&title=${encodeURIComponent(
    `[listing] ${project.title}`,
  )}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied', shareUrl);
    } catch {
      toast.error('Could not copy the link', 'Your browser blocked clipboard access.');
    }
  };

  return (
    <div className="container project-detail-layout">
      <div>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Discover</Link>
          <span aria-hidden="true">/</span>
          <Link to={category?.path ?? '/'}>{project.category}</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{project.title}</span>
        </nav>

        <header className="detail-head">
          <div>
            <h1>
              {project.title}
              {project.verified && (
                <span className="verified-tick" title="Verified project" aria-label="Verified project">
                  ✓
                </span>
              )}
            </h1>
            <p className="detail-sub">
              {project.category} · {project.source} · updated {project.lastUpdated ?? 'recently'}
            </p>
          </div>
          <div className="btn-row">
            <FavoriteButton projectId={project.id} variant="full" />
            <button type="button" className="btn btn-outline" onClick={copyLink}>
              🔗 Share
            </button>
          </div>
        </header>

        <section className="card licence-card" aria-labelledby="licence-heading">
          <h2 id="licence-heading" className="section-title">
            🏁 Licence: {project.license}
            <span className="badge badge-muted">{LICENSE_KIND_LABEL[license.kind]}</span>
          </h2>
          <p className="licence-summary">{license.summary}</p>
          <dl className="licence-facts">
            <div>
              <dt>Commercial use</dt>
              <dd>{license.commercialUse ? '✅ Allowed' : '⚠️ Restricted'}</dd>
            </div>
            <div>
              <dt>Derivatives must stay open</dt>
              <dd>{license.shareAlike ? 'Yes (copyleft)' : 'No'}</dd>
            </div>
            {license.url && (
              <div>
                <dt>Full text</dt>
                <dd>
                  <a href={license.url} target="_blank" rel="noopener noreferrer">
                    Read the licence ↗
                  </a>
                </dd>
              </div>
            )}
          </dl>
          <p className="licence-note">Plain-English summary for convenience — not legal advice.</p>
        </section>

        <section className="detail-block" aria-labelledby="trust-heading">
          <h2 id="trust-heading" className="section-title">
            Why this project is trusted
          </h2>
          <ul className="signal-list">
            {signals.map((signal) => (
              <li key={signal.label} className={`signal ${signal.ok ? 'signal-ok' : 'signal-warn'}`}>
                <span className="signal-icon" aria-hidden="true">
                  {signal.ok ? '✔' : '!'}
                </span>
                <div>
                  <strong>{signal.label}</strong>
                  <p>{signal.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card detail-block" aria-labelledby="overview-heading">
          <h2 id="overview-heading" className="section-title">
            Project overview
          </h2>
          <p className="detail-description">{project.description}</p>

          <div className="detail-facts">
            <div>
              <h3>Supported platforms</h3>
              <div className="chip-row">
                {(project.platforms ?? ['Not specified']).map((platform) => (
                  <span key={platform} className="badge badge-muted">
                    {platform}
                  </span>
                ))}
              </div>
            </div>

            {project.tags?.length ? (
              <div>
                <h3>Findable as</h3>
                <div className="chip-row">
                  {project.tags.slice(0, 14).map((tag) => (
                    <Link key={tag} to={`/?q=${encodeURIComponent(tag)}`} className="chip">
                      #{tag}
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </section>

        {related.length > 0 && (
          <section className="detail-block">
            <ProjectList projects={related} title="More like this" />
          </section>
        )}

        <section className="card detail-block">
          <DiscussionSection projectId={project.id} projectTitle={project.title} />
        </section>
      </div>

      <aside className="detail-sidebar">
        <div className="card trust-card" style={{ borderTopColor: tier.color }}>
          <span className="trust-card-label">OpenDiscover Trust Score</span>
          <TrustRing score={score} />
          <p className="trust-card-note">
            Licence family, maintenance age, community size and upstream verification — the rubric is documented in{' '}
            <a
              href="https://github.com/krishna3163/OpenDiscover/blob/main/CONTRIBUTING.md"
              target="_blank"
              rel="noopener noreferrer"
            >
              CONTRIBUTING.md
            </a>
            .
          </p>
        </div>

        <div className="sidebar-actions">
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-block">
            View on {project.source} ↗
          </a>
          {project.source === 'GitHub' && (
            <>
              <a href={`${project.link}/discussions`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-block">
                💬 Join the discussion
              </a>
              <a href={`${project.link}/issues`} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-block">
                🐞 Issue tracker
              </a>
              {sponsorUrl && (
                <a href={sponsorUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-block">
                  ❤ Sponsor the maintainer
                </a>
              )}
            </>
          )}
        </div>

        <div className="card fact-list">
          <h3 className="section-title">Quick facts</h3>
          <dl>
            <div>
              <dt>Category</dt>
              <dd>
                <Link to={category?.path ?? '/'}>{project.category}</Link>
              </dd>
            </div>
            <div>
              <dt>Source</dt>
              <dd>{project.source}</dd>
            </div>
            <div>
              <dt>Community</dt>
              <dd>★ {formatStars(stars)}</dd>
            </div>
            <div>
              <dt>Last update</dt>
              <dd>{project.lastUpdated ?? 'unknown'}</dd>
            </div>
            <div>
              <dt>Maintenance</dt>
              <dd>
                <span className="meter" aria-hidden="true">
                  <span
                    className="meter-fill"
                    style={{
                      width: `${Math.max(6, 100 - Math.min(100, (daysSinceUpdate / 365) * 100))}%`,
                      background: daysSinceUpdate <= 90 ? '#10b981' : daysSinceUpdate <= 365 ? '#f59e0b' : '#ef4444',
                    }}
                  />
                </span>
                {daysSinceUpdate <= 90 ? 'Fresh' : daysSinceUpdate <= 365 ? 'Slowing' : 'Stale'}
              </dd>
            </div>
          </dl>
        </div>

        <div className="card report-card">
          <h3 className="section-title">Something wrong?</h3>
          <p>
            If this listing is mis-licensed, dead, or not really open source, tell us — data quality is the product.
          </p>
          <a href={reportUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-block">
            🚩 Report this listing
          </a>
        </div>
      </aside>
    </div>
  );
};

export default ProjectDetailPage;
