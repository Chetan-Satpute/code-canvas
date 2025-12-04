import type { AlgorithmArgInfo } from '#data/types.tsx';
import cn from '#utils/cn.tsx';

interface AlgorithmCardArgItemProps extends AlgorithmArgInfo {
  error: boolean;
}

function AlgorithmCardArgItem(props: AlgorithmCardArgItemProps) {
  const { parameter, type, error } = props;

  return (
    <div key={parameter} className="flex flex-col gap-1">
      <label className="text-sm text-neutral-300">{parameter}</label>

      <input
        type="text"
        name={parameter}
        className={cn(
          'rounded-lg bg-neutral-700/60 px-2 py-1 text-sm text-white',
          'border border-neutral-600 focus:border-blue-400',
          'backdrop-blur-md transition-all duration-150 outline-none',
          error
            ? 'border-red-500/70 bg-red-500/10 focus:border-red-400'
            : 'border-neutral-600 focus:border-blue-400',
        )}
        placeholder={
          type === 'number[]'
            ? 'Enter comma separated numbers (e.g. 1,4,2,7)'
            : 'Enter a number (e.g. 5)'
        }
      />
    </div>
  );
}

export default AlgorithmCardArgItem;
