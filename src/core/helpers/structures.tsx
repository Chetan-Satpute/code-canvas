import { CoreArray } from '#core/array/structure.tsx';
import { CoreStructure } from '#core/structure.tsx';
import { randomNumber, randomNumberArray } from '#utils/random.tsx';

export function createRandomStructureByID(structureId: string): CoreStructure {
  switch (structureId) {
    case 'array':
      return CoreArray.fromData(randomNumberArray(randomNumber(5, 10)));
    default:
      return CoreStructure.fromData(null);
  }
}

export function createStructureFromData(
  structureId: string,
  structureData: unknown,
) {
  switch (structureId) {
    case 'array':
      return CoreArray.fromData(structureData as number[]);
    default:
      return CoreStructure.fromData(null);
  }
}
