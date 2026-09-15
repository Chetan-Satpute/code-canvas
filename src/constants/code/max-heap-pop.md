```ts
function pop(heap: number[]) {
  if (heap.length === 0) {
    return;
  }

  // Swap top and last values
  [heap[0], heap[heap.length - 1]] = [heap[heap.length - 1], heap[0]];

  heap.pop();

  for (let nodeIndex = 0; nodeIndex < heap.length;) {
    const leftIndex = nodeIndex * 2 + 1;
    const rightIndex = nodeIndex * 2 + 2;

    let nextIndex = nodeIndex;

    if (leftIndex < heap.length && heap[nextIndex] < heap[leftIndex]) {
      nextIndex = leftIndex;
    }

    if (rightIndex < heap.length && heap[nextIndex] < heap[rightIndex]) {
      nextIndex = rightIndex;
    }

    if (nextIndex === nodeIndex) {
      break;
    }

    // Swap values at nextIndex and nodeIndex
    [heap[nextIndex], heap[nodeIndex]] = [heap[nodeIndex], heap[nextIndex]];

    nodeIndex = nextIndex;
  }

  return;
}
```
