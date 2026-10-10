import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { CATALOGUE_STATS, CATEGORIES, getProjectsByCategory } from '../lib/catalog';
import { formatStars } from '../lib/search';

/**
 * Landing hero: value proposition, live catalogue stats, and the search box
 * that drives `ProjectExplorer` through the shared `?q=` URL parameter.
 */
export const Hero: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const next = new URLSearchParams(searchParams);
    const term = query.trim();
    if (term) next.set('q', term);
    else next.delete('q');
    setSearchParams(next, { replace: true });

    document.getElementById('project-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const stats = [
    { value: String(CATALOGUE_STATS.projects), label: 'Projects indexed' },
    { value: String(CATALOGUE_STATS.categories), label: 'Categories' },
    { value: String(CATALOGUE_STATS.averageTrust), label: 'Avg. Trust Score' },
    { value: formatStars(CATALOGUE_STATS.totalStars), label: 'Community stars' },
  ];

  return (
    <section className="hero">
      <div className="hero-glow" aria-hidden="true" />

      <div className="container">
        <span className="badge badge-warning">The home of honest software</span>

        <h1 className="hero-title">
          Discover trustworthy <span className="accent">open-source innovation.</span>
        </h1>

        <p className="hero-lead">
          We do not distribute software — we help you find the best open-source apps, AI models and tools from GitHub,
          Hugging&nbsp;Face and F-Droid, each with a transparent Trust Score and a plain-English licence explanation.
        </p>

        <form className="hero-search" onSubmit={submit} role="search">
          <label className="sr-only" htmlFor="hero-search">
            Search open-source projects
          </label>
          <input
            id="hero-search"
            type="search"
            placeholder="Search apps, libraries, models — e.g. “private browser”"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoComplete="off"
          />
          <button type="submit" className="btn btn-primary">
            Explore
          </button>
        </form>

        <ul className="hero-stats">
          {stats.map((stat) => (
            <li key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </li>
          ))}
        </ul>

        <nav className="hero-categories" aria-label="Popular categories">
          {CATEGORIES.map((category) => (
            <Link key={category.name} className="card hero-category" to={category.path}>
              <span className="hero-category-icon" aria-hidden="true">
                {category.icon}
              </span>
              <span className="hero-category-name">{category.name}</span>
              <span className="hero-category-count">{getProjectsByCategory(category.name).length} projects</span>
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
};

export default Hero;
