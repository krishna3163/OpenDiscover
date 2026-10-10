/**
 * Test environment setup (jsdom).
 *
 * jsdom does not implement layout APIs (`scrollTo`, `scrollIntoView`,
 * `matchMedia`, canvas 2D). The app guards against a missing canvas context,
 * but the rest are stubbed here so component tests can run headlessly.
 *
 * The file is also loaded for `environment: 'node'` suites (pure logic tests),
 * so everything is guarded behind a `window` check.
 */
import { vi } from 'vitest';

const hasDom = typeof globalThis.window !== 'undefined';

if (hasDom) {
  const win = globalThis.window as unknown as {
    scrollTo?: unknown;
    matchMedia?: unknown;
  };

  Object.defineProperty(win, 'scrollTo', { value: vi.fn(), writable: true });

  if (typeof globalThis.Element !== 'undefined') {
    globalThis.Element.prototype.scrollIntoView = vi.fn();
  }

  if (!win.matchMedia) {
    Object.defineProperty(win, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  }

  // Silence jsdom's "Not implemented: window.scrollTo" noise.
  const originalError = console.error;
  console.error = (...args: unknown[]) => {
    const message = String(args[0] ?? '');
    if (message.includes('Not implemented: window.scrollTo')) return;
    originalError(...(args as []));
  };
}
