```tsx
function remove(tree, value: number) {
  let current = tree.root;
  let parent = null;
  let isLeftChild = false;

  // 1. Find the node
  while (current !== null && current.value !== value) {
    parent = current;

    if (value < current.value) {
      isLeftChild = true;
      current = current.left;
    } else {
      isLeftChild = false;
      current = current.right;
    }
  }

  // value not found
  if (current === null) {
    return;
  }

  // 2. Case 1: no children (leaf)
  if (current.left === null && current.right === null) {
    if (current === tree.root) {
      tree.root = null;
    } else if (isLeftChild) {
      parent.left = null;
    } else {
      parent.right = null;
    }
    return;
  }

  // 3. Case 2: one child (right only)
  if (current.left === null) {
    if (current === tree.root) {
      tree.root = current.right;
    } else if (isLeftChild) {
      parent.left = current.right;
    } else {
      parent.right = current.right;
    }
    return;
  }

  // 4. Case 2: one child (left only)
  if (current.right === null) {
    if (current === tree.root) {
      tree.root = current.left;
    } else if (isLeftChild) {
      parent.left = current.left;
    } else {
      parent.right = current.left;
    }
    return;
  }

  // 5. Case 3: two children
  // Find inorder successor (min of right subtree)
  let successorParent = current;
  let successor = current.right;

  while (successor.left !== null) {
    successorParent = successor;
    successor = successor.left;
  }

  // Replace current value with successor value
  current.value = successor.value;

  // Remove successor node
  if (successorParent.left === successor) {
    successorParent.left = successor.right;
  } else {
    successorParent.right = successor.right;
  }

  return;
}
```
