import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { applyGhPagesRedirect } from './lib/ghPages.ts';

// Undo the GitHub Pages 404 → `?/path` hop before the router mounts, so deep
// links like /project/42 survive a refresh on a static host.
applyGhPagesRedirect();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
