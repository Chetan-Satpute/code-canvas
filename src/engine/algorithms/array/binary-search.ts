import { parseArgument } from '#utils/argument.ts';

import { defineArrayAlgorithm } from '../../structures/array/algorithm.ts';
import { CoreArray } from '../../structures/array/structure.ts';

// A variable pointing at a cell, named under it.
interface Cursor {
  name: string;
  index: number;
}

// The listing this plays against is `constants/code/array-binary-search.md`,
// whose lines are named by the `/*#` markers the build strips out.
export const arrayBinarySearch = defineArrayAlgorithm({
  parseArgs: (values) => {
    const target = parseArgument(values.target ?? '');

    return target === null ? null : { target };
  },

  play: function* ({ board, structure: array, args, step }) {
    const frame = board.call('binarySearch', [
      { name: 'array', value: array.toData() },
      { name: 'target', value: args.target },
    ]);

    yield step('enter');
    yield step('empty');

    if (array.nodes.length === 0) {
      yield step('none');
      yield step('exit');

      board.return();

      return;
    }

    // `right` is not declared yet, so there is no window to show — only the
    // one cell `left` starts on.
    let left = 0;
    frame.set('left', left);
    show(array, left, left, [{ name: 'left', index: left }]);
    yield step('left');

    let right = array.nodes.length - 1;
    frame.set('right', right);
    show(array, left, right, cursors(left, right));
    yield step('right');

    yield step('loop');

    while (left < right) {
      const mid = Math.floor((left + right) / 2);
      frame.set('mid', mid);
      show(array, left, right, cursors(left, right, mid), mid);
      yield step('mid');

      yield step('compare');

      // Every cell below `mid` holds something smaller still, so the whole
      // lower half goes in one step — which is the halving the window shows.
      if (array.nodes[mid].value < args.target) {
        left = mid + 1;
        frame.set('left', left);
        show(array, left, right, cursors(left, right, mid), mid);
        yield step('goRight');
      } else {
        right = mid;
        frame.set('right', right);
        show(array, left, right, cursors(left, right, mid), mid);
        yield step('goLeft');
      }

      // `mid` is declared inside the loop body, so it is gone by the time the
      // condition is tested again.
      frame.clear('mid');
      show(array, left, right, cursors(left, right));
      yield step('loop');
    }

    yield step('check');

    // Exactly one cell is left. `left` only ever moves to `mid + 1`, which is
    // never past `right`, and `right` only ever moves back to `mid`, which is
    // never before `left` — so the loop ends with the two on the same cell,
    // and the empty array that would have had none was returned above.
    const found = array.nodes[left];

    if (found.value === args.target) {
      found.variant = 'success';
      yield step('found');

      reset(array);
      yield step('exit');
      board.return();

      return;
    }

    // Only the one cell the search narrowed to is marked. Binary search never
    // looked at the rest — it ruled them out — so painting the whole array
    // would claim a search it did not do.
    found.variant = 'danger';
    yield step('missing');

    reset(array);
    yield step('exit');
    board.return();
  },
});

function cursors(left: number, right: number, mid?: number): Cursor[] {
  const all = [
    { name: 'left', index: left },
    { name: 'right', index: right },
  ];

  if (mid !== undefined) all.push({ name: 'mid', index: mid });

  return all;
}

// Paints the window still being searched and names the cursors under the
// cells they point at. Everything outside the window has been ruled out and
// goes back to resting, so what the reader watches is the window halving.
function show(
  array: CoreArray,
  left: number,
  right: number,
  marks: Cursor[],
  mid?: number,
) {
  array.nodes.forEach((node, index) => {
    node.variant = index >= left && index <= right ? 'secondary' : 'primary';
    node.setLabel('bottom');
  });

  // `mid` is the cell being compared, and it keeps its variant even once a
  // branch has moved the window off it — it stays in scope to the end of the
  // loop body.
  if (mid !== undefined) array.nodes[mid].variant = 'tertiary';

  // Two cursors on one cell get one label naming both: `mid` rounds down onto
  // `left` whenever the window is two wide, and `left` meets `right` on the
  // cell the search ends at.
  const named = new Map<number, string[]>();

  for (const cursor of marks) {
    const names = named.get(cursor.index) ?? [];
    names.push(cursor.name);
    named.set(cursor.index, names);
  }

  for (const [index, names] of named)
    array.nodes[index].setLabel('bottom', names.join(' '));

  array.rearrange();
}

function reset(array: CoreArray) {
  for (const node of array.nodes) {
    node.variant = 'primary';
    node.setLabel('bottom');
  }

  array.rearrange();
}
