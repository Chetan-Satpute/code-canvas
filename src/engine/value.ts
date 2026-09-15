// The values an algorithm can put in front of the reader: what a call stack
// signature prints and what the memory card lists.
export type CoreValue = number | number[] | boolean | null;

export interface CoreVariable {
  name: string;
  value: CoreValue;
}

// Arrays are structures, and a structure is read on the canvas rather than in
// the memory card — so only scalars reach memory. Signatures print everything.
export function isScalarValue(value: CoreValue): boolean {
  return !Array.isArray(value);
}

export function formatCoreValue(value: CoreValue): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `[${value.join(', ')}]`;

  return value.toString();
}
