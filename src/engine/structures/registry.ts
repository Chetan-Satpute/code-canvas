import { randomNumber, randomNumberArray } from '#utils/random.ts';

import type { CoreStructure } from '../structure.ts';
import { CoreArray } from './array/structure.ts';
import { fillRandomly as fillTree } from './binary-search-tree/operations.ts';
import { CoreBinarySearchTree } from './binary-search-tree/structure.ts';
import { fillRandomly as fillLinkedList } from './linked-list/operations.ts';
import { CoreLinkedList } from './linked-list/structure.ts';
import { fillRandomly as fillHeap } from './max-heap/operations.ts';
import { CoreMaxHeap } from './max-heap/structure.ts';

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

  'linked-list': () => {
    const list = new CoreLinkedList();

    fillLinkedList(list);

    // Named on creation for the same reason the array is: the listings call
    // it `list`, and a label that appeared when a run started would outlive
    // it.
    list.setName('list');
    list.rearrange();

    return list;
  },

  'max-heap': () => {
    const heap = new CoreMaxHeap();

    fillHeap(heap);

    // Named on creation for the same reason the array is: the listings call
    // it `heap`, and a label that appeared when a run started would outlive
    // it.
    heap.setName('heap');
    heap.rearrange();

    return heap;
  },

  'binary-search-tree': () => {
    const tree = new CoreBinarySearchTree();

    fillTree(tree);

    tree.setName('tree');
    tree.rearrange();

    return tree;
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
