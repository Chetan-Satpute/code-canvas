import { CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import { animateMoveMany, disappear } from '#core/helpers/animation.tsx';
import {
  COLOR_ACTIVE,
  COLOR_ERROR,
  COLOR_IDLE,
  COLOR_PIVOT,
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
    board: context.board,
  };
}

export function* playPop(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const { board, heap } = fromContext(context);

  // 0: function pop(heap) {
  board.callstack.push({
    name: 'pop',
    arguments: [
      {
        parameter: 'heap',
        argument: heap.nodes.map((node) => node.arrayNode.value),
      },
    ],
  });

  heap.setName('heap');
  heap.rearrange();
  yield {
    ...board.serialize(0),
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  // 1: if (heap.length === 0) {
  if (heap.nodes.length > 0) {
    heap.nodes[0].arrayNode.color = COLOR_ACTIVE;
    heap.nodes[0].treeNode.color = COLOR_ACTIVE;

    heap.nodes[heap.nodes.length - 1].arrayNode.color = COLOR_ERROR;
    heap.nodes[heap.nodes.length - 1].treeNode.color = COLOR_ERROR;
  }

  yield board.serialize(1);
  if (heap.nodes.length === 0) {
    // 2:    return;
    yield board.serialize(2);

    yield {
      ...board.serialize(35),
      structureData: heap.toData(),
      structureFrames: [board.toFrame()],
    };
    return;
  }

  // 6:    [heap[0], heap[heap.length - 1]] = [heap[heap.length - 1], heap[0]];
  heap.swapValues(0, heap.nodes.length - 1);
  yield board.serialize(6);

  // 8:    heap.pop();
  const nodeIndex = heap.nodes.length - 1;
  const parentIndex = Math.floor((nodeIndex - 1) / 2);

  let node = heap.nodes[nodeIndex];
  const parent = heap.nodes[parentIndex];

  const leftIndex = parentIndex * 2 + 1;

  const edge =
    parent &&
    (nodeIndex === leftIndex ? parent.treeNode.left : parent.treeNode.right);

  node.rearrange();

  if (edge) disappear(board, edge);
  disappear(board, node.treeNode);
  disappear(board, node.arrayNode);

  const rightNodes = heap.getInorderRightNodes(node.treeNode);

  heap.pop();

  animateMoveMany(
    board,
    rightNodes.map((node) => ({
      structure: node,
      targetX: node.x - CANVAS_NODE_WIDTH,
      targetY: node.y,
    })),
  );

  heap.rearrange();
  board.pushFrame();
  yield board.serialize(8);

  // 10:    for (let nodeIndex = 0; nodeIndex < heap.length; ) {
  yield board.serialize(10);
  node = heap.nodes[0];
  if (node) node.arrayNode.color = COLOR_ACTIVE;
  if (node) node.treeNode.color = COLOR_ACTIVE;
  for (let nodeIndex = 0; nodeIndex < heap.nodes.length; ) {
    // 11:      const leftIndex = nodeIndex * 2 + 1;
    const leftIndex = nodeIndex * 2 + 1;
    const leftNode = heap.nodes[leftIndex];
    if (leftNode) leftNode.arrayNode.color = COLOR_SECONDARY;
    if (leftNode) leftNode.treeNode.color = COLOR_SECONDARY;
    yield board.serialize(11);

    // 12:      const rightIndex = rightIndex * 2 + 2;
    const rightIndex = nodeIndex * 2 + 2;
    const rightNode = heap.nodes[rightIndex];
    if (rightNode) rightNode.arrayNode.color = COLOR_SECONDARY;
    if (rightNode) rightNode.treeNode.color = COLOR_SECONDARY;
    yield board.serialize(12);

    // 14:      let nextIndex = nodeIndex;
    let nextIndex = nodeIndex;
    let nextNode = heap.nodes[nextIndex];
    if (nextNode) nextNode.arrayNode.color = COLOR_PIVOT;
    if (nextNode) nextNode.treeNode.color = COLOR_PIVOT;
    yield board.serialize(14);

    // 16:      if (leftIndex < heap.length && heap[nextIndex] < heap[leftIndex]) {
    yield board.serialize(16);
    if (
      leftIndex < heap.nodes.length &&
      heap.nodes[nextIndex].arrayNode.value <
        heap.nodes[leftIndex].arrayNode.value
    ) {
      // 17:        nextIndex = leftIndex;
      if (node) node.arrayNode.color = COLOR_ACTIVE;
      if (node) node.treeNode.color = COLOR_ACTIVE;
      nextIndex = leftIndex;
      nextNode = heap.nodes[nextIndex];
      if (nextNode) nextNode.arrayNode.color = COLOR_PIVOT;
      if (nextNode) nextNode.treeNode.color = COLOR_PIVOT;
      yield board.serialize(17);
    }

    // 16:      if (rightIndex < heap.length && heap[nextIndex] < heap[rightIndex]) {
    yield board.serialize(20);
    if (
      rightIndex < heap.nodes.length &&
      heap.nodes[nextIndex].arrayNode.value <
        heap.nodes[rightIndex].arrayNode.value
    ) {
      // 17:        nextIndex = rightIndex;
      if (nextIndex === leftIndex) {
        if (leftNode) leftNode.arrayNode.color = COLOR_SECONDARY;
        if (leftNode) leftNode.treeNode.color = COLOR_SECONDARY;
      } else {
        if (node) node.arrayNode.color = COLOR_ACTIVE;
        if (node) node.treeNode.color = COLOR_ACTIVE;
      }
      nextIndex = rightIndex;
      nextNode = heap.nodes[nextIndex];
      if (nextNode) nextNode.arrayNode.color = COLOR_PIVOT;
      if (nextNode) nextNode.treeNode.color = COLOR_PIVOT;
      yield board.serialize(21);
    }

    // 24:      if (nextIndex === nodeIndex) {
    yield board.serialize(24);
    if (nextIndex === nodeIndex) {
      // 25:        break;
      if (leftNode) leftNode.arrayNode.color = COLOR_IDLE;
      if (leftNode) leftNode.treeNode.color = COLOR_IDLE;
      if (rightNode) rightNode.arrayNode.color = COLOR_IDLE;
      if (rightNode) rightNode.treeNode.color = COLOR_IDLE;
      yield board.serialize(25);
      break;
    }

    // 29:      [heap[nextIndex], heap[nodeIndex]] = [heap[nodeIndex], heap[nextIndex]];
    heap.swapValues(nextIndex, nodeIndex);
    yield board.serialize(29);

    // 31:      nodeIndex = nextIndex;
    node = heap.nodes[nodeIndex];
    if (node) node.arrayNode.color = COLOR_IDLE;
    if (node) node.treeNode.color = COLOR_IDLE;
    nodeIndex = nextIndex;
    node = heap.nodes[nodeIndex];
    if (node) node.arrayNode.color = COLOR_ACTIVE;
    if (node) node.treeNode.color = COLOR_ACTIVE;
    yield board.serialize(31);

    if (nextIndex === leftIndex) {
      if (rightNode) rightNode.arrayNode.color = COLOR_IDLE;
      if (rightNode) rightNode.treeNode.color = COLOR_IDLE;
    } else {
      if (leftNode) leftNode.arrayNode.color = COLOR_IDLE;
      if (leftNode) leftNode.treeNode.color = COLOR_IDLE;
    }
    yield board.serialize(10);
  }

  // 34:    return;
  if (node) node.arrayNode.color = COLOR_IDLE;
  if (node) node.treeNode.color = COLOR_IDLE;
  yield board.serialize(34);

  // 35:  }
  yield {
    ...board.serialize(35),
    structureData: heap.toData(),
    structureFrames: [board.toFrame()],
  };
}
