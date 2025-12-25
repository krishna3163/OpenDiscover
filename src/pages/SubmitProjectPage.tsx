import React from 'react';

export const SubmitProjectPage: React.FC = () => {
    // User provided Google Form URL
    const GOOGLE_FORM_URL = "https://forms.gle/otdtsnDH2FoweAqA7";

    return (
        <div className="container" style={{ padding: '6rem 1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '2rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '1rem' }}>Submit a Project</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Found an awesome open-source tool? Let us know!
                        <br />Fill out the form below to suggest it for the platform.
                    </p>
                </div>

                {/* Google Form Embed */}
                <div style={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: 'var(--radius-md)',
                    background: '#ffffff', // Google forms are usually white
                    minHeight: '800px'
                }}>
                    <iframe
                        src={GOOGLE_FORM_URL}
                        width="100%"
                        height="800"
                        frameBorder="0"
                        marginHeight={0}
                        marginWidth={0}
                        style={{ display: 'block' }}
                    >
                        Loading form...
                    </iframe>
                </div>

                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Or contact us directly:</p>
                    <a href="mailto:contact@opendiscover.example" className="btn btn-outline">
                        📧 Email Support
                    </a>
                </div>
            </div>
        </div>
    );
};
