import { CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import { animateMoveMany, appear } from '#core/helpers/animation.tsx';
import {
  COLOR_ACTIVE,
  COLOR_IDLE,
  COLOR_SECONDARY,
} from '#core/helpers/color.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { type CoreMaxHeap } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    heap: context.structure as CoreMaxHeap,
    value: context.args['value'] as number,
    board: context.board,
  };
}

export function* playPush(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const { board, heap, value } = fromContext(context);

  // 0: function push(heap, value: number) {
  board.callstack.push({
    name: 'push',
    arguments: [
      {
        parameter: 'heap',
        argument: heap.nodes.map((node) => node.arrayNode.value),
      },
      {
        parameter: 'value',
        argument: value,
      },
    ],
  });

  heap.setName('heap');
  heap.rearrange();
  yield {
    ...board.serialize(0),
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  // 1:  heap.push(value);
  heap.push(value);

  const nodeIndex = heap.nodes.length - 1;
  const parentIndex = Math.floor((nodeIndex - 1) / 2);

  let node = heap.nodes[nodeIndex];
  let parent = heap.nodes[parentIndex];

  const leftIndex = parentIndex * 2 + 1;

  const edge =
    parent &&
    (nodeIndex === leftIndex ? parent.treeNode.left : parent.treeNode.right);

  node.arrayNode.opacity = 0;
  node.treeNode.opacity = 0;
  if (edge) edge.opacity = 0;

  node.rearrange();

  const rightNodes = heap.getInorderRightNodes(node.treeNode);

  animateMoveMany(
    board,
    rightNodes.map((node) => ({
      structure: node,
      targetX: node.x + CANVAS_NODE_WIDTH,
      targetY: node.y,
    })),
  );

  heap.rearrange();

  appear(board, node.arrayNode);
  appear(board, node.treeNode);
  if (edge) appear(board, edge);

  yield board.serialize(1);

  // 3:   for (let nodeIndex = heap.nodes.length - 1; nodeIndex > 0; ) {
  if (node) node.arrayNode.color = COLOR_ACTIVE;
  if (node) node.treeNode.color = COLOR_ACTIVE;
  yield board.serialize(3);
  for (let nodeIndex = heap.nodes.length - 1; nodeIndex > 0; ) {
    // 4:     const parentIndex = Math.floor((nodeIndex - 1) / 2);
    const parentIndex = Math.floor((nodeIndex - 1) / 2);
    parent = heap.nodes[parentIndex];
    if (parent) parent.arrayNode.color = COLOR_SECONDARY;
    if (parent) parent.treeNode.color = COLOR_SECONDARY;
    yield board.serialize(4);

    // 6:     if (node.treeNode.value <= parent.treeNode.value) {
    yield board.serialize(6);
    if (node.arrayNode.value <= parent.arrayNode.value) {
      // 7:       break;
      yield board.serialize(7);
      break;
      // 8:     }
    }

    // 11:     [heap[nodeIndex], heap[parentIndex]] = [heap[parentIndex], heap[nodeIndex]];
    heap.swapValues(nodeIndex, parentIndex);
    yield board.serialize(11);

    // 12:      nodeIndex = parentIndex;
    if (node) node.arrayNode.color = COLOR_IDLE;
    if (node) node.treeNode.color = COLOR_IDLE;
    nodeIndex = parentIndex;
    node = heap.nodes[nodeIndex];
    if (node) node.arrayNode.color = COLOR_ACTIVE;
    if (node) node.treeNode.color = COLOR_ACTIVE;
    yield board.serialize(12);

    yield board.serialize(3);
  }

  // 15:    return;
  if (node) node.arrayNode.color = COLOR_IDLE;
  if (node) node.treeNode.color = COLOR_IDLE;
  if (parent) parent.arrayNode.color = COLOR_IDLE;
  if (parent) parent.treeNode.color = COLOR_IDLE;
  yield board.serialize(15);

  // 16:  }
  heap.setName();
  board.callstack.pop();
  yield {
    ...board.serialize(16),
    structureData: heap.toData(),
    structureFrames: [board.toFrame()],
  };
}
