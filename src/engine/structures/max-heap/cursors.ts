import type { NodeVariant } from '#canvas/elements/node.ts';

import type { CoreMaxHeap } from './structure.ts';

// A variable holding a slot number, named under the cell it points at.
export interface Cursor {
  index: number;
  name: string;
  variant?: NodeVariant;
}

// Paints the slots a loop is about and names them, in both views at once
// since the heap draws every value twice. A cursor past the end has no cell
// to mark — which is the case the listings' bound checks are about — and two
// cursors on one slot get a single label naming both, the way binary search
// names `left` and `right` where they meet.
export function mark(heap: CoreMaxHeap, cursors: Cursor[] = []) {
  for (const node of heap.nodes) {
    node.variant = 'primary';
    node.setLabel('bottom');
  }

  const named = new Map<number, string[]>();

  for (const cursor of cursors) {
    if (cursor.index >= heap.nodes.length) continue;

    named.set(cursor.index, [...(named.get(cursor.index) ?? []), cursor.name]);
    heap.nodes[cursor.index].variant = cursor.variant ?? 'secondary';
  }

  for (const [index, names] of named)
    heap.nodes[index].setLabel('bottom', names.join(' '));

  heap.rearrange();
}
