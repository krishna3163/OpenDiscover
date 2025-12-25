import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PROJECTS_DB } from '../data/projects';
import { AdSpace } from '../components/AdSpace';
import { useAuth } from '../context/AuthContext';

const DiscussionSection: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [comments, setComments] = useState([
        { id: 1, user: 'Alex', text: 'Has anyone tried this with the new API update?', time: '2 hours ago', avatar: 'A' },
        { id: 2, user: 'Sarah', text: 'Works great! The dark mode in v2 is amazing.', time: '5 hours ago', avatar: 'S' }
    ]);
    const [newComment, setNewComment] = useState('');

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        const comment = {
            id: Date.now(),
            user: user?.name || 'Guest',
            text: newComment,
            time: 'Just now',
            avatar: user?.name?.[0] || '?'
        };

        setComments([comment, ...comments]);
        setNewComment('');
    };

    return (
        <div>
            {/* Comment List */}
            <div style={{ marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {comments.map(c => (
                    <div key={c.id} style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '1px solid var(--border-color)' }}>
                            {c.avatar}
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>
                                {c.user} <span style={{ fontWeight: 400, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>• {c.time}</span>
                            </div>
                            <p style={{ lineHeight: 1.5, color: 'var(--text-primary)' }}>{c.text}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Post Form */}
            {isAuthenticated ? (
                <form onSubmit={handlePost} style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-base)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff' }}>
                        {user?.name?.[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Add to the discussion..."
                            style={{ width: '100%', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: 'var(--bg-dark)', color: 'var(--text-primary)', minHeight: '100px', marginBottom: '0.5rem' }}
                        />
                        <button className="btn btn-primary">Post Comment</button>
                    </div>
                </form>
            ) : (
                <div style={{ padding: '1.5rem', background: 'var(--bg-dark)', borderRadius: 'var(--radius-sm)', textAlign: 'center', border: '1px solid var(--border-color)' }}>
                    <p style={{ marginBottom: '1rem' }}>Log in to join the conversation.</p>
                    <Link to="/login" className="btn btn-outline">Log In / Sign Up</Link>
                </div>
            )}
        </div>
    );
};

// Helper to explain licenses in plain English
const getLicenseExplanation = (license: string) => {
    if (license.includes('MIT')) return "You can use, modify, and distribute this software freely, even commercially, with attribution.";
    if (license.includes('GPL')) return "You can use and modify this freely, but if you distribute changes, they must also be open source.";
    if (license.includes('Apache')) return "Permissive license similar to MIT, but providing an express grant of patent rights.";
    if (license.includes('CreativeML')) return "Open model license suitable for AI. Use freely but respect ethical usage guidelines.";
    return "This project has a recognized open-source license.";
};

export const ProjectDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const project = PROJECTS_DB.find(p => p.id === Number(id));
    const [showLicenseInfo, setShowLicenseInfo] = useState(false);

    if (!project) {
        return <div className="container" style={{ padding: '4rem' }}>Project not found.</div>;
    }

    const isAI = project.category === 'AI / ML Models';
    const trustScore = project.trustScore || 85;

    // Color coding for score
    const scoreColor = trustScore > 90 ? '#10b981' : trustScore > 70 ? '#f59e0b' : '#ef4444';

    return (
        <div className="container" style={{ padding: '4rem 1.5rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '3rem' }}>

            {/* Main Content */}
            <div>
                {/* Header */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>{project.title}</h1>
                        {project.verified && <span title="Verified" style={{ color: '#38bdf8', fontSize: '1.5rem' }}>✓</span>}
                    </div>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        {project.category} • Last updated {project.lastUpdated || 'recently'}
                    </p>
                </div>

                {/* License Explainer Section (Priority 2) */}
                <div
                    className="card"
                    style={{
                        marginBottom: '2rem',
                        background: 'linear-gradient(to right, rgba(56, 189, 248, 0.1), transparent)',
                        border: '1px solid rgba(56, 189, 248, 0.2)',
                        cursor: 'pointer'
                    }}
                    onClick={() => setShowLicenseInfo(!showLicenseInfo)}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#38bdf8', fontWeight: 600, marginBottom: '0.5rem' }}>
                        <span>🏁</span> License: {project.license}
                        <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>(Click to explain)</span>
                    </div>
                    {showLicenseInfo && (
                        <p style={{ fontSize: '1rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '4px' }}>
                            ℹ <strong>What this means:</strong> {getLicenseExplanation(project.license)}
                        </p>
                    )}
                </div>

                {/* Why Trusted Checklist (Priority 1) */}
                <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Why this project is trusted</h3>
                    <div className="grid-cols-auto" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        {[
                            'Verified Source Code',
                            'OSI Approved License',
                            'Active Maintainers',
                            isAI ? 'Model Card Available' : 'No Taking Data'
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                <span style={{ color: '#10b981' }}>✔</span> {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Project Overview</h3>
                    <p style={{ lineHeight: 1.7, marginBottom: '1.5rem' }}>
                        {project.description}
                    </p>
                    <p style={{ lineHeight: 1.7 }}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    </p>

                    <div style={{ marginTop: '2rem' }}>
                        <h4 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Supported Platforms</h4>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                            {project.platforms?.map(p => (
                                <span key={p} className="badge" style={{ border: '1px solid var(--border-color)' }}>{p}</span>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Discussion Section */}
                <div className="card" style={{ marginTop: '2rem', padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>💬</span> Commmunity Discussion
                    </h3>
                    <DiscussionSection />
                </div>
            </div>

            {/* Sidebar */}
            <aside>
                {/* Trust Score (Priority 4) */}
                <div className="card" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem', borderTop: `4px solid ${scoreColor}` }}>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>OPEN SOURCE TRUST SCORE</div>
                    <div style={{ fontSize: '3rem', fontWeight: 800, color: scoreColor, lineHeight: 1 }}>{trustScore}</div>
                    <div style={{ fontSize: '0.9rem', color: scoreColor }}>Excellent</div>
                    <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        score based on license, age, and stars
                    </div>
                </div>

                {/* Action Button */}
                <div style={{ marginBottom: '2rem' }}>
                    <a href={project.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ width: '100%', marginBottom: '0.5rem' }}>
                        View on {project.source} ↗
                    </a>
                    <button className="btn btn-outline" style={{ width: '100%' }}>
                        ❤ Sponsor Maintainer
                    </button>
                    <a href={`${project.link}${project.source === 'GitHub' ? '/discussions' : ''}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline" style={{ width: '100%', marginTop: '0.5rem' }}>
                        💬 Join Community
                    </a>
                </div>

                {/* Downloads Chart Mock */}
                <div style={{ marginBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Activity (30 days)</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700 }}>High</span>
                    </div>
                    {/* SVG Line Graph (Sparkline) */}
                    <div style={{ height: '60px', width: '100%', overflow: 'hidden' }}>
                        <svg viewBox="0 0 300 60" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                            <defs>
                                <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                                    <stop offset="0%" stopColor="var(--accent-base)" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="var(--accent-base)" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            {/* Fill Area */}
                            <path
                                d="M0,60 L0,35 L20,30 L40,45 L60,25 L80,35 L100,20 L120,25 L140,15 L160,25 L180,40 L200,30 L220,50 L240,45 L260,55 L280,40 L300,20 L300,60 Z"
                                fill="url(#gradient)"
                            />
                            {/* Line Stroke */}
                            <polyline
                                points="0,35 20,30 40,45 60,25 80,35 100,20 120,25 140,15 160,25 180,40 200,30 220,50 240,45 260,55 280,40 300,20"
                                fill="none"
                                stroke="var(--accent-base)"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                </div>
            </aside>

            {/* Ad Space (Sidebar) */}
            <AdSpace type="sidebar" />
        </div>
    );
};
