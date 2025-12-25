import React from 'react';
import { Link } from 'react-router-dom';

export const DevelopersPage: React.FC = () => {
    return (
        <div className="container" style={{ padding: '4rem 1.5rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', textAlign: 'center' }}>For Developers</h2>

            {/* Team Section */}
            <div style={{ marginBottom: '4rem' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem', textAlign: 'center' }}>Meet the Team</h3>
                <div className="grid-cols-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

                    {/* Krishna */}
                    <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="card" style={{ textAlign: 'center', padding: '2rem', cursor: 'pointer', transition: 'transform 0.2s', border: '1px solid var(--accent-base)' }}>
                            <div style={{ width: '80px', height: '80px', background: 'var(--accent-base)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', fontWeight: 700 }}>K</div>
                            <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Krishna</h4>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Lead Developer & Maintainer</p>
                            <span style={{ fontSize: '0.8rem', color: 'var(--accent-base)', marginTop: '0.5rem', display: 'block' }}>View Profile →</span>
                        </div>
                    </Link>

                    {/* Piyush Mishra */}
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ width: '80px', height: '80px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--text-secondary)', fontWeight: 700 }}>P</div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Piyush Mishra</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Developer</p>
                    </div>

                    {/* Md kaif */}
                    <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ width: '80px', height: '80px', background: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'var(--text-secondary)', fontWeight: 700 }}>M</div>
                        <h4 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Md kaif</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Developer</p>
                    </div>

                </div>
            </div>

            <div className="card" style={{ marginBottom: '2rem', maxWidth: '800px', margin: '0 auto 2rem' }}>
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

            <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
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
