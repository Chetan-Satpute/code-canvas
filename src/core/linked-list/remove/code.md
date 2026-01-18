```tsx
function remove(list: LinkedList, target: number) {
  if (list.head === null) {
    return;
  }

  if (list.head.value === target) {
    list.head = list.head.next;

    return;
  }

  let parent = list.head;

  for (let node = list.head.next; node; parent = node, node = node.next) {
    if (node.value === target) {
      parent.next = node.next;

      return;
    }
  }

  return;
}
```
