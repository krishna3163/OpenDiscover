import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const CommunityCategoryPage: React.FC = () => {
    const { categoryId } = useParams<{ categoryId: string }>();

    // Mock Data based on category
    const categoryTitle = categoryId ? decodeURIComponent(categoryId).replace(/-/g, ' ') : 'Category';

    const threads = [
        { id: 1, title: 'Best practices for open source contributions?', author: 'Alex', replies: 12, views: 340, lastPost: '2 hours ago' },
        { id: 2, title: 'How to deploy React apps to GitHub Pages', author: 'Sarah', replies: 45, views: 1205, lastPost: '5 hours ago' },
        { id: 3, title: 'Understanding the new AI privacy regulations', author: 'Mike', replies: 8, views: 210, lastPost: '1 day ago' },
        { id: 4, title: 'Feedback on the new dark mode', author: 'Krishna', replies: 156, views: 5678, lastPost: 'Pinned' },
        { id: 5, title: 'Looking for maintainers for my project', author: 'John', replies: 3, views: 98, lastPost: '3 days ago' },
    ];

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <Link to="/community" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>← Back to Community</Link>
                <h1 style={{ fontSize: '2rem', fontWeight: 800, marginTop: '0.5rem', textTransform: 'capitalize' }}>
                    {categoryTitle}
                </h1>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 150px', padding: '1rem', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-color)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    <div>Topic</div>
                    <div style={{ textAlign: 'center' }}>Replies</div>
                    <div style={{ textAlign: 'center' }}>Views</div>
                    <div style={{ textAlign: 'right' }}>Last Activity</div>
                </div>

                {threads.map((thread, index) => (
                    <div key={thread.id} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 100px 150px', padding: '1.5rem 1rem', borderBottom: index !== threads.length - 1 ? '1px solid var(--border-color)' : 'none', alignItems: 'center' }}>
                        <div>
                            <Link to={`/project/${thread.id}`} style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', textDecoration: 'none', display: 'block', marginBottom: '0.25rem' }}>
                                {thread.title}
                            </Link>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                Started by <span style={{ color: 'var(--accent-base)' }}>{thread.author}</span>
                            </div>
                        </div>
                        <div style={{ textAlign: 'center', fontWeight: 600 }}>{thread.replies}</div>
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>{thread.views}</div>
                        <div style={{ textAlign: 'right', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                            {thread.lastPost}
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-secondary)' }}>This is a simulated forum view.</p>
            </div>
        </div>
    );
};
