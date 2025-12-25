import React from 'react';
import { Link } from 'react-router-dom';

export const Header: React.FC = () => {
  return (
    <header className="glass-header">
      <div className="container" style={{ height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.03em', background: 'linear-gradient(to right, #fff, var(--text-secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Krishna
            </h1>
          </Link>
          <span className="badge badge-legal" title="We only index openly licensed software">Open Source Only</span>
        </div>

        <nav style={{ display: 'flex', gap: '2rem' }}>
          <Link to="/" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Discover</Link>
          <Link to="/ai-models" className="nav-link">AI Models</Link>
          <Link to="/open-source-apps" className="nav-link">Open Source Apps</Link>
          <Link to="/profile" className="nav-link">About Krishna</Link>
          <Link to="/developers" className="nav-link">Developers</Link>
        </nav>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button
            className="btn btn-outline"
            title="Toggle Accessibility Options"
            onClick={() => {
              document.body.classList.toggle('a11y-high-contrast');
              alert("Toggled High Contrast Mode (Demo)");
            }}
            style={{ padding: '0.5rem', fontSize: '1.2rem' }}
          >
            ♿
          </button>
          <Link to="/login" className="btn btn-outline">Log In</Link>
          <Link to="/submit" className="btn btn-primary">Submit Project</Link>
        </div>
      </div>
    </header>
  );
};
