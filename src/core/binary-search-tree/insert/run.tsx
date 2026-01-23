import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';

import { type CoreBST, CoreBSTNode } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    bst: context.structure as CoreBST,
    board: context.board,
    control: context.control,
    value: context.args['value'] as number,
  };
}

export function runInsert(context: CoreFunctionContext) {
  const { bst, board, control, value } = fromContext(context);

  const node = new CoreBSTNode(value);

  if (bst.root) {
    let ptr = bst.root;

    while (true) {
      if (value === ptr.value) {
        break;
      }

      if (value > ptr.value) {
        if (ptr.right) {
          ptr = ptr.right.end;
        } else {
          ptr.setRight(node);
          break;
        }
      } else {
        if (ptr.left) {
          ptr = ptr.left.end;
        } else {
          ptr.setLeft(node);
          break;
        }
      }
    }
  } else {
    bst.setRoot(node);
  }

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
