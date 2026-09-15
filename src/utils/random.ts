// Inclusive at both ends, which is how the callers read: "between 4 and 10
// elements" means either count is possible.
export function randomNumber(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

export function randomNumberArray(length: number): number[] {
  return Array.from({ length }, () => randomNumber(1, 99));
}

// The most distinct values `randomNumberArray` can draw from, which is what
// caps a request for unique ones.
const VALUE_COUNT = 99;

// Values for a structure that holds no duplicates, such as a binary search
// tree. More values than the range holds is clamped rather than refused —
// the alternative is a loop that never finishes.
export function uniqueRandomNumberArray(length: number): number[] {
  const values = new Set<number>();

  while (values.size < Math.min(length, VALUE_COUNT))
    values.add(randomNumber(1, VALUE_COUNT));

  return [...values];
}

// Values already satisfying the max-heap property, so a random heap is one
// the structure's own operations could have built. Sifting each parent down,
// deepest first, is the standard bottom-up construction.
export function randomMaxHeapArray(length: number): number[] {
  const values = randomNumberArray(length);

  const siftDown = (from: number) => {
    let index = from;

    for (;;) {
      const left = 2 * index + 1;
      const right = 2 * index + 2;
      let largest = index;

      if (left < values.length && values[left] > values[largest])
        largest = left;
      if (right < values.length && values[right] > values[largest])
        largest = right;

      if (largest === index) return;

      [values[index], values[largest]] = [values[largest], values[index]];
      index = largest;
    }
  };

  for (let index = Math.floor(length / 2) - 1; index >= 0; index--)
    siftDown(index);

  return values;
}
