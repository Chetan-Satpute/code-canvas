import { CANVAS_NODE_HEIGHT, CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import { animateMove, appear } from '#core/helpers/animation.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { type CoreLinkedList, CoreLinkedListNode } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    list: context.structure as CoreLinkedList,
    value: context.args['value'] as number,
    board: context.board,
  };
}

export function* playInsertHead(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const { list, value, board } = fromContext(context);

  // 0: function inserthead(list: linkedlist, value: number) {
  board.callstack.push({
    name: 'insertHead',
    arguments: [{ parameter: 'list' }, { parameter: 'value', argument: value }],
  });

  list.setName('list');
  list.rearrange();
  yield {
    ...board.serialize(0),
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  // 1:   const node = new linkedlistnode(value);
  const node = new CoreLinkedListNode(value);
  node.x = list.x;
  node.y = list.y + CANVAS_NODE_HEIGHT * 2;
  node.opacity = 0;

  node.setLabel('left', 'node');
  board.add(node);

  appear(board, node);
  yield board.serialize(1);

  // 3:   node.next = list.head;
  node.setNext(list.head);
  if (node.next) {
    node.next.opacity = 0;
    appear(board, node.next);
  }
  yield board.serialize(3);

  // 4:   list.head = node;
  animateMove(board, list, list.x + CANVAS_NODE_WIDTH * 2, list.y);
  animateMove(board, node, node.x, node.y - CANVAS_NODE_HEIGHT * 2);
  node.setLabel('left');
  list.setHead(node);
  board.remove(node);

  list.moveTo(list.x - CANVAS_NODE_WIDTH * 2, list.y);
  list.rearrange();
  board.pushFrame();

  yield board.serialize(4);

  // 5: }
  list.setName();
  board.callstack.pop();
  yield {
    ...board.serialize(5),
    structureData: list.toData(),
    structureFrames: [list.toCanvasFrame()],
  };
}
