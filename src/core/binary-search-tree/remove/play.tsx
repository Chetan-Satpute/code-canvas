import { CANVAS_NODE_HEIGHT, CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import {
  animateMoveMany,
  animateMoveSubtree,
  appear,
  disappear,
} from '#core/helpers/animation.tsx';
import { COLOR_ACTIVE, COLOR_ERROR, COLOR_IDLE } from '#core/helpers/color.tsx';
import type {
  CoreFunctionContext,
  CoreStepActionPayload,
} from '#core/helpers/types.tsx';

import { CoreBST } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    tree: context.structure as CoreBST,
    value: context.args['value'] as number,
    board: context.board,
  };
}

export function* playRemove(
  context: CoreFunctionContext,
): Generator<CoreStepActionPayload> {
  const { tree, value, board } = fromContext(context);

  // 0: function remove(tree, value: number) {
  board.callstack.push({
    name: 'remove',
    arguments: [{ parameter: 'tree' }, { parameter: 'value', argument: value }],
  });

  tree.setName('tree');
  tree.rearrange();
  yield {
    ...board.serialize(0),
    codeID: `${context.structureID}/${context.algorithmID}`,
  };

  // 1:   let current = tree.root;
  let current = tree.root;
  if (current) current.color = COLOR_ACTIVE;
  yield board.serialize(1);

  // 2:   let parent = null;
  let parent = null;
  yield board.serialize(2);

  // 3:   let isLeftChild = false;
  let isLeftChild = false;
  yield board.serialize(3);

  // 6:   while (current !== null && current.value !== value) {
  yield board.serialize(6);
  while (current && current.value !== value) {
    // 7:     parent = current;
    parent = current;
    yield board.serialize(7);

    // 9:     if (value < current.value) {
    yield board.serialize(9);
    if (value < current.value) {
      // 10:       isLeftChild = true;
      isLeftChild = true;
      yield board.serialize(10);

      // 11:       current = current.left;
      current.color = COLOR_IDLE;
      current = current.left?.end || null;
      if (current) current.color = COLOR_ACTIVE;
      yield board.serialize(11);
    } else {
      // 13:       isLeftChild = false;
      isLeftChild = false;
      yield board.serialize(13);

      // 14:       current = current.right;
      current.color = COLOR_IDLE;
      current = current.right?.end || null;
      if (current) current.color = COLOR_ACTIVE;
      yield board.serialize(14);

      // 15:     }
    }

    yield board.serialize(6);
    // 16:   }
  }

  // 19:   if (current === null) {
  yield board.serialize(19);
  if (current === null) {
    // 20:     return;
    yield board.serialize(20);

    tree.setName();
    board.callstack.pop();
    yield {
      ...board.serialize(80),
      structureData: tree.toData(),
      structureFrames: [board.toFrame()],
    };

    return;
  } else {
    current.color = COLOR_ERROR;
  }

  // 24:   if (current.left === null && current.right === null) {
  yield board.serialize(24);
  if (current.left === null && current.right === null) {
    // 25:     if (current === tree.root) {
    yield board.serialize(25);
    if (current === tree.root) {
      // 26:       tree.root = null;
      disappear(board, tree.root);
      tree.setRoot(null);
      yield board.serialize(26);
    } else if (isLeftChild) {
      // 28:       parent.left = null;
      if (parent?.left) disappear(board, parent.left.end);
      parent?.setLeft(null);
      yield board.serialize(28);
    } else {
      // 30:       parent.right = null;
      if (parent?.right) disappear(board, parent.right.end);
      parent?.setRight(null);
      yield board.serialize(30);
    }

    // 32:     return;
    yield board.serialize(32);

    tree.setName();
    board.callstack.pop();
    yield {
      ...board.serialize(80),
      structureData: tree.toData(),
      structureFrames: [board.toFrame()],
    };

    return;
  }

  // 36:   if (current.left === null) {
  yield board.serialize(36);
  if (current.left === null) {
    // 37:     if (current === tree.root) {
    yield board.serialize(37);
    if (current === tree.root) {
      // 38:       tree.root = current.right;
      if (tree.root.right) disappear(board, tree.root.right);
      disappear(board, tree.root);

      if (current.right?.end)
        animateMoveSubtree(
          board,
          current.right?.end,
          -CANVAS_NODE_WIDTH,
          -2 * CANVAS_NODE_HEIGHT,
        );

      tree.setRoot(current.right?.end);
      tree.rearrange();
      board.pushFrame();
      yield board.serialize(38);
    } else if (isLeftChild) {
      // 40:       parent.left = current.right;

      if (parent && parent.left) disappear(board, parent?.left);
      if (current.right) disappear(board, current.right);
      disappear(board, current);

      const rightNodes = tree.getInorderRightNodes(current);
      if (current.right?.end)
        animateMoveSubtree(
          board,
          current.right?.end,
          0,
          -2 * CANVAS_NODE_HEIGHT,
        );

      parent?.setLeft(current.right?.end);
      if (parent?.left) {
        parent.left.opacity = 0;
        appear(board, parent.left);
      }

      animateMoveMany(
        board,
        rightNodes.map((n) => ({
          structure: n,
          targetX: n.x - CANVAS_NODE_WIDTH,
          targetY: n.y,
        })),
      );

      yield board.serialize(40);
    } else {
      // 42:       parent.right = current.right;
      if (parent && parent.right) disappear(board, parent.right);
      if (current.right) disappear(board, current.right);
      disappear(board, current);

      const rightNodes = tree.getInorderRightNodes(current);
      if (current.right?.end)
        animateMoveSubtree(
          board,
          current.right?.end,
          0,
          -2 * CANVAS_NODE_HEIGHT,
        );

      parent?.setRight(current.right?.end);
      if (parent && parent.right) {
        parent.right.opacity = 0;
        appear(board, parent.right);
      }

      animateMoveMany(
        board,
        rightNodes.map((n) => ({
          structure: n,
          targetX: n.x - CANVAS_NODE_WIDTH,
          targetY: n.y,
        })),
      );

      yield board.serialize(42);
    }

    // 44:     return;
    yield board.serialize(44);

    tree.setName();
    board.callstack.pop();
    yield {
      ...board.serialize(80),
      structureData: tree.toData(),
      structureFrames: [board.toFrame()],
    };
    return;
  }

  // 48:   if (current.right === null) {
  yield board.serialize(48);
  if (current.right === null) {
    // 49:     if (current === tree.root) {
    yield board.serialize(49);
    if (current === tree.root) {
      // 50:       tree.root = current.left;
      if (current.left) disappear(board, current.left);
      disappear(board, current);

      if (current.left?.end)
        animateMoveSubtree(
          board,
          current.left?.end,
          0,
          -2 * CANVAS_NODE_HEIGHT,
        );

      tree.setRoot(current.left?.end);
      tree.rearrange();
      board.pushFrame();

      yield board.serialize(50);
    } else if (isLeftChild) {
      // 52:       parent.left = current.left;
      if (parent && parent.left) disappear(board, parent.left);
      if (current.left) disappear(board, current.left);
      disappear(board, current);

      const rightNodes = tree.getInorderRightNodes(current);

      if (current.left?.end)
        animateMoveSubtree(
          board,
          current.left?.end,
          0,
          -2 * CANVAS_NODE_HEIGHT,
        );

      parent?.setLeft(current.left?.end);

      if (parent && parent.left) {
        parent.left.opacity = 0;
        appear(board, parent.left);
      }

      animateMoveMany(
        board,
        rightNodes.map((n) => ({
          structure: n,
          targetX: n.x - CANVAS_NODE_WIDTH,
          targetY: n.y,
        })),
      );

      tree.rearrange();
      board.pushFrame();
      yield board.serialize(52);
    } else {
      // 54:       parent.right = current.left;
      if (parent && parent.right) disappear(board, parent.right);
      if (current.left) disappear(board, current.left);
      disappear(board, current);

      const rightNodes = tree.getInorderRightNodes(current);

      if (current.left?.end)
        animateMoveSubtree(
          board,
          current.left?.end,
          0,
          -2 * CANVAS_NODE_HEIGHT,
        );

      parent?.setRight(current.left?.end);
      if (parent && parent.right) {
        parent.right.opacity = 0;
        appear(board, parent.right);
      }

      animateMoveMany(
        board,
        rightNodes.map((n) => ({
          structure: n,
          targetX: n.x - CANVAS_NODE_WIDTH,
          targetY: n.y,
        })),
      );

      tree.rearrange();
      board.pushFrame();
      yield board.serialize(54);
    }

    // 56:     return;
    yield board.serialize(56);

    tree.setName();
    board.callstack.pop();
    yield {
      ...board.serialize(80),
      structureData: tree.toData(),
      structureFrames: [board.toFrame()],
    };
    return;
  }

  // 61:   let successorParent = current;
  let successorParent = current;
  yield board.serialize(61);

  // 62:   let successor = current.right;
  let successor = current.right?.end;
  if (successor) successor.color = COLOR_ACTIVE;
  yield board.serialize(62);

  // 64:   while (successor.left !== null) {
  yield board.serialize(64);
  while (successor.left !== null) {
    // 65:     successorParent = successor;
    successorParent = successor;
    yield board.serialize(65);

    // 66:     successor = successor.left;
    if (successor) successor.color = COLOR_IDLE;
    successor = successor.left?.end;
    if (successor) successor.color = COLOR_ACTIVE;
    yield board.serialize(66);

    yield board.serialize(64);
  }

  // 70:   current.value = successor.value;
  current.color = COLOR_ACTIVE;
  successor.color = COLOR_ERROR;
  current.value = successor.value;
  yield board.serialize(70);

  // 73:   if (successorParent.left === successor) {
  yield board.serialize(73);
  if (successorParent.left?.end === successor) {
    // 74:     successorParent.left = successor.right;
    if (successorParent.left) disappear(board, successorParent.left);
    if (successor.right) disappear(board, successor.right);
    disappear(board, successor);

    const rightNodes = tree.getInorderRightNodes(successor);

    if (successor.right?.end)
      animateMoveSubtree(
        board,
        successor.right?.end,
        0,
        -2 * CANVAS_NODE_HEIGHT,
      );

    successorParent.setLeft(successor.right?.end);
    if (successorParent.left) {
      successorParent.left.opacity = 0;
      appear(board, successorParent.left);
    }

    animateMoveMany(
      board,
      rightNodes.map((n) => ({
        structure: n,
        targetX: n.x - CANVAS_NODE_WIDTH,
        targetY: n.y,
      })),
    );

    yield board.serialize(74);
  } else {
    // 76:     successorParent.right = successor.right;
    if (successorParent.right) disappear(board, successorParent.right);
    if (successor.right) disappear(board, successor.right);
    disappear(board, successor);

    const rightNodes = tree.getInorderRightNodes(successor);

    if (successor.right?.end)
      animateMoveSubtree(
        board,
        successor.right?.end,
        0,
        -2 * CANVAS_NODE_HEIGHT,
      );

    successorParent.setRight(successor.right?.end);
    if (successorParent.right) {
      successorParent.right.opacity = 0;
      appear(board, successorParent.right);
    }

    animateMoveMany(
      board,
      rightNodes.map((n) => ({
        structure: n,
        targetX: n.x - CANVAS_NODE_WIDTH,
        targetY: n.y,
      })),
    );

    yield board.serialize(76);
  }

  // 79:   return;
  current.color = COLOR_IDLE;
  yield board.serialize(79);

  tree.setName();
  board.callstack.pop();
  yield {
    ...board.serialize(80),
    structureData: tree.toData(),
    structureFrames: [board.toFrame()],
  };
  return;
}
