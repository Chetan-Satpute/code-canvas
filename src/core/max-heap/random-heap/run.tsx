import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';
import { randomMaxHeapNumberArray, randomNumber } from '#utils/random.tsx';

import { CoreMaxHeap } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    heap: context.structure as CoreMaxHeap,
    board: context.board,
    control: context.control,
  };
}

export function runRandomHeap(context: CoreFunctionContext) {
  const {
    heap,

    board,
    control,
  } = fromContext(context);

  const values = randomMaxHeapNumberArray(randomNumber(3, 7));

  heap.nodes = CoreMaxHeap.fromData(values).nodes;
  heap.rearrange();

  const frames = [board.toFrame()];
  const data = heap.toData();

  control.dispatch(
    setStep({
      frames,
      structureData: data,
      structureFrames: frames,
    }),
  );
}
