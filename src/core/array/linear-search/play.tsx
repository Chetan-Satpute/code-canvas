import {
  COLOR_ACTIVE,
  COLOR_ERROR,
  COLOR_IDLE,
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

export function* playLinearSearch(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const fromContextResult = fromContext(context);
  const { board, array, target } = fromContextResult;

  // 0 function linearSearch(array: number[], target: number) {
  board.callstack.push({
    name: 'linearSearch',
    arguments: [
      { parameter: 'array', argument: array.nodes.map((node) => node.value) },
      { parameter: 'target', argument: target },
    ],
  });

  array.setName('array');
  array.rearrange();
  yield {
    ...board.serialize(0),
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  // 1   for (let i = 0; i < array.length; i++) {
  yield board.serialize(1);
  for (let i = 0; i < array.nodes.length; i++) {
    array.nodes[i].color = COLOR_ACTIVE;

    // 2     if (array[i] === target) {
    yield board.serialize(2);
    if (array.nodes[i].value === target) {
      // 3       return i;
      array.nodes[i].color = COLOR_SUCCESS;
      yield board.serialize(3);
      array.nodes[i].color = COLOR_IDLE;

      // end play with success
      board.callstack.pop();
      yield {
        ...board.serialize(8),
        structureData: array.toData(),
        structureFrames: [array.toCanvasFrame()],
        codeID: `${context.structureID}/${context.algorithmID}`,
      };
      
      return;
    }

    array.nodes[i].color = COLOR_IDLE;
    yield board.serialize(1);
  }

  // 7   return NaN;
  for (let i = 0; i < array.nodes.length; i++) {
    array.nodes[i].color = COLOR_ERROR;
  }
  yield board.serialize(7);
  for (let i = 0; i < array.nodes.length; i++) {
    array.nodes[i].color = COLOR_IDLE;
  }

  // 8 }
  board.callstack.pop();
  yield {
    ...board.serialize(8),
    structureData: array.toData(),
    structureFrames: [array.toCanvasFrame()],
    codeID: `${context.structureID}/${context.algorithmID}`,
  };
}
