```ts
/*#enter*/ function removeValue(array: number[], index: number) {
  /*#guard*/ if (index < 0 || index >= array.length) {
    /*#return*/ return;
  }

  // Shift every later element one place to the left
  /*#loop*/ for (let i = index + 1; i < array.length; i++) {
    /*#shift*/ array[i - 1] = array[i];
  }

  /*#truncate*/ array.length--;
} /*#exit*/
```
