```tsx
function linearSearch(array: number[], value: number) {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === value) {
      return i;
    }
  }

  return NaN;
}
```
