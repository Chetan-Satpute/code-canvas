import { parseArgument } from '#utils/argument.ts';
import { randomNumber, uniqueRandomNumberArray } from '#utils/random.ts';

import { animateMoveMany, appear, disappear } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import { defineBinarySearchTreeOperation } from './algorithm.ts';
import type { CoreBinarySearchTreeNode } from './structure.ts';
import { CoreBinarySearchTree } from './structure.ts';

export const NODE_COUNT_MIN = 4;
export const NODE_COUNT_MAX = 8;

interface Position {
  x: number;
  y: number;
}

// Where every node currently is. A tree's layout is derived from the whole
// tree — a node's column is its in-order position and its row is its depth —
// so an edit anywhere moves nodes it never touched. Capturing the positions
// first and animating the new layout back from them means no operation has to
// work out which nodes it displaced.
function positions(
  tree: CoreBinarySearchTree,
): Map<CoreBinarySearchTreeNode, Position> {
  return new Map(
    tree.inorder().map((node) => [node, { x: node.x, y: node.y }]),
  );
}

// Lays the tree out again and walks every node from where it was to where it
// now belongs. A node the edit added is not in `before` and so is left where
// the layout put it — it has no previous place to travel from.
function relayout(
  board: CoreBoard,
  tree: CoreBinarySearchTree,
  before: Map<CoreBinarySearchTreeNode, Position>,
) {
  tree.rearrange();

  const moves = [];

  for (const node of tree.inorder()) {
    const from = before.get(node);
    if (from === undefined) continue;
    if (from.x === node.x && from.y === node.y) continue;

    const to = { x: node.x, y: node.y };

    node.x = from.x;
    node.y = from.y;
    node.rearrange();

    moves.push({ element: node, ...to });
  }

  if (moves.length > 0) animateMoveMany(board, moves);

  board.pushFrame();
}

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
    const before = positions(tree);

    const insertion = tree.insert(args.value);

    // The tree already holds the value, and a binary search tree carries no
    // duplicates, so there is nothing to insert.
    if (insertion === null) return;

    // Kept invisible while the tree opens the column it goes in, then faded
    // in once the room exists — the same order the array's insert uses.
    insertion.node.opacity = 0;
    if (insertion.edge !== null) insertion.edge.opacity = 0;

    relayout(board, tree, before);

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

    const before = positions(tree);

    // Faded before the change is applied, since a node and an edge the tree
    // has unlinked are not serialized and so could not be seen fading. This
    // is why `remove` hands back the change rather than making it.
    if (removal.edge === null) disappear(board, removal.node);
    else disappear(board, removal.node, removal.edge);

    removal.unlink();

    relayout(board, tree, before);
  },
});
