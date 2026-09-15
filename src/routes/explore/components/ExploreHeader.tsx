import { Link } from '@tanstack/react-router';

import Button from '#components/Button.tsx';
import Icon from '#components/Icon.tsx';
import useFullscreen from '#hooks/useFullscreen.ts';
import cn from '#utils/cn.ts';

// A link rather than a `Button` wrapping one. Nesting an anchor inside a
// button is invalid HTML, and it left the button's padding — most of its
// 40x48 area — landing on the button instead of the 16px icon inside it, so
// the control only navigated when the click happened to hit the icon.
//
// These reproduce Button's outline variant at size md. They cannot come from
// Button itself, which renders a <button>; `enabled:` variants are dropped
// because that pseudo-class never matches an anchor.
const backLinkClasses =
  'font-en border-border text-foreground hover:border-muted-foreground hover:bg-surface-2 focus-visible:ring-ring/45 focus-visible:ring-offset-background inline-flex h-10 cursor-pointer items-center justify-center rounded-lg border px-4 text-sm font-semibold whitespace-nowrap transition duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-offset-2 active:translate-y-px active:scale-[0.98]';

// Equal-width side slots keep the title centred even when the fullscreen
// button is absent.
const sideClasses = 'flex flex-1 items-center';

function ExploreHeader() {
  const { isSupported, isFullscreen, toggle } = useFullscreen();

  return (
    <header className="border-border bg-surface-1 text-muted-foreground flex shrink-0 items-center gap-1 border-b px-4 py-3 sm:px-6">
      <div className={sideClasses}>
        <Link to="/" className={backLinkClasses}>
          <Icon name="arrow-left" size="sm" label="Back to the catalog" />
        </Link>
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
