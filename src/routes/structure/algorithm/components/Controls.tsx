import { Play, RedoDot, X } from 'lucide-react';

import cn from '#utils/cn.tsx';

import { useControls } from '../hooks/controls';

function Controls() {
  const { handleClose, handleNextStep } = useControls();

  return (
    <div className="flex">
      <button
        className={cn(
          'flex flex-1 items-center justify-around gap-4 rounded-tl-lg px-2 py-1 font-medium backdrop-blur-md transition-all duration-100',
          'bg-gradient-to-b from-white/10 to-white/5 text-white hover:from-white/20 hover:to-white/10',
          'cursor-pointer active:translate-y-px',
        )}
        onClick={handleClose}
      >
        <span>close</span>
        <X size={16} />
      </button>
      <button
        className={cn(
          'flex flex-1 items-center justify-around gap-4 px-2 py-1 font-medium backdrop-blur-md transition-all duration-100',
          'bg-gradient-to-b from-white/10 to-white/5 text-white hover:from-white/20 hover:to-white/10',
          'cursor-pointer border-x border-white/10 active:translate-y-px',
        )}
      >
        <span>start</span>
        <Play size={16} />
      </button>
      <button
        className={cn(
          'flex flex-1 items-center justify-around gap-4 rounded-tr-lg px-2 py-1 font-medium backdrop-blur-md transition-all duration-100',
          'bg-gradient-to-b from-white/10 to-white/5 text-white hover:from-white/20 hover:to-white/10',
          'cursor-pointer active:translate-y-px',
        )}
        onClick={handleNextStep}
      >
        <span>next step</span>
        <RedoDot size={16} />
      </button>
    </div>
  );
}

export default Controls;
