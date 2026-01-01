import { CANVAS_NODE_HEIGHT } from '#constants/canvas.tsx';
import { animateMove } from '#core/helpers/animation.tsx';
import { COLOR_ACTIVE, COLOR_IDLE } from '#core/helpers/color.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { CoreArray } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    array: context.structure as CoreArray,
    value: context.args['value'] as number,
    index: context.args['index'] as number,
    board: context.board,
    control: context.control,
  };
}

export function* playInsertValue(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const fromContextResult = fromContext(context);
  const { board, array, value } = fromContextResult;
  let { index } = fromContextResult;

  // 0 function insertValue(array: number[], value: number, index: number) {
  board.callstack.push({
    name: 'insertValue',
    arguments: [
      { parameter: 'array', argument: array.nodes.map((node) => node.value) },
      { parameter: 'value', argument: value },
      { parameter: 'index', argument: index },
    ],
  });

  array.setName('array');
  array.rearrange();
  yield {
    ...board.serialize(0),
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  yield board.serialize(1);

  // 1   if (index < 0) {
  if (index < 0) {
    // 2     index = 0;
    index = 0;
    yield board.serialize(2);
  }

  yield board.serialize(5);
  // 5   if (index > array.length) {
  if (index > array.nodes.length) {
    // 6     index = array.length;
    index = array.nodes.length;
    yield board.serialize(6);
  }

  // 9   const result = new Array(array.length + 1);
  const result = new CoreArray();
  result.setName('result');
  board.add(result);

  for (let i = 0; i < array.nodes.length + 1; i++) result.push(0);

  result.moveTo(array.x, array.y + CANVAS_NODE_HEIGHT * 3);
  result.rearrange();

  yield board.serialize(9);

  yield board.serialize(11);
  // 11   for (let i = 0; i < index; i++) {
  for (let i = 0; i < index; i++) {
    // 12     result[i] = array[i];
    array.nodes[i].color = COLOR_ACTIVE;
    result.nodes[i].color = COLOR_ACTIVE;
    result.nodes[i].value = array.nodes[i].value;
    yield board.serialize(12);
    array.nodes[i].color = COLOR_IDLE;
    result.nodes[i].color = COLOR_IDLE;

    yield board.serialize(11);
  }

  // 15   result[index] = value;
  result.nodes[index].color = COLOR_ACTIVE;
  result.nodes[index].value = value;
  yield board.serialize(15);
  result.nodes[index].color = COLOR_IDLE;

  // 17   for (let i = index; i < array.length; i++) {
  yield board.serialize(17);
  for (let i = index; i < array.nodes.length; i++) {
    // 18     result[i + 1] = array[i];
    array.nodes[i].color = COLOR_ACTIVE;
    result.nodes[i + 1].color = COLOR_ACTIVE;
    result.nodes[i + 1].value = array.nodes[i].value;
    yield board.serialize(18);
    array.nodes[i].color = COLOR_IDLE;
    result.nodes[i + 1].color = COLOR_IDLE;

    yield board.serialize(17);
  }

  // 21   array = result;
  board.remove(array);
  result.setName('array');
  animateMove(board, result, array.x, array.y);
  yield board.serialize(21);

  // 22 }
  result.setName();
  board.callstack.pop();
  yield {
    ...board.serialize(22),
    structureData: result.toData(),
    structureFrames: [result.toCanvasFrame()],
  };
}
