```tsx
function pop(heap) {
  if (heap.length === 0) {
    return;
  }

  // swap top and last values
  [heap[0], heap[heap.length - 1]] = [heap[heap.length - 1], heap[0]];

  heap.pop();

  for (let nodeIndex = 0; nodeIndex < heap.length; ) {
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

    // swap nextIndex and nodeIndex values
    [heap[nextIndex], heap[nodeIndex]] = [heap[nodeIndex], heap[nextIndex]];

    nodeIndex = nextIndex;
  }

  return;
}
```
