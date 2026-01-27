import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';

import { CoreMaxHeap } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    heap: context.structure as CoreMaxHeap,
    board: context.board,
    control: context.control,
  };
}

export function runPop(context: CoreFunctionContext) {
  const { heap, board, control } = fromContext(context);

  if (heap.nodes.length !== 0) {
    // swap top with last node
    heap.swapValues(0, heap.nodes.length - 1);
    heap.pop();

    for (let nodeIndex = 0; ; ) {
      const leftIndex = nodeIndex * 2 + 1;
      const rightIndex = nodeIndex * 2 + 2;

      let index = nodeIndex;

      if (
        leftIndex < heap.nodes.length &&
        heap.nodes[index].treeNode.value < heap.nodes[leftIndex].treeNode.value
      ) {
        index = leftIndex;
      }

      if (
        rightIndex < heap.nodes.length &&
        heap.nodes[index].treeNode.value < heap.nodes[rightIndex].treeNode.value
      ) {
        index = rightIndex;
      }

      if (index === nodeIndex) break;

      heap.swapValues(index, nodeIndex);
      nodeIndex = index;
    }
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
