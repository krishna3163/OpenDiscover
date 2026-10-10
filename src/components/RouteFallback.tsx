import React from 'react';

/** Shown while a lazily-loaded route chunk is being fetched. */
export const RouteFallback: React.FC<{ label?: string }> = ({ label = 'Loading' }) => (
  <div className="container route-fallback" role="status" aria-live="polite">
    <span className="sr-only">{label}…</span>
    <div className="skeleton skeleton-title" aria-hidden="true" />
    <div className="skeleton-grid">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <div className="skeleton skeleton-card" key={index} aria-hidden="true" />
      ))}
    </div>
  </div>
);

export default RouteFallback;
