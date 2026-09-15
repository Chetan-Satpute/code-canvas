```ts
/*#enter*/ function mergeSort(array: number[]): void {
  // Base case: arrays of length 0 or 1 are already sorted
  /*#base*/ if (array.length <= 1) {
    /*#sorted*/ return;
  }

  /*#mid*/ const mid = Math.floor(array.length / 2);

  /*#left*/ const left = array.slice(0, mid);
  /*#right*/ const right = array.slice(mid);

  /*#sortLeft*/ mergeSort(left);
  /*#sortRight*/ mergeSort(right);

  /*#mergeHalves*/ merge(array, left, right);
} /*#exit*/

/*#mergeEnter*/ function merge(
  array: number[],
  left: number[],
  right: number[],
) {
  /*#leftIndex*/ let leftIndex = 0;
  /*#rightIndex*/ let rightIndex = 0;
  /*#arrayIndex*/ let arrayIndex = 0;

  /*#loop*/ while (leftIndex < left.length && rightIndex < right.length) {
    /*#compare*/ if (left[leftIndex] <= right[rightIndex]) {
      /*#takeLeft*/ array[arrayIndex] = left[leftIndex];
      /*#nextLeft*/ leftIndex++;
    } else {
      /*#takeRight*/ array[arrayIndex] = right[rightIndex];
      /*#nextRight*/ rightIndex++;
    }

    /*#nextSlot*/ arrayIndex++;
  }

  // Append remaining elements (only one of these will run)
  /*#drainLeft*/ while (leftIndex < left.length) {
    /*#drainLeftTake*/ array[arrayIndex] = left[leftIndex];
    /*#drainLeftNext*/ leftIndex++;
    /*#drainLeftSlot*/ arrayIndex++;
  }

  /*#drainRight*/ while (rightIndex < right.length) {
    /*#drainRightTake*/ array[arrayIndex] = right[rightIndex];
    /*#drainRightNext*/ rightIndex++;
    /*#drainRightSlot*/ arrayIndex++;
  }
} /*#mergeExit*/
```
