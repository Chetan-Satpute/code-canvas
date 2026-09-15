import { disappear } from '../../animation.ts';
import { defineMaxHeapAlgorithm } from '../../structures/max-heap/algorithm.ts';
import { mark } from '../../structures/max-heap/cursors.ts';
import { animateSwap } from '../../structures/max-heap/swap.ts';

// The listing this plays against is `constants/code/max-heap-pop.md`, whose
// lines are named by the `/*#` markers the build strips out.
export const maxHeapPop = defineMaxHeapAlgorithm({
  parseArgs: () => ({}),

  play: function* ({ board, structure: heap, step }) {
    const frame = board.call('pop', [{ name: 'heap', value: heap.toData() }]);

    yield step('enter');
    yield step('emptyCheck');

    if (heap.nodes.length === 0) {
      yield step('emptyReturn');
      yield step('exit');

      board.return();

      return;
    }

    const last = heap.nodes.length - 1;
    frame.set('last', last);
    mark(heap, [
      { index: 0, name: 'top', variant: 'tertiary' },
      { index: last, name: 'last' },
    ]);
    yield step('last');

    // The maximum is on top and the slot that has to disappear is the last
    // one, so the two exchange places first: what leaves is then the value
    // the caller asked for, and what is left on top has to sink.
    if (last > 0) animateSwap(board, heap, 0, last);
    mark(heap, [{ index: last, name: 'last', variant: 'danger' }]);
    yield step('swapLast');

    const removal = heap.removeLast();

    // Unreachable: the empty heap returned above, so there is a last slot.
    if (removal === null) return;

    // Faded while the heap still holds it, since a node the heap has dropped
    // is not serialized and so could not be seen fading.
    disappear(
      board,
      removal.node,
      ...(removal.edge === null ? [] : [removal.edge]),
    );

    removal.unlink();
    heap.rearrange();
    board.pushFrame();

    frame.clear('last');
    yield step('removeLast');

    let index = 0;
    frame.set('index', index);
    mark(heap, [{ index, name: 'index' }]);
    yield step('loop');

    while (index < heap.nodes.length) {
      const left = index * 2 + 1;
      frame.set('left', left);
      mark(heap, [
        { index, name: 'index' },
        { index: left, name: 'left', variant: 'tertiary' },
      ]);
      yield step('left');

      const right = index * 2 + 2;
      frame.set('right', right);
      mark(heap, [
        { index, name: 'index' },
        { index: left, name: 'left', variant: 'tertiary' },
        { index: right, name: 'right', variant: 'tertiary' },
      ]);
      yield step('right');

      let next = index;
      frame.set('next', next);
      mark(heap, [
        { index, name: 'index' },
        { index: left, name: 'left', variant: 'tertiary' },
        { index: right, name: 'right', variant: 'tertiary' },
        { index: next, name: 'next' },
      ]);
      yield step('next');

      const cursors = () => [
        { index, name: 'index' },
        { index: left, name: 'left', variant: 'tertiary' as const },
        { index: right, name: 'right', variant: 'tertiary' as const },
        { index: next, name: 'next' },
      ];

      yield step('checkLeft');

      if (
        left < heap.nodes.length &&
        heap.nodes[next].value < heap.nodes[left].value
      ) {
        next = left;
        frame.set('next', next);
        mark(heap, cursors());
        yield step('takeLeft');
      }

      yield step('checkRight');

      if (
        right < heap.nodes.length &&
        heap.nodes[next].value < heap.nodes[right].value
      ) {
        next = right;
        frame.set('next', next);
        mark(heap, cursors());
        yield step('takeRight');
      }

      yield step('settled');

      if (next === index) {
        // Bigger than both children, so it is where it belongs and everything
        // below it is smaller still.
        mark(heap, [{ index, name: 'index', variant: 'success' }]);
        yield step('stop');

        break;
      }

      animateSwap(board, heap, next, index);
      mark(heap, cursors());
      yield step('swap');

      index = next;
      frame.set('index', index);
      mark(heap, [{ index, name: 'index' }]);
      yield step('sink');

      // The three are declared inside the loop body, so they are gone by the
      // time the condition is tested again.
      clearBody(frame);
      yield step('loop');
    }

    clearBody(frame);
    mark(heap);

    yield step('return');
    yield step('exit');

    board.return();
  },
});

function clearBody(frame: { clear(name: string): void }) {
  frame.clear('left');
  frame.clear('right');
  frame.clear('next');
}
