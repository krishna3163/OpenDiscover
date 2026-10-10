/**
 * Tiny date helpers — no date library, no timezone surprises.
 */

/** `"2 hours ago"` from an ISO timestamp. */
export function timeAgo(iso: string): string {
  const seconds = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 1000));
  if (seconds < 45) return 'just now';

  const units = [
    { limit: 60, divisor: 1, label: 'second' },
    { limit: 3600, divisor: 60, label: 'minute' },
    { limit: 86400, divisor: 3600, label: 'hour' },
    { limit: 604800, divisor: 86400, label: 'day' },
    { limit: 2592000, divisor: 604800, label: 'week' },
    { limit: 31536000, divisor: 2592000, label: 'month' },
    { limit: Number.POSITIVE_INFINITY, divisor: 31536000, label: 'year' },
  ];

  for (const unit of units) {
    if (seconds < unit.limit) {
      const value = Math.max(1, Math.floor(seconds / unit.divisor));
      return `${value} ${unit.label}${value === 1 ? '' : 's'} ago`;
    }
  }
  return 'just now';
}

