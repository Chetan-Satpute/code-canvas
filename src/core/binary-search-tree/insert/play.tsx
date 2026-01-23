import { CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import type { CoreEdge } from '#core/elements/edge.tsx';
import { animateMoveMany, appear } from '#core/helpers/animation.tsx';
import {
  COLOR_ACTIVE,
  COLOR_IDLE,
  COLOR_SUCCESS,
} from '#core/helpers/color.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { CoreBST, CoreBSTNode } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    tree: context.structure as CoreBST,
    value: context.args['value'] as number,
    board: context.board,
  };
}

export function* playInsert(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const { tree, value, board } = fromContext(context);

  // 0: function insert(bst, value: number) {
  board.callstack.push({
    name: 'insert',
    arguments: [{ parameter: 'tree' }, { parameter: 'value', argument: value }],
  });

  tree.setName('tree');
  tree.rearrange();
  yield {
    ...board.serialize(0),
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  // 1: if (bst.root === null) {
  yield board.serialize(1);
  if (tree.root === null) {
    // 2: bst.root = new Node(value);
    const node = new CoreBSTNode(value);
    node.opacity = 0;

    tree.setRoot(node);
    tree.rearrange();

    appear(board, node);

    yield board.serialize(2);

    // 3: return;
    yield board.serialize(3);

    tree.setName();
    board.callstack.pop();
    yield {
      ...board.serialize(29),
      structureData: tree.toData(),
      structureFrames: [board.toFrame()],
    };
    return;
  }

  // 6: let current = bst.root;
  let current = tree.root;
  current.color = COLOR_ACTIVE;
  yield board.serialize(6);

  // 8: while (true) {
  yield board.serialize(8);
  while (true) {
    // 9: if (value === current.value) {
    yield board.serialize(9);
    if (value === current.value) {
      current.color = COLOR_SUCCESS;
      yield board.serialize(10);
      current.color = COLOR_IDLE;

      break;
    }

    // 13: if (value < current.value) {
    yield board.serialize(13);
    if (value < current.value) {
      // 14: if (current.left === null) {
      yield board.serialize(14);
      if (current.left === null) {
        // 15: current.left = new Node(value);
        const node = new CoreBSTNode(value);
        node.opacity = 0;

        const rightNodes = tree.getInorderRightNodes(current);
        rightNodes.push(current);
        animateMoveMany(
          board,
          rightNodes.map((n) => ({
            structure: n,
            targetX: n.x + CANVAS_NODE_WIDTH,
            targetY: n.y,
          })),
        );

        current.setLeft(node);

        const edge = current.left as CoreEdge<CoreBSTNode> | null;
        if (edge) edge.opacity = 0;

        tree.rearrange();
        appear(board, node);
        if (edge) appear(board, edge);

        yield board.serialize(15);

        // 16: break;
        current.color = COLOR_IDLE;
        node.color = COLOR_SUCCESS;
        yield board.serialize(16);
        node.color = COLOR_IDLE;
        break;
      }

      // 19: current = current.left;
      current.color = COLOR_IDLE;
      current = current.left.end;
      current.color = COLOR_ACTIVE;
      yield board.serialize(19);
    } else {
      // 21: if (current.right === null) {
      yield board.serialize(21);
      if (current.right === null) {
        // 22: current.right = new Node(value);
        const node = new CoreBSTNode(value);
        node.opacity = 0;

        const rightNodes = tree.getInorderRightNodes(current);
        animateMoveMany(
          board,
          rightNodes.map((n) => ({
            structure: n,
            targetX: n.x + CANVAS_NODE_WIDTH,
            targetY: n.y,
          })),
        );

        current.setRight(node);

        const edge = current.right as CoreEdge<CoreBSTNode> | null;
        if (edge) edge.opacity = 0;

        tree.rearrange();
        appear(board, node);
        if (edge) appear(board, edge);

        yield board.serialize(22);

        // 23: break;
        current.color = COLOR_IDLE;
        node.color = COLOR_SUCCESS;
        yield board.serialize(23);
        node.color = COLOR_IDLE;
        break;
      }

      // 26: current = current.right;
      current.color = COLOR_IDLE;
      current = current.right.end;
      current.color = COLOR_ACTIVE;
      yield board.serialize(26);
    }

    yield board.serialize(8);
  }

  // 30: return;
  yield board.serialize(30);

  // 31: }
  tree.setName();
  board.callstack.pop();
  yield {
    ...board.serialize(31),
    structureData: tree.toData(),
    structureFrames: [board.toFrame()],
  };
}
