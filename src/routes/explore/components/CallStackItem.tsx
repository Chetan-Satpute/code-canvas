import CodeTokens from '#components/CodeTokens.tsx';
import cn from '#utils/cn.ts';
import { highlightSignature } from '#utils/signature.ts';

import type { CallStackFrame } from './CallStackCard.tsx';

interface CallStackItemProps {
  frame: CallStackFrame;
  active: boolean;
}

function CallStackItem(props: CallStackItemProps) {
  const { frame, active } = props;

  const tokens = highlightSignature(frame.signature);

  return (
    <li
      className={cn(
        'no-scrollbar border-border overflow-x-auto rounded-lg border py-2',
        active ? 'bg-surface-2' : 'bg-surface-1',
      )}
    >
      {/* A signature is never wrapped — a frame is one line, however long. The
          width is the line's own, floored at the item's, so short signatures
          still fill it; the horizontal padding sits here rather than on the
          item so it scrolls with the line and stays visible at both ends. */}
      <code className="font-code block w-min min-w-full px-3 text-sm whitespace-pre">
        <CodeTokens tokens={tokens} />
      </code>
    </li>
  );
}

export default CallStackItem;
