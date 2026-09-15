```ts
function push(heap: number[], value: number) {
  heap.push(value);

  for (let nodeIndex = heap.length - 1; nodeIndex > 0;) {
    const parentIndex = Math.floor((nodeIndex - 1) / 2);

    if (heap[nodeIndex] <= heap[parentIndex]) {
      break;
    }

    // Swap values at nodeIndex and parentIndex
    [heap[nodeIndex], heap[parentIndex]] = [heap[parentIndex], heap[nodeIndex]];
    nodeIndex = parentIndex;
  }

  return;
}
```
