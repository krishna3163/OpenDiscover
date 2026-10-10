/**
 * Offline assistant.
 *
 * The AI chat needs a Google API key, and a key shipped to the browser is
 * public by definition (see SECURITY.md). So when no key — or no proxy — is
 * configured, the assistant falls back to this *local* engine: it searches the
 * real catalogue with the same ranking the UI uses and answers with links.
 *
 * That keeps the feature useful in demos, in CI and for visitors who never
 * configure anything.
 */
import { PROJECTS_DB } from '../data/projects';
import { CATALOGUE_STATS, CATEGORIES, getLicenseInfo } from '../lib/catalog';
import { searchProjects, trustTier } from '../lib/search';
import type { Project } from '../types';

const GREETINGS = /\b(hi|hello|hey|namaste|namaskar|hola|yo|good (morning|evening|afternoon))\b/i;
const CAPABILITY = /(what can you do|help me|how do you work|who are you|capabilities)/i;
const SUBMISSION = /(submit|add (my|a) project|list (my|a) project|contribute a project)/i;
const TRUST_QUESTION = /(trust score|how do you (rank|score|verify)|verified)/i;
const LICENSE_QUESTION = /(licen[cs]e|mit|gpl|apache|agpl|copyright)/i;
const COMPARE = /\b(vs\.?|versus|compare|difference between|better)\b/i;

function formatProject(project: Project): string {
  const tier = trustTier(project.trustScore ?? 0);
  const license = getLicenseInfo(project.license);
  const platforms = project.platforms?.length ? ` · ${project.platforms.join(', ')}` : '';
  return [
    `**${project.title}** — ${project.description}`,
    `   ${project.category} · ★ ${project.stars} · Trust ${project.trustScore ?? '—'}/100 (${tier.label}) · ${project.license}: ${license.summary}`,
    `   ${project.link}${platforms}`,
  ].join('\n');
}

/** Pick the intent behind a message so the reply stays on topic. */
export function localAssistantReply(userMessage: string): string {
  const message = userMessage.trim();
  if (!message) return 'Ask me about an app, a category, or a problem you want to solve.';

  if (GREETINGS.test(message) && message.split(/\s+/).length <= 4) {
    return [
      'Hello! 👋 I am the OpenDiscover assistant.',
      `I can search our index of **${CATALOGUE_STATS.projects} open-source projects** across ${CATALOGUE_STATS.categories} categories.`,
      'Try: “private browser for android”, “open alternative to Notion”, “local LLM under 8B”, or “GPL vs MIT”.',
    ].join('\n\n');
  }

  if (CAPABILITY.test(message)) {
    const categoryLines = CATEGORIES.map((c) => `- ${c.icon} **${c.name}** — ${c.blurb}`).join('\n');
    return [
      'I help you find software you can actually trust. Here is what I can do:',
      '1. **Recommend** open-source tools for a need you describe.',
      '2. **Explain licenses** in plain English (MIT, GPL, AGPL, model licences).',
      '3. **Compare** projects by Trust Score, popularity and maintenance.',
      '4. **Point you to categories** when you only have a vague idea.',
      categoryLines,
      'Note: I only ever link to official upstream sources — OpenDiscover never hosts binaries.',
    ].join('\n\n');
  }

  if (TRUST_QUESTION.test(message)) {
    return [
      '**How the Trust Score works (0–100)**',
      '- 30 pts — OSI-approved or documented model licence',
      '- 25 pts — active maintenance (commit in the last ~3 months)',
      '- 20 pts — community size (stars, contributors, releases)',
      '- 15 pts — verified official upstream source',
      '- 10 pts — reproducible builds or signed releases',
      `Right now the index averages **${CATALOGUE_STATS.averageTrust}/100**, and ${CATALOGUE_STATS.verified} of ${CATALOGUE_STATS.projects} entries are verified.`,
      'The full rubric is in CONTRIBUTING.md, and every listing links to its real repository so you can check us.',
    ].join('\n\n');
  }

  if (SUBMISSION.test(message)) {
    return [
      'Awesome — we would love to list it! 🎉',
      'Use the **Submit Project** page (`/submit`) to send the details.',
      'A listing needs:',
      '- a publicly accessible source repository (GitHub, GitLab, Codeberg, …)',
      '- an OSI-approved licence, or a documented model licence for weights',
      '- a link to the **official upstream** — no mirrors or repackaged binaries',
      'We review submissions manually before they appear in the index.',
    ].join('\n\n');
  }

  if (LICENSE_QUESTION.test(message) && COMPARE.test(message)) {
    return [
      '**Permissive vs copyleft, in one paragraph each:**',
      `- ${getLicenseInfo('MIT').summary} (MIT, Apache-2.0, BSD)`,
      `- ${getLicenseInfo('GPL-3.0').summary} (GPL)`,
      `- ${getLicenseInfo('AGPL-3.0').summary} (AGPL)`,
      `- ${getLicenseInfo('MPL-2.0').summary} (MPL — the middle ground)`,
      'Rule of thumb: permissive maximises adoption, copyleft protects the commons. OpenDiscover lists both and labels them clearly.',
    ].join('\n\n');
  }

  // Default: treat the message as a search query against the catalogue.
  const { projects } = searchProjects(PROJECTS_DB, { query: message }, 'relevance');

  if (projects.length === 0) {
    const popular = searchProjects(PROJECTS_DB, {}, 'trust').projects.slice(0, 3);
    return [
      `I could not find an exact match for “${message}” in our index yet.`,
      'These are the highest-trust projects we list right now:',
      ...popular.map(formatProject),
      'If you know an open-source tool we are missing, submit it at `/submit` — that is how the catalogue grows.',
    ].join('\n\n');
  }

  const top = projects.slice(0, 5);
  const header =
    top.length === 1
      ? `One match for “${message}”: 🎯`
      : `Here are ${top.length} open-source matches for “${message}”, best first: 🎯`;

  return [header, ...top.map(formatProject)].join('\n\n');
}

export default localAssistantReply;
