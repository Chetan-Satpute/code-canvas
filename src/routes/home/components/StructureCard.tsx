import { Link } from '@tanstack/react-router';
import { ArrowRight } from 'lucide-react';

import type { StructureInfo } from '#data/types.tsx';
import cn from '#utils/cn.tsx';

interface StructureCardProps {
  structureID: string;
  structureInfo: StructureInfo;
}

function StructureCard(props: StructureCardProps) {
  const { structureID, structureInfo } = props;
  const { title, description } = structureInfo;

  return (
    <Link
      key={structureID}
      to="/$structureID"
      params={{ structureID }}
      className={cn(
        'group relative flex flex-col justify-between',
        'max-w-sm flex-1 basis-80',
        'rounded-2xl bg-gradient-to-b from-neutral-800 to-neutral-900 p-6 text-left',
        'shadow-sm ring-1 ring-white/5 transition-all duration-200',
        'hover:-translate-y-1 hover:shadow-blue-400/40 hover:ring-blue-400/40',
        'focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:outline-none',
        'active:scale-98',
      )}
      viewTransition={{ types: ['fade'] }}
    >
      <div className="flex-1">
        <h2 className="mb-2 text-xl font-bold">{title}</h2>
        <p className="text-base text-neutral-300">{description}</p>
      </div>

      <div className="mt-4 flex items-center text-blue-400 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100">
        <span className="mr-1 text-sm font-medium">Explore</span>
        <ArrowRight className="h-5 w-5" strokeWidth={2} />
      </div>
    </Link>
  );
}

export default StructureCard;
