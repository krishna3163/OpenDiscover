import React, { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/auth';
import { useFavorites } from '../context/favorites';
import { PRIMARY_NAV } from '../lib/routes';

/**
 * Site header: primary navigation, favourites shortcut, and the account menu.
 *
 * Menus close on `Escape` and on outside clicks, and every control exposes its
 * expanded state to assistive technology.
 */
export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, isAuthenticated, isStaff, logout } = useAuth();
  const { count } = useFavorites();
  const navigate = useNavigate();
  const profileRef = useRef<HTMLDivElement>(null);

  // Close the account menu on outside click / Escape.
  useEffect(() => {
    if (!isProfileOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!profileRef.current?.contains(event.target as Node)) setIsProfileOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsProfileOpen(false);
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isProfileOpen]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMenuOpen(false);
    navigate('/');
  };

  const initial = user?.name?.charAt(0).toUpperCase() ?? '?';

  return (
    <header className="glass-header">
      <div className="container header-inner">
        <div className="header-brand">
          <Link to="/" className="logo" onClick={() => setIsMenuOpen(false)}>
            <span className="logo-mark" aria-hidden="true">
              ◎
            </span>
            OpenDiscover
          </Link>
          <span className="badge badge-legal" title="We only index openly licensed software">
            Open Source Only
          </span>
          {isStaff && (
            <span className="badge badge-staff" title="Demo staff view">
              Staff
            </span>
          )}
        </div>

        {/* Desktop navigation */}
        <nav className="desktop-nav" aria-label="Primary">
          {PRIMARY_NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `nav-link${isActive ? ' nav-link-active' : ''}`}
            >
              {item.label}
              {item.path === '/favorites' && count > 0 && <span className="nav-count">{count}</span>}
            </NavLink>
          ))}
          <NavLink to="/chat/Bot" className={({ isActive }) => `nav-link nav-ai${isActive ? ' nav-link-active' : ''}`}>
            🤖 AI
          </NavLink>
        </nav>

        {/* Desktop actions */}
        <div className="desktop-actions">
          {isAuthenticated && user ? (
            <div className="profile-menu" ref={profileRef}>
              <button
                type="button"
                className="avatar-button"
                onClick={() => setIsProfileOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={isProfileOpen}
                title="Account"
              >
                {initial}
              </button>

              {isProfileOpen && (
                <div className="profile-dropdown" role="menu">
                  <div className="profile-dropdown-head">
                    <strong>{user.name}</strong>
                    <span>{user.email}</span>
                    {isStaff && <em>Demo staff account · not real auth</em>}
                  </div>
                  <Link to="/profile" role="menuitem" className="profile-dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    Your profile
                  </Link>
                  <Link to="/favorites" role="menuitem" className="profile-dropdown-item" onClick={() => setIsProfileOpen(false)}>
                    Favourites {count > 0 ? `(${count})` : ''}
                  </Link>
                  <button type="button" role="menuitem" className="profile-dropdown-item danger" onClick={handleLogout}>
                    Log out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline">
              Log in
            </Link>
          )}
          <Link to="/submit" className="btn btn-primary">
            Submit Project
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="mobile-toggle"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {isMenuOpen && (
          <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile">
            {PRIMARY_NAV.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) => (isActive ? 'nav-link-active' : undefined)}
              >
                {item.label}
                {item.path === '/favorites' && count > 0 ? ` (${count})` : ''}
              </NavLink>
            ))}
            <Link to="/chat/Bot" onClick={() => setIsMenuOpen(false)}>
              🤖 AI Assistant
            </Link>
            <div className="mobile-menu-divider" />
            {isAuthenticated ? (
              <button type="button" className="mobile-menu-button" onClick={handleLogout}>
                Log out
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                Log in
              </Link>
            )}
            <Link to="/submit" className="btn btn-primary" onClick={() => setIsMenuOpen(false)} style={{ textAlign: 'center' }}>
              Submit Project
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
