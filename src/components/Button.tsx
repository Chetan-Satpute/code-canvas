import type { PropsWithChildren } from 'react';

import Icon from '#components/Icon.tsx';
import cn from '#utils/cn.ts';

type ButtonVariant =
  'primary' | 'secondary' | 'accent' | 'destructive' | 'outline';

type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends PropsWithChildren {
  variant?: ButtonVariant;
  size?: ButtonSize;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
}

const baseClasses =
  'font-en relative inline-flex cursor-pointer items-center justify-center border font-semibold whitespace-nowrap transition duration-150 outline-none select-none focus-visible:ring-3 focus-visible:ring-ring/45 focus-visible:ring-offset-2 focus-visible:ring-offset-background enabled:active:translate-y-px enabled:active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50';

// Each variant owns its border-color. Split across these strings, the winner
// is whichever Tailwind emits later, not the one listed last here.
const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'border-transparent bg-primary text-primary-foreground enabled:hover:bg-primary-hover',
  secondary:
    'border-transparent bg-secondary text-secondary-foreground enabled:hover:bg-secondary-hover',
  accent:
    'border-transparent bg-accent text-accent-foreground enabled:hover:bg-accent-hover',
  destructive:
    'border-transparent bg-destructive text-destructive-foreground enabled:hover:bg-destructive-hover',
  outline:
    'border-border text-foreground enabled:hover:border-muted-foreground enabled:hover:bg-surface-2',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 rounded-md px-3 text-xs',
  md: 'h-10 rounded-lg px-4 text-sm',
  lg: 'h-12 rounded-lg px-6 text-base',
};

function Button(props: ButtonProps) {
  const {
    children,
    variant = 'primary',
    size = 'md',
    type = 'button',
    disabled = false,
    loading = false,
    onClick,
  } = props;

  const className = cn(baseClasses, variantClasses[variant], sizeClasses[size]);

  // Flex row so an Icon child aligns with the text instead of the baseline.
  const labelClasses = cn(
    'inline-flex items-center gap-2',
    loading && 'invisible',
  );

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || loading}
      aria-busy={loading}
      onClick={onClick}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Icon name="loader-circle" spin />
        </span>
      )}

      {/* Kept mounted while loading so the width does not jump. */}
      <span className={labelClasses}>{children}</span>
    </button>
  );
}

export default Button;
