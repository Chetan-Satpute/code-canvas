import { CoreNode } from '#core/elements/node.tsx';
import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setFrames, setStructureData } from '#redux/slice.ts';

import type { CoreArray } from '../structure';

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

  control.dispatch(setFrames(frames));
  control.dispatch(setStructureData(data));
}
