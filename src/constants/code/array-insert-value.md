```ts
/*#enter*/ function insertValue(array: number[], index: number, value: number) {
  /*#checkLow*/ if (index < 0) {
    /*#clampLow*/ index = 0;
  }

  /*#checkHigh*/ if (index > array.length) {
    /*#clampHigh*/ index = array.length;
  }

  /*#result*/ const result = new Array(array.length + 1).fill(0);

  /*#copyBefore*/ for (let i = 0; i < index; i++) {
    /*#copyBeforeAssign*/ result[i] = array[i];
  }

  /*#insert*/ result[index] = value;

  /*#copyAfter*/ for (let i = index; i < array.length; i++) {
    /*#copyAfterAssign*/ result[i + 1] = array[i];
  }

  /*#assign*/ array = result;
} /*#exit*/
```
