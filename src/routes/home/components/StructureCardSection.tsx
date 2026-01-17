import ErrorSection from '#components/ErrorSection.tsx';
import LoadingSection from '#components/LoadingSection.tsx';
import { useStructures } from '#hooks/structures.tsx';

import StructureCard from './StructureCard';

function StructureCardSection() {
  const { data, isLoading, isError, refetch, isRefetching } = useStructures();

  if (isLoading || isRefetching) return <LoadingSection />;
  if (isError || !data) return <ErrorSection onRetry={refetch} />;

  const structures = Object.entries(data);
  const structureCards = structures.map(([structureID, structureInfo]) => (
    <StructureCard
      key={structureID}
      structureID={structureID}
      structureInfo={structureInfo}
    />
  ));

  return (
    <section className="mx-auto max-w-6xl px-6 pb-12">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
        {structureCards}
      </div>
    </section>
  );
}

export default StructureCardSection;
