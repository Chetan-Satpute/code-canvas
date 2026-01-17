import { CoreArray } from '#core/array/structure.tsx';
import { CoreBoard } from '#core/board.tsx';
import { CoreLinkedList } from '#core/linked-list/structure.tsx';
import { CoreStructure } from '#core/structure.tsx';
import { randomNumber, randomNumberArray } from '#utils/random.tsx';

import type { CoreFunctionContext } from './types';

export function createRandomStructureByID(structureId: string): CoreStructure {
  switch (structureId) {
    case 'array':
      return CoreArray.fromData(randomNumberArray(randomNumber(5, 10)));
    case 'linked-list':
      return CoreLinkedList.fromData(randomNumberArray(randomNumber(4, 10)));
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
    case 'linked-list':
      return CoreLinkedList.fromData(structureData as number[]);
    default:
      return CoreStructure.fromData(null);
  }
}

export function initContextStructure(
  contextProps: Omit<CoreFunctionContext, 'board' | 'structure'>,
): CoreFunctionContext {
  const board = new CoreBoard();

  const structure = createStructureFromData(
    contextProps.structureID,
    contextProps.structureData,
  );

  board.add(structure);

  return { ...contextProps, board, structure };
}
