```ts
function removeValue(array: number[], index: number) {
  if (index < 0 || index >= array.length) {
    return;
  }

  // Shift every later element one place to the left
  for (let i = index + 1; i < array.length; i++) {
    array[i - 1] = array[i];
  }

  array.length--;
}
```
