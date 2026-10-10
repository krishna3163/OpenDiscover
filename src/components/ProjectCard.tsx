import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { getLicenseInfo, isOpenSourceLicense, LICENSE_KIND_LABEL } from '../lib/catalog';
import { trustTier } from '../lib/search';
import { FavoriteButton } from './FavoriteButton';
import { Highlight } from './Highlight';

// Re-exported so existing imports from this module keep working.
export type { Project };

interface ProjectCardProps {
  project: Project;
  /** Search query used to highlight the matched words. */
  highlight?: string;
}

/**
 * The main discovery unit: what it is, how trusted it is, and one click
 * through to the official upstream source.
 */
export const ProjectCard: React.FC<ProjectCardProps> = ({ project, highlight }) => {
  const score = project.trustScore ?? 0;
  const tier = trustTier(score);
  const license = getLicenseInfo(project.license);

  return (
    <article className="card project-card">
      <div className="project-card-top">
        <span className="project-category">{project.category}</span>
        <FavoriteButton projectId={project.id} />
      </div>

      <h3 className="project-title">
        <Link to={`/project/${project.id}`}>
          <Highlight text={project.title} query={highlight} />
        </Link>
        {project.verified && (
          <span className="verified-tick" title="Verified upstream source and license" aria-label="Verified project">
            ✓
          </span>
        )}
      </h3>

      <p className="project-description">
        <Highlight text={project.description} query={highlight} maxLength={140} />
      </p>

      <div className="project-meta">
        <span className="badge badge-muted" title={license.summary}>
          {project.license}
        </span>
        <span className="badge badge-muted">★ {project.stars}</span>
        <span className="badge badge-muted">{project.source}</span>
        {!isOpenSourceLicense(license.kind) && (
          <span className="badge badge-warning" title={license.summary}>
            ⚠ {LICENSE_KIND_LABEL[license.kind]}
          </span>
        )}
      </div>

      <div className="project-trust" title={`Trust Score: ${score}/100 — ${tier.label}`}>
        <span className="trust-dot" style={{ background: tier.color }} aria-hidden="true" />
        <span className="trust-value" style={{ color: tier.color }}>
          {score}
        </span>
        <span className="trust-label">{tier.label}</span>
        <span className="trust-bar" aria-hidden="true">
          <span className="trust-bar-fill" style={{ width: `${score}%`, background: tier.color }} />
        </span>
      </div>

      <div className="project-card-footer">
        <Link to={`/project/${project.id}`} className="btn btn-ghost">
          Details
        </Link>
        <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          View on {project.source} <span aria-hidden="true">↗</span>
        </a>
      </div>
    </article>
  );
};

export default ProjectCard;
