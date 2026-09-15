import type { NodeVariant } from '#canvas/elements/node.ts';
import { NODE_HEIGHT, NODE_WIDTH } from '#canvas/elements/node.ts';

import { appear, disappear } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import type { CoreStep } from '../../step.ts';
import { defineArrayAlgorithm } from '../../structures/array/algorithm.ts';
import { assign } from '../../structures/array/assign.ts';
import { CoreArray } from '../../structures/array/structure.ts';

// What a recursive call needs from the algorithm context. The structure is
// not in it: which array a call sorts is the argument that changes.
interface Context {
  board: CoreBoard;
  step: (anchor: string) => CoreStep;
}

// The listing this plays against is `constants/code/array-merge-sort.md`,
// whose lines are named by the `/*#` markers the build strips out.
export const arrayMergeSort = defineArrayAlgorithm({
  parseArgs: () => ({}),

  play: function* ({ board, structure: array, step }) {
    yield* mergeSort({ board, step }, array);
  },
});

function* mergeSort(context: Context, array: CoreArray): Generator<CoreStep> {
  const { board, step } = context;

  const frame = board.call('mergeSort', [
    { name: 'array', value: array.toData() },
  ]);

  // Every call sorts an array it calls `array`, so the name is set on entry
  // and put back to `left` or `right` by the caller once the call returns.
  // The canvas is then annotated with the names the highlighted line uses.
  array.setName('array');
  array.rearrange();

  yield step('enter');
  yield step('base');

  if (array.nodes.length <= 1) {
    yield step('sorted');
    yield step('exit');

    board.return();

    return;
  }

  const mid = Math.floor(array.nodes.length / 2);
  frame.set('mid', mid);

  array.nodes[mid].variant = 'tertiary';
  array.nodes[mid].setLabel('bottom', 'mid');
  array.rearrange();
  yield step('mid');

  const left = sliceHalf(board, array, 0, mid);
  yield step('left');

  const right = sliceHalf(board, array, mid, array.nodes.length);
  yield step('right');

  // The three names belong to this call, so they come off while a deeper one
  // is running and its own three are on the canvas instead. Each structure
  // positions its own name, so all three are rearranged and not just the one
  // being recursed into.
  const showNames = (visible: boolean) => {
    array.setName(visible ? 'array' : undefined);
    left.setName(visible ? 'left' : undefined);
    right.setName(visible ? 'right' : undefined);

    array.rearrange();
    left.rearrange();
    right.rearrange();
  };

  showNames(true);

  yield step('sortLeft');
  showNames(false);
  yield* mergeSort(context, left);
  showNames(true);
  yield step('sortLeft');

  yield step('sortRight');
  showNames(false);
  yield* mergeSort(context, right);
  showNames(true);
  yield step('sortRight');

  array.nodes[mid].variant = 'primary';
  array.nodes[mid].setLabel('bottom');
  array.rearrange();

  yield step('mergeHalves');
  yield* merge(context, array, left, right);

  // The whole range is sorted, which is the one thing the reader is meant to
  // take from the call — held for a step before the colors come off.
  yield step('mergeHalves');
  for (const node of array.nodes) node.variant = 'primary';

  // The halves were copies, and the values they held are back in `array`, so
  // they go out of scope here the way they do in the listing.
  disappear(board, ...left.nodes, ...right.nodes);
  board.remove(left);
  board.remove(right);

  frame.clear('mid');

  yield step('exit');
  board.return();
}

// One half of `array`, as `array.slice` makes it: a copy, laid out one row
// below and under the elements it was taken from, fading in so the split
// reads as something that happened rather than something that was always
// there.
function sliceHalf(
  board: CoreBoard,
  array: CoreArray,
  from: number,
  to: number,
): CoreArray {
  const half = new CoreArray(
    array.nodes.slice(from, to).map((node) => node.value),
  );

  // A half starting partway along sits one cell further right than its
  // elements did, so the two halves have a gap between them.
  half.moveTo(
    array.x + (from === 0 ? 0 : from + 1) * NODE_WIDTH,
    array.y + 2 * NODE_HEIGHT,
  );
  half.rearrange();

  for (const node of half.nodes) node.opacity = 0;

  board.add(half);
  appear(board, ...half.nodes);

  return half;
}

function* merge(
  context: Context,
  array: CoreArray,
  left: CoreArray,
  right: CoreArray,
): Generator<CoreStep> {
  const { board, step } = context;

  const frame = board.call('merge', [
    { name: 'array', value: array.toData() },
    { name: 'left', value: left.toData() },
    { name: 'right', value: right.toData() },
  ]);

  yield step('mergeEnter');

  // All three arrays keep every element they have for the whole of the merge.
  // What moves is the index each one is read or written at, which is why the
  // three of them are marked rather than rebuilt: `left` and `right` are read
  // and never change, and `array` has each of its cells overwritten in turn.
  let leftIndex = 0;
  frame.set('leftIndex', leftIndex);
  mark(left, leftIndex, 'secondary');
  yield step('leftIndex');

  let rightIndex = 0;
  frame.set('rightIndex', rightIndex);
  mark(right, rightIndex, 'secondary');
  yield step('rightIndex');

  let arrayIndex = 0;
  frame.set('arrayIndex', arrayIndex);
  mark(array, arrayIndex, 'tertiary');
  yield step('arrayIndex');

  yield step('loop');

  while (leftIndex < left.nodes.length && rightIndex < right.nodes.length) {
    yield step('compare');

    if (left.nodes[leftIndex].value <= right.nodes[rightIndex].value) {
      assign(board, array, arrayIndex, left.nodes[leftIndex]);
      yield step('takeLeft');

      leftIndex = advance(left, leftIndex, frame, 'leftIndex');
      yield step('nextLeft');
    } else {
      assign(board, array, arrayIndex, right.nodes[rightIndex]);
      yield step('takeRight');

      rightIndex = advance(right, rightIndex, frame, 'rightIndex');
      yield step('nextRight');
    }

    arrayIndex++;
    frame.set('arrayIndex', arrayIndex);
    mark(array, arrayIndex, 'tertiary');
    yield step('nextSlot');

    yield step('loop');
  }

  yield step('drainLeft');

  while (leftIndex < left.nodes.length) {
    assign(board, array, arrayIndex, left.nodes[leftIndex]);
    yield step('drainLeftTake');

    leftIndex = advance(left, leftIndex, frame, 'leftIndex');
    yield step('drainLeftNext');

    arrayIndex++;
    frame.set('arrayIndex', arrayIndex);
    mark(array, arrayIndex, 'tertiary');
    yield step('drainLeftSlot');

    yield step('drainLeft');
  }

  yield step('drainRight');

  while (rightIndex < right.nodes.length) {
    assign(board, array, arrayIndex, right.nodes[rightIndex]);
    yield step('drainRightTake');

    rightIndex = advance(right, rightIndex, frame, 'rightIndex');
    yield step('drainRightNext');

    arrayIndex++;
    frame.set('arrayIndex', arrayIndex);
    mark(array, arrayIndex, 'tertiary');
    yield step('drainRightSlot');

    yield step('drainRight');
  }

  yield step('mergeExit');
  board.return();
}

// Marks the element an index points at. Past the end is an index that has run
// out, which the listing's loop conditions test for and which leaves nothing
// on the canvas to mark.
function mark(array: CoreArray, index: number, variant: NodeVariant) {
  const node = array.nodes[index];
  if (node === undefined) return;

  node.variant = variant;
}

// `leftIndex++` on a half being read: the element it pointed at is behind it
// now, so it goes back to resting and the next one is marked.
function advance(
  half: CoreArray,
  index: number,
  frame: { set(name: string, value: number): void },
  name: string,
): number {
  mark(half, index, 'primary');

  const next = index + 1;
  frame.set(name, next);
  mark(half, next, 'secondary');

  return next;
}
