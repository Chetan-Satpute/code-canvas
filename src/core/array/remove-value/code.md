```tsx
function removeValue(array: number[], index: number) {
  if (index < 0 || index >= array.length) {
    return;
  }

  // shift elements to the left
  for (let i = index + 1; i < array.length; i++) {
    array[i - 1] = array[i];
  }

  array.length--;
}
```
