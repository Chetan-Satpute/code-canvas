import fs from 'node:fs/promises';
import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import type { Plugin } from 'vite';

import type { CodeLine, CodePalette } from '../src/utils/code.ts';

const LANG = 'typescript';
const THEME = 'tokyo-night';

// `import lines from './insert.md?highlight'` yields the tokenized listing.
const QUERY = '?highlight';

// `import { palette } from 'virtual:code-theme'` yields the colors needed to
// highlight code the app only builds at runtime.
const PALETTE_ID = 'virtual:code-theme';
const RESOLVED_PALETTE_ID = '\0' + PALETTE_ID;

// TextMate packs font styles into a bitmask; only these two are rendered.
const ITALIC = 1;
const BOLD = 2;

// Built from `shiki/core` rather than the `shiki` bundle so only one grammar
// and one theme are loaded. None of it reaches the browser — the plugin hands
// the app finished tokens.
function createHighlighter(): Promise<HighlighterCore> {
  return createHighlighterCore({
    langs: [import('@shikijs/langs/typescript')],
    themes: [import('@shikijs/themes/tokyo-night')],
    engine: createJavaScriptRegexEngine(),
  });
}

// Mirrors the markdown v1 kept its listings in: the first fenced block, or the
// whole file when it has no fence.
function extractCode(markdown: string): string {
  const fenced = /```[a-zA-Z0-9-]*\s*([\s\S]*?)```/m.exec(markdown);

  return (fenced === null ? markdown : fenced[1]).trim();
}

function toLines(highlighter: HighlighterCore, code: string): CodeLine[] {
  const { tokens } = highlighter.codeToTokens(code, {
    lang: LANG,
    theme: THEME,
  });

  return tokens.map((line) =>
    line.map((token) => {
      const fontStyle = token.fontStyle ?? 0;

      // The false cases are left undefined so they drop out of the JSON.
      return {
        content: token.content,
        color: token.color,
        italic: (fontStyle & ITALIC) === 0 ? undefined : true,
        bold: (fontStyle & BOLD) === 0 ? undefined : true,
      };
    }),
  );
}

// Every palette color is read back off a token the theme itself colored, so
// the call stack is painted in the same colors as the listing above it.
// A declaration rather than a call, because it is the only context where the
// grammar names a parameter — which is what a call stack frame shows.
const PALETTE_PROBE =
  "function call(name: number) { call(other, 42, 'text'); }";

function buildPalette(highlighter: HighlighterCore): CodePalette {
  const { tokens } = highlighter.codeToTokens(PALETTE_PROBE, {
    lang: LANG,
    theme: THEME,
  });

  const colorOf = (content: string): string => {
    const color = tokens[0].find((token) => token.content === content)?.color;

    // Only reachable if the grammar or theme stops resolving the probe, which
    // would silently mispaint every signature — so fail the build instead.
    if (color === undefined)
      throw new Error(
        `Theme '${THEME}' left '${content}' of the palette probe uncolored`,
      );

    return color;
  };

  return {
    function: colorOf('call'),
    parameter: colorOf('name'),
    variable: colorOf('other'),
    number: colorOf('42'),
    string: colorOf('text'),
    separator: colorOf(','),
    punctuation: colorOf('('),
  };
}

function codeHighlight(): Plugin {
  let highlighter: Promise<HighlighterCore> | null = null;

  const getHighlighter = () => (highlighter ??= createHighlighter());

  return {
    name: 'code-canvas:code-highlight',

    resolveId(id) {
      return id === PALETTE_ID ? RESOLVED_PALETTE_ID : null;
    },

    async load(id) {
      if (id === RESOLVED_PALETTE_ID) {
        const palette = buildPalette(await getHighlighter());

        return `export const palette = ${JSON.stringify(palette)};`;
      }

      if (!id.endsWith(QUERY)) return null;

      const file = id.slice(0, -QUERY.length);

      // Editing a listing in dev should reload it, and the file is only ever
      // read here — the bundler never sees it as an input of its own.
      this.addWatchFile(file);

      const code = extractCode(await fs.readFile(file, 'utf8'));
      const lines = toLines(await getHighlighter(), code);

      return `export default ${JSON.stringify(lines)};`;
    },
  };
}

export default codeHighlight;
