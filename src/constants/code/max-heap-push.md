```ts
/*#enter*/ function push(heap: number[], value: number) {
  /*#append*/ heap.push(value);

  /*#loop*/ for (let index = heap.length - 1; index > 0;) {
    /*#parent*/ const parent = Math.floor((index - 1) / 2);

    /*#compare*/ if (heap[index] <= heap[parent]) {
      /*#stop*/ break;
    }

    // Swap values at index and parent
    /*#swap*/ [heap[index], heap[parent]] = [heap[parent], heap[index]];
    /*#climb*/ index = parent;
  }

  /*#return*/ return;
} /*#exit*/
```
