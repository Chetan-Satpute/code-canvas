import { useParams } from '@tanstack/react-router';

import { useStructure } from '#hooks/structures.tsx';

import StructuresMenuButton from './components/StructuresMenuButton';

function StructurePage() {
  const { structureID } = useParams({ from: '/$structureID' });

  const { data: structureInfo, isLoading, isError } = useStructure(structureID);

  const structureTitle =
    isLoading || isError || !structureInfo ? null : structureInfo.title;

  return (
    <div className="flex h-screen w-screen flex-col [view-transition-name:page] lg:flex-row">
      <div className="flex h-1/2 w-full flex-col lg:h-full lg:w-3/5">
        <header className="flex items-center justify-between px-4 py-2">
          <h1 className="text-xl font-bold">Code Canvas</h1>
          {structureTitle && <StructuresMenuButton title={structureTitle} />}
        </header>
        <main className="flex flex-1 overflow-auto bg-blue-200/10"></main>
      </div>
      <aside className="flex-1 bg-green-200/10"></aside>
    </div>
  );
}

export default StructurePage;
