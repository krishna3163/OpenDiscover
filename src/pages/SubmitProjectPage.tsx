import React from 'react';
import { Link } from 'react-router-dom';
import { SITE } from '../config/site';
import { CONTRIBUTING_URL, ISSUE_URL } from '../lib/routes';

/**
 * Submission page.
 *
 * Two paths: the Google Form (for anyone) and a pull request against
 * `src/data/projects.ts` (for developers). The iframe is kept because the form
 * is the maintainer's inbox, but some Google Forms refuse to be embedded, so
 * there is always a visible direct link as well.
 */
export const SubmitProjectPage: React.FC = () => (
  <div className="container page-narrow">
    <header className="section-head">
      <h1>Submit a project</h1>
      <p>
        Found an open-source tool worth indexing? Send it over. Every listing is reviewed by a human before it appears.
      </p>
    </header>

    <section className="card detail-block" aria-labelledby="criteria-heading">
      <h2 id="criteria-heading" className="section-title">
        What we accept
      </h2>
      <ul className="check-list">
        <li>An OSI-approved licence (MIT, Apache-2.0, GPL, MPL…) or a documented model licence for AI weights.</li>
        <li>A public source repository — GitHub, GitLab, Codeberg, Hugging Face, or an official F-Droid listing.</li>
        <li>The <strong>official upstream</strong> URL. No mirrors, no repackaged binaries, no download portals.</li>
        <li>Some sign of life: a commit, release or issue activity within the last 12 months.</li>
      </ul>
      <p className="notice notice-warning">
        We will not list cracked, pirated or licence-stripped software. That rule is the entire point of the site.
      </p>
    </section>

    <section className="card detail-block" aria-labelledby="form-heading">
      <h2 id="form-heading" className="section-title">
        Option 1 · Submission form
      </h2>
      <p>
        If the embedded form does not render (Google sometimes blocks framing),{' '}
        <a href={SITE.submissionFormUrl} target="_blank" rel="noopener noreferrer">
          open it in a new tab ↗
        </a>
        .
      </p>
      <div className="form-embed">
        <iframe
          title="OpenDiscover project submission form"
          src={SITE.submissionFormUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        >
          Loading form… If it stays blank,{' '}
          <a href={SITE.submissionFormUrl}>open the submission form directly</a>.
        </iframe>
      </div>
      <a href={SITE.submissionFormUrl} className="btn btn-primary btn-block" target="_blank" rel="noopener noreferrer">
        Open the form in a new tab ↗
      </a>
    </section>

    <section className="card detail-block" aria-labelledby="pr-heading">
      <h2 id="pr-heading" className="section-title">
        Option 2 · Send a pull request
      </h2>
      <p>
        Developers: add an entry to <code>src/data/projects.ts</code>. Search tags are derived automatically, so you
        only supply the facts — title, description, category, licence, source, stars, upstream link, Trust Score and
        platforms.
      </p>
      <pre className="code-block">
        <code>{`{
  id: 612,
  title: "Your Project",
  description: "One honest sentence about what it does.",
  category: "Dev Tools",
  license: "MIT",
  source: "GitHub",
  stars: "1.4k",
  verified: true,
  link: "https://github.com/you/your-project",
  trustScore: 88,
  platforms: ["Linux", "Windows"],
  lastUpdated: "2 weeks ago"
}`}</code>
      </pre>
      <div className="btn-row">
        <a href={CONTRIBUTING_URL} className="btn btn-primary" target="_blank" rel="noopener noreferrer">
          Read CONTRIBUTING.md
        </a>
        <a href={ISSUE_URL} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
          Or open an issue instead
        </a>
        <Link to="/developers" className="btn btn-ghost">
          Developer docs
        </Link>
      </div>
    </section>

    <p className="login-footnote">
      Prefer email? Write to <a href={`mailto:${SITE.contactEmail}`}>{SITE.contactEmail}</a> with the repository link
      and a sentence about why it belongs here.
    </p>
  </div>
);

export default SubmitProjectPage;
