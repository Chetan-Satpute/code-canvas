import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';

import { CoreArray } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    array: context.structure as CoreArray,
    board: context.board,
    control: context.control,
  };
}

export function runSortArray(context: CoreFunctionContext) {
  const { array, board, control } = fromContext(context);

  array.nodes.sort((a, b) => a.value - b.value);
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
