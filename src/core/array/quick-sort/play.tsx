import type { CoreBoard } from '#core/board.tsx';
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

export function* playQuickSort(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const fromContextResult = fromContext(context);
  const { board, array } = fromContextResult;

  array.setName('array');
  array.rearrange();
  yield* quickSort(board, array, 0, array.nodes.length - 1, true);

  for (const node of array.nodes) node.color = COLOR_IDLE;
  array.setName();
  board.callstack.pop();
  yield {
    ...board.serialize(10),
    structureData: array.toData(),
    structureFrames: [array.toCanvasFrame()],
  };
}

function* quickSort(
  board: CoreBoard,
  array: CoreArray,
  low: number,
  high: number,
  isRoot: boolean = false,
): Generator<CoreStepActionPayload> {
  // 0: function quickSort(array: number[], low = 0, high = array.length - 1): void {
  board.callstack.push({
    name: 'quickSort',
    arguments: [
      { parameter: 'array', argument: array.nodes.map((node) => node.value) },
      { parameter: 'low', argument: low },
      { parameter: 'high', argument: high },
    ],
  });

  yield { ...board.serialize(0), codeID: 'array/quick-sort' };

  // 1:   // Base case: 0 or 1 element is already sorted
  // 2:   if (low >= high) {
  yield board.serialize(2);
  if (low >= high) {
    // 3:     return;
    yield board.serialize(3);
    if (!isRoot) {
      board.callstack.pop();
      yield board.serialize(10);
    }

    return;
    // 4:   }
  }

  // 6:   const pivotIndex = partition(array, low, high);
  yield board.serialize(6);
  const pivotIndex = yield* partition(board, array, low, high);
  yield board.serialize(6);

  // 8:   quickSort(array, low, pivotIndex - 1);
  yield board.serialize(8);
  yield* quickSort(board, array, low, pivotIndex - 1);
  for (let i = low; i < pivotIndex; i++) array.nodes[i].color = COLOR_SUCCESS;
  yield board.serialize(8);

  // 9:   quickSort(array, pivotIndex + 1, high);
  yield board.serialize(9);
  yield* quickSort(board, array, pivotIndex + 1, high);
  for (let i = pivotIndex + 1; i <= high; i++)
    array.nodes[i].color = COLOR_SUCCESS;
  yield board.serialize(9);

  // 10: }
  if (!isRoot) {
    board.callstack.pop();
    yield board.serialize(10);
  }
}

function* partition(
  board: CoreBoard,
  array: CoreArray,
  low: number,
  high: number,
): Generator<CoreStepActionPayload, number> {
  // 12: function partition(array: number[], low: number, high: number): number {
  board.callstack.push({
    name: 'partition',
    arguments: [
      { parameter: 'array', argument: array.nodes.map((n) => n.value) },
      { parameter: 'low', argument: low },
      { parameter: 'high', argument: high },
    ],
  });

  yield board.serialize(12);

  // 13:   const pivot = array[high];
  const pivotValue = array.nodes[high].value;
  array.nodes[high].color = COLOR_PIVOT;
  yield board.serialize(13);

  // 14:   let i = low - 1;
  let i = low - 1;
  yield board.serialize(14);

  // 16:   for (let j = low; j < high; j++) {
  if (low < array.nodes.length) array.nodes[low].color = COLOR_ACTIVE;
  yield board.serialize(16);
  for (let j = low; j < high; j++) {
    // 17:     if (array[j] <= pivot) {
    yield board.serialize(17);
    if (array.nodes[j].value <= pivotValue) {
      // 18:       i++;
      i++;
      array.nodes[i].color = COLOR_SECONDARY;
      yield board.serialize(18);

      // 19:       // Swap to move smaller element to the left side
      // 20:       [array[i], array[j]] = [array[j], array[i]];
      [array.nodes[i].value, array.nodes[j].value] = [
        array.nodes[j].value,
        array.nodes[i].value,
      ];
      yield board.serialize(20);
      // 21:     }
    }
    // 22:   }

    if (j !== i) array.nodes[j].color = COLOR_IDLE;
    if (j + 1 < high) array.nodes[j + 1].color = COLOR_ACTIVE;
    yield board.serialize(16);
  }

  // 24:   // Swap pivot into its final sorted position
  // 25:   [array[i + 1], array[high]] = [array[high], array[i + 1]];
  array.nodes[i + 1].color = COLOR_SUCCESS;
  [array.nodes[i + 1].value, array.nodes[high].value] = [
    array.nodes[high].value,
    array.nodes[i + 1].value,
  ];
  yield board.serialize(25);

  // 27:   return i + 1;
  // 28: }
  if (high !== i + 1) array.nodes[high].color = COLOR_IDLE;
  yield board.serialize(27);

  board.callstack.pop();
  for (let k = low; k <= i; k++) array.nodes[k].color = COLOR_IDLE;
  yield board.serialize(28);

  return i + 1;
}
