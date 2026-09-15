import Icon from '#components/Icon.tsx';

const repositoryUrl = 'https://github.com/chetan-satpute/code-canvas';

function HomeFooter() {
  return (
    <footer className="border-border/60 border-t">
      <div className="text-muted-foreground font-en mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-sm md:flex-row lg:px-10">
        <span>© 2026 Chetan Satpute</span>

        <a
          href={repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground focus-visible:ring-ring/45 focus-visible:ring-offset-background hidden items-center gap-1.5 rounded-md transition duration-150 outline-none focus-visible:ring-3 focus-visible:ring-offset-2 md:inline-flex"
        >
          Source on GitHub
          <Icon name="external-link" />
        </a>
      </div>
    </footer>
  );
}

export default HomeFooter;
