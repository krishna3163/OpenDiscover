/**
 * Demo community data.
 *
 * ⚠️ Everything here is simulated: there is no forum backend. It is isolated in
 * one module so replacing it with a real API (or Discourse/Flarum embed) later
 * is a single-file change.
 */
import { PROJECTS_DB } from './projects';
import { recencyDays } from '../lib/search';

export interface ForumCategory {
  slug: string;
  title: string;
  description: string;
  icon: string;
}

export const FORUM_CATEGORIES: ForumCategory[] = [
  {
    slug: 'announcements',
    title: 'Announcements & News',
    description: 'Official updates from the OpenDiscover team.',
    icon: '📢',
  },
  {
    slug: 'general',
    title: 'General Discussion',
    description: 'Anything about open source, licences and self-hosting.',
    icon: '💬',
  },
  {
    slug: 'showcase',
    title: 'Project Showcase',
    description: 'Show off your own projects or a great find.',
    icon: '🚀',
  },
  {
    slug: 'help',
    title: 'Help & Support',
    description: 'Stuck on something? Ask the community.',
    icon: '❓',
  },
  {
    slug: 'modding',
    title: 'Modding & Customization',
    description: 'Shizuku, F-Droid repos, dotfiles and tweaks.',
    icon: '🔧',
  },
];

export interface ForumThread {
  id: number;
  title: string;
  author: string;
  replies: number;
  views: number;
  lastActivity: string;
  pinned?: boolean;
}

/**
 * Deterministic per-category threads, seeded from the real catalogue so the
 * demo forum at least talks about projects we actually list.
 */
export function threadsForCategory(slug: string): ForumThread[] {
  const seed = FORUM_CATEGORIES.findIndex((category) => category.slug === slug) + 1;
  const featured = PROJECTS_DB.filter((project) => project.id % seed === 0).slice(0, 5);
  const fallback = PROJECTS_DB.slice(0, 5);
  const picks = featured.length >= 3 ? featured : fallback;

  const templates = [
    (title: string) => `Is ${title} still actively maintained?`,
    (title: string) => `Switched to ${title} — here is what changed for me`,
    (title: string) => `${title}: best configuration for privacy?`,
    (title: string) => `How does ${title} compare to its proprietary alternatives?`,
    (title: string) => `Looking for contributors: ${title} needs help`,
  ];

  const authors = ['Alex', 'Sarah', 'Mike', 'Krishna', 'Priya', 'John'];

  return picks.map((project, index) => ({
    id: project.id,
    title: templates[index % templates.length](project.title),
    author: authors[(project.id + index) % authors.length],
    replies: (project.id * 7) % 60 + (index === 0 ? 96 : 3),
    views: (project.id * 53) % 4000 + 90,
    lastActivity: project.lastUpdated ?? '2 days ago',
    pinned: index === 0,
  }));
}

/** "Recently updated" activity feed for the community sidebar. */
export function recentActivity(limit = 4) {
  return [...PROJECTS_DB]
    .sort((a, b) => recencyDays(a.lastUpdated) - recencyDays(b.lastUpdated))
    .slice(0, limit)
    .map((project) => ({
      id: project.id,
      title: project.title,
      category: project.category,
      when: project.lastUpdated ?? 'recently',
      link: project.link,
    }));
}

/** Headline numbers shown on the community page (derived, not invented). */
export const COMMUNITY_STATS = {
  projects: PROJECTS_DB.length,
  categories: FORUM_CATEGORIES.length,
  verified: PROJECTS_DB.filter((project) => project.verified).length,
  threads: FORUM_CATEGORIES.reduce((total, category) => total + threadsForCategory(category.slug).length, 0),
};
