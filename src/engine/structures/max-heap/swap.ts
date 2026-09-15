import { NODE_HEIGHT } from '#canvas/elements/node.ts';

import { animateMoveMany } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import type { CoreMaxHeap } from './structure.ts';

// `[heap[a], heap[b]] = [heap[b], heap[a]]`, animated. The listing exchanges
// two elements, so in the array row the nodes themselves move: out of the row
// in opposite directions, past each other, and back in. Travelling along the
// row would take each of them through every element in between. v1 swapped
// the numbers and left both nodes standing, which is a recolor and does not
// show a value climbing the heap.
//
// The tree is a second drawing of those same elements, and there the two
// values simply trade places. Moving its nodes past each other drags every
// edge that touches them out of shape for the length of the move, which reads
// as the tree coming apart rather than as two values swapping.
export function animateSwap(
  board: CoreBoard,
  heap: CoreMaxHeap,
  a: number,
  b: number,
) {
  const rising = heap.nodes[a].arrayNode;
  const falling = heap.nodes[b].arrayNode;

  const risingAt = { x: rising.x, y: rising.y };
  const fallingAt = { x: falling.x, y: falling.y };

  // An index names a slot rather than the value in it, and so does a cursor,
  // so neither travels with the node. `rearrange` writes the indices back on
  // arrival and the caller puts its cursors back — in both views, since the
  // tree's copy of these two values is about to change as well.
  for (const node of [heap.nodes[a], heap.nodes[b]]) {
    node.arrayNode.clearLabels();
    node.treeNode.clearLabels();
  }

  const above = risingAt.y - NODE_HEIGHT;
  const below = fallingAt.y + NODE_HEIGHT;

  animateMoveMany(board, [
    { element: rising, x: risingAt.x, y: above },
    { element: falling, x: fallingAt.x, y: below },
  ]);

  animateMoveMany(board, [
    { element: rising, x: fallingAt.x, y: above },
    { element: falling, x: risingAt.x, y: below },
  ]);

  animateMoveMany(board, [
    { element: rising, ...fallingAt },
    { element: falling, ...risingAt },
  ]);

  heap.swap(a, b);
  heap.rearrange();
  board.pushFrame();
}
