#!/usr/bin/env node
/**
 * Export the curated catalogue as static JSON.
 *
 * Writes `public/data/projects.json`, which gives the site a real, zero-infra
 * read-only API (`GET <site>/data/projects.json`) and makes the dataset
 * reusable by other tools without parsing TypeScript.
 *
 * Runs automatically before `npm run build` (see the `prebuild` script) and can
 * be run by hand with `npm run export:data`.
 */
import { build } from 'esbuild';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const tempEntry = resolve(root, '.tmp/catalogue-entry.mjs');
const tempBundle = resolve(root, '.tmp/catalogue.mjs');
const outFile = resolve(root, 'public/data/projects.json');

// Entry shim: re-export everything we want to publish.
await mkdir(dirname(tempEntry), { recursive: true });
await writeFile(
  tempEntry,
  `export { PROJECTS_DB } from '../src/data/projects.ts';
export { CATEGORIES, LICENSE_KIND_LABEL, getLicenseInfo, CATALOGUE_STATS } from '../src/lib/catalog.ts';
`,
  'utf8',
);

// Bundle the TS modules with esbuild (already installed as a Vite dependency).
await build({
  entryPoints: [tempEntry],
  outfile: tempBundle,
  bundle: true,
  format: 'esm',
  platform: 'node',
  target: 'node20',
  logLevel: 'warning',
});

const { PROJECTS_DB, CATEGORIES, getLicenseInfo, LICENSE_KIND_LABEL, CATALOGUE_STATS } = await import(tempBundle);

const payload = {
  $schema: 'https://json.schemastore.org/base.json',
  generatedAt: new Date().toISOString(),
  source: 'https://github.com/krishna3163/OpenDiscover',
  license: 'MIT',
  notice:
    'Discovery metadata only. Every `link` points at the official upstream project; OpenDiscover hosts no binaries.',
  stats: {
    ...CATALOGUE_STATS,
    byCategory: Object.fromEntries(CATEGORIES.map((c) => [c.name, PROJECTS_DB.filter((p) => p.category === c.name).length])),
  },
  categories: CATEGORIES.map(({ name, path, icon, blurb }) => ({ name, path, icon, blurb })),
  projects: PROJECTS_DB.map((project) => ({
    ...project,
    licenseKind: getLicenseInfo(project.license).kind,
    licenseSummary: getLicenseInfo(project.license).summary,
    licenseLabel: LICENSE_KIND_LABEL[getLicenseInfo(project.license).kind],
  })),
};

await mkdir(dirname(outFile), { recursive: true });
await writeFile(outFile, `${JSON.stringify(payload, null, 2)}\n`, 'utf8');
await rm(dirname(tempEntry), { recursive: true, force: true });

const kb = (Buffer.byteLength(JSON.stringify(payload)) / 1024).toFixed(1);
console.log(`✓ Exported ${payload.projects.length} projects → public/data/projects.json (${kb} kB)`);
