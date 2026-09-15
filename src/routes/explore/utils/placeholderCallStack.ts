import type { Algorithm } from '#constants/algorithms.ts';

import type { CallStackFrame } from '../components/CallStackCard.tsx';

// The entry function is the first one the listing declares.
function entryFunctionName(algorithm: Algorithm): string {
  const match = algorithm.code.join('\n').match(/function (\w+)/);

  return match === null ? algorithm.id : match[1];
}

// The execution engine will emit real frames as it runs. Until it does, this
// stands in the single frame the run was started with, so the exploration
// layout has something to lay out. The structure itself is left out of the
// variables — the canvas is where it is read.
export function buildPlaceholderCallStack(
  algorithm: Algorithm,
  values: Record<string, string>,
): CallStackFrame[] {
  const variables = algorithm.args.map((argument) => ({
    name: argument.name,
    value: values[argument.name] || (argument.placeholder ?? ''),
  }));

  const signature = `${entryFunctionName(algorithm)}(${variables
    .map((variable) => variable.value)
    .join(', ')})`;

  return [{ id: 'frame-0', signature, line: 1, variables }];
}
