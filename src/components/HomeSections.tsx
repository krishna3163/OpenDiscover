import React from 'react';
import { Link } from 'react-router-dom';

export const TrustSignals: React.FC = () => {
    return (
        <section style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', textAlign: 'center' }}>
                    {[
                        { icon: '✅', text: 'License Verified' },
                        { icon: '🔐', text: 'No APKs Hosted' },
                        { icon: '🌍', text: 'Official Sources Only' },
                        { icon: '👩‍💻', text: 'Maintainer Friendly' },
                    ].map((item, i) => (
                        <div key={i} style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                            {item.text}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export const HowItWorks: React.FC = () => {
    return (
        <section className="container" style={{ padding: '6rem 0' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>How OpenDiscover Works</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Transparency at every step.</p>
            </div>

            <div className="grid-cols-auto" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                {[
                    { title: '1. We Scan', icon: '🔍', desc: 'We aggregate projects from trusted platforms like GitHub, Hugging Face, and F-Droid.' },
                    { title: '2. We Verify', icon: '📜', desc: 'We check for valid OSI-approved licenses (MIT, Apache, GPL) to ensure freedom.' },
                    { title: '3. We Link', icon: '🔗', desc: 'We redirect you to the official source. No repackaged binaries. No malware risk.' },
                ].map((step, i) => (
                    <div key={i} className="card" style={{ textAlign: 'center', padding: '2.5rem 1.5rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1.5rem', background: 'var(--bg-dark)', width: '80px', height: '80px', lineHeight: '80px', borderRadius: '50%', margin: '0 auto' }}>{step.icon}</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>{step.title}</h3>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export const CategoryGrid: React.FC = () => {
    const categories = [
        { name: 'AI & ML', icon: '🤖', link: '/ai-models' },
        { name: 'Privacy Tools', icon: '🔐', link: '/privacy-tools' },
        { name: 'Productivity', icon: '⚡', link: '/productivity' },
        { name: 'Dev Tools', icon: '🧑‍💻', link: '/dev-tools' },
        { name: 'Mobile Apps', icon: '📱', link: '/mobile-apps' },
        { name: 'Web Apps', icon: '🌐', link: '/productivity' }, // Fallback for Web Apps to Productivity for now
    ];

    return (
        <section className="container" style={{ paddingBottom: '6rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>Explore Categories</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
                {categories.map((cat, i) => (
                    <Link key={i} to={cat.link} className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', textDecoration: 'none', color: 'var(--text-primary)', gap: '1rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>{cat.icon}</span>
                        <span style={{ fontWeight: 600 }}>{cat.name}</span>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export const ComparisonTable: React.FC = () => {
    return (
        <section style={{ background: 'var(--bg-card)', padding: '6rem 0' }}>
            <div className="container">
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '4rem' }}>Why This Is Different</h2>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                                <th style={{ padding: '1.5rem', textAlign: 'left', fontSize: '1.2rem' }}>Platform</th>
                                <th style={{ padding: '1.5rem', fontSize: '1.1rem' }}>Hosts Files</th>
                                <th style={{ padding: '1.5rem', fontSize: '1.1rem' }}>License Clear</th>
                                <th style={{ padding: '1.5rem', fontSize: '1.1rem' }}>Open-Source Only</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-secondary)' }}>Random APK Sites</td>
                                <td style={{ padding: '1.5rem' }}>❌ (Risky)</td>
                                <td style={{ padding: '1.5rem' }}>❌</td>
                                <td style={{ padding: '1.5rem' }}>❌</td>
                            </tr>
                            <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                                <td style={{ padding: '1.5rem', textAlign: 'left', color: 'var(--text-secondary)' }}>GitHub</td>
                                <td style={{ padding: '1.5rem' }}>❌ (Safe)</td>
                                <td style={{ padding: '1.5rem' }}>⚠️ (Variable)</td>
                                <td style={{ padding: '1.5rem' }}>⚠️ (Mixed)</td>
                            </tr>
                            <tr style={{ background: 'rgba(var(--hue-accent), 0.1)' }}>
                                <td style={{ padding: '1.5rem', textAlign: 'left', fontWeight: 700, color: 'var(--accent-base)' }}>OpenDiscover</td>
                                <td style={{ padding: '1.5rem' }}>✅ (No Hosting)</td>
                                <td style={{ padding: '1.5rem' }}>✅ (Verified)</td>
                                <td style={{ padding: '1.5rem' }}>✅ (Guaranteed)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
};

export const MaintainerCTA: React.FC = () => {
    return (
        <section className="container" style={{ padding: '6rem 0' }}>
            <div className="card" style={{ background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(var(--hue-accent), 0.1) 100%)', border: '1px solid var(--accent-glow)', padding: '4rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem' }}>Are you an open-source maintainer?</h2>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
                    Get discovered by thousands of ethical users. We help you attract contributors and grow your community without the piracy risk.
                </p>
                <Link to="/submit" className="btn btn-primary" style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
                    Submit Your Project
                </Link>
            </div>
        </section>
    );
};
