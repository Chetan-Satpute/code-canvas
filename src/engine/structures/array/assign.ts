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

  // Out into the row between the two arrays first, and only then along it.
  // Travelling straight to the cell would slide the value through the array
  // it was read from and then through the cells already written; the two
  // arrays are laid out two rows apart precisely so there is a row between
  // that nothing is ever laid out on.
  animateMove(board, travelling, travelling.x, lane(from, target));
  animateMove(board, travelling, target.x, target.y);

  // It arrives over the cell it is being written to, so the value is taken
  // from under it: what the reader sees is the old value replaced.
  target.value = travelling.value;
  target.variant = 'success';

  board.unfloat(travelling);
  board.pushFrame();
}

// The free row between the source and the destination, whichever of the two
// is above the other.
function lane(from: CoreNode, target: CoreNode): number {
  return Math.round((from.y + target.y) / 2);
}
