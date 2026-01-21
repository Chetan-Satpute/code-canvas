import { CoreBST } from '#core/binary-search-tree/structure.tsx';
import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';
import { randomBSTData, randomNumber } from '#utils/random.tsx';

function fromContext(context: CoreFunctionContext) {
  return {
    bst: context.structure as CoreBST,
    board: context.board,
    control: context.control,
  };
}

export function runRandomBST(context: CoreFunctionContext) {
  const { bst, board, control } = fromContext(context);

  const data = randomBSTData(randomNumber(3, 8));

  bst.setRoot(CoreBST.fromData(data).root);

  bst.rearrange();

  const frames = [board.toFrame()];
  const bstData = bst.toData();

  control.dispatch(
    setStep({
      frames,
      structureData: bstData,
      structureFrames: frames,
    }),
  );
}
