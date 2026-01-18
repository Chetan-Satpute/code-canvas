import { CANVAS_NODE_HEIGHT, CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import {
  animateMove,
  animateMoveMany,
  appear,
  disappear,
} from '#core/helpers/animation.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import type { CoreLinkedList, CoreLinkedListNode } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    list: context.structure as CoreLinkedList,
    target: context.args['target'] as number,
    board: context.board,
  };
}

export function* playRemove(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const { list, target, board } = fromContext(context);

  // 0: function remove(list: LinkedList, target: number) {
  board.callstack.push({
    name: 'remove',
    arguments: [
      { parameter: 'list' },
      { parameter: 'target', argument: target },
    ],
  });
  list.setName('list');
  list.rearrange();

  yield {
    ...board.serialize(0),
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  // 1:   if (list.head === null) {
  yield board.serialize(1);
  if (list.head === null) {
    // 2:     return;
    yield board.serialize(2);

    list.setName();
    board.callstack.pop();
    yield {
      ...board.serialize(22),
      structureData: list.toData(),
      structureFrames: [list.toCanvasFrame()],
    };

    return;
  }

  // 5:   if (list.head.value === target) {
  yield board.serialize(5);
  if (list.head.value === target) {
    // 6:     list.head = list.head.next;
    const node = list.head;
    board.add(node);

    animateMove(board, node, node.x, node.y + CANVAS_NODE_HEIGHT * 2);

    list.setHead(list.head.next?.end);
    list.moveTo(list.x + CANVAS_NODE_WIDTH * 2, list.y);

    animateMove(board, list, list.x - CANVAS_NODE_WIDTH * 2, list.y);

    if (node.next) disappear(board, node.next);
    disappear(board, node);

    board.remove(node);
    yield board.serialize(6);

    // 8:     return;
    yield board.serialize(8);

    list.setName();
    board.callstack.pop();
    yield {
      ...board.serialize(22),
      structureData: list.toData(),
      structureFrames: [list.toCanvasFrame()],
    };

    return;
  }

  // 11:   let parent = list.head;
  let parent = list.head;
  parent.setLabel('bottom', 'parent');
  parent.rearrange();
  yield board.serialize(11);

  // 13:   for (let node = list.head.next; node; parent = node, node = node.next) {
  let node = list.head.next?.end;
  if (node) node.setLabel('bottom', 'node');
  node?.rearrange();

  yield board.serialize(13);
  for (node = list.head.next?.end; node; ) {
    // 14:     if (node.value === target) {
    yield board.serialize(14);
    if (node.value === target) {
      // 15:       parent.next = node.next;
      animateMove(board, node, node.x, node.y + CANVAS_NODE_HEIGHT * 2);
      if (parent.next) disappear(board, parent.next);

      parent.setNext(node.next?.end);
      board.add(node);
      if (parent.next) {
        parent.next.opacity = 0;
        appear(board, parent.next);
      }

      if (node.next) disappear(board, node.next);
      disappear(board, node);
      board.remove(node);

      const rightNodes: CoreLinkedListNode[] = [];
      for (let ptr = node.next?.end; ptr; ptr = ptr.next?.end) {
        rightNodes.push(ptr);
      }

      animateMoveMany(
        board,
        rightNodes.map((node) => ({
          structure: node,
          targetX: node.x - CANVAS_NODE_WIDTH * 2,
          targetY: node.y,
        })),
      );

      yield board.serialize(15);

      // 17:       return;
      parent.setLabel('bottom');
      yield board.serialize(17);

      list.setName();
      board.callstack.pop();
      yield {
        ...board.serialize(22),
        structureData: list.toData(),
        structureFrames: [list.toCanvasFrame()],
      };
      return;
    }

    parent.setLabel('bottom');
    node.setLabel('bottom');
    parent = node;
    node = node.next?.end;

    parent.setLabel('bottom', 'parent');
    parent.rearrange();
    if (node) node.setLabel('bottom', 'node');
    node?.rearrange();

    yield board.serialize(13);
  }

  // 21:   return;
  parent.setLabel('bottom');
  yield board.serialize(21);

  // 22: }
  list.setName();
  board.callstack.pop();
  yield {
    ...board.serialize(22),
    structureData: list.toData(),
    structureFrames: [list.toCanvasFrame()],
  };
}
