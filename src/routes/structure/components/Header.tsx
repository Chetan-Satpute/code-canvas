import { useParams } from '@tanstack/react-router';

import { useStructure } from '#hooks/structures.tsx';

import StructuresMenuButton from './StructuresMenuButton';

function Header() {
  const { structureID } = useParams({ from: '/$structureID' });

  const { data: structureInfo, isLoading, isError } = useStructure(structureID);

  const structureTitle =
    isLoading || isError || !structureInfo ? null : structureInfo.title;

  return (
    <header className="flex items-center justify-between px-4 py-2">
      <h1 className="text-xl font-bold">Code Canvas</h1>
      {structureTitle && <StructuresMenuButton title={structureTitle} />}
    </header>
  );
}

export default Header;
