import React, { useState } from 'react';

export const SubmitProjectModal: React.FC = () => {
    const [url, setUrl] = useState('');

    return (
        <div className="card" style={{ maxWidth: '600px', margin: '4rem auto' }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Submit a Project</h3>

            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                Help the community discover great open source software. We index projects from GitHub, GitLab, Hugging Face, and F-Droid.
            </p>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Project Repository / Store Link</label>
                <input
                    type="url"
                    placeholder="e.g. https://github.com/torvalds/linux"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    style={{
                        display: 'block',
                        width: '100%',
                        padding: '1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-dark)',
                        color: 'var(--text-primary)'
                    }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                    <input type="checkbox" />
                    The project has an OSI-approved Open Source license (MIT, GPL, etc).
                </label>
                <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.9rem' }}>
                    <input type="checkbox" />
                    I am the maintainer (optional).
                </label>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} disabled={!url}>
                Fetch Metadata & Submit
            </button>
        </div>
    );
};
