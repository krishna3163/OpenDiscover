import { describe, expect, it } from 'vitest';
import { deriveTags, withDerivedTags } from './tags';
import { PROJECTS_DB } from '../data/projects';
import { searchProjects } from './search';
import type { Project } from '../types';

const base: Project = {
  id: 900,
  title: 'Private Browser',
  description: 'A fast web browser with built-in tracker blocking and no telemetry.',
  category: 'Privacy & Security',
  license: 'MPL-2.0',
  source: 'GitHub',
  stars: '10k',
  verified: true,
  link: 'https://github.com/example/browser',
  trustScore: 90,
  platforms: ['Linux', 'Android'],
  lastUpdated: '1 week ago',
};

describe('deriveTags', () => {
  it('extracts intent keywords from the description', () => {
    const tags = deriveTags(base);
    expect(tags).toContain('browser');
    expect(tags).toContain('privacy');
    expect(tags).toContain('web');
  });

  it('adds category-level discovery tags', () => {
    expect(deriveTags(base)).toContain('security');
    expect(deriveTags({ ...base, category: 'AI / ML Models' })).toContain('ai');
    expect(deriveTags({ ...base, category: 'Mobile Apps' })).toContain('android');
  });

  it('detects AI models', () => {
    const tags = deriveTags({
      ...base,
      title: 'Llama 3',
      description: 'A large language model for text generation and inference.',
      category: 'AI / ML Models',
    });
    expect(tags).toContain('llm');
    expect(tags).toContain('language-model');
  });

  it('detects messenger, terminal and password-manager intents', () => {
    expect(deriveTags({ ...base, description: 'An encrypted messenger for private chat.' })).toContain('messenger');
    expect(deriveTags({ ...base, description: 'A terminal emulator with a real shell.' })).toContain('terminal');
    expect(deriveTags({ ...base, description: 'A password manager and encrypted vault.' })).toContain(
      'password-manager',
    );
  });

  it('produces lowercase, duplicate-free tags', () => {
    const tags = deriveTags({ ...base, platforms: ['Linux', 'linux', 'Android'] });
    expect(tags.every((tag) => tag === tag.toLowerCase())).toBe(true);
    expect(new Set(tags).size).toBe(tags.length);
  });
});

describe('withDerivedTags', () => {
  it('keeps hand-written tags when they exist', () => {
    const project = { ...base, tags: ['handwritten'] };
    expect(withDerivedTags(project).tags).toEqual(['handwritten']);
  });

  it('adds derived tags when none are declared', () => {
    expect(withDerivedTags(base).tags?.length).toBeGreaterThan(3);
  });

  it('does not mutate the input', () => {
    const copy = { ...base };
    withDerivedTags(copy);
    expect(copy.tags).toBeUndefined();
  });
});

describe('the real catalogue is searchable', () => {
  const queries = [
    ['browser', 1],
    ['messenger', 1],
    ['terminal', 1],
    ['llm', 1],
    ['password', 1],
    ['music', 1],
    ['notes', 1],
    ['android', 1],
    ['encryption', 1],
    ['browser for android', 1],
    ['best open source notes app', 1],
  ] as const;

  it.each(queries)('finds at least one result for “%s”', (query, minimum) => {
    const { total } = searchProjects(PROJECTS_DB, { query }, 'relevance');
    expect(total, `no results for "${query}"`).toBeGreaterThanOrEqual(minimum);
  });

  it('returns nothing (rather than junk) for an intent the index does not cover', () => {
    // There is no VPN entry in the catalogue yet — a real gap, tracked in docs/ROADMAP.md.
    expect(searchProjects(PROJECTS_DB, { query: 'vpn' }).total).toBe(0);
    expect(searchProjects(PROJECTS_DB, { query: 'blockchain wallet' }).total).toBe(0);
  });

  it('ranks a title match above a loose match', () => {
    const { projects } = searchProjects(PROJECTS_DB, { query: 'termux' }, 'relevance');
    expect(projects[0]?.title.toLowerCase()).toContain('termux');
  });

  it('finds projects by license and by source', () => {
    expect(searchProjects(PROJECTS_DB, { query: 'gpl' }).total).toBeGreaterThan(0);
    expect(searchProjects(PROJECTS_DB, { query: 'f-droid' }).total).toBeGreaterThan(0);
  });
});
