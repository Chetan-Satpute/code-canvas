```tsx
/**
 * ⚠️ IMPORTANT:
 * The input array MUST be sorted in ascending order.
 * If the array is not sorted, binary search may return
 * an incorrect result or fail to find an existing element.
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
