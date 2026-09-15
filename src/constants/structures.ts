import type { OperationRunner } from '#engine/algorithm.ts';
import {
  insertIntoArray,
  randomizeArray,
  removeFromArray,
  sortArray,
} from '#engine/structures/array/operations.ts';
import {
  insertIntoBinarySearchTree,
  randomizeBinarySearchTree,
  removeFromBinarySearchTree,
} from '#engine/structures/binary-search-tree/operations.ts';
import type { ArgumentKind } from '#utils/argument.ts';

export interface StructureOperationArgument {
  name: string;
  placeholder?: string;
  // Defaults to any finite number.
  kind?: ArgumentKind;
}

// An edit the user can apply to the structure from the explore sidebar,
// independent of the algorithm being explored.
export interface StructureOperation {
  id: string;
  label: string;
  args: StructureOperationArgument[];
  // Absent until the structure is ported to the engine.
  apply?: OperationRunner;
}

export interface Structure {
  id: StructureId;
  title: string;
  description: string;
  operations: StructureOperation[];
}

export type StructureId =
  'array' | 'linked-list' | 'binary-search-tree' | 'max-heap';

const structures: Record<StructureId, Structure> = {
  array: {
    id: 'array',
    title: 'Array',
    description:
      'A fixed-size collection of elements stored in order, where each element is reached directly by its index.',
    operations: [
      { id: 'randomize', label: 'Randomize', args: [], apply: randomizeArray },
      { id: 'sort', label: 'Sort', args: [], apply: sortArray },
      {
        id: 'insert',
        label: 'Insert',
        args: [
          { name: 'index', placeholder: '2', kind: 'integer' },
          { name: 'value', placeholder: '42' },
        ],
        apply: insertIntoArray,
      },
      {
        id: 'remove',
        label: 'Remove',
        args: [{ name: 'index', placeholder: '2', kind: 'integer' }],
        apply: removeFromArray,
      },
    ],
  },

  'linked-list': {
    id: 'linked-list',
    title: 'Linked List',
    description:
      'A linear chain of nodes, where each node holds a value and a reference to the next node in the sequence.',
    operations: [
      { id: 'randomize', label: 'Randomize', args: [] },
      {
        id: 'insert-head',
        label: 'Insert at head',
        args: [{ name: 'value', placeholder: '42' }],
      },
      {
        id: 'insert-after',
        label: 'Insert after',
        args: [
          { name: 'target', placeholder: '13' },
          { name: 'value', placeholder: '42' },
        ],
      },
      {
        id: 'remove',
        label: 'Remove',
        args: [{ name: 'target', placeholder: '13' }],
      },
    ],
  },

  'binary-search-tree': {
    id: 'binary-search-tree',
    title: 'Binary Search Tree',
    description:
      'A tree of nodes kept ordered, so every left child is smaller than its parent and every right child is larger.',
    operations: [
      {
        id: 'randomize',
        label: 'Randomize',
        args: [],
        apply: randomizeBinarySearchTree,
      },
      {
        id: 'insert',
        label: 'Insert',
        args: [{ name: 'value', placeholder: '42' }],
        apply: insertIntoBinarySearchTree,
      },
      {
        id: 'remove',
        label: 'Remove',
        args: [{ name: 'value', placeholder: '42' }],
        apply: removeFromBinarySearchTree,
      },
    ],
  },

  'max-heap': {
    id: 'max-heap',
    title: 'Max Heap',
    description:
      'A complete binary tree where every node is greater than or equal to its children, so the maximum sits at the root.',
    operations: [
      { id: 'randomize', label: 'Randomize', args: [] },
      {
        id: 'push',
        label: 'Push',
        args: [{ name: 'value', placeholder: '42' }],
      },
      { id: 'pop', label: 'Pop', args: [] },
    ],
  },
};

export default structures;
