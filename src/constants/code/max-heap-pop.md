```ts
/*#enter*/ function pop(heap: number[]) {
  /*#emptyCheck*/ if (heap.length === 0) {
    /*#emptyReturn*/ return;
  }

  /*#last*/ const last = heap.length - 1;

  // Swap top and last values
  /*#swapLast*/ [heap[0], heap[last]] = [heap[last], heap[0]];

  /*#removeLast*/ heap.pop();

  /*#loop*/ for (let index = 0; index < heap.length;) {
    /*#left*/ const left = index * 2 + 1;
    /*#right*/ const right = index * 2 + 2;

    /*#next*/ let next = index;

    /*#checkLeft*/ if (left < heap.length && heap[next] < heap[left]) {
      /*#takeLeft*/ next = left;
    }

    /*#checkRight*/ if (right < heap.length && heap[next] < heap[right]) {
      /*#takeRight*/ next = right;
    }

    /*#settled*/ if (next === index) {
      /*#stop*/ break;
    }

    // Swap values at next and index
    /*#swap*/ [heap[next], heap[index]] = [heap[index], heap[next]];

    /*#sink*/ index = next;
  }

  /*#return*/ return;
} /*#exit*/
```
