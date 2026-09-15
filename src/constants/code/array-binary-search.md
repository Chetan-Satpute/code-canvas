```ts
/**
 * The array MUST be sorted in ascending order. On an unsorted array binary
 * search may miss a value that is present, or report the wrong index.
 */
/*#enter*/ function binarySearch(array: number[], target: number): number {
  /*#left*/ let left = 0;
  /*#right*/ let right = array.length - 1;

  /*#loop*/ while (left < right) {
    /*#mid*/ const mid = Math.floor((left + right) / 2);

    /*#compare*/ if (array[mid] < target) {
      /*#goRight*/ left = mid + 1;
    } else {
      /*#goLeft*/ right = mid;
    }
  }

  /*#check*/ if (array[left] === target) {
    /*#found*/ return left;
  }

  /*#missing*/ return -1;
} /*#exit*/
```
