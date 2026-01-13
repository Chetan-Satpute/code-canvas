import { CoreNode } from '#core/elements/node.tsx';
import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';
import { randomNumber, randomNumberArray } from '#utils/random.tsx';

import { CoreArray } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    array: context.structure as CoreArray,
    board: context.board,
    control: context.control,
  };
}

export function runRandomArray(context: CoreFunctionContext) {
  const {
    array,

    board,
    control,
  } = fromContext(context);

  const values = randomNumberArray(randomNumber(4, 10));

  array.nodes = values.map((value) => new CoreNode(value));
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
