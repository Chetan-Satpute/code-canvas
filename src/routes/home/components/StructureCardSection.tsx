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
    <section className="m-auto flex flex-wrap justify-center gap-6 px-6 pb-12">
      {structureCards}
    </section>
  );
}

export default StructureCardSection;
