import type { Algorithm } from '#constants/algorithms.ts';
import algorithms from '#constants/algorithms.ts';
import type { Structure } from '#constants/structures.ts';
import structures from '#constants/structures.ts';

// The id comes straight off the URL, so one that matches nothing is an
// ordinary outcome rather than a bug — callers render a not-found state.
export function findAlgorithm(id: string): Algorithm | null {
  if (!Object.hasOwn(algorithms, id)) return null;

  return algorithms[id];
}

export function getStructure(algorithm: Algorithm): Structure {
  return structures[algorithm.structureId];
}
