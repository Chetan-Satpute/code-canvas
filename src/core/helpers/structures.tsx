import { CoreArray } from '#core/array/structure.tsx';
import {
  CoreBST,
  type CoreBSTDataNode,
} from '#core/binary-search-tree/structure.tsx';
import { CoreBoard } from '#core/board.tsx';
import { CoreLinkedList } from '#core/linked-list/structure.tsx';
import { CoreMaxHeap } from '#core/max-heap/structure.tsx';
import { CoreStructure } from '#core/structure.tsx';
import {
  randomBSTData,
  randomMaxHeapNumberArray,
  randomNumber,
  randomNumberArray,
} from '#utils/random.tsx';

import type { CoreFunctionContext } from './types';

export function createRandomStructureByID(structureId: string): CoreStructure {
  switch (structureId) {
    case 'array':
      return CoreArray.fromData(randomNumberArray(randomNumber(5, 10)));
    case 'linked-list':
      return CoreLinkedList.fromData(randomNumberArray(randomNumber(2, 6)));
    case 'binary-search-tree':
      return CoreBST.fromData(randomBSTData(randomNumber(3, 8)));
    case 'max-heap':
      return CoreMaxHeap.fromData(randomMaxHeapNumberArray(randomNumber(3, 7)));
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
    case 'binary-search-tree':
      return CoreBST.fromData(structureData as CoreBSTDataNode);
    case 'max-heap':
      return CoreMaxHeap.fromData(structureData as number[]);
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
