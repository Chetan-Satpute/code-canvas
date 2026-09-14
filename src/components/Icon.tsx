import {
  ArrowLeft,
  Dot,
  LoaderCircle,
  Maximize,
  Minimize,
  Play,
  RotateCcw,
  Square,
  StepForward,
} from 'lucide-react';

import cn from '#utils/cn.ts';

// The app's only lucide-react import. Keep it named — `import * as lucide`
// would pull in the entire icon set.
const iconComponents = {
  'arrow-left': ArrowLeft,
  dot: Dot,
  'loader-circle': LoaderCircle,
  maximize: Maximize,
  minimize: Minimize,
  play: Play,
  'rotate-ccw': RotateCcw,
  square: Square,
  'step-forward': StepForward,
} as const;

export type IconName = keyof typeof iconComponents;

type IconSize = 'text' | 'sm' | 'md' | 'lg';

interface IconProps {
  name: IconName;
  size?: IconSize;
  spin?: boolean;
  label?: string;
}

// `text` scales with the surrounding font size; the rest are for standalone icons.
const sizeClasses: Record<IconSize, string> = {
  text: 'size-[1em]',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
};

function Icon(props: IconProps) {
  const { name, size = 'text', spin = false, label } = props;

  const LucideIconComponent = iconComponents[name];

  const className = cn('shrink-0', sizeClasses[size], spin && 'animate-spin');

  // Unlabelled icons repeat a nearby text label, so hide them from screen readers.
  const decorative = label === undefined;

  return (
    <LucideIconComponent
      className={className}
      aria-hidden={decorative || undefined}
      aria-label={label}
      role={decorative ? undefined : 'img'}
    />
  );
}

export default Icon;
