```tsx
function insert(tree, value: number) {
  if (tree.root === null) {
    tree.root = new Node(value);
    return;
  }

  let current = tree.root;

  while (true) {
    if (value === current.value) {
        break;
    }

    if (value < current.value) {
      if (current.left === null) {
        current.left = new Node(value);
        break;
      }

      current = current.left;
    } else {
      if (current.right === null) {
        current.right = new Node(value);
        break;
      }

      current = current.right;
    }
  }

  return;
}
```
