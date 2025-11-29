import chalk from 'chalk';
import fs from 'node:fs/promises';
import path from 'node:path';
import { codeToTokens } from 'shiki';

async function main() {
  const codeFiles = await fetchCodeFiles();
  await Promise.all(codeFiles.map(processCodeFile));
}

main();

// ===============================================

/**
 * Fetch all `code.md` files inside `src/core`
 *
 * Expected path pattern:
 * src/core/<structure>/<algorithm>/code.md
 */
async function fetchCodeFiles() {
  const coreDir = path.resolve('src/core');
  const codeFiles = [];

  const entries = await fs.readdir(coreDir, {
    withFileTypes: true,
    recursive: true,
  });

  for (const entry of entries) {
    if (entry.isFile() && entry.name === 'code.md') {
      const filePath = path.join(entry.path, entry.name);

      const parts = entry.path.split(path.sep);

      const algorithm = parts.at(-1) ?? null;
      const structure = parts.at(-2) ?? null;

      codeFiles.push({
        structure,
        algorithm,
        file: filePath,
      });
    }
  }

  return codeFiles;
}

/**
 * Process a single code.md file:
 * - Reads markdown content
 * - Extracts fenced code blocks OR treats full file as code
 * - Generates Shiki tokens
 * - Writes JSON into public/core/<structure>/<algorithm>.json
 *
 * @param {{ structure: string, algorithm: string, file: string }} param0
 */
export async function processCodeFile({ structure, algorithm, file }) {
  try {
    // 1. Read the .md file
    const raw = await fs.readFile(file, 'utf-8');

    // 2. Extract code from fenced blocks
    const extracted = extractCodeFromMarkdown(raw);

    // 3. Highlight with Shiki
    const tokens = await codeToTokens(extracted, {
      lang: 'typescript',
      theme: 'material-theme-darker',
    });

    // 4. Ensure output folder exists
    const publicDir = path.join(process.cwd(), 'public/code');
    const outFolder = path.join(publicDir, structure);
    await fs.mkdir(outFolder, { recursive: true });

    // 5. Write tokens to JSON file
    const outFile = path.join(outFolder, `${algorithm}.json`);
    await fs.writeFile(outFile, JSON.stringify(tokens, null, 2));

    console.log(chalk.green(`✨ Processed ${structure}/${algorithm}`));
  } catch (err) {
    console.error(chalk.red('[ERROR] processing code file:'), file, err);
  }
}

/**
 * Extracts the first fenced code block from a Markdown file.
 * If none are found, returns the entire markdown.
 *
 * @param {string} md
 * @returns {string}
 */
function extractCodeFromMarkdown(md) {
  const fenceRegex = /```[a-zA-Z0-9-]*\s*([\s\S]*?)```/m;
  const match = md.match(fenceRegex);
  return match ? match[1].trim() : md.trim();
}

