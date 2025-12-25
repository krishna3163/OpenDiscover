import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
    return (
        <footer style={{ borderTop: '1px solid var(--border-color)', padding: '4rem 0', marginTop: 'auto', background: 'var(--bg-card)' }}>
            <div className="container" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                <div style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem' }}>
                    <p style={{ fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>LEGAL DISCLAIMER</p>
                    <p>
                        OpenDiscover does not host, distribute, or modify any software binaries.
                        All projects are indexed links to official sources (GitHub, F-Droid, Hugging Face, etc.).
                        We are a discovery metadata engine only.
                    </p>
                </div>

                <p style={{ marginBottom: '1rem' }}>
                    © 2025 OpenDiscover. Designed & Built by
                    <Link to="/profile" style={{ color: 'var(--accent-base)', textDecoration: 'none', fontWeight: 600, marginLeft: '5px' }}>
                        Krishna
                    </Link>
                </p>

                <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/profile">About Me</Link>
                    <a href="https://github.com/krishna3163" target="_blank" rel="noopener noreferrer">GitHub</a>
                    <a href="https://linkedin.com/in/krishna0858" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                    <a href="https://instagram.com/krishna.0858" target="_blank" rel="noopener noreferrer">Instagram</a>
                    <Link to="/open-source-apps">Apps</Link>
                </div>
            </div>
        </footer>
    );
};
