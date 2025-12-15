import { useParams } from '@tanstack/react-router';

import { useStructure } from '#hooks/structures.tsx';

import AlgorithmCard from './components/AlgorithmCard';

export default function StructurePage() {
  const { structureID } = useParams({ from: '/$structureID' });
  const { data, isLoading } = useStructure(structureID);

  if (isLoading || !data) return null;

  const algorithms = data.algorithms || [];
  const algorithmCards = algorithms.map((algo) => (
    <AlgorithmCard
      key={algo.id}
      id={algo.id}
      name={algo.name}
      args={algo.args}
    />
  ));

  return (
    <aside className="m-1 flex flex-1 flex-col overflow-auto rounded-lg bg-neutral-900/60 text-white backdrop-blur-md lg:m-2">
      <div className="flex flex-col gap-4 p-1">{algorithmCards}</div>
    </aside>
  );
}
