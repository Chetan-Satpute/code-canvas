import type { CoreBSTDataNode } from '#core/binary-search-tree/structure.tsx';

/**
 * Generate a random integer between 0 and 100 (inclusive).
 *
 * @returns A random integer in the range [0, 100]
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate an array of random integers of a given length.
 * Values may contain duplicates.
 *
 * @param length - Length of the array
 * @returns An array of random integers
 */
export function randomNumberArray(length: number): number[] {
  return Array.from({ length }, () => randomNumber(0, 100));
}

/**
 * Generate an array of unique random integers of a given length.
 *
 * Guarantees the returned array has exactly `length` values.
 * Throws if `length` exceeds the available unique range (0–100).
 *
 * @param length - Number of unique values required
 * @returns An array of unique random integers
 */
export function uniqueRandomNumberArray(length: number): number[] {
  const MAX_UNIQUE_VALUES = 101; // values from 0 to 100 inclusive

  if (length > MAX_UNIQUE_VALUES) {
    throw new Error(`Cannot generate ${length} unique values in range 0–100`);
  }

  const values = new Set<number>();

  while (values.size < length) {
    values.add(randomNumber(0, 100));
  }

  return [...values];
}

/**
 * Generate random BST data with exactly `length` nodes.
 *
 * - Uses unique values to preserve BST properties
 * - Structure depends on insertion order
 * - Compatible with `CoreBST.fromData`
 *
 * @param length - Number of nodes in the BST
 * @returns BST data object
 */
export function randomBSTData(length: number): CoreBSTDataNode {
  const values = uniqueRandomNumberArray(length);

  const insert = (node: CoreBSTDataNode, value: number): void => {
    if (node.value === undefined) {
      node.value = value;
      return;
    }

    if (value < node.value) {
      node.left ??= {};
      insert(node.left, value);
    } else {
      node.right ??= {};
      insert(node.right, value);
    }
  };

  const root: CoreBSTDataNode = {};

  for (const value of values) {
    insert(root, value);
  }

  return root;
}
