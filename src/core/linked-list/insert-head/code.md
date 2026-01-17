```tsx
function inserthead(list: linkedlist, value: number) {
  const node = new linkedlistnode(value);

  node.next = list.head;
  list.head = node;
}
```
