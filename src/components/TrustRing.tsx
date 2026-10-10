import React from 'react';
import { trustTier } from '../lib/search';

interface TrustRingProps {
  score: number;
  /** Diameter in pixels. */
  size?: number;
  strokeWidth?: number;
  label?: string;
}

/**
 * Circular Trust Score gauge.
 * The ring length is derived from the score, so it can never disagree with the
 * number in the middle.
 */
export const TrustRing: React.FC<TrustRingProps> = ({ score, size = 132, strokeWidth = 10, label }) => {
  const tier = trustTier(score);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="trust-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img"
        aria-label={`Trust Score ${clamped} out of 100 — ${tier.label}`}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border-color)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tier.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 600ms ease' }}
        />
      </svg>
      <div className="trust-ring-value">
        <strong style={{ color: tier.color }}>{clamped}</strong>
        <span>{label ?? tier.label}</span>
      </div>
    </div>
  );
};

export default TrustRing;
