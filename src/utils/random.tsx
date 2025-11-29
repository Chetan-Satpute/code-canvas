/**
 * Generate a random number between min and max
 * @param min - The minimum number
 * @param max - The maximum number
 * @returns A random number between min and max
 */
export function randomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** random number array of length
 * @param length - The length of the array
 * @returns A random number array of length
 */
export function randomNumberArray(length: number): number[] {
  return Array.from({ length }, () => randomNumber(0, 100));
}
