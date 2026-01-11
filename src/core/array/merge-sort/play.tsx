import { CANVAS_NODE_HEIGHT, CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import type { CoreBoard } from '#core/board.tsx';
import { appear, disappear } from '#core/helpers/animation.tsx';
import {
  COLOR_ACTIVE,
  COLOR_IDLE,
  COLOR_PIVOT,
  COLOR_SECONDARY,
  COLOR_SUCCESS,
} from '#core/helpers/color.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { CoreArray } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    array: context.structure as CoreArray,
    target: context.args['target'] as number,
    board: context.board,
  };
}

export function* playMergeSort(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const fromContextResult = fromContext(context);
  const { board, array } = fromContextResult;

  yield* mergeSort(board, array, true);
}

function* mergeSort(
  board: CoreBoard,
  array: CoreArray,
  isRoot = false,
): Generator<CoreStepActionPayload> {
  // 0 function mergeSort(array: number[]): number[] {
  board.callstack.push({
    name: 'mergeSort',
    arguments: [
      { parameter: 'array', argument: array.nodes.map((node) => node.value) },
    ],
  });

  array.setName('array');
  array.rearrange();
  yield { ...board.serialize(0), codeID: `array/merge-sort` };

  // 1   // Base case: arrays of length 0 or 1 are already sorted
  // 2   if (array.length <= 1) {
  yield board.serialize(2);
  if (array.nodes.length <= 1) {
    // 3     return;
    yield board.serialize(3);

    board.callstack.pop();
    if (isRoot) {
      array.setName();
      yield {
        ...board.serialize(15),
        structureData: array.toData(),
        structureFrames: [array.toCanvasFrame()],
      };
    } else {
      yield board.serialize(15);
      array.setName();
    }

    return;
  }
  // 4   }

  // 6   const mid = Math.floor(array.length / 2);
  const mid = Math.floor(array.nodes.length / 2);
  array.nodes[mid].color = COLOR_PIVOT;
  array.nodes[mid].setLabel('bottom', 'mid');
  array.rearrange();
  yield board.serialize(6);

  // 8   const left = array.slice(0, mid);
  const left = new CoreArray();
  left.opacity = 0;
  left.moveTo(array.x, array.y + CANVAS_NODE_HEIGHT * 2);
  for (let i = 0; i < mid; i++) left.push(array.nodes[i].value);
  left.rearrange();

  board.add(left);
  appear(board, left);
  yield board.serialize(8);

  // 9   const right = array.slice(mid);
  const right = new CoreArray();
  right.opacity = 0;
  right.moveTo(
    array.x + CANVAS_NODE_WIDTH * (mid + 1),
    array.y + CANVAS_NODE_HEIGHT * 2,
  );
  for (let i = mid; i < array.nodes.length; i++)
    right.push(array.nodes[i].value);
  right.rearrange();

  board.add(right);
  appear(board, right);
  yield board.serialize(9);

  // 11   mergeSort(left);
  yield board.serialize(11);
  array.setName();
  yield* mergeSort(board, left);
  array.setName('array');
  array.rearrange();
  yield board.serialize(11);

  // 12   mergeSort(right);
  yield board.serialize(12);
  array.setName();
  yield* mergeSort(board, right);
  array.setName('array');
  array.rearrange();
  yield board.serialize(12);

  // 14   merge(array, left, right);
  array.nodes[mid].setLabel('bottom');
  for (const node of array.nodes) node.color = COLOR_SECONDARY;
  yield board.serialize(14);
  yield* merge(board, array, left, right);
  for (const node of array.nodes) node.color = COLOR_SUCCESS;
  yield board.serialize(14);
  for (const node of array.nodes) node.color = COLOR_IDLE;

  // 15 }
  disappear(board, left, right);

  board.remove(left);
  board.remove(right);
  board.callstack.pop();
  if (isRoot) {
    array.setName();
    yield {
      ...board.serialize(15),
      structureData: array.toData(),
      structureFrames: [array.toCanvasFrame()],
    };
  } else {
    yield board.serialize(15);
    array.setName();
  }
}

function* merge(
  board: CoreBoard,
  array: CoreArray,
  left: CoreArray,
  right: CoreArray,
): Generator<CoreStepActionPayload> {
  // 17 function merge(array: number[], left: number[], right: number[]): void {
  board.callstack.push({
    name: 'merge',
    arguments: [
      { parameter: 'array', argument: array.nodes.map((node) => node.value) },
      { parameter: 'left', argument: left.nodes.map((node) => node.value) },
      { parameter: 'right', argument: right.nodes.map((node) => node.value) },
    ],
  });
  yield board.serialize(17);

  // 18   let leftIndex = 0;
  let leftIndex = 0;
  left.nodes[leftIndex].color = COLOR_ACTIVE;
  yield board.serialize(18);
  // 19   let rightIndex = 0;
  let rightIndex = 0;
  right.nodes[rightIndex].color = COLOR_ACTIVE;
  yield board.serialize(19);
  // 20   let arrayIndex = 0;
  let arrayIndex = 0;
  array.nodes[arrayIndex].color = COLOR_PIVOT;
  yield board.serialize(20);

  // 22   while (leftIndex < left.length && rightIndex < right.length) {
  yield board.serialize(22);
  while (leftIndex < left.nodes.length && rightIndex < right.nodes.length) {
    // 23     if (left[leftIndex] <= right[rightIndex]) {
    yield board.serialize(22);
    if (left.nodes[leftIndex].value <= right.nodes[rightIndex].value) {
      // 24       array[arrayIndex] = left[leftIndex];
      array.nodes[arrayIndex].value = left.nodes[leftIndex].value;
      yield board.serialize(24);

      // 25       leftIndex++;
      left.nodes[leftIndex].color = COLOR_IDLE;
      leftIndex++;
      if (leftIndex < left.nodes.length)
        left.nodes[leftIndex].color = COLOR_ACTIVE;
      yield board.serialize(25);

      // 26     } else {
    } else {
      // 27       array[arrayIndex] = right[rightIndex];
      array.nodes[arrayIndex].value = right.nodes[rightIndex].value;
      yield board.serialize(27);

      // 28       rightIndex++;
      right.nodes[rightIndex].color = COLOR_IDLE;
      rightIndex++;
      if (rightIndex < right.nodes.length)
        right.nodes[rightIndex].color = COLOR_ACTIVE;
      yield board.serialize(28);
    }
    // 29     }

    // 30     arrayIndex++;
    array.nodes[arrayIndex].color = COLOR_IDLE;
    arrayIndex++;
    if (arrayIndex < array.nodes.length)
      array.nodes[arrayIndex].color = COLOR_PIVOT;
    yield board.serialize(30);

    yield board.serialize(22);
  }
  // 31   }

  // 33   // Append remaining elements (only one of these will run)
  // 34   while (leftIndex < left.nodes.length) {
  yield board.serialize(34);
  while (leftIndex < left.nodes.length) {
    // 35     array[arrayIndex] = left[leftIndex];
    array.nodes[arrayIndex].value = left.nodes[leftIndex].value;
    yield board.serialize(35);

    // 36     leftIndex++;
    left.nodes[leftIndex].color = COLOR_IDLE;
    leftIndex++;
    if (leftIndex < left.nodes.length)
      left.nodes[leftIndex].color = COLOR_ACTIVE;
    yield board.serialize(36);

    // 37     arrayIndex++;
    array.nodes[arrayIndex].color = COLOR_IDLE;
    arrayIndex++;
    if (arrayIndex < array.nodes.length)
      array.nodes[arrayIndex].color = COLOR_PIVOT;
    yield board.serialize(37);

    yield board.serialize(34);
  }

  // 40   while (rightIndex < right.nodes.length) {
  yield board.serialize(40);
  while (rightIndex < right.nodes.length) {
    // 41     array[arrayIndex] = right[rightIndex];
    array.nodes[arrayIndex].value = right.nodes[rightIndex].value;
    yield board.serialize(41);

    // 42     rightIndex++;
    right.nodes[rightIndex].color = COLOR_IDLE;
    rightIndex++;
    if (rightIndex < right.nodes.length)
      right.nodes[rightIndex].color = COLOR_ACTIVE;
    yield board.serialize(42);

    // 43     arrayIndex++;
    array.nodes[arrayIndex].color = COLOR_IDLE;
    arrayIndex++;
    if (arrayIndex < array.nodes.length)
      array.nodes[arrayIndex].color = COLOR_PIVOT;
    yield board.serialize(43);

    yield board.serialize(40);
  }
  // 44   }

  // 45 }
  board.callstack.pop();
  yield board.serialize(45);
}
