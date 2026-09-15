import { parseArgument } from '#utils/argument.ts';

import { disappear } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import { defineArrayAlgorithm } from '../../structures/array/algorithm.ts';
import { assign } from '../../structures/array/assign.ts';
import type { CoreArray } from '../../structures/array/structure.ts';

// The listing this plays against is `constants/code/array-remove-value.md`,
// whose lines are named by the `/*#` markers the build strips out.
export const arrayRemoveValue = defineArrayAlgorithm({
  parseArgs: (values) => {
    const index = parseArgument(values.index ?? '', 'integer');

    // Out of range is not clamped the way the sidebar's remove operation
    // clamps it: the guard is the first thing the listing does, and a reader
    // typing -1 should watch it run.
    return index === null ? null : { index };
  },

  play: function* ({ board, structure: array, args, step }) {
    const { index } = args;

    const frame = board.call('removeValue', [
      { name: 'array', value: array.toData() },
      { name: 'index', value: index },
    ]);

    yield step('enter');
    yield step('guard');

    if (index < 0 || index >= array.nodes.length) {
      yield step('return');
      yield step('exit');

      board.return();

      return;
    }

    // The cell whose value the shift is about to overwrite, which is the one
    // the caller asked to be rid of. It is the value that goes, not the cell:
    // what leaves the array is the slot at the far end.
    array.nodes[index].variant = 'danger';

    yield step('loop');

    for (let i = index + 1; i < array.nodes.length; i++) {
      frame.set('i', i);
      array.nodes[i].variant = 'secondary';

      // Every later element lands one cell back, so the cell written here is
      // holding its final value and keeps the variant `assign` gives it.
      assign(board, array, i - 1, array.nodes[i]);
      yield step('shift');

      array.nodes[i].variant = 'primary';
      yield step('loop');
    }

    frame.clear('i');

    truncate(board, array);
    yield step('truncate');

    // The run is over, so none of the colors it used to say what it was doing
    // outlives it.
    for (const node of array.nodes) node.variant = 'primary';

    yield step('exit');
    board.return();
  },
});

// `array.length--`. The shift left the last two cells holding the same value,
// and this is the one that drops off the end — so the array loses a slot
// rather than a value, and nothing moves to close a gap.
function truncate(board: CoreBoard, array: CoreArray) {
  // Faded while still in the array, since a node the array no longer holds is
  // not serialized and so could not be seen fading.
  disappear(board, array.nodes[array.nodes.length - 1]);

  array.nodes.pop();
  array.rearrange();

  board.pushFrame();
}
