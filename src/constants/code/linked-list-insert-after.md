```ts
/*#enter*/ function insertAfter(
  list: LinkedList,
  target: number,
  value: number,
) {
  /*#emptyCheck*/ if (list.head === null) {
    /*#emptyReturn*/ return;
  }

  /*#loop*/ for (let ptr = list.head; ptr; ptr = ptr.next) {
    /*#compare*/ if (ptr.value !== target) {
      /*#skip*/ continue;
    }

    /*#create*/ const node = new LinkedListNode(value);

    /*#link*/ node.next = ptr.next;
    /*#splice*/ ptr.next = node;

    /*#stop*/ break;
  }

  /*#return*/ return;
} /*#exit*/
```
