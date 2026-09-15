import { randomNumber, randomNumberArray } from '#utils/random.ts';

import type { CoreStructure } from '../structure.ts';
import { CoreArray } from './array/structure.ts';

// Structures the engine can build. The catalog lists four; the ones missing
// here are not ported yet, and the explore page disables their controls
// rather than pretending they work.
const randomStructures: Record<string, () => CoreStructure> = {
  array: () => {
    const array = new CoreArray(randomNumberArray(randomNumber(5, 10)));

    // Named on creation rather than by the algorithm that reads it, so the
    // label is there from the first paint instead of appearing when a run
    // starts and outliving it.
    array.setName('array');
    array.rearrange();

    return array;
  },
};

export function isStructureImplemented(structureId: string): boolean {
  return Object.hasOwn(randomStructures, structureId);
}

export function createRandomStructure(
  structureId: string,
): CoreStructure | null {
  const create = randomStructures[structureId];

  return create === undefined ? null : create();
}
