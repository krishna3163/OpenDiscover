import { useEffect, type FC } from 'react';
import { useLocation } from 'react-router-dom';
import { titleFor } from '../lib/routes';

/**
 * Scroll to the top whenever the route changes.
 * Without this, navigating away from a long listing keeps the previous scroll
 * offset and the new page looks broken.
 */
export const ScrollToTop: FC = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    if (window.location.hash) return; // let in-page anchors win
    window.scrollTo({ top: 0, left: 0 });
  }, [pathname, search]);

  return null;
};

/** Keep `document.title` in sync with the route (tabs, SEO, shared links). */
export const DocumentTitle: FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = titleFor(pathname);
  }, [pathname]);

  return null;
};

export default ScrollToTop;
