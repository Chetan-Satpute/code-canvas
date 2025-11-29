import { useParams } from '@tanstack/react-router';
import type { TokensResult } from 'shiki';

import { useJSONData } from '#queries/jsonData.tsx';
import { useAppSelector } from '#redux/hooks.tsx';
import cn from '#utils/cn.tsx';

function CodeBlock() {
  const { structureID, algorithmID } = useParams({
    from: '/$structureID/$algorithmID',
  });

  const activeCodeLine = useAppSelector((state) => state.app.activeCodeLine);

  const { data, isLoading } = useJSONData<TokensResult>(
    `/code/${structureID}/${algorithmID}.json`,
  );

  if (isLoading || !data) return null;

  const { tokens } = data;

  const lines = tokens.map((line, lineIndex) => {
    const shouldHighlight = activeCodeLine === lineIndex;

    const lineSpans = line.map((token, tokenIndex) => (
      <span key={tokenIndex} style={{ color: token.color }}>
        {token.content}
      </span>
    ));

    return (
      <div
        key={lineIndex}
        className={cn(
          'size-min min-w-full px-2 py-px',
          shouldHighlight && 'bg-gradient-to-r from-white/20 to-transparent',
        )}
      >
        {lineSpans.length ? lineSpans : ' '}
      </div>
    );
  });

  return (
    <pre className="no-scrollbar flex-1 overflow-auto py-2 text-xs">
      <code className="size-min">{lines}</code>
    </pre>
  );
}

export default CodeBlock;
