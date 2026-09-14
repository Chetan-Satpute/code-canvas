import Card from '#components/Card.tsx';
import cn from '#utils/cn.ts';

import type { MemoryVariable } from './MemoryCard.tsx';

export interface CallStackFrame {
  id: string;
  signature: string;
  line?: number;
  variables?: MemoryVariable[];
}

interface CallStackCardProps {
  frames: CallStackFrame[];
}

function CallStackCard(props: CallStackCardProps) {
  const { frames } = props;

  return (
    <Card title="Call stack" padded={false}>
      {/* Innermost frame first, so the frame the canvas and code are showing
          is at the top and callers read downwards under it. */}
      <div className="max-h-[40vh] overflow-auto p-5 lg:h-full lg:max-h-none">
        <ol className="flex flex-col gap-2">
          {frames.map((frame, index) => (
            <li
              key={frame.id}
              className={cn(
                'border-border rounded-lg border px-3 py-2',
                // The frame the memory card is showing.
                index === 0 ? 'bg-surface-2' : 'bg-surface-1',
              )}
            >
              <div className="flex items-baseline justify-between gap-3">
                <code className="font-code text-card-foreground min-w-0 text-sm break-all">
                  {frame.signature}
                </code>

                {frame.line !== undefined && (
                  <span className="font-code text-muted-foreground shrink-0 text-xs">
                    line {frame.line}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Card>
  );
}

export default CallStackCard;
