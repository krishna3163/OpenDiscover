import React from 'react';

import { ProjectList } from '../components/ProjectList';

// To avoid complex refactoring in this step, I will use ProjectList and add a filter prop to it in the next step.
// For now, I'll create the wrapper.

interface CategoryPageProps {
    title: string;
    description: string;
    filterCategory: string; // "AI / ML Models" or "Privacy & Security"
}

export const CategoryPage: React.FC<CategoryPageProps> = ({ title, description, filterCategory }) => {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem', minHeight: '60vh' }}>
            <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>{title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>{description}</p>
            </div>

            {/* We will need to update ProjectList to accept a filter. */}
            <ProjectList filter={filterCategory} />
        </div>
    );
};
