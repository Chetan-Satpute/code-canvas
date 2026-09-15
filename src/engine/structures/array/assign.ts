import { NODE_HEIGHT } from '#canvas/elements/node.ts';

import { animateMove } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import { CoreNode } from '../../elements/node.ts';
import type { CoreArray } from './structure.ts';

// `to[index] = from`, animated. An assignment copies a value, so neither
// array gains or loses an element: what travels is a copy belonging to
// neither, and the destination cell takes its value where it lands.
export function assign(
  board: CoreBoard,
  to: CoreArray,
  index: number,
  from: CoreNode,
) {
  const target = to.nodes[index];

  const travelling = new CoreNode(from.value);
  travelling.x = from.x;
  travelling.y = from.y;
  travelling.variant = 'secondary';

  board.float(travelling);

  // Out of the row first, and only then along it. Travelling straight to the
  // cell would slide the value through whatever lies between the two, and a
  // copy moving along the row it came from is indistinguishable from the
  // cells it passes over.
  animateMove(board, travelling, travelling.x, lane(from, target));
  animateMove(board, travelling, target.x, target.y);

  // It arrives over the cell it is being written to, so the value is taken
  // from under it: what the reader sees is the old value replaced.
  target.value = travelling.value;
  target.variant = 'success';

  board.unfloat(travelling);
  board.pushFrame();
}

// The free row the copy travels along. Two arrays are laid out two rows apart
// precisely so the row between them is one nothing is ever laid out on; an
// assignment within a single array has no row between, so the copy goes out
// below the row it came from.
function lane(from: CoreNode, target: CoreNode): number {
  if (from.y === target.y) return from.y + NODE_HEIGHT;

  return Math.round((from.y + target.y) / 2);
}
