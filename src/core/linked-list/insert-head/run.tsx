import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';

import { type CoreLinkedList, CoreLinkedListNode } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    list: context.structure as CoreLinkedList,
    value: context.args['value'] as number,
    board: context.board,
    control: context.control,
  };
}

export function runInsertHead(context: CoreFunctionContext) {
  const { list, value, board, control } = fromContext(context);

  const node = new CoreLinkedListNode(value);

  node.setNext(list.head);
  list.head = node;

  list.rearrange();

  const frames = [board.toFrame()];
  const data = list.toData();

  control.dispatch(
    setStep({
      frames,
      structureData: data,
      structureFrames: frames,
    }),
  );
}
