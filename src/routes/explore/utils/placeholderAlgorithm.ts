import type { AlgorithmArgument } from '../components/AlgorithmCard.tsx';
import type { CallStackFrame } from '../components/CallStackCard.tsx';
import type { StructureOperation } from '../components/StructureCard.tsx';

interface PlaceholderAlgorithm {
  title: string;
  description: string;
  args: AlgorithmArgument[];
  code: string[];
  operations: StructureOperation[];
}

// Stand-in content so the layout has something to hold. It is replaced once
// algorithms are resolved from the route's id.
const placeholderAlgorithm: PlaceholderAlgorithm = {
  title: 'Binary Search',
  description:
    'Halves a sorted array on every step, discarding the side that cannot hold the target.',
  args: [
    { name: 'target', placeholder: '42' },
    { name: 'target', placeholder: '42' },
    { name: 'target', placeholder: '42' },
    { name: 'target', placeholder: '42' },
    { name: 'target', placeholder: '42' },
    { name: 'target', placeholder: '42' },
    { name: 'target', placeholder: '42' },
  ],
  code: [
    'function binarySearch(values, target, low, high) {',
    '  if (low > high) return -1;',
    '',
    '  const mid = Math.floor((low + high) / 2);',
    '',
    '  if (values[mid] === target) return mid;',
    '',
    '  if (values[mid] < target) {',
    '    return binarySearch(values, target, mid + 1, high);',
    '  }',
    '',
    '  return binarySearch(values, target, low, mid - 1);',
    '}',
  ],
  operations: [
    {
      id: 'insert',
      label: 'Insert',
      args: [
        { name: 'value', placeholder: '42' },
        { name: 'index', placeholder: '3' },
      ],
    },
    {
      id: 'remove',
      label: 'Remove',
      args: [{ name: 'value', placeholder: '42' }],
    },
    {
      id: 'replace',
      label: 'Replace',
      args: [{ name: 'values', placeholder: '3, 8, 15, 42' }],
    },
  ],
};

// The engine will emit real frames as it runs. Until then this fabricates a
// plausible mid-run stack from the submitted arguments, innermost first. The
// array itself is left out of the variables — the canvas is where it is read.
export function buildPlaceholderCallStack(
  values: Record<string, string>,
): CallStackFrame[] {
  const target = values.target || 'target';

  return [
    {
      id: 'frame-1',
      signature: `binarySearch(values, ${target}, 4, 7)`,
      line: 4,
      variables: [
        { name: 'target', value: target },
        { name: 'low', value: '4' },
        { name: 'high', value: '7' },
        { name: 'mid', value: '5' },
      ],
    },
    {
      id: 'frame-0',
      signature: `binarySearch(values, ${target}, 0, 7)`,
      line: 9,
      variables: [
        { name: 'target', value: target },
        { name: 'low', value: '0' },
        { name: 'high', value: '7' },
        { name: 'mid', value: '3' },
      ],
    },
  ];
}

export default placeholderAlgorithm;
