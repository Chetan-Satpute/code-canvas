import { useStructures } from '#hooks/structures.tsx';

import StructureCard from './StructureCard';

function StructureCardSection() {
  const { data, isLoading, error, isError } = useStructures();

  // TODO: Add a loading and error state
  if (isLoading) return null;
  if (error || isError || !data) return null;

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
