import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';

import { CoreArray } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    array: context.structure as CoreArray,
    index: context.args['index'] as number,
    board: context.board,
    control: context.control,
  };
}

export function runRemoveValue(context: CoreFunctionContext) {
  const { array, index: rawIndex, board, control } = fromContext(context);

  const index = rawIndex;

  if (index >= 0 && index < array.nodes.length) {
    // remove element at index
    array.nodes.splice(index, 1);
  }

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
