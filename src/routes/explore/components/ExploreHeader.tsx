import { Link } from '@tanstack/react-router';

import Button from '#components/Button.tsx';
import Icon from '#components/Icon.tsx';
import useFullscreen from '#hooks/useFullscreen.ts';
import cn from '#utils/cn.ts';

const homeLinkClasses =
  'font-en text-foreground hover:text-accent focus-visible:ring-ring/45 focus-visible:ring-offset-background inline-flex items-center gap-2 rounded-md transition duration-150 outline-none focus-visible:ring-3 focus-visible:ring-offset-2';

// Equal-width side slots keep the title centred even when the fullscreen
// button is absent.
const sideClasses = 'flex flex-1 items-center';

function ExploreHeader() {
  const { isSupported, isFullscreen, toggle } = useFullscreen();

  return (
    <header className="border-border bg-surface-1 text-muted-foreground flex shrink-0 items-center gap-1 border-b px-4 py-3 sm:px-6">
      <div className={sideClasses}>
        <Button onClick={() => {}} variant="outline">
          <Link to="/" className={homeLinkClasses}>
            <Icon name="arrow-left" size="sm" />
          </Link>
        </Button>
      </div>

      <span className="font-en-display text-foreground text-sm font-semibold sm:text-base">
        Code Canvas
      </span>

      <div className={cn(sideClasses, 'justify-end')}>
        {isSupported && (
          <Button onClick={toggle} variant="outline">
            <Icon
              name={isFullscreen ? 'minimize' : 'maximize'}
              size="sm"
              label={isFullscreen ? 'Exit full screen' : 'Enter full screen'}
            />
          </Button>
        )}
      </div>
    </header>
  );
}

export default ExploreHeader;
