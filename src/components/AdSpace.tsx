import React from 'react';

interface AdSpaceProps {
    type?: 'banner' | 'sidebar';
}

export const AdSpace: React.FC<AdSpaceProps> = ({ type = 'banner' }) => {
    const isBanner = type === 'banner';

    return (
        <div
            style={{
                width: '100%',
                height: isBanner ? '120px' : '300px',
                background: 'var(--bg-card)',
                border: '1px dashed var(--border-color)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-muted)',
                margin: '2rem 0',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            <span style={{
                position: 'absolute',
                top: '0.5rem',
                left: '0.5rem',
                fontSize: '0.6rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                opacity: 0.5
            }}>
                Advertisement
            </span>
            <div style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Your Ad Here</p>
                <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>Support Open Source</p>
            </div>
        </div>
    );
};
