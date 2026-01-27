import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';

import { CoreMaxHeap } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    heap: context.structure as CoreMaxHeap,
    value: context.args['value'] as number,
    board: context.board,
    control: context.control,
  };
}

export function runPush(context: CoreFunctionContext) {
  const { heap, value, board, control } = fromContext(context);

  heap.push(value);

  for (let nodeIndex = heap.nodes.length - 1; nodeIndex > 0; ) {
    const parentIndex = Math.floor((nodeIndex - 1) / 2);

    const parent = heap.nodes[parentIndex];
    const node = heap.nodes[nodeIndex];

    if (node.treeNode.value <= parent.treeNode.value) {
      break;
    }

    heap.swapValues(nodeIndex, parentIndex);
    nodeIndex = parentIndex;
  }

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
