```ts
/*#enter*/ function quickSort(
  array: number[],
  low = 0,
  high = array.length - 1,
): void {
  // Base case: 0 or 1 element is already sorted
  /*#base*/ if (low >= high) {
    /*#sorted*/ return;
  }

  /*#partitionCall*/ const pivotIndex = partition(array, low, high);

  /*#sortLeft*/ quickSort(array, low, pivotIndex - 1);
  /*#sortRight*/ quickSort(array, pivotIndex + 1, high);
} /*#exit*/

/*#partitionEnter*/ function partition(
  array: number[],
  low: number,
  high: number,
): number {
  /*#pivot*/ const pivot = array[high];
  /*#boundary*/ let i = low - 1;

  /*#loop*/ for (let j = low; j < high; j++) {
    /*#compare*/ if (array[j] <= pivot) {
      /*#advanceBoundary*/ i++;
      // Swap to move smaller element to the left side
      /*#swap*/ [array[i], array[j]] = [array[j], array[i]];
    }
  }

  // Swap pivot into its final sorted position
  /*#placePivot*/ [array[i + 1], array[high]] = [array[high], array[i + 1]];

  /*#returnIndex*/ return i + 1;
} /*#partitionExit*/
```
