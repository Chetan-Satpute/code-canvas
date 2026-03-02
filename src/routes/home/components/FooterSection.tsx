import { Copyright, ExternalLink } from 'lucide-react';

function FooterSection() {
  return (
    <footer className="flex items-center justify-between gap-1 border-t border-neutral-700 px-4 py-4 text-center text-sm text-neutral-500 lg:px-8">
      <span className="flex items-center gap-2">
        <Copyright size={14} />
        <span>2026 Chetan Satpute</span>
      </span>
      <a
        href="https://github.com/chetan-satpute/code-canvas"
        target="_blank"
        rel="noopener noreferrer"
        className="flex cursor-pointer items-center gap-2 text-blue-500 hover:text-blue-400"
      >
        <span>github</span>
        <ExternalLink size={14} />
      </a>
    </footer>
  );
}

export default FooterSection;
