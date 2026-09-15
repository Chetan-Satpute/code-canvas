import { parseArgument } from '#utils/argument.ts';
import { randomMaxHeapArray, randomNumber } from '#utils/random.ts';

import { appear, disappear } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import { defineMaxHeapOperation } from './algorithm.ts';
import type { CoreMaxHeap } from './structure.ts';
import { animateSwap } from './swap.ts';

export const NODE_COUNT_MIN = 3;
export const NODE_COUNT_MAX = 7;

export function fillRandomly(heap: CoreMaxHeap) {
  heap.restore(
    randomMaxHeapArray(randomNumber(NODE_COUNT_MIN, NODE_COUNT_MAX)),
  );
}

// The loop `push` runs after appending: while the new element beats the slot
// above it, the two exchange places. Written the way the listing writes it,
// so the sidebar operation and the algorithm cannot disagree.
function siftUp(board: CoreBoard, heap: CoreMaxHeap) {
  for (let index = heap.nodes.length - 1; index > 0;) {
    const parent = Math.floor((index - 1) / 2);

    if (heap.nodes[index].value <= heap.nodes[parent].value) break;

    animateSwap(board, heap, index, parent);
    index = parent;
  }
}

// The loop `pop` runs after the top has been replaced: while either child
// beats the slot, the larger of them takes it.
function siftDown(board: CoreBoard, heap: CoreMaxHeap) {
  for (let index = 0; index < heap.nodes.length;) {
    const left = index * 2 + 1;
    const right = index * 2 + 2;

    let next = index;

    if (
      left < heap.nodes.length &&
      heap.nodes[next].value < heap.nodes[left].value
    )
      next = left;

    if (
      right < heap.nodes.length &&
      heap.nodes[next].value < heap.nodes[right].value
    )
      next = right;

    if (next === index) break;

    animateSwap(board, heap, next, index);
    index = next;
  }
}

export const randomizeMaxHeap = defineMaxHeapOperation({
  parseArgs: () => ({}),
  apply: (_board, heap) => {
    fillRandomly(heap);
  },
});

export const pushOntoMaxHeap = defineMaxHeapOperation({
  parseArgs: (values) => {
    const value = parseArgument(values.value ?? '');

    return value === null ? null : { value };
  },
  apply: (board, heap, args) => {
    const { node, edge } = heap.push(args.value);

    node.opacity = 0;
    if (edge !== null) edge.opacity = 0;

    heap.rearrange();
    appear(board, node, ...(edge === null ? [] : [edge]));

    siftUp(board, heap);
  },
});

export const popFromMaxHeap = defineMaxHeapOperation({
  parseArgs: () => ({}),
  apply: (board, heap) => {
    if (heap.nodes.length === 0) return;

    // The top is exchanged with the last element before the last slot is
    // dropped, which is what leaves a heap of one element shorter with a
    // value on top that has to sink to where it belongs.
    if (heap.nodes.length > 1)
      animateSwap(board, heap, 0, heap.nodes.length - 1);

    const removal = heap.removeLast();
    if (removal === null) return;

    // Faded while the heap still holds it, since a node it has dropped is not
    // serialized and so could not be seen fading.
    disappear(
      board,
      removal.node,
      ...(removal.edge === null ? [] : [removal.edge]),
    );

    removal.unlink();
    heap.rearrange();
    board.pushFrame();

    siftDown(board, heap);
  },
});
