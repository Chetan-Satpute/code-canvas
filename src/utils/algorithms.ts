import type { Algorithm } from '#constants/algorithms.ts';
import algorithms from '#constants/algorithms.ts';
import type { Structure } from '#constants/structures.ts';
import structures from '#constants/structures.ts';
import { isStructureImplemented } from '#engine/structures/registry.ts';

// One structure and the algorithms that operate on it. Both lists keep the
// order they are declared in, so the catalog reads from simplest structure to
// most involved rather than alphabetically.
export interface CatalogSection {
  structure: Structure;
  algorithms: Algorithm[];
}

// The id comes straight off the URL, so one that matches nothing is an
// ordinary outcome rather than a bug — callers render a not-found state.
export function findAlgorithm(id: string): Algorithm | null {
  if (!Object.hasOwn(algorithms, id)) return null;

  return algorithms[id];
}

export function getStructure(algorithm: Algorithm): Structure {
  return structures[algorithm.structureId];
}

export function getCatalog(): CatalogSection[] {
  return Object.values(structures).map((structure) => ({
    structure,
    algorithms: Object.values(algorithms).filter(
      (algorithm) => algorithm.structureId === structure.id,
    ),
  }));
}

// An algorithm plays only when both it and its structure have been ported to
// the engine. The explore page gates Run on this, and the catalog marks the
// rest so nobody opens one expecting an animation.
export function isPlayable(algorithm: Algorithm): boolean {
  return (
    algorithm.run !== undefined && isStructureImplemented(algorithm.structureId)
  );
}
