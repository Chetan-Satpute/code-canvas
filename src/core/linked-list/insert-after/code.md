```tsx
function insertAfter(list: LinkedList, target: number, value: number) {
  if (list.head === null) {
    return;
  }

  for (let ptr = list.head; ptr; ptr = ptr.next) {
    if (ptr.value !== target) {
      continue;
    }

    const node = new LinkedListNode(value);

    node.next = ptr.next;
    ptr.next = node;

    break;
  }

  return;
}
```
