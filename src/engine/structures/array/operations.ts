import { NODE_WIDTH } from '#canvas/elements/node.ts';
import { parseArgument } from '#utils/argument.ts';
import { randomNumber, randomNumberArray } from '#utils/random.ts';

import { animateMoveMany, appear, disappear } from '../../animation.ts';
import { CoreNode } from '../../elements/node.ts';
import { defineArrayOperation } from './algorithm.ts';

// An index the user typed. Whether it is a whole number at all is settled by
// `parseArgument`; being out of range is ordinary — the bound depends on the
// array's current length, which the form does not know — so it is clamped
// rather than refused, as v1 did.
function clampIndex(value: string, max: number): number | null {
  const index = parseArgument(value, 'integer');
  if (index === null) return null;

  return Math.min(Math.max(index, 0), max);
}

export const randomizeArray = defineArrayOperation({
  parseArgs: () => ({}),
  apply: (_board, array) => {
    array.nodes = randomNumberArray(randomNumber(5, 10)).map(
      (value) => new CoreNode(value),
    );
    array.rearrange();
  },
});

export const sortArray = defineArrayOperation({
  parseArgs: () => ({}),
  apply: (_board, array) => {
    array.nodes.sort((a, b) => a.value - b.value);
    array.rearrange();
  },
});

export const insertIntoArray = defineArrayOperation({
  parseArgs: (values) => {
    const value = parseArgument(values.value ?? '');
    if (value === null) return null;

    return { index: values.index ?? '', value };
  },
  apply: (board, array, args) => {
    const index = clampIndex(args.index, array.nodes.length);
    if (index === null) return;

    const node = new CoreNode(args.value);
    node.opacity = 0;

    // Spliced in before the shift so the later elements already know their
    // new indices, then faded in once the gap exists.
    array.nodes.splice(index, 0, node);
    array.rearrange();

    // Undo the layout for everything after the gap, so the move starts from
    // where the reader last saw those elements.
    const shifted = array.nodes.slice(index + 1);
    for (const element of shifted) element.x -= NODE_WIDTH;
    array.nodes[index].x -= NODE_WIDTH;

    animateMoveMany(
      board,
      shifted.map((element) => ({
        element,
        x: element.x + NODE_WIDTH,
        y: element.y,
      })),
    );

    array.rearrange();
    appear(board, node);
  },
});

export const removeFromArray = defineArrayOperation({
  parseArgs: (values) => ({ index: values.index ?? '' }),
  apply: (board, array, args) => {
    if (array.nodes.length === 0) return;

    const index = clampIndex(args.index, array.nodes.length - 1);
    if (index === null) return;

    // Faded out while still in the array, since a node the array no longer
    // holds is not serialized and so could not be seen fading.
    disappear(board, array.nodes[index]);
    array.nodes.splice(index, 1);

    // The gap it left is closed by walking everything after it one cell back.
    animateMoveMany(
      board,
      array.nodes.slice(index).map((element) => ({
        element,
        x: element.x - NODE_WIDTH,
        y: element.y,
      })),
    );

    array.rearrange();
    board.pushFrame();
  },
});
