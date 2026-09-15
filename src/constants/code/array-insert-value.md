```ts
function insertValue(array: number[], index: number, value: number) {
  if (index < 0) {
    index = 0;
  }

  if (index > array.length) {
    index = array.length;
  }

  const result = new Array(array.length + 1);

  for (let i = 0; i < index; i++) {
    result[i] = array[i];
  }

  result[index] = value;

  for (let i = index; i < array.length; i++) {
    result[i + 1] = array[i];
  }

  array = result;
}
```
