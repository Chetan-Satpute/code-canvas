```ts
/**
 * The array MUST be sorted in ascending order. On an unsorted array binary
 * search may miss a value that is present, or report the wrong index.
 */
function binarySearch(array: number[], target: number): number {
  let left = 0;
  let right = array.length - 1;

  while (left < right) {
    const mid = Math.floor((left + right) / 2);

    if (array[mid] < target) {
      left = mid + 1;
    } else {
      right = mid;
    }
  }

  if (array[left] === target) {
    return left;
  }

  return -1;
}
```
