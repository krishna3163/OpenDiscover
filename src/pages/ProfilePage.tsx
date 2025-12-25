import React from 'react';

export const ProfilePage: React.FC = () => {
    return (
        <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
                <div style={{
                    width: '120px',
                    height: '120px',
                    background: 'linear-gradient(135deg, var(--accent-base), #a855f7)',
                    borderRadius: '50%',
                    margin: '0 auto 2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '3rem',
                    fontWeight: 800,
                    color: '#fff',
                    boxShadow: '0 0 30px rgba(var(--accent-base-rgb), 0.4)'
                }}>
                    K
                </div>

                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Krishna</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>
                    Full Stack Developer & Open Source Enthusiast
                </p>

                <div style={{
                    display: 'grid',
                    gap: '1rem',
                    maxWidth: '400px',
                    margin: '0 auto',
                    textAlign: 'left'
                }}>
                    <a href="mailto:kk3163019@gmail.com" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '1.5rem' }}>📧</span>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email</div>
                            <div style={{ fontWeight: 600 }}>kk3163019@gmail.com</div>
                        </div>
                    </a>

                    <a href="https://linkedin.com/in/krishna0858" target="_blank" rel="noopener noreferrer" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '1.5rem' }}>💼</span>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>LinkedIn</div>
                            <div style={{ fontWeight: 600 }}>krishna0858</div>
                        </div>
                    </a>

                    <a href="https://github.com/krishna3163" target="_blank" rel="noopener noreferrer" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '1.5rem' }}>💻</span>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>GitHub</div>
                            <div style={{ fontWeight: 600 }}>krishna3163</div>
                        </div>
                    </a>

                    <a href="https://instagram.com/krishna.0858" target="_blank" rel="noopener noreferrer" className="card" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '1.5rem' }}>📸</span>
                        <div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Instagram</div>
                            <div style={{ fontWeight: 600 }}>krishna.0858</div>
                        </div>
                    </a>
                </div>

                <div style={{ marginTop: '3rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                    <p>
                        "Building the future of open source discovery. Passionate about creating tools that empower developers and users alike."
                    </p>
                </div>
            </div>
        </div>
    );
};
