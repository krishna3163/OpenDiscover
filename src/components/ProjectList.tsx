import React from 'react';
import { ProjectCard } from './ProjectCard';
import { PROJECTS_DB } from '../data/projects';


interface ProjectListProps {
    filter?: string;      // Category filter (exact match)
    searchQuery?: string; // Text search filter (fuzzy)
}

export const ProjectList: React.FC<ProjectListProps> = ({ filter, searchQuery }) => {
    // Filter Logic:
    // 1. If filter prop exists, match category.
    // 2. If searchQuery exists, match title or description.

    const displayedProjects = PROJECTS_DB.filter(p => {
        // Category Match
        const matchesCategory = filter ? p.category === filter : true;

        // Search Match
        const query = searchQuery?.toLowerCase() || '';
        const matchesSearch = query
            ? p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
            : true;

        return matchesCategory && matchesSearch;
    });

    return (
        <section id="project-list" className="container" style={{ paddingBottom: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>
                    {filter ? `${filter}` : searchQuery ? `Results for "${searchQuery}"` : 'Trending Projects'}
                </h3>
                {!filter && !searchQuery && <a href="#" style={{ fontSize: '0.9rem' }}>Browse All &rarr;</a>}
            </div>

            {displayedProjects.length > 0 ? (
                <div className="grid-cols-auto">
                    {displayedProjects.map(proj => (
                        <ProjectCard key={proj.id} project={proj} />
                    ))}
                </div>
            ) : (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)' }}>
                    <p>No projects found matching your criteria.</p>
                </div>
            )}
        </section>
    );
};
