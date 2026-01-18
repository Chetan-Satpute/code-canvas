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

import { type CoreLinkedList, CoreLinkedListNode } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    list: context.structure as CoreLinkedList,
    target: context.args['target'] as number,
    value: context.args['value'] as number,
    board: context.board,
  };
}

export function* playInsertAfter(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const { list, target, value, board } = fromContext(context);

  // 0: function insertAfter(list: LinkedList, target: number, value: number) {
  board.callstack.push({
    name: 'insertAfter',
    arguments: [
      { parameter: 'list' },
      { parameter: 'target', argument: target },
      { parameter: 'value', argument: value },
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
      ...board.serialize(14),
      structureData: list.toData(),
      structureFrames: [list.toCanvasFrame()],
    };

    return;
  }

  // 5:   for (let ptr = list.head; ptr; ptr = ptr.next) {
  let ptr: CoreLinkedListNode | undefined = list.head;
  ptr.setLabel('bottom', 'ptr');
  ptr.rearrange();
  yield board.serialize(5);
  for (ptr = list.head; ptr; ) {
    // 6:     if (ptr.value !== target) {
    yield board.serialize(6);
    if (ptr.value !== target) {
      // 7:       continue;
      yield board.serialize(7);

      if (ptr) ptr.setLabel('bottom');
      ptr = ptr.next?.end;
      if (ptr) ptr.setLabel('bottom', 'ptr');
      ptr?.rearrange();
      yield board.serialize(5);
      continue;
    }

    // 10:     const node = new LinkedListNode(value);
    const node = new CoreLinkedListNode(value);
    node.setLabel('bottom', 'node');
    node.moveTo(ptr.x + CANVAS_NODE_WIDTH * 2, ptr.y + CANVAS_NODE_HEIGHT * 2);
    node.opacity = 0;
    board.add(node);
    appear(board, node);
    yield board.serialize(10);

    // 12:     node.next = ptr.next;
    node.setNext(ptr.next?.end);
    if (node.next) node.next.opacity = 0;
    if (node.next) appear(board, node.next);
    yield board.serialize(12);

    // 13:     ptr.next = node;
    if (ptr.next) disappear(board, ptr.next);
    ptr.setNext(node);
    board.remove(node);
    if (ptr.next) ptr.next.opacity = 0;
    if (ptr.next) appear(board, ptr.next);

    const rightNodes: CoreLinkedListNode[] = [];
    for (let n = node.next?.end; n; n = n.next?.end) rightNodes.push(n);

    animateMoveMany(
      board,
      rightNodes.map((n) => ({
        structure: n,
        targetX: n.x + CANVAS_NODE_WIDTH * 2,
        targetY: n.y,
      })),
    );

    animateMove(board, node, node.x, node.y - CANVAS_NODE_HEIGHT * 2);
    yield board.serialize(13);

    // 15:     break;
    ptr.setLabel('bottom');
    node.setLabel('bottom');
    yield board.serialize(15);
    break;
  }

  // 18:   return;
  yield board.serialize(18);

  // 19: }
  list.setName();
  board.callstack.pop();
  yield {
    ...board.serialize(19),
    structureData: list.toData(),
    structureFrames: [list.toCanvasFrame()],
  };
}
