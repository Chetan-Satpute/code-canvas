import { disappear } from '#core/helpers/animation.tsx';
import { COLOR_ACTIVE, COLOR_ERROR, COLOR_IDLE } from '#core/helpers/color.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { CoreArray } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    array: context.structure as CoreArray,
    index: context.args['index'] as number,
    board: context.board,
  };
}

export function* playRemoveValue(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const { board, array } = fromContext(context);
  let { index } = fromContext(context);

  // 0 function removeValue(array: number[], index: number) {
  board.callstack.push({
    name: 'removeValue',
    arguments: [
      { parameter: 'array', argument: array.nodes.map((n) => n.value) },
      { parameter: 'index', argument: index },
    ],
  });

  array.setName('array');
  array.rearrange();

  yield {
    ...board.serialize(0),
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  // 1    if (index < 0 || index >= array.length) {
  yield board.serialize(1);
  if (index < 0 || index >= array.nodes.length) {
    // 2      return;
    yield board.serialize(2);

    // handle early return
    array.setName();
    board.callstack.pop();
    yield {
      ...board.serialize(11),
      structureData: array.toData(),
      structureFrames: [array.toCanvasFrame()],
    };
    return;
  }

  // 6    for (let i = index + 1; i < array.length; i++) {
  array.nodes[index].color = COLOR_ERROR;
  if (index + 1 < array.nodes.length) array.nodes[index + 1].color = COLOR_ACTIVE;
  yield board.serialize(6);
  for (let i = index + 1; i < array.nodes.length; i++) {
    // 7      array[i - 1] = array[i];
    array.nodes[i - 1].value = array.nodes[i].value;
    array.nodes[i - 1].color = COLOR_ACTIVE;
    yield board.serialize(7);
    array.nodes[i].color = COLOR_IDLE;
    array.nodes[i - 1].color = COLOR_IDLE;

    if (i + 1 < array.nodes.length) array.nodes[i + 1].color = COLOR_ACTIVE;
    yield board.serialize(6);
  }

  // 10   array.length--;
  const lastNode = array.nodes[array.nodes.length - 1];
  disappear(board, lastNode);

  array.nodes.pop();
  array.rearrange();
  yield board.serialize(10);

  // 11 }
  array.setName();
  board.callstack.pop();
  yield {
    ...board.serialize(11),
    structureData: array.toData(),
    structureFrames: [array.toCanvasFrame()],
  };
}
