import { NODE_HEIGHT } from '#canvas/elements/node.ts';

import { animateMoveMany } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import type { CoreStep } from '../../step.ts';
import { defineArrayAlgorithm } from '../../structures/array/algorithm.ts';
import { CoreArray } from '../../structures/array/structure.ts';

// What a recursive call needs from the algorithm context. The array is not in
// it — every call sorts the same one — but the range it works on is.
interface Context {
  board: CoreBoard;
  step: (anchor: string) => CoreStep;
}

// The listing this plays against is `constants/code/array-quick-sort.md`,
// whose lines are named by the `/*#` markers the build strips out.
export const arrayQuickSort = defineArrayAlgorithm({
  parseArgs: () => ({}),

  play: function* ({ board, structure: array, step }) {
    yield* quickSort({ board, step }, array, 0, array.nodes.length - 1);

    // The run is over, so the colors it used to say what it was doing come
    // off. The last step held the whole array marked sorted, which is what
    // the reader is left having seen.
    for (const node of array.nodes) node.variant = 'primary';
  },
});

function* quickSort(
  context: Context,
  array: CoreArray,
  low: number,
  high: number,
): Generator<CoreStep> {
  const { board, step } = context;

  const frame = board.call('quickSort', [
    { name: 'array', value: array.toData() },
    { name: 'low', value: low },
    { name: 'high', value: high },
  ]);

  yield step('enter');
  yield step('base');

  if (low >= high) {
    // A range of one element is already where it belongs. An empty one —
    // which is what a partition at either end of its range produces — has
    // nothing on the canvas to say that about.
    if (low === high) array.nodes[low].variant = 'success';

    yield step('sorted');
    yield step('exit');

    board.return();

    return;
  }

  yield step('partitionCall');
  const pivotIndex = yield* partition(context, array, low, high);
  frame.set('pivotIndex', pivotIndex);
  yield step('partitionCall');

  yield step('sortLeft');
  yield* quickSort(context, array, low, pivotIndex - 1);
  yield step('sortLeft');

  yield step('sortRight');
  yield* quickSort(context, array, pivotIndex + 1, high);
  yield step('sortRight');

  // The pivot was placed by the partition and both sides have now been
  // sorted, so every cell in the range is final.
  for (let index = low; index <= high; index++)
    array.nodes[index].variant = 'success';

  yield step('exit');
  board.return();
}

function* partition(
  context: Context,
  array: CoreArray,
  low: number,
  high: number,
): Generator<CoreStep, number> {
  const { board, step } = context;

  const frame = board.call('partition', [
    { name: 'array', value: array.toData() },
    { name: 'low', value: low },
    { name: 'high', value: high },
  ]);

  yield step('partitionEnter');

  // The pivot is the value, not the cell: the cell it sits in is where the
  // last swap will put something else. It keeps `tertiary` for the whole
  // partition, and the element being compared against it takes the same
  // variant while the comparison is on screen — the two operands of one
  // comparison read as a pair.
  const pivot = array.nodes[high].value;
  frame.set('pivot', pivot);

  array.nodes[high].variant = 'tertiary';
  array.nodes[high].setLabel('bottom', 'pivot');
  array.rearrange();
  yield step('pivot');

  let i = low - 1;
  frame.set('i', i);
  markCursors(array, low, high, i, -1);
  yield step('boundary');

  for (let j = low; j < high; j++) {
    frame.set('j', j);
    markCursors(array, low, high, i, j);
    yield step('loop');

    array.nodes[j].variant = 'tertiary';
    yield step('compare');

    if (array.nodes[j].value <= pivot) {
      i++;
      frame.set('i', i);
      markCursors(array, low, high, i, j);
      yield step('advanceBoundary');

      swap(board, array, i, j);

      // The element that moved down to `i` is one of the small ones now, and
      // whatever came back with it is one of the large ones.
      array.nodes[i].variant = 'secondary';
      array.nodes[j].variant = j === i ? 'secondary' : 'danger';
      markCursors(array, low, high, i, j);
      yield step('swap');
    } else {
      // Larger than the pivot, so it stays on the right of the boundary and
      // nothing moves.
      array.nodes[j].variant = 'danger';
    }
  }

  // `i + 1` is the first cell holding something larger than the pivot, which
  // is where the pivot belongs.
  const pivotIndex = i + 1;

  swap(board, array, pivotIndex, high);

  array.nodes[pivotIndex].variant = 'success';
  clearCursors(array, low, high);
  yield step('placePivot');

  frame.set('pivotIndex', pivotIndex);
  yield step('returnIndex');

  // Which side of the pivot a value fell is settled, and the calls about to
  // sort those sides say the rest. Only the pivot keeps its variant: it is in
  // the cell it will end the run in.
  for (let index = low; index <= high; index++) {
    if (index === pivotIndex) continue;

    array.nodes[index].variant = 'primary';
  }

  yield step('partitionExit');
  board.return();

  return pivotIndex;
}

// The two cursors the loop is built around, under the cells they point at.
// `i` starts before the range and has nothing to mark until the first element
// moves behind it; when the two land on the same cell, one label names both.
function markCursors(
  array: CoreArray,
  low: number,
  high: number,
  i: number,
  j: number,
) {
  // The pivot sits at `high` and keeps its own label, and neither cursor ever
  // reaches it: the loop stops below it.
  for (let index = low; index < high; index++)
    array.nodes[index].setLabel('bottom');

  if (i >= low) array.nodes[i].setLabel('bottom', i === j ? 'i j' : 'i');
  if (j >= low && j !== i) array.nodes[j].setLabel('bottom', 'j');

  array.rearrange();
}

function clearCursors(array: CoreArray, low: number, high: number) {
  for (let index = low; index <= high; index++)
    array.nodes[index].setLabel('bottom');

  array.rearrange();
}

// `[array[a], array[b]] = [array[b], array[a]]`, animated. The two elements
// exchange places, so unlike an assignment this really is the nodes moving —
// out of the row in opposite directions, past each other, and back in. Going
// straight along the row would take each of them through every element in
// between.
function swap(board: CoreBoard, array: CoreArray, a: number, b: number) {
  // The listing swaps a cell with itself whenever the element already sits
  // where the boundary reached, which is a statement that runs and moves
  // nothing.
  if (a === b) {
    board.pushFrame();
    return;
  }

  const first = array.nodes[a];
  const second = array.nodes[b];

  // An index names a cell rather than the value in it, and so does a cursor,
  // so neither travels with the node. `rearrange` writes the indices back on
  // arrival, and the cursors are put back by the caller.
  first.clearLabels();
  second.clearLabels();

  const firstX = first.x;
  const secondX = second.x;
  const { y } = first;

  animateMoveMany(board, [
    { element: first, x: firstX, y: y - NODE_HEIGHT },
    { element: second, x: secondX, y: y + NODE_HEIGHT },
  ]);

  animateMoveMany(board, [
    { element: first, x: secondX, y: y - NODE_HEIGHT },
    { element: second, x: firstX, y: y + NODE_HEIGHT },
  ]);

  animateMoveMany(board, [
    { element: first, x: secondX, y },
    { element: second, x: firstX, y },
  ]);

  [array.nodes[a], array.nodes[b]] = [array.nodes[b], array.nodes[a]];
  array.rearrange();
}
