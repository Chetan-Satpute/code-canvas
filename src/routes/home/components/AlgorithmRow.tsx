import { Link } from '@tanstack/react-router';

import Icon from '#components/Icon.tsx';
import type { Algorithm } from '#constants/algorithms.ts';
import { isPlayable } from '#utils/algorithms.ts';
import cn from '#utils/cn.ts';

interface AlgorithmRowProps {
  algorithm: Algorithm;
}

// Inset so the ring is not clipped by the list's rounded, overflow-hidden edge.
const rowClasses =
  'group hover:bg-surface-2 focus-visible:ring-ring/45 flex items-start gap-3 p-4 transition duration-150 outline-none focus-visible:ring-3 focus-visible:ring-inset sm:gap-4 sm:p-5';

function AlgorithmRow(props: AlgorithmRowProps) {
  const { algorithm } = props;

  const playable = isPlayable(algorithm);

  return (
    <Link
      to="/$algorithmId"
      params={{ algorithmId: algorithm.id }}
      className={rowClasses}
    >
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h4 className="font-en-display text-card-foreground group-hover:text-accent text-base font-semibold transition duration-150">
            {algorithm.title}
          </h4>

          <span
            className={cn(
              'font-code text-xs',
              playable ? 'text-accent' : 'text-muted-foreground/60',
            )}
          >
            {playable ? 'playable' : 'soon'}
          </span>
        </div>

        <p className="font-en text-muted-foreground mt-1.5 text-sm leading-relaxed">
          {algorithm.description}
        </p>
      </div>

      <span className="text-muted-foreground group-hover:text-accent mt-1 transition duration-150 group-hover:translate-x-1">
        <Icon name="arrow-right" size="sm" />
      </span>
    </Link>
  );
}

export default AlgorithmRow;
