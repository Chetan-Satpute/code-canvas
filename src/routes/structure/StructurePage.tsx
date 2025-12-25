import { useParams } from '@tanstack/react-router';

import { useStructure } from '#hooks/structures.tsx';

import AlgorithmCard from './components/AlgorithmCard';

export default function StructurePage() {
  const { structureID } = useParams({ from: '/$structureID' });
  const { data, isLoading } = useStructure(structureID);

  if (isLoading || !data) return null;

  const sections = data.sections || [];

  const sectionItems = sections.map((section, index) => {
    const isLastSection = sections.length === index + 1;

    const algorithms = section.algorithms || [];
    const algorithmCards = algorithms.map((algo) => (
      <AlgorithmCard
        key={algo.id}
        id={algo.id}
        name={algo.name}
        args={algo.args}
      />
    ));

    return (
      <div key={section.id} className="flex flex-col gap-4 mb-4">
        <h4 className="text-sm text-center font-semibold uppercase tracking-wide text-neutral-300">{section.name}</h4>
        
        {algorithmCards}

        {!isLastSection && <hr className="border-neutral-800" />}
      </div>
    );
  });

  return (
    <aside className="m-1 flex flex-1 flex-col overflow-auto rounded-lg bg-neutral-900/60 text-white backdrop-blur-md lg:m-2">
      {sectionItems}
    </aside>
  );
}
