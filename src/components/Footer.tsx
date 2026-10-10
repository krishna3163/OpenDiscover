import React from 'react';
import { Link } from 'react-router-dom';
import { CATALOGUE_STATS } from '../lib/catalog';
import { ISSUE_URL, PRIMARY_NAV, REPO_URL, SITE_NAME } from '../lib/routes';

/**
 * Site footer: legal disclaimer (this project links, it never distributes),
 * navigation, and the real project links.
 */
export const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-col footer-about">
          <strong className="footer-logo">◎ {SITE_NAME}</strong>
          <p>
            A discovery metadata engine. We index {CATALOGUE_STATS.projects} open-source projects and link to their
            official upstream sources — we never host, repackage or distribute binaries.
          </p>
          <p className="footer-badge">
            <span className="badge badge-legal">OSI licences only</span>{' '}
            <span className="badge badge-muted">{CATALOGUE_STATS.verified} verified</span>
          </p>
        </div>

        <nav className="footer-col" aria-label="Explore">
          <h3>Explore</h3>
          <ul>
            {PRIMARY_NAV.map((item) => (
              <li key={item.path}>
                <Link to={item.path}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/chat/Bot">AI Assistant</Link>
            </li>
          </ul>
        </nav>

        <nav className="footer-col" aria-label="Project">
          <h3>Project</h3>
          <ul>
            <li>
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer">
                Source on GitHub
              </a>
            </li>
            <li>
              <a href={`${REPO_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">
                Contributing guide
              </a>
            </li>
            <li>
              <a href={`${REPO_URL}/blob/main/SECURITY.md`} target="_blank" rel="noopener noreferrer">
                Security policy
              </a>
            </li>
            <li>
              <a href={`${REPO_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">
                MIT licence
              </a>
            </li>
            <li>
              <a href={ISSUE_URL} target="_blank" rel="noopener noreferrer">
                Report a bad listing
              </a>
            </li>
          </ul>
        </nav>

        <div className="footer-col">
          <h3>Maintainer</h3>
          <ul>
            <li>
              <Link to="/profile">About Krishna</Link>
            </li>
            <li>
              <a href="https://github.com/krishna3163" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
            </li>
            <li>
              <a href="https://linkedin.com/in/krishna0858" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </li>
            <li>
              <a href="mailto:kk3163019@gmail.com">kk3163019@gmail.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container footer-legal">
        <p>
          <strong>Legal disclaimer:</strong> OpenDiscover does not host, distribute or modify any software binaries.
          All projects are indexed links to official sources (GitHub, GitLab, Codeberg, F-Droid, Hugging Face).
          Licence summaries are convenience explanations, not legal advice.
        </p>
        <p>
          © {year} {SITE_NAME} · MIT licensed · Designed &amp; built by <Link to="/profile">Krishna</Link> and
          contributors.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
