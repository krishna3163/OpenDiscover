import { describe, expect, it } from 'vitest';
import { PROJECTS_DB } from './projects';
import { CATEGORY_NAMES } from '../types';
import { getLicenseInfo, isOpenSourceLicense } from '../lib/catalog';
import { parseStars, recencyDays } from '../lib/search';

/**
 * Data-quality tests for the curated catalogue.
 *
 * The whole product is "trust us, we checked" — so the dataset itself has to be
 * verifiable. These tests fail the build if someone adds a duplicate id, a
 * download-portal link, a proprietary entry marked "verified", or a row the
 * search layer cannot parse.
 */

/** Hosts we accept as official upstream sources. */
const ALLOWED_HOSTS = [
  'github.com',
  'gitlab.com',
  'codeberg.org',
  'huggingface.co',
  'f-droid.org',
  'gitlab.torproject.org',
  'code.briarproject.org',
  'obsidian.md',
  'www.blender.org',
  'www.libreoffice.org',
  'git-scm.com',
];

/** Sites that repackage binaries — never acceptable in this index. */
const BLOCKED_HOST_PATTERNS = [
  /apkmirror/i,
  /apkcombo/i,
  /apkpure/i,
  /softonic/i,
  /uptodown/i,
  /getintopc/i,
  /crack/i,
  /modapk/i,
  /play\.google\.com/i,
];


describe('catalogue integrity', () => {
  it('is not empty', () => {
    expect(PROJECTS_DB.length).toBeGreaterThan(20);
  });

  it('has unique ids', () => {
    const ids = PROJECTS_DB.map((project) => project.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('has unique titles (no duplicate listings)', () => {
    const titles = PROJECTS_DB.map((project) => project.title.toLowerCase());
    const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);
    expect(duplicates).toEqual([]);
  });

  it('only uses categories that exist in the type union', () => {
    const known: string[] = [...CATEGORY_NAMES];
    for (const project of PROJECTS_DB) {
      expect(known, `unknown category on "${project.title}"`).toContain(project.category);
    }
  });

  it('links to official upstream hosts over https', () => {
    for (const project of PROJECTS_DB) {
      const url = new URL(project.link);
      expect(url.protocol, `${project.title} must use https`).toBe('https:');
      expect(ALLOWED_HOSTS, `${project.title} → ${url.hostname} is not an approved source`).toContain(url.hostname);
    }
  });

  it('never links to a repackaging / download portal', () => {
    for (const project of PROJECTS_DB) {
      for (const blocked of BLOCKED_HOST_PATTERNS) {
        expect(blocked.test(project.link), `${project.title} links to ${project.link}`).toBe(false);
      }
    }
  });

  it('keeps Trust Scores inside 0–100', () => {
    for (const project of PROJECTS_DB) {
      const score = project.trustScore ?? 0;
      expect(score, `${project.title} trustScore=${score}`).toBeGreaterThanOrEqual(0);
      expect(score, `${project.title} trustScore=${score}`).toBeLessThanOrEqual(100);
    }
  });

  it('never marks a non-open-source entry as verified', () => {
    for (const project of PROJECTS_DB) {
      const license = getLicenseInfo(project.license);
      if (!isOpenSourceLicense(license.kind)) {
        expect(project.verified, `${project.title} is ${project.license} but marked verified`).toBe(false);
        expect(project.trustScore ?? 100, `${project.title} should not carry a high Trust Score`).toBeLessThan(80);
      }
    }
  });

  it('has a description long enough to be useful', () => {
    for (const project of PROJECTS_DB) {
      expect(project.description.length, project.title).toBeGreaterThanOrEqual(30);
      expect(project.title.trim().length, project.title).toBeGreaterThan(1);
    }
  });

  it('declares at least one platform', () => {
    for (const project of PROJECTS_DB) {
      expect(project.platforms?.length ?? 0, project.title).toBeGreaterThan(0);
    }
  });

  it('has community metrics the sorter can parse', () => {
    for (const project of PROJECTS_DB) {
      const stars = parseStars(project.stars);
      const isUnknown = /n\/a|unknown/i.test(project.stars);
      expect(isUnknown || stars > 0, `${project.title} stars="${project.stars}"`).toBe(true);
    }
  });

  it('has a parseable "last updated" value', () => {
    for (const project of PROJECTS_DB) {
      expect(recencyDays(project.lastUpdated), `${project.title} lastUpdated="${project.lastUpdated}"`).toBeLessThan(
        999,
      );
    }
  });

  it('derives search tags for every entry', () => {
    for (const project of PROJECTS_DB) {
      expect(project.tags?.length ?? 0, `${project.title} has no tags`).toBeGreaterThanOrEqual(3);
      expect(
        project.tags?.every((tag) => tag === tag.toLowerCase()),
        `${project.title} tags must be lowercase`,
      ).toBe(true);
    }
  });
});
