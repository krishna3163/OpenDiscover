import React from 'react';

interface HeroProps {
    onSearch?: (query: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ onSearch }) => {
    const [query, setQuery] = React.useState('');

    const handleSearch = () => {
        if (onSearch) onSearch(query);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleSearch();
    };

    return (
        <section style={{ padding: '6rem 0', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            {/* Background Glow */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '600px', height: '600px', background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)', opacity: 0.3, zIndex: -1 }}></div>

            <div className="container">
                <span className="badge badge-warning" style={{ marginBottom: '1.5rem' }}>The Home of Honest Software</span>
                <h2 style={{ fontSize: '3.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: '1.5rem' }}>
                    Discover Trustworthy<br />
                    <span style={{ color: 'var(--accent-base)' }}>Open Source Innovation.</span>
                </h2>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 3rem' }}>
                    We don’t distribute software — we help you find the best open-source apps, AI models, and tools from GitHub, Hugging Face, and F-Droid.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '4rem' }}>
                    <input
                        type="text"
                        placeholder="Search apps, libraries, models (e.g. 'privacy browser')..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        style={{
                            width: '450px',
                            padding: '1rem 1.5rem',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-color)',
                            background: 'var(--bg-card)',
                            color: 'var(--text-primary)',
                            outline: 'none'
                        }}
                    />
                    <button className="btn btn-primary" onClick={handleSearch} style={{ padding: '0 2rem' }}>Explore</button>
                </div>

                <div className="grid-cols-auto" style={{ maxWidth: '900px', margin: '0 auto', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    {['Privacy & Security', 'AI / ML Models', 'Productivity', 'Dev Tools'].map((cat) => (
                        <div key={cat} className="card" style={{ padding: '1rem', textAlign: 'center', cursor: 'pointer' }}>
                            <span style={{ fontWeight: 600 }}>{cat}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
