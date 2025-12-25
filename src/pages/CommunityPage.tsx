import React from 'react';
import { Link } from 'react-router-dom';

export const CommunityPage: React.FC = () => {
    const categories = [
        { id: 1, title: 'Announcements & News', description: 'Official updates from the OpenDiscover team.', topics: 12, posts: 45, icon: '📢' },
        { id: 2, title: 'General Discussion', description: 'Talk about anything related to open source and tech.', topics: 340, posts: 1205, icon: '💬' },
        { id: 3, title: 'Project Showcase', description: 'Show off your own projects or findings.', topics: 89, posts: 412, icon: '🚀' },
        { id: 4, title: 'Help & Support', description: 'Need help? Ask the community.', topics: 156, posts: 678, icon: '❓' },
        { id: 5, title: 'Modding & Customization', description: 'Deep dive into tweaking and modding apps.', topics: 201, posts: 980, icon: '🔧' },
    ];

    return (
        <div className="container" style={{ padding: '2rem 1.5rem', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 300px', gap: '2rem' }}>

            {/* Main Forum Content */}
            <div>
                <div style={{ marginBottom: '2rem', padding: '1.5rem', background: 'linear-gradient(to right, var(--accent-base), transparent)', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-base)' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Community Hub</h1>
                    <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Welcome to the official OpenDiscover forums. Be kind and helpful!</p>
                </div>

                <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                    <div style={{ padding: '1rem', background: 'var(--bg-dark)', borderBottom: '1px solid var(--border-color)', fontWeight: 700 }}>
                        Forums
                    </div>
                    {categories.map((cat, index) => (
                        <div key={cat.id} style={{ display: 'flex', alignItems: 'center', padding: '1.5rem', borderBottom: index !== categories.length - 1 ? '1px solid var(--border-color)' : 'none' }}>
                            <div style={{ fontSize: '2rem', marginRight: '1.5rem', background: 'var(--bg-dark)', width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
                                {cat.icon}
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                                    <Link to={`/community/${cat.title.toLowerCase().replace(/ /g, '-')}`} style={{ textDecoration: 'none', color: 'inherit' }}>{cat.title}</Link>
                                </h3>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{cat.description}</p>
                            </div>
                            <div style={{ textAlign: 'right', minWidth: '100px' }}>
                                <div style={{ fontWeight: 700 }}>{cat.topics}</div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Topics</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Recent Activity</h3>
                        <button className="btn btn-outline">View All</button>
                    </div>
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card" style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                            <div style={{ width: '40px', height: '40px', background: 'var(--border-color)', borderRadius: '50%' }}></div>
                            <div>
                                <div style={{ fontWeight: 600 }}>New AI Model Released: DeepSeek-V3</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Started by Krishna • 2 hours ago</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sidebar */}
            <aside>
                <div className="card" style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '10px', height: '10px', background: '#10b981', borderRadius: '50%', display: 'inline-block' }}></span>
                        Staff Online
                    </h3>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {['Krishna', 'Piyush', 'Kaif', 'Bot'].map(staff => (
                            <li key={staff} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ width: '32px', height: '32px', background: 'var(--accent-base)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '0.8rem' }}>
                                    {staff[0]}
                                </div>
                                <span style={{ flex: 1 }}>{staff}</span>
                                <Link to={`/chat/${staff}`} style={{ fontSize: '0.8rem', color: 'var(--accent-base)', textDecoration: 'none', border: '1px solid var(--border-color)', padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)' }}>
                                    Chat
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="card">
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Forum Stats</h4>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Threads:</span>
                        <span style={{ fontWeight: 600 }}>8,912</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Total Posts:</span>
                        <span style={{ fontWeight: 600 }}>142,503</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Members:</span>
                        <span style={{ fontWeight: 600 }}>25,401</span>
                    </div>
                </div>
            </aside>
        </div>
    );
};
