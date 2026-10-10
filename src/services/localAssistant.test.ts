import { describe, expect, it } from 'vitest';
import { localAssistantReply } from './localAssistant';
import { PROJECTS_DB } from '../data/projects';

/**
 * The offline assistant must be useful without any API key: it answers from
 * the real catalogue, so its output has to contain real links.
 */
describe('localAssistantReply', () => {
  it('greets and explains what it can do', () => {
    const reply = localAssistantReply('hello');
    expect(reply).toMatch(/OpenDiscover/i);
    expect(localAssistantReply('what can you do?')).toMatch(/licence|license/i);
  });

  it('explains the Trust Score rubric', () => {
    const reply = localAssistantReply('how do you calculate the trust score?');
    expect(reply).toMatch(/Trust Score/i);
    expect(reply).toMatch(/30 pts/);
  });

  it('explains how to submit a project', () => {
    const reply = localAssistantReply('how do I submit my project?');
    expect(reply).toMatch(/\/submit/);
    expect(reply).toMatch(/official upstream/i);
  });

  it('compares licences when asked', () => {
    const reply = localAssistantReply('MIT vs GPL — what is the difference?');
    expect(reply).toMatch(/copyleft/i);
    expect(reply).toMatch(/permissive/i);
  });

  it('recommends real projects with real links for a normal query', () => {
    const reply = localAssistantReply('private browser for android');
    const links = reply.match(/https?:\/\/\S+/g) ?? [];
    expect(links.length).toBeGreaterThan(0);

    const known = new Set(PROJECTS_DB.map((project) => project.link));
    for (const link of links) expect(known.has(link.replace(/[.,]$/, '')), `unknown link ${link}`).toBe(true);
  });

  it('handles a query with no matches by suggesting the top-trusted projects', () => {
    const reply = localAssistantReply('quantum knitting simulator 9000');
    expect(reply).toMatch(/could not find/i);
    expect(reply).toMatch(/https?:\/\//);
    expect(reply).toMatch(/\/submit/);
  });

  it('never returns an empty string', () => {
    for (const message of ['', '   ', 'a', 'the', 'zzzz']) {
      expect(localAssistantReply(message).trim().length).toBeGreaterThan(0);
    }
  });
});
