import { Link } from '@tanstack/react-router';
import { Menu } from 'lucide-react';

import cn from '#utils/cn.tsx';

interface StructuresMenuButtonProps {
  title: string;
}

function StructuresMenuButton(props: StructuresMenuButtonProps) {
  const { title } = props;

  return (
    <Link
      to="/"
      className={cn(
        'flex items-center gap-2 rounded-lg px-2 py-1 font-medium backdrop-blur-md transition-all duration-200',
        'border border-white/10 bg-gradient-to-b from-white/10 to-white/5 text-white hover:from-white/20 hover:to-white/10',
        'cursor-pointer active:scale-95',
      )}
      viewTransition={{ types: ['fade'] }}
    >
      <Menu size={16} />
      <span className="font-medium">{title}</span>
    </Link>
  );
}

export default StructuresMenuButton;
