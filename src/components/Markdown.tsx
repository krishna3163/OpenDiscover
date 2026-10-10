import React from 'react';

/**
 * Minimal, dependency-free markdown renderer for assistant replies.
 *
 * Deliberately small and **HTML-safe**: it builds React nodes, never uses
 * `dangerouslySetInnerHTML`, so a model reply can't inject markup.
 *
 * Supported: `**bold**`, `` `code` ``, `[label](url)`, `-`/`*` bullet lists,
 * `1.` ordered lists, `>` quotes and paragraph breaks.
 */

const URL_PATTERN = /^(https?:\/\/[^\s)]+)$/;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  const nodes: React.ReactNode[] = [];
  // Split on **bold**, `code` and [label](url) in one pass.
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)]+)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;
  let index = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > cursor) nodes.push(text.slice(cursor, match.index));
    const token = match[0];
    const key = `${keyPrefix}-${index}`;
    index += 1;

    if (token.startsWith('**')) {
      nodes.push(<strong key={key}>{token.slice(2, -2)}</strong>);
    } else if (token.startsWith('`')) {
      nodes.push(<code key={key}>{token.slice(1, -1)}</code>);
    } else if (token.startsWith('[')) {
      const parsed = /\[([^\]]+)\]\(([^)\s]+)\)/.exec(token);
      const label = parsed?.[1] ?? token;
      const href = parsed?.[2] ?? '#';
      nodes.push(
        <a key={key} href={href} target="_blank" rel="noopener noreferrer">
          {label}
        </a>,
      );
    } else if (URL_PATTERN.test(token)) {
      nodes.push(
        <a key={key} href={token} target="_blank" rel="noopener noreferrer">
          {token.replace(/^https?:\/\//, '').replace(/\/$/, '')}
        </a>,
      );
    } else {
      nodes.push(token);
    }

    cursor = match.index + token.length;
  }

  if (cursor < text.length) nodes.push(text.slice(cursor));
  return nodes;
}

export const Markdown: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  const blocks: React.ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let key = 0;

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, i) => <li key={i}>{renderInline(item, `li-${key}-${i}`)}</li>);
    blocks.push(
      list.ordered ? (
        <ol key={`ol-${key}`} className="md-list">
          {items}
        </ol>
      ) : (
        <ul key={`ul-${key}`} className="md-list">
          {items}
        </ul>
      ),
    );
    key += 1;
    list = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const bullet = /^\s*[-*•]\s+(.*)$/.exec(line);
    const ordered = /^\s*\d+[.)]\s+(.*)$/.exec(line);

    if (bullet || ordered) {
      const isOrdered = !!ordered;
      if (!list || list.ordered !== isOrdered) {
        flushList();
        list = { ordered: isOrdered, items: [] };
      }
      list.items.push((bullet?.[1] ?? ordered?.[1] ?? '').trim());
      continue;
    }

    flushList();

    if (!line.trim()) continue;

    if (line.startsWith('>')) {
      blocks.push(
        <blockquote key={`q-${key++}`} className="md-quote">
          {renderInline(line.replace(/^>\s?/, ''), `q-${key}`)}
        </blockquote>,
      );
      continue;
    }

    const heading = /^(#{1,4})\s+(.*)$/.exec(line);
    if (heading) {
      blocks.push(
        <strong key={`h-${key++}`} className="md-heading">
          {renderInline(heading[2], `h-${key}`)}
        </strong>,
      );
      continue;
    }

    blocks.push(
      <p key={`p-${key++}`} className="md-paragraph">
        {renderInline(line, `p-${key}`)}
      </p>,
    );
  }

  flushList();

  return <div className="markdown">{blocks}</div>;
};

export default Markdown;
