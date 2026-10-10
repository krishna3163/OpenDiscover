import React from 'react';
import { Link } from 'react-router-dom';
import { CATALOGUE_STATS, CATEGORIES, getProjectsByCategory } from '../lib/catalog';
import { CONTRIBUTING_URL, REPO_URL } from '../lib/routes';

/** Strip of guarantees shown right under the hero. */
export const TrustSignals: React.FC = () => (
  <section className="trust-strip" aria-label="What OpenDiscover guarantees">
    <div className="container trust-strip-inner">
      {[
        { icon: '✅', text: 'Licence verified' },
        { icon: '🔐', text: 'No APKs hosted' },
        { icon: '🌍', text: 'Official sources only' },
        { icon: '👩‍💻', text: 'Maintainer friendly' },
        { icon: '🧮', text: 'Transparent Trust Score' },
      ].map((item) => (
        <p key={item.text} className="trust-signal">
          <span aria-hidden="true">{item.icon}</span>
          {item.text}
        </p>
      ))}
    </div>
  </section>
);

/** Four-step explainer of how a listing gets published. */
export const HowItWorks: React.FC = () => (
  <section className="container section">
    <header className="section-head">
      <h2>How OpenDiscover works</h2>
      <p>Transparency at every step — and every claim is checkable.</p>
    </header>

    <ol className="steps-grid">
      {[
        {
          title: 'We scan',
          icon: '🔍',
          desc: 'Projects are aggregated from trusted platforms: GitHub, GitLab, Codeberg, Hugging Face and F-Droid.',
        },
        {
          title: 'We verify',
          icon: '📜',
          desc: 'We check for a valid OSI-approved licence (or a documented model licence) and confirm the upstream owner.',
        },
        {
          title: 'We score',
          icon: '🧮',
          desc: 'A public rubric turns licence, maintenance, community size and release signing into one 0–100 Trust Score.',
        },
        {
          title: 'We link',
          icon: '🔗',
          desc: 'You are sent to the official source. No repackaged binaries, no mirrors, no malware risk.',
        },
      ].map((step) => (
        <li key={step.title} className="card step-card">
          <span className="step-icon" aria-hidden="true">
            {step.icon}
          </span>
          <h3>{step.title}</h3>
          <p>{step.desc}</p>
        </li>
      ))}
    </ol>
  </section>
);

/** Category shortcuts with live counts. */
export const CategoryGrid: React.FC = () => (
  <section className="container section">
    <header className="section-head">
      <h2>Explore categories</h2>
      <p>{CATALOGUE_STATS.projects} curated projects across {CATALOGUE_STATS.categories} categories.</p>
    </header>

    <div className="category-grid">
      {CATEGORIES.map((category) => (
        <Link key={category.name} to={category.path} className="card category-card">
          <span className="category-icon" aria-hidden="true">
            {category.icon}
          </span>
          <strong>{category.name}</strong>
          <span className="category-blurb">{category.blurb}</span>
          <span className="category-count">{getProjectsByCategory(category.name).length} projects</span>
        </Link>
      ))}
    </div>
  </section>
);

/** Honest comparison against the alternatives people actually use. */
export const ComparisonTable: React.FC = () => {
  const rows = [
    {
      platform: 'Random APK / download sites',
      hosts: '❌ Repackaged binaries',
      licence: '❌ Rarely stated',
      openOnly: '❌ Mixed with paid software',
      score: '❌ None',
      highlight: false,
    },
    {
      platform: 'GitHub / GitLab search',
      hosts: '✅ Source code',
      licence: '⚠️ Varies per repo',
      openOnly: '⚠️ Mixed',
      score: '❌ Stars only',
      highlight: false,
    },
    {
      platform: 'App stores',
      hosts: '✅ Binaries',
      licence: '❌ Usually proprietary',
      openOnly: '❌ No',
      score: '⚠️ Ratings',
      highlight: false,
    },
    {
      platform: 'OpenDiscover',
      hosts: '✅ Links only, never hosts',
      licence: '✅ Verified + explained',
      openOnly: '✅ Open source only',
      score: '✅ Trust Score 0–100',
      highlight: true,
    },
  ];

  return (
    <section className="comparison-section">
      <div className="container section">
        <header className="section-head">
          <h2>Why this is different</h2>
          <p>Discovery without the download risk.</p>
        </header>

        <div className="table-scroll">
          <table className="comparison-table">
            <caption className="sr-only">Comparison of software discovery platforms</caption>
            <thead>
              <tr>
                <th scope="col">Platform</th>
                <th scope="col">What it hosts</th>
                <th scope="col">Licence clarity</th>
                <th scope="col">Open source only</th>
                <th scope="col">Trust signal</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.platform} className={row.highlight ? 'row-highlight' : undefined}>
                  <th scope="row">{row.platform}</th>
                  <td>{row.hosts}</td>
                  <td>{row.licence}</td>
                  <td>{row.openOnly}</td>
                  <td>{row.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

/** Call to action for maintainers who want their project listed. */
export const MaintainerCTA: React.FC = () => (
  <section className="container section">
    <div className="card cta-card">
      <h2>Are you an open-source maintainer?</h2>
      <p>
        Get discovered by people who care about licences and privacy. We send traffic straight to your repository — no
        repackaging, no ads around your download button.
      </p>
      <div className="btn-row">
        <Link to="/submit" className="btn btn-primary">
          Submit your project
        </Link>
        <a href={CONTRIBUTING_URL} className="btn btn-outline" target="_blank" rel="noopener noreferrer">
          Read the listing criteria
        </a>
        <a href={REPO_URL} className="btn btn-ghost" target="_blank" rel="noopener noreferrer">
          ★ Star the repo
        </a>
      </div>
    </div>
  </section>
);
