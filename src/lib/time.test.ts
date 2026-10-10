import { describe, expect, it } from 'vitest';
import { timeAgo } from './time';

const minutesAgo = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

describe('timeAgo', () => {
  it('describes fresh timestamps', () => {
    expect(timeAgo(minutesAgo(0))).toBe('just now');
    expect(timeAgo(minutesAgo(0.5))).toBe('just now');
  });

  it('switches units correctly', () => {
    expect(timeAgo(minutesAgo(2))).toBe('2 minutes ago');
    expect(timeAgo(minutesAgo(60))).toBe('1 hour ago');
    expect(timeAgo(minutesAgo(90))).toBe('1 hour ago');
    expect(timeAgo(minutesAgo(60 * 24))).toBe('1 day ago');
    expect(timeAgo(minutesAgo(60 * 24 * 8))).toBe('1 week ago');
    expect(timeAgo(minutesAgo(60 * 24 * 40))).toBe('1 month ago');
    expect(timeAgo(minutesAgo(60 * 24 * 400))).toBe('1 year ago');
  });

  it('pluralises', () => {
    expect(timeAgo(minutesAgo(5))).toBe('5 minutes ago');
    expect(timeAgo(minutesAgo(1))).toBe('1 minute ago');
  });

  it('clamps future timestamps instead of going negative', () => {
    const future = new Date(Date.now() + 60_000).toISOString();
    expect(timeAgo(future)).toBe('just now');
  });

  it('always ends with a recognisable suffix', () => {
    expect(timeAgo(minutesAgo(3))).toMatch(/ago$/);
    expect(timeAgo(minutesAgo(0))).toMatch(/just now$/);
  });
});
