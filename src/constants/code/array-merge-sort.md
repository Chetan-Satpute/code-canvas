```ts
function mergeSort(array: number[]): void {
  // Base case: arrays of length 0 or 1 are already sorted
  if (array.length <= 1) {
    return;
  }

  const mid = Math.floor(array.length / 2);

  const left = array.slice(0, mid);
  const right = array.slice(mid);

  mergeSort(left);
  mergeSort(right);

  merge(array, left, right);
}

function merge(array: number[], left: number[], right: number[]): void {
  let leftIndex = 0;
  let rightIndex = 0;
  let arrayIndex = 0;

  while (leftIndex < left.length && rightIndex < right.length) {
    if (left[leftIndex] <= right[rightIndex]) {
      array[arrayIndex] = left[leftIndex];
      leftIndex++;
    } else {
      array[arrayIndex] = right[rightIndex];
      rightIndex++;
    }
    arrayIndex++;
  }

  // Append remaining elements (only one of these will run)
  while (leftIndex < left.length) {
    array[arrayIndex] = left[leftIndex];
    leftIndex++;
    arrayIndex++;
  }

  while (rightIndex < right.length) {
    array[arrayIndex] = right[rightIndex];
    rightIndex++;
    arrayIndex++;
  }
}
```
