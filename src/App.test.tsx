// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import App from './App';
import { PROJECTS_DB } from './data/projects';
import { STORAGE_KEYS } from './lib/storage';

/**
 * Smoke tests.
 *
 * These render the *real* app (router, providers, pages) so a broken context,
 * a bad import or a route that throws is caught before it reaches a visitor.
 *
 * Note: search results wrap matches in `<mark>`, which splits text nodes — so
 * assertions read `textContent` of a card instead of using `getByText`.
 */

function renderAt(path = '/') {
  window.history.pushState({}, '', path);
  return render(<App />);
}

const cards = () => screen.queryAllByRole('article');
const cardTitles = () => cards().map((card) => card.textContent ?? '');

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});

describe('app shell', () => {
  it('renders the header, hero and a grid of projects', async () => {
    renderAt('/');

    expect(screen.getByRole('link', { name: /OpenDiscover/i })).toBeTruthy();
    expect(await screen.findByRole('heading', { level: 1 })).toBeTruthy();
    expect((await screen.findAllByText(String(PROJECTS_DB.length))).length).toBeGreaterThan(0);
    await waitFor(() => expect(cards().length).toBeGreaterThan(0));
  });

  it('provides a skip link for keyboard users', () => {
    renderAt('/');
    expect(screen.getByText('Skip to content').getAttribute('href')).toBe('#main-content');
  });
});

describe('search & filters', () => {
  it('narrows the grid as you type', async () => {
    renderAt('/');
    const input = await screen.findByLabelText(/search projects/i);
    await waitFor(() => expect(cards().length).toBeGreaterThan(1));

    fireEvent.change(input, { target: { value: 'termux' } });

    await waitFor(() => expect(cardTitles().join(' ')).toMatch(/Termux/));
    expect(cards().length).toBe(1);
  });

  it('reads the query from the URL so results are shareable', async () => {
    renderAt('/?q=llama');
    await waitFor(() => expect(cardTitles().join(' ')).toMatch(/Llama/));
  });

  it('filters by category route', async () => {
    renderAt('/mobile-apps');
    await waitFor(() => expect(cards().length).toBeGreaterThan(0));
    for (const title of cardTitles()) {
      expect(title).toMatch(/Mobile Apps/);
    }
  });

  it('shows an empty state instead of a blank page', async () => {
    renderAt('/?q=zzzznotaproject');
    expect(await screen.findByText(/No projects match those filters/i)).toBeTruthy();
    expect(screen.getByRole('button', { name: /reset search/i })).toBeTruthy();
  });
});

describe('routing', () => {
  it('renders a category page', async () => {
    renderAt('/ai-models');
    expect(await screen.findByRole('heading', { name: /AI & Machine Learning/i })).toBeTruthy();
  });

  it('renders a project detail page with a trust score and licence explainer', async () => {
    const target = PROJECTS_DB[0];
    renderAt(`/project/${target.id}`);

    const heading = await screen.findByRole('heading', { level: 1 });
    expect(heading.textContent).toContain(target.title);
    expect((await screen.findAllByText(/Licence:/i)).length).toBeGreaterThan(0);
    expect(screen.getByText(/OpenDiscover Trust Score/i)).toBeTruthy();
  });

  it('renders the 404 page for unknown paths', async () => {
    renderAt('/definitely-not-a-page');
    expect(await screen.findByText(/This page is not in the index/i)).toBeTruthy();
  });
});

describe('favourites', () => {
  it('saves a project and shows it on the favourites page', async () => {
    renderAt('/');
    const firstCard = (await screen.findAllByRole('article'))[0];
    const title = within(firstCard).getByRole('heading').textContent ?? '';
    const toggle = within(firstCard).getByRole('button', { name: /save .* to favourites/i });

    await act(async () => {
      fireEvent.click(toggle);
    });

    expect(window.localStorage.getItem(STORAGE_KEYS.favorites)).toContain(
      String(PROJECTS_DB.find((p) => title.includes(p.title))?.id),
    );

    renderAt('/favorites');
    expect(await screen.findByText(/Your Favourites/i)).toBeTruthy();
    await waitFor(() => expect(document.body.textContent).toContain(title));
  });

  it('shows the empty state when nothing is saved', async () => {
    renderAt('/favorites');
    expect(await screen.findByText(/Your shortlist is empty/i)).toBeTruthy();
  });
});

describe('demo auth', () => {
  it('signs in without any hard-coded credentials', async () => {
    renderAt('/login');

    fireEvent.change(await screen.findByLabelText(/username or email/i), { target: { value: 'ada' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'anything' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    fireEvent.change(await screen.findByLabelText(/6-digit code/i), { target: { value: '123456' } });
    fireEvent.click(screen.getByRole('button', { name: /verify & continue/i }));

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.user)).toContain('Ada');
    });
  });

  it('recognises the demo staff handle by name, not by password', async () => {
    renderAt('/login');

    fireEvent.change(await screen.findByLabelText(/username or email/i), { target: { value: 'krishna0858' } });
    fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: 'literally anything' } });
    fireEvent.click(screen.getByRole('button', { name: /continue/i }));

    fireEvent.change(await screen.findByLabelText(/6-digit code/i), { target: { value: '999999' } });
    fireEvent.click(screen.getByRole('button', { name: /verify & continue/i }));

    await waitFor(() => {
      expect(window.localStorage.getItem(STORAGE_KEYS.user)).toContain('Krishna');
    });
    expect(window.localStorage.getItem(STORAGE_KEYS.user)).toContain('staff');
  });
});
