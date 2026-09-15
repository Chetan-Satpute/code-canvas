```ts
/*#enter*/ function insert(tree: BinarySearchTree, value: number) {
  /*#emptyCheck*/ if (tree.root === null) {
    /*#setRoot*/ tree.root = new Node(value);
    /*#rootReturn*/ return;
  }

  /*#current*/ let current = tree.root;

  /*#loop*/ while (true) {
    /*#equalCheck*/ if (value === current.value) {
      /*#duplicate*/ break;
    }

    /*#lessCheck*/ if (value < current.value) {
      /*#leftCheck*/ if (current.left === null) {
        /*#setLeft*/ current.left = new Node(value);
        /*#leftBreak*/ break;
      }

      /*#goLeft*/ current = current.left;
    } else {
      /*#rightCheck*/ if (current.right === null) {
        /*#setRight*/ current.right = new Node(value);
        /*#rightBreak*/ break;
      }

      /*#goRight*/ current = current.right;
    }
  }

  /*#return*/ return;
} /*#exit*/
```
