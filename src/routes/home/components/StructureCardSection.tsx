import type { DataStructureJSON } from '#data/types.tsx';
import { useJSONData } from '#queries/jsonData.tsx';

import StructureCard from './StructureCard';

function StructureCardSection() {
  const { data, isLoading, error, isError } = useJSONData<DataStructureJSON>(
    '/data/structures.json',
  );

  if (isLoading) return null;
  if (error || isError || !data) return null;

  const structures = Object.entries(data);
  const structureCards = structures.map(([structureID, structureInfo]) => (
    <StructureCard structureID={structureID} structureInfo={structureInfo} />
  ));

  return (
    <section className="m-auto flex flex-wrap justify-center gap-6 px-6 pb-12">
      {structureCards}
    </section>
  );
}

export default StructureCardSection;
