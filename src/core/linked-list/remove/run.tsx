import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';

import type { CoreLinkedList } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    list: context.structure as CoreLinkedList,
    target: context.args['target'] as number,
    board: context.board,
    control: context.control,
  };
}

export function runRemove(context: CoreFunctionContext) {
  const { list, target, board, control } = fromContext(context);

  remove(list, target);

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

function remove(list: CoreLinkedList, target: number) {
  if (list.head === null) {
    return;
  }

  if (list.head.value === target) {
    return list.setHead(list.head.next?.end);
  }

  let parent = list.head;

  for (
    let node = list.head.next?.end;
    node;
    parent = node, node = node.next?.end
  ) {
    if (node.value === target) {
      return parent.setNext(node.next?.end);
    }
  }
}
