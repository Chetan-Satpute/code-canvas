import type { Algorithm } from '#constants/algorithms.ts';
import type { Structure } from '#constants/structures.ts';

import AlgorithmRow from './AlgorithmRow.tsx';

interface StructureSectionProps {
  structure: Structure;
  algorithms: Algorithm[];
}

function StructureSection(props: StructureSectionProps) {
  const { structure, algorithms } = props;

  return (
    <section className="grid gap-4 sm:gap-6 lg:grid-cols-[17rem_minmax(0,1fr)] lg:gap-12">
      {/* Sticky on wide screens, so the structure a list belongs to stays
          named while the list scrolls past it. */}
      <header className="lg:sticky lg:top-24 lg:self-start">
        <h3 className="font-en-display text-foreground text-2xl font-semibold">
          {structure.title}
        </h3>

        <p className="font-en text-muted-foreground mt-3 text-sm leading-relaxed">
          {structure.description}
        </p>

        <p className="font-code text-muted-foreground/60 mt-4 text-xs">
          {algorithms.length} algorithms
        </p>
      </header>

      <ul className="border-border bg-card divide-border divide-y overflow-hidden rounded-xl border">
        {algorithms.map((algorithm) => (
          <li key={algorithm.id}>
            <AlgorithmRow algorithm={algorithm} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default StructureSection;
