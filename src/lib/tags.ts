/**
 * Tag derivation.
 *
 * The curated dataset only stores facts (title, description, license, …).
 * Search tags are *derived* at module load, so:
 *   - nobody has to hand-maintain keywords for 40+ projects,
 *   - new entries are instantly findable by intent ("vpn", "notes", "llm"),
 *   - the logic is pure and unit-testable.
 */
import { tokenize } from './search';
import type { Project } from '../types';

const STOPWORDS = new Set([
  'the','a','an','and','or','for','of','to','in','with','your','you','is','are','on','from','no','that','this','it','by','as','be','all','can','not','but','their','them','they','has','have','will','more','most','any','each','into','over','under','than','then','when','where','which','who','why','how','also','very','just','only','both','such','via','our','we','us','my','me',
]);

/** Intent keywords: `pattern` is matched against title + description. */
const INTENT_TAGS: { pattern: RegExp; tags: string[] }[] = [
  { pattern: /\b(browser|chromium|firefox)\b/i, tags: ['browser', 'web'] },
  { pattern: /\b(vpn|wireguard|openvpn|tailscale|mullvad)\b/i, tags: ['vpn', 'networking', 'privacy'] },
  { pattern: /(chat|messenger|messaging|matrix|element|signal|session|simplex|telegram)/i, tags: ['messenger', 'chat', 'encrypted'] },
  { pattern: /(music|audio|podcast|player|mpv|vlc|spotify|sound)/i, tags: ['media', 'music', 'audio'] },
  { pattern: /(video|youtube|stream|film|movie)/i, tags: ['video', 'media'] },
  { pattern: /(notes?|markdown|joplin|obsidian|zettel|wiki)/i, tags: ['notes', 'markdown', 'writing'] },
  { pattern: /(password|vault|secret|bitwarden|keepass|passkey|2fa|authenticator)/i, tags: ['password-manager', 'security', 'credentials'] },
  { pattern: /(terminal|shell|console|termux|bash|zsh|adb|shizuku)/i, tags: ['terminal', 'cli', 'shell'] },
  { pattern: /(editor|\bide\b|vscode|neovim|emacs|sublime)/i, tags: ['editor', 'ide', 'code'] },
  { pattern: /(database|sql|postgres|sqlite|redis|mongo)/i, tags: ['database', 'data'] },
  { pattern: /(container|docker|kubernetes|podman|kubectl)/i, tags: ['containers', 'devops', 'infrastructure'] },
  { pattern: /(e-?mail|smtp|thunderbird|inbox)/i, tags: ['email', 'communication'] },
  { pattern: /(calendar|schedule|reminder|todo|task)/i, tags: ['calendar', 'productivity', 'tasks'] },
  { pattern: /(files?|sync|nextcloud|backup|storage|cloud)/i, tags: ['files', 'sync', 'storage'] },
  { pattern: /(tor|onion|proxy|anonym|i2p)/i, tags: ['anonymity', 'privacy', 'censorship'] },
  { pattern: /(firewall|tracker|adblock|ad-?guard|dns|pi-?hole|privacy)/i, tags: ['privacy', 'blocking', 'dns'] },
  { pattern: /(encrypt|cryptograph|cipher|gpg|age\b)/i, tags: ['encryption', 'security'] },
  { pattern: /(keyboard|launcher|home ?screen|widget|icon pack)/i, tags: ['android', 'launcher', 'customization'] },
  { pattern: /(llm|language model|gpt|llama|mistral|gemma|phi-?\d|qwen|yi-\d|deepseek|chatbot)/i, tags: ['llm', 'language-model', 'ai'] },
  { pattern: /(diffusion|text-?to-?image|image gen|stable diffusion|flux)/i, tags: ['image-generation', 'ai', 'diffusion'] },
  { pattern: /(speech|whisper|transcri|voice|tts|asr)/i, tags: ['speech', 'transcription', 'ai'] },
  { pattern: /(inference|ollama|llama\.cpp|vllm|runtime|quantiz)/i, tags: ['inference', 'ai', 'local-ai'] },
  { pattern: /(machine learning|deep learning|neural|model|dataset|training)/i, tags: ['machine-learning', 'ai'] },
  { pattern: /(android)/i, tags: ['android', 'mobile'] },
  { pattern: /(iphone|ios|ipad)/i, tags: ['ios', 'mobile'] },
  { pattern: /(linux|ubuntu|debian|arch|fedora)/i, tags: ['linux', 'desktop'] },
  { pattern: /(windows)/i, tags: ['windows', 'desktop'] },
  { pattern: /(macos|mac\b|darwin)/i, tags: ['macos', 'desktop'] },
  { pattern: /(self-?host|homelab|server|nas)/i, tags: ['self-hosted', 'server'] },
  { pattern: /(design|figma|image editor|photo|gimp|inkscape|draw)/i, tags: ['design', 'graphics'] },
  { pattern: /(git\b|version control|forge|codeberg|gitlab)/i, tags: ['git', 'version-control'] },
  { pattern: /(search engine|metasearch|searx)/i, tags: ['search', 'metasearch'] },
  { pattern: /(map|navigation|location|gps|osm|openstreetmap)/i, tags: ['maps', 'navigation'] },
  { pattern: /(finance|budget|money|invoice|crypto wallet|wallet)/i, tags: ['finance', 'money'] },
  { pattern: /(game|gaming|emulator|retro)/i, tags: ['games', 'emulation'] },
  { pattern: /(office|document|spreadsheet|pdf|libreoffice)/i, tags: ['office', 'documents'] },
];

/** Category → a couple of broad discovery tags. */
const CATEGORY_TAGS: Record<string, string[]> = {
  'AI / ML Models': ['ai', 'models', 'open-weights'],
  'Open Source Apps': ['apps', 'open-source'],
  'Privacy & Security': ['privacy', 'security'],
  Productivity: ['productivity', 'tools'],
  'Dev Tools': ['developer-tools', 'coding'],
  'Mobile Apps': ['mobile', 'android', 'apps'],
};

/** Build the tag list for a project. Deterministic and duplicate-free. */
export function deriveTags(project: Omit<Project, 'tags'>): string[] {
  const haystack = `${project.title} ${project.description} ${project.license} ${project.source} ${(project.platforms ?? []).join(' ')}`;
  const tags = new Set<string>();

  for (const token of tokenize(project.title)) {
    if (token.length > 1 && !STOPWORDS.has(token)) tags.add(token);
  }

  for (const { pattern, tags: intentTags } of INTENT_TAGS) {
    if (pattern.test(haystack)) intentTags.forEach((tag) => tags.add(tag));
  }

  (CATEGORY_TAGS[project.category] ?? []).forEach((tag) => tags.add(tag));

  for (const token of tokenize(project.description)) {
    if (tags.size > 26) break;
    if (token.length > 3 && !STOPWORDS.has(token)) tags.add(token);
  }

  (project.platforms ?? []).forEach((platform) => tags.add(platform.toLowerCase()));

  return [...tags];
}

/** Attach derived tags to any project that does not declare its own. */
export function withDerivedTags<T extends Omit<Project, 'tags'> & { tags?: string[] }>(project: T): T {
  if (project.tags?.length) return project;
  return { ...project, tags: deriveTags(project) };
}
