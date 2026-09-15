import { NODE_HEIGHT } from '#canvas/elements/node.ts';
import { parseArgument } from '#utils/argument.ts';

import { appear } from '../../animation.ts';
import { animateFrom, capture } from '../../layout.ts';
import { defineLinkedListAlgorithm } from '../../structures/linked-list/algorithm.ts';
import { CoreLinkedListNode } from '../../structures/linked-list/structure.ts';

// The listing this plays against is
// `constants/code/linked-list-insert-head.md`, whose lines are named by the
// `/*#` markers the build strips out.
export const linkedListInsertHead = defineLinkedListAlgorithm({
  parseArgs: (values) => {
    const value = parseArgument(values.value ?? '');

    return value === null ? null : { value };
  },

  play: function* ({ board, structure: list, args, step }) {
    const { value } = args;

    board.call('insertHead', [
      // A list is read on the canvas, so the signature names its type the way
      // the listing declares it rather than printing its contents.
      { name: 'list', value: { structure: 'LinkedList' } },
      { name: 'value', value },
    ]);

    yield step('enter');

    // The node exists before it is part of anything, so it is staged a row
    // below the place it is about to take rather than inside the list — which
    // still holds the same nodes it did.
    const node = new CoreLinkedListNode(value);
    node.x = list.x;
    node.y = list.y + 2 * NODE_HEIGHT;
    node.variant = 'secondary';
    node.opacity = 0;
    node.setLabel('bottom', 'node');
    node.rearrange();

    board.float(node);
    appear(board, node);
    yield step('create');

    node.setNext(list.head);

    if (node.next !== null) {
      node.next.opacity = 0;
      appear(board, node.next);
    }

    yield step('link');

    // The staged node is captured along with the list, so it rises into the
    // row in the same motion the rest of the list slides along to make room.
    const before = capture([node, ...list.nodes()]);

    board.unfloat(node);
    list.head = node;
    node.setLabel('bottom');

    list.rearrange();
    animateFrom(board, list.nodes(), before);
    yield step('setHead');

    node.variant = 'primary';
    yield step('exit');

    board.return();
  },
});
