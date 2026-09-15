import Card from '#components/Card.tsx';
import CodeTokens from '#components/CodeTokens.tsx';
import VisualizationCanvas from '#components/VisualizationCanvas.tsx';
import cn from '#utils/cn.ts';
import type { Listing } from '#utils/code.ts';

import { useHeroRun } from '../hooks/useHeroRun.ts';

interface HeroPreviewProps {
  listing: Listing;
}

// Shorter than the explore page's canvas panel, which is sized for structures
// a reader has grown. The array draws 60px tall, so this leaves it room to
// breathe without a field of empty dot grid above it.
const canvasClasses = 'h-48';

function HeroPreview(props: HeroPreviewProps) {
  const { listing } = props;

  const { frames, activeLine } = useHeroRun(listing);

  return (
    <div className="flex flex-col gap-4">
      <div className={canvasClasses}>
        <Card padded={false}>
          <VisualizationCanvas frames={frames} />
        </Card>
      </div>

      {/* The code card's layout at hero scale. It deliberately does not reuse
          `CodeCard`: that one scrolls its active line into view, which on a
          page the reader scrolls past would drag them back up to the hero on
          every step. The tokens and the highlight are the real ones. */}
      <Card padded={false}>
        <div className="flex items-baseline justify-between gap-4 px-5 pt-4">
          <span className="font-en-display text-card-foreground text-sm font-semibold">
            Linear Search
          </span>

          <span className="font-code text-muted-foreground text-xs">
            target = 42
          </span>
        </div>

        <ol className="font-code overflow-x-auto py-3 text-xs leading-relaxed">
          {listing.lines.map((tokens, index) => {
            const isActive = index + 1 === activeLine;

            return (
              <li
                key={index}
                className={cn(
                  'flex gap-3 px-5',
                  isActive && 'from-accent/20 bg-gradient-to-r to-transparent',
                )}
              >
                <span
                  className={cn(
                    'w-3 shrink-0 text-right select-none',
                    isActive ? 'text-accent' : 'text-muted-foreground',
                  )}
                >
                  {index + 1}
                </span>

                <code className="text-card-foreground whitespace-pre">
                  <CodeTokens tokens={tokens} />
                </code>
              </li>
            );
          })}
        </ol>
      </Card>
    </div>
  );
}

export default HeroPreview;
