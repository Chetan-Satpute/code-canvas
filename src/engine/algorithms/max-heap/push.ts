import { parseArgument } from '#utils/argument.ts';

import { appear } from '../../animation.ts';
import { defineMaxHeapAlgorithm } from '../../structures/max-heap/algorithm.ts';
import { mark } from '../../structures/max-heap/cursors.ts';
import { animateSwap } from '../../structures/max-heap/swap.ts';

// The listing this plays against is `constants/code/max-heap-push.md`, whose
// lines are named by the `/*#` markers the build strips out.
export const maxHeapPush = defineMaxHeapAlgorithm({
  parseArgs: (values) => {
    const value = parseArgument(values.value ?? '');

    return value === null ? null : { value };
  },

  play: function* ({ board, structure: heap, args, step }) {
    const { value } = args;

    const frame = board.call('push', [
      // The listing takes the heap as the array it is, so the signature
      // prints it the way the array's own algorithms do.
      { name: 'heap', value: heap.toData() },
      { name: 'value', value },
    ]);

    yield step('enter');

    // The new element goes in the next free slot, which is a leaf hanging off
    // whichever node owns it — so a cell and a tree node appear together.
    const { node, edge } = heap.push(value);

    node.opacity = 0;
    if (edge !== null) edge.opacity = 0;

    heap.rearrange();
    appear(board, node, ...(edge === null ? [] : [edge]));
    yield step('append');

    let index = heap.nodes.length - 1;
    frame.set('index', index);
    mark(heap, [{ index, name: 'index' }]);
    yield step('loop');

    while (index > 0) {
      const parent = Math.floor((index - 1) / 2);
      frame.set('parent', parent);
      mark(heap, [
        { index, name: 'index' },
        { index: parent, name: 'parent', variant: 'tertiary' },
      ]);
      yield step('parent');

      yield step('compare');

      if (heap.nodes[index].value <= heap.nodes[parent].value) {
        // No bigger than the slot above it, so it is where it belongs and
        // every slot above that already holds something bigger still.
        mark(heap, [{ index, name: 'index', variant: 'success' }]);
        yield step('stop');

        break;
      }

      animateSwap(board, heap, index, parent);
      mark(heap, [
        { index, name: 'index', variant: 'tertiary' },
        { index: parent, name: 'parent' },
      ]);
      yield step('swap');

      index = parent;
      frame.set('index', index);
      mark(heap, [{ index, name: 'index' }]);
      yield step('climb');

      // `parent` is declared inside the loop body, so it is gone by the time
      // the condition is tested again.
      frame.clear('parent');
      yield step('loop');
    }

    frame.clear('parent');
    mark(heap);

    yield step('return');
    yield step('exit');

    board.return();
  },
});
