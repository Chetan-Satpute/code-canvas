import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';

import { type CoreLinkedList, CoreLinkedListNode } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    list: context.structure as CoreLinkedList,
    target: context.args['target'] as number,
    value: context.args['value'] as number,
    board: context.board,
    control: context.control,
  };
}

export function runInsertAfter(context: CoreFunctionContext) {
  const { list, target, value, board, control } = fromContext(context);

  insertAfter(list, target, value);

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

function insertAfter(list: CoreLinkedList, target: number, value: number) {
  if (list.head === null) {
    return;
  }

  for (
    let ptr: CoreLinkedListNode | undefined = list.head;
    ptr;
    ptr = ptr.next?.end
  ) {
    if (ptr.value !== target) {
      continue;
    }

    const node = new CoreLinkedListNode(value);

    node.setNext(ptr.next?.end);
    ptr.setNext(node);

    break;
  }

  return;
}
