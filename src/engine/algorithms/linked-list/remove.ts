import type { NodeVariant } from '#canvas/elements/node.ts';
import { parseArgument } from '#utils/argument.ts';

import { appear, disappear } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import { CoreEdge } from '../../elements/edge.ts';
import { animateFrom, capture } from '../../layout.ts';
import { defineLinkedListAlgorithm } from '../../structures/linked-list/algorithm.ts';
import type {
  CoreLinkedList,
  Link,
} from '../../structures/linked-list/structure.ts';
import { CoreLinkedListNode } from '../../structures/linked-list/structure.ts';

// The listing this plays against is `constants/code/linked-list-remove.md`,
// whose lines are named by the `/*#` markers the build strips out.
export const linkedListRemove = defineLinkedListAlgorithm({
  parseArgs: (values) => {
    const target = parseArgument(values.target ?? '');

    return target === null ? null : { target };
  },

  play: function* ({ board, structure: list, args, step }) {
    const { target } = args;

    board.call('remove', [
      { name: 'list', value: { structure: 'LinkedList' } },
      { name: 'target', value: target },
    ]);

    yield step('enter');
    yield step('emptyCheck');

    if (list.head === null) {
      yield step('emptyReturn');
      yield step('exit');

      board.return();

      return;
    }

    const head = list.head;
    head.variant = 'secondary';
    yield step('headCheck');

    if (head.value === target) {
      head.variant = 'danger';

      // Nothing points at the head, so unlinking it is the one case with no
      // link to put in the place of the two that go.
      unlink(board, list, null, head);
      yield step('unlinkHead');

      yield step('headReturn');
      yield step('exit');

      board.return();

      return;
    }

    head.variant = 'primary';

    // `parent` and `node` are references to nodes rather than scalars, so
    // they are named under the nodes they point at instead of being listed in
    // memory. They take different variants because the listing's whole point
    // is that the two are a pair: the match cannot be unlinked without the
    // node in front of it.
    let parent = head;
    mark(parent, 'parent', 'tertiary');
    yield step('parent');

    let node = head.next?.end ?? null;
    if (node !== null) mark(node, 'node', 'secondary');
    yield step('node');

    yield step('loop');

    while (node !== null) {
      yield step('compare');

      if (node.value === target) {
        node.variant = 'danger';

        unlink(board, list, parent, node);
        yield step('unlink');

        unmark(parent);
        yield step('foundReturn');
        yield step('exit');

        board.return();

        return;
      }

      // `parent = node` makes the node the scan just rejected the one in
      // front of the next, which is the whole point of keeping it: the match
      // cannot be unlinked without it.
      unmark(parent);
      parent = node;
      mark(parent, 'parent', 'tertiary');
      yield step('advanceParent');

      node = node.next?.end ?? null;
      if (node !== null) mark(node, 'node', 'secondary');
      yield step('advanceNode');

      yield step('loop');
    }

    unmark(parent);

    yield step('return');
    yield step('exit');

    board.return();
  },
});

function mark(node: CoreLinkedListNode, name: string, variant: NodeVariant) {
  node.variant = variant;
  node.setLabel('bottom', name);
  node.rearrange();
}

function unmark(node: CoreLinkedListNode) {
  node.variant = 'primary';
  node.setLabel('bottom');
  node.rearrange();
}

// `parent.next = node.next`, and `list.head = list.head.next` when the node
// leaving is the head. The node and both links that touched it are faded
// while the list still holds them — a node the list has unlinked is not
// serialized, and so could not be seen fading — then the link that skips the
// gap is drawn and the list closes up under it.
function unlink(
  board: CoreBoard,
  list: CoreLinkedList,
  parent: CoreLinkedListNode | null,
  going: CoreLinkedListNode,
) {
  const detached: Link[] = [going.next, parent?.next ?? null];
  disappear(board, going, ...detached.filter((link) => link !== null));

  const successor = going.next?.end ?? null;

  const created =
    parent === null || successor === null
      ? null
      : new CoreEdge(parent, successor);

  if (parent === null) list.head = successor;
  else parent.next = created;

  const before = capture(list.nodes());

  if (created !== null) {
    created.opacity = 0;
    appear(board, created);
  }

  list.rearrange();
  animateFrom(board, list.nodes(), before);
}
