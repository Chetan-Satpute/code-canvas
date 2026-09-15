// Both modules are produced by the Vite plugin in `vite/codeHighlight.ts`.
// They are declared here rather than in `types.d.ts` because a file with
// top-level imports can only augment modules that already exist, not declare
// new ones.

declare module '*.md?highlight' {
  const lines: import('#utils/code.ts').CodeLine[];

  export default lines;
}

declare module 'virtual:code-theme' {
  export const palette: import('#utils/code.ts').CodePalette;
}
