import type { DataStructureJSON, StructureInfo } from '#data/types.tsx';
import { useJSONData } from '#queries/jsonData.tsx';

const STRUCTURE_JSON_PATH = '/data/structures.json';

export function useStructures() {
  return useJSONData<DataStructureJSON>(STRUCTURE_JSON_PATH);
}

export function useStructure(id: string) {
  const query = useJSONData<DataStructureJSON>(STRUCTURE_JSON_PATH);

  let data: StructureInfo | null = null;
  if (query.data) data = query.data[id] ?? null;

  return { ...query, data };
}
