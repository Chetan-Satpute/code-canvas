import {
  COLOR_ACTIVE,
  COLOR_ERROR,
  COLOR_IDLE,
  COLOR_PIVOT,
  COLOR_SUCCESS,
} from '#core/helpers/color.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import type { CoreArray } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    array: context.structure as CoreArray,
    target: context.args['target'] as number,
    board: context.board,
  };
}

export function* playBinarySearch(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const fromContextResult = fromContext(context);
  const { board, array, target } = fromContextResult;

  // 6: function binarySearch(array: number[], target: number): number {
  board.callstack.push({
    name: 'binarySearch',
    arguments: [
      { parameter: 'array', argument: array.nodes.map((node) => node.value) },
      { parameter: 'target', argument: target },
    ],
  });

  array.setName('array');
  array.rearrange();
  yield {
    ...board.serialize(6),
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  // 7:   let left = 0;
  if (array.nodes.length) {
    array.nodes[0].setLabel('bottom', 'left');
    array.nodes[0].color = COLOR_ACTIVE;
  }

  let left = 0;
  array.rearrange();
  yield board.serialize(7);

  // 8:   let right = array.length - 1;
  if (array.nodes.length) {
    if (array.nodes[array.nodes.length - 1].label.bottom?.text === 'left')
      array.nodes[array.nodes.length - 1].setLabel('bottom', 'left|right');
    else array.nodes[array.nodes.length - 1].setLabel('bottom', 'right');
    array.nodes[array.nodes.length - 1].color = COLOR_ACTIVE;
  }

  let right = array.nodes.length - 1;
  array.rearrange();
  yield board.serialize(8);

  // 10:   while (left < right) {
  yield board.serialize(10);
  while (left < right) {
    // 11:     const mid = Math.floor((left + right) / 2);
    const mid = Math.floor((left + right) / 2);
    array.nodes[mid].color = COLOR_PIVOT;
    if (array.nodes[mid].label.bottom?.text === 'left') {
      array.nodes[mid].setLabel('bottom', 'left|mid');
    } else {
      array.nodes[mid].setLabel('bottom', 'mid');
    }
    array.rearrange();
    yield board.serialize(11);

    yield board.serialize(13);
    // 13:     if (array[mid] < target) {
    if (array.nodes[mid].value < target) {
      // 14:       left = mid + 1;
      array.nodes[left].color = COLOR_IDLE;
      array.nodes[left].setLabel('bottom');
      left = mid + 1;
      if (left < array.nodes.length) {
        array.nodes[left].color = COLOR_ACTIVE;
        if (array.nodes[left].label.bottom?.text === 'right') {
          array.nodes[left].setLabel('bottom', 'left|right');
        } else {
          array.nodes[left].setLabel('bottom', 'left');
        }
      }
      array.rearrange();
      yield board.serialize(14);
      array.nodes[mid].color = COLOR_IDLE;
      array.nodes[mid].setLabel('bottom');
      // 15:     } else {
    } else {
      // 16:       right = mid;
      array.nodes[right].color = COLOR_IDLE;
      array.nodes[right].setLabel('bottom');
      right = mid;
      array.nodes[right].color = COLOR_ACTIVE;
      if (
        array.nodes[right].label.bottom?.text === 'left' ||
        array.nodes[right].label.bottom?.text === 'left|mid'
      ) {
        array.nodes[right].setLabel('bottom', 'left|right');
      } else {
        array.nodes[right].setLabel('bottom', 'right');
      }
      array.rearrange();
      yield board.serialize(16);
    }
    // 17:     }

    yield board.serialize(10);
  }
  // 18:   }

  // 20:   if (array[left] === target) {
  yield board.serialize(20);
  if (array.nodes[left].value === target) {
    // 21:     return left;
    array.nodes[left].color = COLOR_SUCCESS;
    yield board.serialize(21);

    // cleanup
    for (const node of array.nodes) {
      node.color = COLOR_IDLE;
      node.setLabel('bottom');
    }

    array.setName();
    board.callstack.pop();
    yield {
      ...board.serialize(25),
      structureData: array.toData(),
      structureFrames: [array.toCanvasFrame()],
      codeID: `${context.structureID}/${context.algorithmID}`,
    };

    return left;
  }
  // 22:   }

  // 24:   return -1;
  for (const node of array.nodes) {
    node.color = COLOR_ERROR;
    node.setLabel('bottom');
  }
  yield board.serialize(24);

  // 25: }

  // cleanup
  for (const node of array.nodes) {
    node.color = COLOR_IDLE;
    node.setLabel('bottom');
  }

  array.setName();
  board.callstack.pop();
  yield {
    ...board.serialize(25),
    structureData: array.toData(),
    structureFrames: [array.toCanvasFrame()],
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  return -1;
}
