import type { AlgorithmRunner } from '#engine/algorithm.ts';
import { arrayBinarySearch } from '#engine/algorithms/array/binary-search.ts';
import { arrayInsertValue } from '#engine/algorithms/array/insert-value.ts';
import { arrayLinearSearch } from '#engine/algorithms/array/linear-search.ts';
import { arrayMergeSort } from '#engine/algorithms/array/merge-sort.ts';
import { arrayQuickSort } from '#engine/algorithms/array/quick-sort.ts';
import { arrayRemoveValue } from '#engine/algorithms/array/remove-value.ts';
import { binarySearchTreeInsert } from '#engine/algorithms/binary-search-tree/insert.ts';
import { binarySearchTreeRemove } from '#engine/algorithms/binary-search-tree/remove.ts';
import { linkedListInsertAfter } from '#engine/algorithms/linked-list/insert-after.ts';
import { linkedListInsertHead } from '#engine/algorithms/linked-list/insert-head.ts';
import { linkedListRemove } from '#engine/algorithms/linked-list/remove.ts';
import type { ArgumentKind } from '#utils/argument.ts';
import type { Listing } from '#utils/code.ts';

import binarySearchListing from './code/array-binary-search.md?highlight';
import arrayInsertValueListing from './code/array-insert-value.md?highlight';
import linearSearchListing from './code/array-linear-search.md?highlight';
import mergeSortListing from './code/array-merge-sort.md?highlight';
import quickSortListing from './code/array-quick-sort.md?highlight';
import arrayRemoveValueListing from './code/array-remove-value.md?highlight';
import treeInsertListing from './code/binary-search-tree-insert.md?highlight';
import treeRemoveListing from './code/binary-search-tree-remove.md?highlight';
import linkedListInsertAfterListing from './code/linked-list-insert-after.md?highlight';
import linkedListInsertHeadListing from './code/linked-list-insert-head.md?highlight';
import linkedListRemoveListing from './code/linked-list-remove.md?highlight';
import heapPopListing from './code/max-heap-pop.md?highlight';
import heapPushListing from './code/max-heap-push.md?highlight';
import type { StructureId } from './structures.ts';

export interface AlgorithmArgument {
  name: string;
  placeholder?: string;
  // Defaults to any finite number.
  kind?: ArgumentKind;
}

export interface Algorithm {
  id: string;
  structureId: StructureId;
  title: string;
  description: string;
  args: AlgorithmArgument[];
  // Tokenized by the Vite plugin in `vite/codeHighlight.ts` when the listing
  // is imported, so the browser is handed colors rather than a highlighter.
  // It also carries the named lines the algorithm steps to.
  listing: Listing;
  // Absent until the algorithm is ported to the engine. The explore page
  // disables Run for those rather than pretending they play.
  run?: AlgorithmRunner;
}

// Ids are the explore route's only parameter, so they carry the structure as
// a prefix to stay unique across structures that share an operation name.
const algorithms: Record<string, Algorithm> = {
  'array-linear-search': {
    id: 'array-linear-search',
    structureId: 'array',
    title: 'Linear Search',
    description:
      'Walks the array from the front, comparing every element until the target turns up or the end is reached.',
    args: [{ name: 'target', placeholder: '42' }],
    listing: linearSearchListing,
    run: arrayLinearSearch,
  },

  'array-binary-search': {
    id: 'array-binary-search',
    structureId: 'array',
    title: 'Binary Search',
    description:
      'Halves a sorted array on every step, discarding the side that cannot hold the target.',
    args: [{ name: 'target', placeholder: '42' }],
    listing: binarySearchListing,
    run: arrayBinarySearch,
  },

  'array-merge-sort': {
    id: 'array-merge-sort',
    structureId: 'array',
    title: 'Merge Sort',
    description:
      'Splits the array down to single elements, then merges the halves back together in order.',
    args: [],
    listing: mergeSortListing,
    run: arrayMergeSort,
  },

  'array-quick-sort': {
    id: 'array-quick-sort',
    structureId: 'array',
    title: 'Quick Sort',
    description:
      'Partitions the array around a pivot so smaller values fall left and larger right, then sorts each side.',
    args: [],
    listing: quickSortListing,
    run: arrayQuickSort,
  },

  'array-insert-value': {
    id: 'array-insert-value',
    structureId: 'array',
    title: 'Insert Value',
    description:
      'Makes room at an index by copying every later element one place along, then writes the new value.',
    args: [
      { name: 'index', placeholder: '2', kind: 'integer' },
      { name: 'value', placeholder: '42' },
    ],
    listing: arrayInsertValueListing,
    run: arrayInsertValue,
  },

  'array-remove-value': {
    id: 'array-remove-value',
    structureId: 'array',
    title: 'Remove Value',
    description:
      'Closes the gap left at an index by shifting every later element one place back, then drops the last slot.',
    args: [{ name: 'index', placeholder: '2', kind: 'integer' }],
    listing: arrayRemoveValueListing,
    run: arrayRemoveValue,
  },

  'linked-list-insert-head': {
    id: 'linked-list-insert-head',
    structureId: 'linked-list',
    title: 'Insert at Head',
    description:
      'Points a new node at the current head and makes it the head, so the list grows in constant time.',
    args: [{ name: 'value', placeholder: '42' }],
    listing: linkedListInsertHeadListing,
    run: linkedListInsertHead,
  },

  'linked-list-insert-after': {
    id: 'linked-list-insert-after',
    structureId: 'linked-list',
    title: 'Insert after Target',
    description:
      'Follows the chain to the node holding the target, then splices a new node in behind it.',
    args: [
      { name: 'target', placeholder: '13' },
      { name: 'value', placeholder: '42' },
    ],
    listing: linkedListInsertAfterListing,
    run: linkedListInsertAfter,
  },

  'linked-list-remove': {
    id: 'linked-list-remove',
    structureId: 'linked-list',
    title: 'Remove',
    description:
      'Keeps a reference to the previous node while scanning, so the match can be unlinked by pointing past it.',
    args: [{ name: 'target', placeholder: '13' }],
    listing: linkedListRemoveListing,
    run: linkedListRemove,
  },

  'binary-search-tree-insert': {
    id: 'binary-search-tree-insert',
    structureId: 'binary-search-tree',
    title: 'Insert Value',
    description:
      'Descends left or right by comparing against each node, and hangs the new node off the first empty slot.',
    args: [{ name: 'value', placeholder: '42' }],
    listing: treeInsertListing,
    run: binarySearchTreeInsert,
  },

  'binary-search-tree-remove': {
    id: 'binary-search-tree-remove',
    structureId: 'binary-search-tree',
    title: 'Remove Value',
    description:
      'Unlinks a leaf, lifts a lone child into place, or — for a node with two children — replaces it with its inorder successor.',
    args: [{ name: 'value', placeholder: '42' }],
    listing: treeRemoveListing,
    run: binarySearchTreeRemove,
  },

  'max-heap-push': {
    id: 'max-heap-push',
    structureId: 'max-heap',
    title: 'Push',
    description:
      'Appends the value at the end, then swaps it upwards past any smaller parent until the heap order holds.',
    args: [{ name: 'value', placeholder: '42' }],
    listing: heapPushListing,
  },

  'max-heap-pop': {
    id: 'max-heap-pop',
    structureId: 'max-heap',
    title: 'Pop',
    description:
      'Moves the last value to the root and removes the old maximum, then sinks the root past its larger child.',
    args: [],
    listing: heapPopListing,
  },
};

export default algorithms;
