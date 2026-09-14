import { Link } from '@tanstack/react-router';

import Icon from '#components/Icon.tsx';

interface ExploreHeaderProps {
  algorithmId: string;
}

const homeLinkClasses =
  'font-en text-foreground hover:text-accent focus-visible:ring-ring/45 focus-visible:ring-offset-background inline-flex items-center gap-2 rounded-md transition duration-150 outline-none focus-visible:ring-3 focus-visible:ring-offset-2';

function ExploreHeader(props: ExploreHeaderProps) {
  const { algorithmId } = props;

  return (
    <header className="border-border bg-surface-1 text-muted-foreground flex shrink-0 items-center gap-1 border-b px-4 py-3 sm:px-6">
      <Link to="/" className={homeLinkClasses}>
        <Icon name="arrow-left" size="sm" />
        <span className="font-en-display text-sm font-semibold sm:text-base">
          Code Canvas
        </span>
      </Link>

      <Icon name="dot" size="lg" />

      <span className="font-code truncate text-sm">{algorithmId}</span>
    </header>
  );
}

export default ExploreHeader;
