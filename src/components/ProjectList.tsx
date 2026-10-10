import React from 'react';
import { Link } from 'react-router-dom';
import type { Project } from '../types';
import { ProjectCard } from './ProjectCard';

interface ProjectListProps {
  projects: Project[];
  title?: string;
  /** Search terms to highlight inside the cards. */
  highlight?: string;
  emptyMessage?: React.ReactNode;
  id?: string;
}

/**
 * Presentational grid of project cards.
 *
 * For search/filter/sort UI use {@link ProjectExplorer}; this component is for
 * fixed collections such as "Related projects" or a curated shortlist.
 */
export const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  title,
  highlight,
  emptyMessage = 'No projects found matching your criteria.',
  id,
}) => (
  <section className="container project-list" id={id} style={{ paddingBottom: '3rem' }}>
    {title && <h3 className="section-title">{title}</h3>}

    {projects.length > 0 ? (
      <div className="grid-cols-auto">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} highlight={highlight} />
        ))}
      </div>
    ) : (
      <div className="empty-state empty-state-inline">
        <p>{emptyMessage}</p>
      </div>
    )}
  </section>
);

export const ProjectListLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to}>{children}</Link>
);

export default ProjectList;
