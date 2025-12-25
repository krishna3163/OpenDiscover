import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="glass-header">
      <div className="container" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', whiteSpace: 'nowrap' }}>
          <Link to="/" style={{ textDecoration: 'none' }} onClick={() => setIsMenuOpen(false)}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'flex', alignItems: 'baseline', gap: '0.4rem', flexWrap: 'nowrap' }}>
              OpenDiscover
            </h1>
          </Link>
          <span className="badge badge-legal" title="We only index openly licensed software">Open Source Only</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '3rem', whiteSpace: 'nowrap' }}>
          <Link to="/" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Discover</Link>
          <Link to="/ai-models" className="nav-link">AI Models</Link>
          <Link to="/open-source-apps" className="nav-link">Open Source Apps</Link>
          <Link to="/community" className="nav-link">Community</Link>
          <Link to="/profile" className="nav-link">About Krishna</Link>
          <Link to="/developers" className="nav-link">Developers</Link>
        </nav>

        {/* Desktop Actions */}
        <div className="desktop-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Hi, {user.name}</span>
              <button onClick={logout} className="btn btn-outline" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>Log Out</button>
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline">Log In</Link>
          )}
          <Link to="/submit" className="btn btn-primary">Submit Project</Link>
        </div>

        {/* Mobile Toggle Button */}
        <button
          className="mobile-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <div className="mobile-menu">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>Discover</Link>
            <Link to="/ai-models" onClick={() => setIsMenuOpen(false)}>AI Models</Link>
            <Link to="/open-source-apps" onClick={() => setIsMenuOpen(false)}>Open Source Apps</Link>
            <Link to="/community" onClick={() => setIsMenuOpen(false)}>Community</Link>
            <Link to="/profile" onClick={() => setIsMenuOpen(false)}>About Krishna</Link>
            <Link to="/developers" onClick={() => setIsMenuOpen(false)}>Developers</Link>
            <div style={{ borderTop: '1px solid var(--border-color)', margin: '0.5rem 0' }}></div>
            {isAuthenticated ? (
              <button onClick={() => { logout(); setIsMenuOpen(false); }} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', padding: '0.5rem 0', textAlign: 'left', fontSize: '1.1rem' }}>Log Out</button>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>Log In</Link>
            )}
            <Link to="/submit" className="btn btn-primary" onClick={() => setIsMenuOpen(false)} style={{ textAlign: 'center' }}>Submit Project</Link>
          </div>
        )}
      </div>
    </header>
  );
};
