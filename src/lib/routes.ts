/**
 * Route table.
 *
 * Declared once so `App.tsx`, the header navigation, the category grid, the
 * footer, `sitemap.xml` and `document.title` all agree on the same paths.
 */
import type { CategoryName } from '../types';

export const SITE_NAME = 'OpenDiscover';
export const SITE_TAGLINE = 'Find & Trust Open Source Software';
export const REPO_URL = 'https://github.com/krishna3163/OpenDiscover';
export const ISSUE_URL = `${REPO_URL}/issues/new/choose`;
export const DISCUSSIONS_URL = `${REPO_URL}/discussions`;
export const CONTRIBUTING_URL = `${REPO_URL}/blob/main/CONTRIBUTING.md`;
export const SECURITY_URL = `${REPO_URL}/blob/main/SECURITY.md`;
export const SUBMISSION_FORM_URL = 'https://forms.gle/otdtsnDH2FoweAqA7';
export const CONTACT_EMAIL = 'kk3163019@gmail.com';

export interface CategoryRoute {
  path: string;
  category: CategoryName;
  title: string;
  description: string;
  icon: string;
}

/** Every `/category` listing page, generated from one table. */
export const CATEGORY_ROUTES: CategoryRoute[] = [
  {
    path: '/ai-models',
    category: 'AI / ML Models',
    title: 'AI & Machine Learning',
    description: 'Explore open-weights models, inference engines, and AI playgrounds.',
    icon: '🤖',
  },
  {
    path: '/open-source-apps',
    category: 'Open Source Apps',
    title: 'Open Source Applications',
    description: 'Curated collection of the best open source apps for privacy, productivity, and creativity.',
    icon: '📦',
  },
  {
    path: '/privacy',
    category: 'Privacy & Security',
    title: 'Privacy & Security Tools',
    description: 'Protect your digital rights with these essential privacy-first tools.',
    icon: '🛡️',
  },
  {
    path: '/productivity',
    category: 'Productivity',
    title: 'Productivity',
    description: 'Boost your efficiency with open source tools.',
    icon: '⚡',
  },
  {
    path: '/dev-tools',
    category: 'Dev Tools',
    title: 'Developer Tools',
    description: 'Essential tools for coding, debugging, and building.',
    icon: '🧑‍💻',
  },
  {
    path: '/mobile-apps',
    category: 'Mobile Apps',
    title: 'Mobile Apps',
    description: 'Open source Android apps, including Shizuku-optimised tools.',
    icon: '📱',
  },
  {
    path: '/morphe',
    category: 'Morphe Patches',
    title: 'Morphe Patches & AutoBuilds',
    description: 'Explore community patch bundles, ad-blocking mods, and auto-generated APKs with release, beta, and prerelease tags.',
    icon: '⚡',
  },
];

/** Links rendered in the desktop header. */
export const PRIMARY_NAV = [
  { path: '/', label: 'Discover' },
  { path: '/morphe', label: '⚡ Morphe' },
  { path: '/ai-models', label: 'AI Models' },
  { path: '/open-source-apps', label: 'Apps' },
  { path: '/favorites', label: 'Favourites' },
  { path: '/community', label: 'Community' },
  { path: '/developers', label: 'Developers' },
];

export const ROUTE_TITLES: Record<string, string> = {
  '/': SITE_TAGLINE,
  '/morphe': 'Morphe Patches & AutoBuilds',
  '/community': 'Community Hub',
  '/developers': 'For Developers',
  '/login': 'Log in',
  '/submit': 'Submit a Project',
  '/favorites': 'Your Favourites',
  '/profile': 'About the Maintainer',
  ...Object.fromEntries(CATEGORY_ROUTES.map((route) => [route.path, route.title])),
};

/** `document.title` for any pathname, including dynamic segments. */
export function titleFor(pathname: string): string {
  const exact = ROUTE_TITLES[pathname];
  if (exact) return `${exact} · ${SITE_NAME}`;
  if (pathname.startsWith('/project/')) return `Project · ${SITE_NAME}`;
  if (pathname.startsWith('/chat/')) return `Chat · ${SITE_NAME}`;
  if (pathname.startsWith('/community/')) return `Community · ${SITE_NAME}`;
  return `${SITE_NAME} — ${SITE_TAGLINE}`;
}
