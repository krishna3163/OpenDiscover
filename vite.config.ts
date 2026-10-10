/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load every variable (including ones without the VITE_ prefix) so the
  // deploy path can be configured from CI as well as from `.env`.
  const env = loadEnv(mode, process.cwd(), '');
  const base = env.VITE_BASE_PATH || '/';

  return {
    base,
    plugins: [react()],
    server: {
      // Bind to all interfaces so the app works inside containers / previews.
      host: true,
      port: 5173,
      // Allow proxied preview hosts (tunnels, sandboxes, *.e2b.app, Codespaces).
      // `true` accepts any Host header — fine for a dev server, never for prod.
      allowedHosts: true,
    },
    preview: {
      host: true,
      port: 4173,
      allowedHosts: true,
    },
    build: {
      target: 'es2022',
      cssCodeSplit: true,
      reportCompressedSize: true,
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          // Split heavy vendors out of the main bundle so returning visitors
          // only re-download what actually changed.
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            motion: ['framer-motion'],
          },
        },
      },
    },
    test: {
      environment: 'node',
      setupFiles: ['./tests/setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}', 'tests/**/*.{test,spec}.{ts,tsx}'],
      globals: false,
    },
  };
});
