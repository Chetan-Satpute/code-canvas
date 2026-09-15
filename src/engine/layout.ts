import { animateMoveMany } from './animation.ts';
import type { CoreBoard } from './board.ts';
import type { CoreNode } from './elements/node.ts';

interface Position {
  x: number;
  y: number;
}

export type Layout = Map<CoreNode, Position>;

// Where every node is right now. A structure that derives its layout from its
// contents — a linked list positions by index, a tree by in-order column and
// depth — moves nodes that an edit never touched. Capturing the positions
// first and animating the new layout back from them means nothing that edits
// such a structure has to work out which nodes it displaced.
export function capture(nodes: CoreNode[]): Layout {
  return new Map(nodes.map((node) => [node, { x: node.x, y: node.y }]));
}

// Walks every node from where `before` had it to where it is now, which is
// where the structure's own `rearrange` has already put it. A node the edit
// added is not in `before` and is left where the layout put it — unless the
// caller captured it too, which is how a node staged off the structure is
// animated into place alongside the nodes making room for it.
export function animateFrom(
  board: CoreBoard,
  nodes: CoreNode[],
  before: Layout,
) {
  const moves = [];

  for (const node of nodes) {
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
