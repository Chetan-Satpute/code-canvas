import { NODE_HEIGHT, NODE_WIDTH } from '#canvas/elements/node.ts';
import { parseArgument } from '#utils/argument.ts';

import { appear } from '../../animation.ts';
import { CoreEdge } from '../../elements/edge.ts';
import { animateFrom, capture } from '../../layout.ts';
import { defineLinkedListAlgorithm } from '../../structures/linked-list/algorithm.ts';
import { CoreLinkedListNode } from '../../structures/linked-list/structure.ts';

// The listing this plays against is
// `constants/code/linked-list-insert-after.md`, whose lines are named by the
// `/*#` markers the build strips out.
export const linkedListInsertAfter = defineLinkedListAlgorithm({
  parseArgs: (values) => {
    const target = parseArgument(values.target ?? '');
    const value = parseArgument(values.value ?? '');

    if (target === null || value === null) return null;

    return { target, value };
  },

  play: function* ({ board, structure: list, args, step }) {
    const { target, value } = args;

    board.call('insertAfter', [
      { name: 'list', value: { structure: 'LinkedList' } },
      { name: 'target', value: target },
      { name: 'value', value },
    ]);

    yield step('enter');
    yield step('emptyCheck');

    if (list.head === null) {
      yield step('emptyReturn');
      yield step('exit');

      board.return();

      return;
    }

    // `ptr` is a reference to a node rather than a scalar, so it is named
    // under the node it points at instead of being listed in memory.
    let ptr: CoreLinkedListNode | null = list.head;
    mark(ptr, 'ptr');
    yield step('loop');

    while (ptr !== null) {
      yield step('compare');

      if (ptr.value !== target) {
        yield step('skip');

        unmark(ptr);
        ptr = ptr.next?.end ?? null;
        if (ptr !== null) mark(ptr, 'ptr');
        yield step('loop');

        continue;
      }

      // Staged in the slot it will take — one place along from `ptr`, a row
      // below — so that it only has to rise once the list has opened a gap.
      const node = new CoreLinkedListNode(value);
      node.x = ptr.x + 2 * NODE_WIDTH;
      node.y = ptr.y + 2 * NODE_HEIGHT;
      node.variant = 'secondary';
      node.opacity = 0;
      node.setLabel('bottom', 'node');
      node.rearrange();

      board.float(node);
      appear(board, node);
      yield step('create');

      node.setNext(ptr.next?.end ?? null);

      if (node.next !== null) {
        node.next.opacity = 0;
        appear(board, node.next);
      }

      yield step('link');

      // A new link rather than the one `ptr` held: an edge is drawn between
      // the two nodes it holds, and this one ends at `node`.
      const linked = new CoreEdge(ptr, node);
      linked.opacity = 0;

      const before = capture([node, ...list.nodes()]);

      // The link `ptr` held spanned the slot the node goes in, so it is
      // dropped here and the gap opens with nothing across it.
      ptr.next = linked;
      board.unfloat(node);
      node.setLabel('bottom');

      list.rearrange();
      animateFrom(board, list.nodes(), before);
      appear(board, linked);
      yield step('splice');

      unmark(ptr);
      node.variant = 'success';
      yield step('stop');

      node.variant = 'primary';

      break;
    }

    yield step('return');
    yield step('exit');

    board.return();
  },
});

function mark(node: CoreLinkedListNode, name: string) {
  node.variant = 'secondary';
  node.setLabel('bottom', name);
  node.rearrange();
}

function unmark(node: CoreLinkedListNode) {
  node.variant = 'primary';
  node.setLabel('bottom');
  node.rearrange();
}
