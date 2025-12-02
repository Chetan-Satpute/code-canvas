import { Play, SkipForward } from 'lucide-react';

import type { AlgorithmInfo } from '#data/types.tsx';
import cn from '#utils/cn.tsx';

type AlgorithmCardProps = AlgorithmInfo;

function AlgorithmCard(props: AlgorithmCardProps) {
  const { id, name, args } = props;

  const argItems = args.map((arg) => (
    <div key={arg.parameter} className="flex flex-col gap-1">
      <label className="text-sm text-neutral-300">{arg.parameter}</label>

      <input
        type="text"
        className={cn(
          'rounded-lg bg-neutral-700/60 px-2 py-1 text-sm text-white',
          'border border-neutral-600 focus:border-blue-400',
          'backdrop-blur-md transition-all duration-150 outline-none',
        )}
        placeholder={
          arg.type === 'number[]'
            ? 'Enter comma separated numbers (e.g. 1,4,2,7)'
            : 'Enter a number (e.g. 5)'
        }
      />
    </div>
  ));

  return (
    <div
      key={id}
      className="rounded-lg bg-neutral-800/90 p-4 shadow-sm backdrop-blur-md"
    >
      <h3 className="mb-3 text-lg font-semibold tracking-wide">{name}</h3>

      <div className="flex flex-col gap-4">
        {argItems}

        <div className="mt-1 flex gap-2">
          <button
            className={cn(
              'flex flex-1 items-center justify-center gap-4 rounded-lg px-3 py-1 text-sm font-medium',
              'border border-white/10 bg-gradient-to-b from-white/10 to-white/5',
              'hover:from-white/20 hover:to-white/10',
              'cursor-pointer backdrop-blur-md transition-all duration-200 active:scale-95',
            )}
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
      </div>
    </div>
  );
}

export default AlgorithmCard;
