import type { ButtonHTMLAttributes, ReactNode } from 'react';

import cn from '#utils/cn.tsx';

type ControlButtonProps = {
  label: string;
  icon: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

function ControlButton({
  label,
  icon,
  className,
  ...props
}: ControlButtonProps) {
  return (
    <button
      className={cn(
        'flex flex-1 items-center justify-center gap-3 px-3 py-1.5 text-sm font-medium',
        'cursor-pointer rounded-md',
        'bg-neutral-700/40 text-neutral-200',
        'border border-neutral-600/40',
        'hover:bg-neutral-700/60 hover:text-white',
        'active:translate-y-px active:bg-neutral-700/70',
        'transition-colors duration-150',
        className,
      )}
      {...props}
    >
      <span>{label}</span>
      {icon}
    </button>
  );
}

export default ControlButton;
