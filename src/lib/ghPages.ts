/**
 * GitHub Pages deep-link support.
 *
 * `public/404.html` rewrites `/OpenDiscover/project/42` into
 * `/OpenDiscover/?/project/42` because Pages cannot rewrite URLs. This
 * function undoes that *before* React Router mounts, so `BrowserRouter` sees a
 * clean path and refresh/share on any route works.
 *
 * It is a no-op on dev servers, custom domains and other hosts.
 */
export function applyGhPagesRedirect(): void {
  const { search, hash, origin } = window.location;

  if (!search.startsWith('?/') && !search.startsWith('?p=/')) return;

  const encoded = search.slice(search.startsWith('?/') ? 2 : 4);
  const [rawPath, rawQuery] = encoded.split('&q=');
  const restoredPath = rawPath ? `/${rawPath.replace(/~and~/g, '&')}` : '/';
  const restoredQuery = rawQuery ? `?${rawQuery.replace(/~and~/g, '&')}` : '';

  const base = import.meta.env.BASE_URL || '/';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const target = `${origin}${cleanBase}${restoredPath}${restoredQuery}${hash}`;

  window.history.replaceState(null, '', target);
}
