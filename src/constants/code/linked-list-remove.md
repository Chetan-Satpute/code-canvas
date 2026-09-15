```ts
/*#enter*/ function remove(list: LinkedList, target: number) {
  /*#emptyCheck*/ if (list.head === null) {
    /*#emptyReturn*/ return;
  }

  /*#headCheck*/ if (list.head.value === target) {
    /*#unlinkHead*/ list.head = list.head.next;

    /*#headReturn*/ return;
  }

  /*#parent*/ let parent = list.head;
  /*#node*/ let node = list.head.next;

  /*#loop*/ while (node) {
    /*#compare*/ if (node.value === target) {
      /*#unlink*/ parent.next = node.next;

      /*#foundReturn*/ return;
    }

    /*#advanceParent*/ parent = node;
    /*#advanceNode*/ node = node.next;
  }

  /*#return*/ return;
} /*#exit*/
```
