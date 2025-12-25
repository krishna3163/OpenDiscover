import React from 'react';
import { Link } from 'react-router-dom';

export interface Project {
    id: number;
    title: string;
    description: string;
    category: string;
    license: string;
    source: string;
    stars: string;
    verified: boolean;
    link: string;
    trustScore?: number;
    platforms?: string[];
    lastUpdated?: string;
}

interface ProjectCardProps {
    project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: '100%' }}>
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent-base)', fontWeight: 600 }}>{project.category}</span>
                    <span className="badge" style={{ background: 'var(--bg-dark)', fontSize: '0.65rem' }}>{project.source}</span>
                </div>

                <Link to={`/project/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {project.title}
                        {project.verified && <span title="Verified Project" style={{ color: '#38bdf8', fontSize: '1rem' }}>✓</span>}
                    </h4>
                </Link>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1rem' }}>
                    {project.description}
                </p>

                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span className="badge" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>License: {project.license}</span>
                    <span className="badge" style={{ border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>★ {project.stars}</span>
                </div>
            </div>

            <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'space-between' }}
                >
                    View on {project.source}
                    <span style={{ fontSize: '1.2rem' }}>↗</span>
                </a>
            </div>
        </div>
    );
};
