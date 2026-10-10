import { useEffect, useState } from 'react';

/**
 * Return `value` after it has stopped changing for `delay` ms.
 * Keeps typing in the search box from re-ranking the whole catalogue on
 * every keystroke.
 */
export function useDebounce<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

export default useDebounce;
