import { NODE_WIDTH } from '#canvas/elements/node.ts';
import { randomNumber, randomNumberArray } from '#utils/random.ts';

import { animateMoveMany, appear, disappear } from '../../animation.ts';
import { CoreNode } from '../../elements/node.ts';
import { defineArrayOperation } from './algorithm.ts';

// An index the user typed. Out of range is ordinary — the field is free text
// — so it is clamped rather than refused, which is what v1 did too.
function clampIndex(value: string, max: number): number | null {
  const index = Number(value);
  if (!Number.isInteger(index)) return null;

  return Math.min(Math.max(index, 0), max);
}

function parseValue(value: string): number | null {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
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
    const value = parseValue(values.value ?? '');
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
