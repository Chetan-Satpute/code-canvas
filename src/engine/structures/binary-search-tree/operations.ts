import { parseArgument } from '#utils/argument.ts';
import { randomNumber, uniqueRandomNumberArray } from '#utils/random.ts';

import { appear, disappear } from '../../animation.ts';
import { animateFrom, capture } from '../../layout.ts';
import { defineBinarySearchTreeOperation } from './algorithm.ts';
import type { CoreBinarySearchTree } from './structure.ts';

export const NODE_COUNT_MIN = 4;
export const NODE_COUNT_MAX = 8;

// A tree of distinct values in random order, so the shape it takes is the one
// that insertion order gives it rather than a balanced one.
export function fillRandomly(tree: CoreBinarySearchTree) {
  tree.restore(null);

  for (const value of uniqueRandomNumberArray(
    randomNumber(NODE_COUNT_MIN, NODE_COUNT_MAX),
  ))
    tree.insert(value);

  tree.rearrange();
}

export const randomizeBinarySearchTree = defineBinarySearchTreeOperation({
  parseArgs: () => ({}),
  apply: (_board, tree) => {
    fillRandomly(tree);
  },
});

export const insertIntoBinarySearchTree = defineBinarySearchTreeOperation({
  parseArgs: (values) => {
    const value = parseArgument(values.value ?? '');

    return value === null ? null : { value };
  },
  apply: (board, tree, args) => {
    const before = capture(tree.inorder());

    const insertion = tree.insert(args.value);

    // The tree already holds the value, and a binary search tree carries no
    // duplicates, so there is nothing to insert.
    if (insertion === null) return;

    // Kept invisible while the tree opens the column it goes in, then faded
    // in once the room exists — the same order the array's insert uses.
    insertion.node.opacity = 0;
    if (insertion.edge !== null) insertion.edge.opacity = 0;

    tree.rearrange();
    animateFrom(board, tree.inorder(), before);

    if (insertion.edge === null) appear(board, insertion.node);
    else appear(board, insertion.node, insertion.edge);
  },
});

export const removeFromBinarySearchTree = defineBinarySearchTreeOperation({
  parseArgs: (values) => {
    const value = parseArgument(values.value ?? '');

    return value === null ? null : { value };
  },
  apply: (board, tree, args) => {
    const removal = tree.remove(args.value);
    if (removal === null) return;

    const before = capture(tree.inorder());

    // Faded before the change is applied, since a node and an edge the tree
    // has unlinked are not serialized and so could not be seen fading. This
    // is why `remove` hands back the change rather than making it.
    if (removal.edge === null) disappear(board, removal.node);
    else disappear(board, removal.node, removal.edge);

    removal.unlink();

    tree.rearrange();
    animateFrom(board, tree.inorder(), before);
  },
});
