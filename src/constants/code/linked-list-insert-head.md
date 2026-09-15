```ts
function insertHead(list: LinkedList, value: number) {
  const node = new LinkedListNode(value);

  node.next = list.head;
  list.head = node;
}
```
