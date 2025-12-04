import { Play, SkipForward } from 'lucide-react';

import cn from '#utils/cn.tsx';

interface AlgorithmCardButtonGroupProps {
  onRun: () => void;
}

function AlgorithmCardButtonGroup(props: AlgorithmCardButtonGroupProps) {
  const { onRun } = props;

  return (
    <div className="mt-1 flex gap-2">
      <button
        className={cn(
          'flex flex-1 items-center justify-center gap-4 rounded-lg px-3 py-1 text-sm font-medium',
          'border border-white/10 bg-gradient-to-b from-white/10 to-white/5',
          'hover:from-white/20 hover:to-white/10',
          'cursor-pointer backdrop-blur-md transition-all duration-200 active:scale-95',
        )}
        onClick={onRun}
      >
        <span>Run</span>
        <SkipForward size={16} />
      </button>

      <button
        className={cn(
          'flex flex-1 items-center justify-center gap-4 rounded-lg px-3 py-1 text-sm font-medium',
          'border border-blue-500/20 bg-gradient-to-b from-blue-600/30 to-blue-500/20',
          'hover:from-blue-600/40 hover:to-blue-500/30',
          'cursor-pointer backdrop-blur-md transition-all duration-200 active:scale-95',
        )}
      >
        <span>Play</span>
        <Play size={16} />
      </button>
    </div>
  );
}

export default AlgorithmCardButtonGroup;
