import { animateMoveMany } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import type { CoreBinarySearchTreeNode } from './structure.ts';
import { CoreBinarySearchTree } from './structure.ts';

interface Position {
  x: number;
  y: number;
}

export type Layout = Map<CoreBinarySearchTreeNode, Position>;

// Where every node currently is. A tree's layout is derived from the whole
// tree — a node's column is its in-order position and its row is its depth —
// so an edit anywhere moves nodes it never touched. Capturing the positions
// first and animating the new layout back from them means nothing that edits
// the tree has to work out which nodes it displaced.
export function positions(tree: CoreBinarySearchTree): Layout {
  return new Map(
    tree.inorder().map((node) => [node, { x: node.x, y: node.y }]),
  );
}

// Lays the tree out again and walks every node from where it was to where it
// now belongs. A node the edit added is not in `before` and so is left where
// the layout put it — it has no previous place to travel from.
export function relayout(
  board: CoreBoard,
  tree: CoreBinarySearchTree,
  before: Layout,
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
