import { CoreNode } from '#core/elements/node.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';

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

export function runInsertValue(context: CoreFunctionContext) {
  const {
    array,
    value,
    index: rawIndex,
    board,
    control,
  } = fromContext(context);

  let index = rawIndex;

  if (index < 0) index = 0;
  if (index > array.nodes.length) index = array.nodes.length;

  array.nodes.splice(index, 0, new CoreNode(value));
  array.rearrange();

  const frames = [board.toFrame()];
  const data = array.toData();

  control.dispatch(
    setStep({
      frames,
      structureData: data,
      structureFrames: frames,
    }),
  );
}

export function* playInsertValue(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const fromContextResult = fromContext(context);
  const { board, array, value } = fromContextResult;
  let { index } = fromContextResult;

  // Line 1 – function entry
  board.callstack.push({
    name: 'insertValue',
    arguments: [
      { parameter: 'array', argument: array.nodes.map((node) => node.value) },
      { parameter: 'value', argument: value },
      { parameter: 'index', argument: index },
    ],
  });
  yield {
    codeID: `${context.structureID}/${context.algorithmID}`,
    activeCodeLine: 1,
    ...board.serialize(),
  };

  // Line 2: if (index < 0)
  yield {
    activeCodeLine: 2,
    ...board.serialize(),
  };

  if (index < 0) {
    // Line 3: index = 0
    index = 0;
    board.pushFrame();

    yield {
      activeCodeLine: 3,
      ...board.serialize(),
    };
  }

  // Line 6: if (index > array.length)
  yield {
    activeCodeLine: 6,
    ...board.serialize(),
  };

  if (index > array.nodes.length) {
    // Line 7: index = array.length
    index = array.nodes.length;
    board.pushFrame();

    yield {
      activeCodeLine: 7,
      ...board.serialize(),
    };
  }

  // Line 10: allocate result array
  const result = new CoreArray();
  result.nodes = new Array(array.nodes.length + 1).fill(
    () => new CoreNode(NaN),
  );
  board.pushFrame();

  yield {
    activeCodeLine: 10,
    ...board.serialize(),
  };

  // Line 12: for (let i = 0; i < index; i++)
  for (let i = 0; i < index; i++) {
    // loop condition check
    yield {
      activeCodeLine: 12,
      ...board.serialize(),
    };

    // Line 13: result[i] = array[i]
    result.nodes[i].value = array.nodes[i].value;
    board.pushFrame();

    yield {
      activeCodeLine: 13,
      ...board.serialize(),
    };
  }

  // Line 16: result[index] = value
  result.nodes[index].value = value;
  board.pushFrame();

  yield {
    activeCodeLine: 16,
    ...board.serialize(),
  };

  // Line 18: second loop
  for (let i = index; i < array.nodes.length; i++) {
    // loop condition check
    yield {
      activeCodeLine: 18,
      ...board.serialize(),
    };

    // Line 19: result[i + 1] = array[i]
    result.nodes[i + 1].value = array.nodes[i].value;
    board.pushFrame();

    yield {
      activeCodeLine: 19,
      ...board.serialize(),
    };
  }

  // Line 22: array = result
  // array = result;
  board.pushFrame();

  yield {
    activeCodeLine: 22,
    ...board.serialize(),
  };
}
