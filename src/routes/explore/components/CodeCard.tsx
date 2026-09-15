import { useEffect, useRef } from 'react';

import Card from '#components/Card.tsx';
import CodeTokens from '#components/CodeTokens.tsx';
import cn from '#utils/cn.ts';
import type { CodeLine } from '#utils/code.ts';

interface CodeCardProps {
  lines: CodeLine[];
  // The line the run is currently on, numbered from 1 as the gutter is.
  // Absent outside a run, when no line is current.
  activeLine?: number;
}

function CodeCard(props: CodeCardProps) {
  const { lines, activeLine } = props;

  const activeRow = useRef<HTMLLIElement>(null);

  // A listing is usually taller than the card, so stepping would otherwise
  // walk the highlight off screen. `nearest` scrolls by as little as it takes
  // and does nothing at all while the line is already in view.
  useEffect(() => {
    activeRow.current?.scrollIntoView({ block: 'nearest' });
  }, [activeLine]);

  return (
    <Card title="Code" padded={false}>
      {/* Capped on small screens, where the card is in page flow; on large
          screens it fills the grid row the page gives it.

          Only the vertical padding sits here: a scroll container's end padding
          is not part of what it scrolls, so padding-right would disappear the
          moment a long line was scrolled to. The rows carry it instead, and
          the listing takes the width of its longest line — floored at the
          container's — so every row is as wide as the widest one. */}
      <div className="max-h-[50vh] overflow-auto py-5 lg:h-full lg:max-h-none">
        <ol className="font-code w-min min-w-full text-sm leading-relaxed">
          {lines.map((tokens, index) => {
            const isActive = index + 1 === activeLine;

            return (
              <li
                key={index}
                ref={isActive ? activeRow : null}
                className={cn(
                  'flex gap-4 px-5',
                  // Fading out rather than filling the row keeps the marker
                  // clear of the code, which carries colors of its own.
                  isActive && 'from-accent/20 bg-gradient-to-r to-transparent',
                )}
              >
                <span
                  className={cn(
                    'w-6 shrink-0 text-right select-none',
                    isActive ? 'text-accent' : 'text-muted-foreground',
                  )}
                >
                  {index + 1}
                </span>

                {/* Shows through wherever the theme colors nothing. */}
                <code className="text-card-foreground whitespace-pre">
                  <CodeTokens tokens={tokens} />
                </code>
              </li>
            );
          })}
        </ol>
      </div>
    </Card>
  );
}

export default CodeCard;
