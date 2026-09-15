import fs from 'node:fs/promises';
import { createHighlighterCore, type HighlighterCore } from 'shiki/core';
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript';
import type { Plugin } from 'vite';

import type {
  CodeAnchors,
  CodeLine,
  CodePalette,
  Listing,
} from '../src/utils/code.ts';

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

// A `/*#name*/` marker names the line it sits on, so an algorithm can yield
// `step('compare')` instead of a hand-counted line number. Stripped here,
// before shiki tokenizes, so a marker never reaches the rendered listing and
// the tokens are the same as if it had never been written.
//
// It leads the line rather than trailing it because prettier formats code
// inside markdown fences, and it moves a trailing comment off any line ending
// in `{` onto the next one — which would silently shift the anchor to the
// wrong line. A leading block comment it leaves alone.
const ANCHOR_PATTERN = /\/\*#([A-Za-z][\w-]*)\*\/ ?/g;

function extractAnchors(code: string): { code: string; anchors: CodeAnchors } {
  const anchors: CodeAnchors = {};

  const lines = code.split('\n').map((line, index) => {
    const names = [...line.matchAll(ANCHOR_PATTERN)].map((match) => match[1]);
    if (names.length === 0) return line;

    // Both a line with two names and a name on two lines leave it ambiguous
    // which line a step means, and the author would never see which won — so
    // fail the build rather than pick one.
    if (names.length > 1)
      throw new Error(`Listing names one line '${names.join("' and '")}'`);

    const [name] = names;
    if (Object.hasOwn(anchors, name))
      throw new Error(`Listing names '${name}' on more than one line`);

    // 1-based, as the code card's gutter counts.
    anchors[name] = index + 1;

    return line.replace(ANCHOR_PATTERN, '').trimEnd();
  });

  return { code: lines.join('\n'), anchors };
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

      const { code, anchors } = extractAnchors(
        extractCode(await fs.readFile(file, 'utf8')),
      );

      const listing: Listing = {
        lines: toLines(await getHighlighter(), code),
        anchors,
      };

      return `export default ${JSON.stringify(listing)};`;
    },
  };
}

export default codeHighlight;
