import React from 'react';

export const DevelopersPage: React.FC = () => {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '800px' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem' }}>For Developers</h2>

            <div className="card" style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Submit Your Project</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    We welcome submissions from the community. Projects must meet the following criteria:
                </p>
                <ul style={{ paddingLeft: '1.5rem', marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
                    <li>OSI-Approved License (MIT, Apache, GPL, etc.)</li>
                    <li>Publicly accessible source code (GitHub, GitLab, etc.)</li>
                    <li>Active maintenance (commits within last 12 months preferred)</li>
                </ul>
                <a href="/submit" className="btn btn-primary">Submit Now</a>
            </div>

            <div className="card">
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>OpenDiscover API</h3>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                    Building a tool? Access our index programmatically.
                </p>
                <pre style={{ background: 'var(--bg-dark)', padding: '1rem', borderRadius: 'var(--radius-sm)', overflowX: 'auto', marginBottom: '1rem' }}>
                    <code>GET https://api.opendiscover.dev/v1/projects?category=ai</code>
                </pre>
                <button className="btn btn-outline" disabled>Documentation Coming Soon</button>
            </div>
        </div>
    );
};
