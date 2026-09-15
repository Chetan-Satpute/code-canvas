import { NODE_HEIGHT } from '#canvas/elements/node.ts';
import { parseArgument } from '#utils/argument.ts';

import { animateMove, appear, disappear } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import { CoreNode } from '../../elements/node.ts';
import { defineArrayAlgorithm } from '../../structures/array/algorithm.ts';
import { assign } from '../../structures/array/assign.ts';
import { CoreArray } from '../../structures/array/structure.ts';

// The listing this plays against is `constants/code/array-insert-value.md`,
// whose lines are named by the `/*#` markers the build strips out.
export const arrayInsertValue = defineArrayAlgorithm({
  parseArgs: (values) => {
    const index = parseArgument(values.index ?? '', 'integer');
    const value = parseArgument(values.value ?? '');

    // An index out of range is not refused here the way the sidebar's insert
    // operation clamps it: clamping is the first thing the listing does, and
    // a reader typing -3 should watch those two lines run.
    if (index === null || value === null) return null;

    return { index, value };
  },

  play: function* ({ board, structure: array, args, step }) {
    // Reassigned by the two guards the way the listing reassigns the
    // parameter, so it is a binding of its own rather than `args.index`.
    let index = args.index;

    const frame = board.call('insertValue', [
      { name: 'array', value: array.toData() },
      { name: 'index', value: index },
      { name: 'value', value: args.value },
    ]);

    // Two arrays are on the canvas for most of this run and the listing names
    // both, so the structures carry their names while it plays.
    array.setName('array');
    array.rearrange();

    yield step('enter');

    yield step('checkLow');

    if (index < 0) {
      index = 0;
      frame.set('index', index);
      yield step('clampLow');
    }

    yield step('checkHigh');

    if (index > array.nodes.length) {
      index = array.nodes.length;
      frame.set('index', index);
      yield step('clampHigh');
    }

    const result = allocate(board, array);
    yield step('result');

    yield step('copyBefore');

    for (let i = 0; i < index; i++) {
      frame.set('i', i);
      array.nodes[i].variant = 'secondary';

      assign(board, result, i, array.nodes[i]);
      yield step('copyBeforeAssign');

      array.nodes[i].variant = 'primary';
      yield step('copyBefore');
    }

    // Each loop declares its own `i`, so the first one's is gone before the
    // second one's is declared.
    frame.clear('i');

    write(board, result, index, args.value);
    yield step('insert');

    yield step('copyAfter');

    for (let i = index; i < array.nodes.length; i++) {
      frame.set('i', i);
      array.nodes[i].variant = 'secondary';

      // Everything from `index` on lands one cell further along, which is the
      // room the new value was written into.
      assign(board, result, i + 1, array.nodes[i]);
      yield step('copyAfterAssign');

      array.nodes[i].variant = 'primary';
      yield step('copyAfter');
    }

    frame.clear('i');

    rebind(board, array, result);
    yield step('assign');

    // The run is over, so neither the names it put on the canvas nor the
    // colors it used to say what it was doing outlive it.
    array.setName();
    for (const node of array.nodes) node.variant = 'primary';
    array.rearrange();

    yield step('exit');
    board.return();
  },
});

// `new Array(array.length + 1).fill(0)`: a second array, one cell longer,
// laid out two rows below the one being copied so the row between them is
// free for a value in flight. It fades in, so its appearance reads as
// something that happened rather than something that was always there.
function allocate(board: CoreBoard, array: CoreArray): CoreArray {
  const result = new CoreArray(
    new Array<number>(array.nodes.length + 1).fill(0),
  );

  result.setName('result');
  result.moveTo(array.x, array.y + 2 * NODE_HEIGHT);
  result.rearrange();

  result.opacity = 0;
  for (const node of result.nodes) node.opacity = 0;

  board.add(result);

  // The structure fades with its nodes because the structure is what carries
  // the name label, which would otherwise snap in while the cells were still
  // arriving.
  appear(board, result, ...result.nodes);

  return result;
}

// `result[index] = value`. The value is a parameter rather than a cell of
// another array, so it has no origin on the canvas: it arrives in the free
// row the copies travel along and drops into the slot from there.
function write(
  board: CoreBoard,
  result: CoreArray,
  index: number,
  value: number,
) {
  const target = result.nodes[index];

  const travelling = new CoreNode(value);
  travelling.x = target.x;
  travelling.y = target.y - NODE_HEIGHT;
  travelling.variant = 'tertiary';
  travelling.opacity = 0;

  board.float(travelling);

  appear(board, travelling);
  animateMove(board, travelling, target.x, target.y);

  target.value = value;
  target.variant = 'tertiary';

  board.unfloat(travelling);
  board.pushFrame();
}

// `array = result`. The name stops referring to the array the call was given
// and refers to the new one, so the old row goes and the new one takes its
// place.
//
// The structure object is what the board and the explore page hold, so it
// takes over the result's nodes rather than being replaced — the same reason
// `CoreStructure.restore` mutates in place. The nodes themselves are handed
// over, already sitting where the move left them, so the frame that ends the
// step is identical to the one before it.
function rebind(board: CoreBoard, array: CoreArray, result: CoreArray) {
  array.setName();
  array.rearrange();
  disappear(board, ...array.nodes);

  result.setName('array');
  result.rearrange();
  animateMove(board, result, array.x, array.y);

  array.nodes = result.nodes;
  array.setName('array');
  array.rearrange();

  board.remove(result);
  board.pushFrame();
}
