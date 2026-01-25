import type { CoreFunctionContext } from '#core/helpers/types.tsx';
import { setStep } from '#redux/slice.ts';

import { type CoreBST, CoreBSTNode } from '../structure';

function fromContext(context: CoreFunctionContext) {
  return {
    bst: context.structure as CoreBST,
    board: context.board,
    control: context.control,
    value: context.args['value'] as number,
  };
}

export function runRemove(context: CoreFunctionContext) {
  const { bst, board, control, value } = fromContext(context);

  let current = bst.root;
  let parent: CoreBSTNode | null = null;
  let isLeftChild = false;

  // 1. Search for node
  while (current && current.value !== value) {
    parent = current;

    if (value < current.value) {
      isLeftChild = true;
      current = current.left?.end ?? null;
    } else {
      isLeftChild = false;
      current = current.right?.end ?? null;
    }
  }

  // Not found
  if (!current) {
    return;
  }

  // Helper to replace parent's child pointer
  const replaceChild = (node: CoreBSTNode | null) => {
    if (!parent) {
      bst.setRoot(node);
    } else if (isLeftChild) {
      parent.setLeft(node);
    } else {
      parent.setRight(node);
    }
  };

  // 2. Case: Leaf node
  if (!current.left && !current.right) {
    replaceChild(null);
  }

  // 3. Case: Only right child
  else if (!current.left && current.right) {
    replaceChild(current.right.end);
  }

  // 4. Case: Only left child
  else if (current.left && !current.right) {
    replaceChild(current.left.end);
  }

  // 5. Case: Two children
  else {
    // Find inorder successor (leftmost of right subtree)
    let successorParent = current;
    let successor = current.right!.end;
    let successorIsLeftChild = false;

    while (successor.left) {
      successorParent = successor;
      successorIsLeftChild = true;
      successor = successor.left.end;
    }

    // Replace value
    current.value = successor.value;

    // Remove successor node
    const successorChild = successor.right?.end ?? null;

    if (successorParent === current) {
      successorParent.setRight(successorChild);
    } else if (successorIsLeftChild) {
      successorParent.setLeft(successorChild);
    } else {
      successorParent.setRight(successorChild);
    }
  }

  // 6. Stabilize layout & emit frames
  bst.rearrange();

  const frames = [board.toFrame()];
  const bstData = bst.toData();

  control.dispatch(
    setStep({
      frames,
      structureData: bstData,
      structureFrames: frames,
    }),
  );
}
