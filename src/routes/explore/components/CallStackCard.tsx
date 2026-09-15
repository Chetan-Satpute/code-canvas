import Card from '#components/Card.tsx';
import type { CallStackFrame } from '#engine/step.ts';

import CallStackItem from './CallStackItem.tsx';

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
            // The first frame is the one the memory card is showing.
            <CallStackItem key={frame.id} frame={frame} active={index === 0} />
          ))}
        </ol>
      </div>
    </Card>
  );
}

export default CallStackCard;
