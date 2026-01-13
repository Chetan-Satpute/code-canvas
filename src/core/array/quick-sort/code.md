```tsx
function quickSort(array: number[], low = 0, high = array.length - 1): void {
  // Base case: 0 or 1 element is already sorted
  if (low >= high) {
    return;
  }

  const pivotIndex = partition(array, low, high);

  quickSort(array, low, pivotIndex - 1);
  quickSort(array, pivotIndex + 1, high);
}

function partition(array: number[], low: number, high: number): number {
  const pivot = array[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (array[j] <= pivot) {
      i++;
      // Swap to move smaller element to the left side
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Swap pivot into its final sorted position
  [array[i + 1], array[high]] = [array[high], array[i + 1]];

  return i + 1;
}
```