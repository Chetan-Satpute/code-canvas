import type { ButtonHTMLAttributes, ReactNode } from 'react';

import cn from '#utils/cn.tsx';

type ControlButtonProps = {
  label: string
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
        'flex flex-1 items-center justify-around gap-4 px-2 py-1 font-medium',
        'backdrop-blur-md transition-all duration-100',
        'bg-gradient-to-b from-white/10 to-white/5 text-white',
        'hover:from-white/20 hover:to-white/10',
        'cursor-pointer active:translate-y-px',
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
