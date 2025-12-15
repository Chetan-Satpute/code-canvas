import type { ReactNode } from 'react';

import { Loader2 } from 'lucide-react';

import cn from '#utils/cn.tsx';

interface ActionButtonProps {
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'neutral' | 'primary';
}

function ActionButton({
  label,
  icon,
  onClick,
  loading = false,
  disabled = false,
  variant = 'neutral',
}: ActionButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={cn(
        'flex flex-1 items-center justify-center gap-3 rounded-lg px-3 py-2 text-sm font-medium',
        'backdrop-blur-md transition-all duration-200',
        'active:scale-95',
        'disabled:cursor-auto disabled:opacity-60 disabled:active:scale-100',
        'enabled:hover:cursor-pointer',

        variant === 'neutral' &&
          cn(
            'border border-white/10',
            'bg-gradient-to-b from-white/10 to-white/5',
            'enabled:hover:from-white/20 enabled:hover:to-white/10',
          ),

        variant === 'primary' &&
          cn(
            'border border-blue-500/20',
            'bg-gradient-to-b from-blue-600/30 to-blue-500/20',
            'enabled:hover:from-blue-600/40 enabled:hover:to-blue-500/30',
          ),
      )}
    >
      <span>{label}</span>
      <span className="flex h-4 w-4 items-center justify-center">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : icon}
      </span>
    </button>
  );
}

export default ActionButton;
