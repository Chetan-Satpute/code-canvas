import { CoreEdge } from '#core/elements/edge.tsx';
import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';
import { randomNumber, randomNumberArray } from '#utils/random.tsx';

import { CoreLinkedList, CoreLinkedListNode } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    linkedList: context.structure as CoreLinkedList,
    board: context.board,
    control: context.control,
  };
}

export function runRandomLinkedList(context: CoreFunctionContext) {
  const {
    linkedList,

    board,
    control,
  } = fromContext(context);

  const values = randomNumberArray(randomNumber(4, 10));

  if (values.length) {
    linkedList.head = new CoreLinkedListNode(values[0]);

    let ptr = linkedList.head;
    for (let i = 1; i < values.length; i++) {
      const nextNode = new CoreLinkedListNode(values[i]);

      ptr.next = new CoreEdge(ptr, nextNode);
      ptr = ptr.next.end;
    }
  }

  linkedList.rearrange();

  const frames = [board.toFrame()];
  const data = linkedList.toData();

  control.dispatch(
    setStep({
      frames,
      structureData: data,
      structureFrames: frames,
    }),
  );
}
