import { useParams } from '@tanstack/react-router';

import ErrorSection from '#components/ErrorSection.tsx';
import LoadingSection from '#components/LoadingSection.tsx';
import { useStructure } from '#hooks/structures.tsx';

import AlgorithmCard from './components/AlgorithmCard';
import EmptySection from './components/EmptySection';

export default function StructurePage() {
  const { structureID } = useParams({ from: '/$structureID' });
  const { data, isLoading, refetch, isError } = useStructure(structureID);

  if (isLoading) return <LoadingSection />;
  if (isError || !data) return <ErrorSection onRetry={refetch} />;

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
        canPlay={algo.canPlay}
        canRun={algo.canRun}
      />
    ));

    return (
      <div key={section.id} className="mb-4 flex flex-col gap-4">
        <h4 className="text-center text-sm font-semibold tracking-wide text-neutral-300 uppercase">
          {section.name}
        </h4>

        {algorithmCards}

        {!isLastSection && <hr className="border-neutral-800" />}
      </div>
    );
  });

  return (
    <aside className="m-1 flex flex-1 flex-col overflow-auto rounded-lg bg-neutral-900 text-white lg:m-2">
      {sectionItems.length > 0 ? sectionItems : <EmptySection />}
    </aside>
  );
}
