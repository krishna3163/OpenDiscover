import React from 'react';
import { normalize, tokenize } from '../lib/search';

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

interface HighlightProps {
  text: string;
  query?: string;
  /** Trim long descriptions to this many characters when no query matches. */
  maxLength?: number;
}

/**
 * Render `text` with the search terms wrapped in `<mark>`, so visitors can see
 * *why* a result matched. Falls back to plain text when there is no query.
 */
export const Highlight: React.FC<HighlightProps> = ({ text, query, maxLength }) => {
  const tokens = tokenize(query ?? '').filter((token) => token.length > 1);

  const body =
    maxLength && text.length > maxLength ? `${text.slice(0, maxLength).trimEnd()}…` : text;

  if (tokens.length === 0) return <>{body}</>;

  const pattern = new RegExp(`(${tokens.map(escapeRegExp).join('|')})`, 'ig');
  const parts = body.split(pattern);

  return (
    <>
      {parts.map((part, index) =>
        tokens.includes(normalize(part)) ? <mark key={`${part}-${index}`}>{part}</mark> : <React.Fragment key={`${part}-${index}`}>{part}</React.Fragment>,
      )}
    </>
  );
};

export default Highlight;
