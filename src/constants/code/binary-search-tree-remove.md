```ts
/*#enter*/ function remove(tree: BinarySearchTree, value: number) {
  /*#current*/ let current = tree.root;
  /*#parent*/ let parent = null;
  /*#isLeftChild*/ let isLeftChild = false;

  // 1. Find the node
  /*#searchLoop*/ while (current !== null && current.value !== value) {
    /*#setParent*/ parent = current;

    /*#compare*/ if (value < current.value) {
      /*#markLeft*/ isLeftChild = true;
      /*#goLeft*/ current = current.left;
    } else {
      /*#markRight*/ isLeftChild = false;
      /*#goRight*/ current = current.right;
    }
  }

  // Value not found
  /*#missingCheck*/ if (current === null) {
    /*#missing*/ return;
  }

  // 2. Case 1: no children (leaf)
  /*#leafCheck*/ if (current.left === null && current.right === null) {
    /*#leafRootCheck*/ if (current === tree.root) {
      /*#leafRoot*/ tree.root = null;
    } else if (isLeftChild) {
      /*#leafLeft*/ parent.left = null;
    } else {
      /*#leafRight*/ parent.right = null;
    }
    /*#leafReturn*/ return;
  }

  // 3. Case 2: one child (right only)
  /*#rightOnlyCheck*/ if (current.left === null) {
    /*#rightOnlyRootCheck*/ if (current === tree.root) {
      /*#rightOnlyRoot*/ tree.root = current.right;
    } else if (isLeftChild) {
      /*#rightOnlyLeft*/ parent.left = current.right;
    } else {
      /*#rightOnlyRight*/ parent.right = current.right;
    }
    /*#rightOnlyReturn*/ return;
  }

  // 4. Case 2: one child (left only)
  /*#leftOnlyCheck*/ if (current.right === null) {
    /*#leftOnlyRootCheck*/ if (current === tree.root) {
      /*#leftOnlyRoot*/ tree.root = current.left;
    } else if (isLeftChild) {
      /*#leftOnlyLeft*/ parent.left = current.left;
    } else {
      /*#leftOnlyRight*/ parent.right = current.left;
    }
    /*#leftOnlyReturn*/ return;
  }

  // 5. Case 3: two children
  // Find inorder successor (min of right subtree)
  /*#successorParent*/ let successorParent = current;
  /*#successor*/ let successor = current.right;

  /*#successorLoop*/ while (successor.left !== null) {
    /*#successorSetParent*/ successorParent = successor;
    /*#successorGoLeft*/ successor = successor.left;
  }

  // Replace current value with successor value
  /*#copyValue*/ current.value = successor.value;

  // Remove successor node
  /*#successorSideCheck*/ if (successorParent.left === successor) {
    /*#successorLeft*/ successorParent.left = successor.right;
  } else {
    /*#successorRight*/ successorParent.right = successor.right;
  }

  /*#return*/ return;
} /*#exit*/
```
