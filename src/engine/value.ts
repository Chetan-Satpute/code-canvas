// A structure passed by reference. It is read on the canvas rather than
// printed, so a signature names the type the listing declares and memory
// leaves it out — unlike an array, which is short enough to print whole.
export interface CoreStructureValue {
  structure: string;
}

// The values an algorithm can put in front of the reader: what a call stack
// signature prints and what the memory card lists.
export type CoreValue = number | number[] | boolean | null | CoreStructureValue;

export interface CoreVariable {
  name: string;
  value: CoreValue;
}

function isStructureValue(value: CoreValue): value is CoreStructureValue {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

// Arrays and structures are read on the canvas rather than in the memory card
// — so only scalars reach memory. Signatures print everything.
export function isScalarValue(value: CoreValue): boolean {
  return !Array.isArray(value) && !isStructureValue(value);
}

export function formatCoreValue(value: CoreValue): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return `[${value.join(', ')}]`;
  if (isStructureValue(value)) return value.structure;

  return value.toString();
}
