import { parseArgument } from '#utils/argument.ts';
import { randomNumber, uniqueRandomNumberArray } from '#utils/random.ts';

import { appear, disappear } from '../../animation.ts';
import { CoreEdge } from '../../elements/edge.ts';
import { animateFrom, capture } from '../../layout.ts';
import { defineLinkedListOperation } from './algorithm.ts';
import type { CoreLinkedList, Link } from './structure.ts';
import { CoreLinkedListNode } from './structure.ts';

export const NODE_COUNT_MIN = 4;
export const NODE_COUNT_MAX = 8;

// Distinct values, because every operation but the first names the node it
// acts on by its value — a list holding the same number twice would make
// "insert after 13" mean two different things.
export function fillRandomly(list: CoreLinkedList) {
  list.restore(
    uniqueRandomNumberArray(randomNumber(NODE_COUNT_MIN, NODE_COUNT_MAX)),
  );
}

export const randomizeLinkedList = defineLinkedListOperation({
  parseArgs: () => ({}),
  apply: (_board, list) => {
    fillRandomly(list);
  },
});

export const insertAtLinkedListHead = defineLinkedListOperation({
  parseArgs: (values) => {
    const value = parseArgument(values.value ?? '');

    return value === null ? null : { value };
  },
  apply: (board, list, args) => {
    const node = new CoreLinkedListNode(args.value);
    node.setNext(list.head);

    const arriving = [node, ...(node.next === null ? [] : [node.next])];
    for (const element of arriving) element.opacity = 0;

    // Captured before the head changes, so the nodes already in the list are
    // animated from where they stand into the place one further along.
    const before = capture(list.nodes());

    list.head = node;
    list.rearrange();
    animateFrom(board, list.nodes(), before);

    appear(board, ...arriving);
  },
});

export const insertAfterInLinkedList = defineLinkedListOperation({
  parseArgs: (values) => {
    const target = parseArgument(values.target ?? '');
    const value = parseArgument(values.value ?? '');

    if (target === null || value === null) return null;

    return { target, value };
  },
  apply: (board, list, args) => {
    const previous = list
      .nodes()
      .find((candidate) => candidate.value === args.target);

    // The list does not hold the target, so there is nowhere to insert after.
    if (previous === undefined) return;

    const node = new CoreLinkedListNode(args.value);
    node.setNext(previous.next?.end ?? null);

    // A new link rather than the one `previous` held: an edge is drawn
    // between the two nodes it holds, and this one now starts at `node`.
    const linked = new CoreEdge(previous, node);

    const arriving = [node, linked, ...(node.next === null ? [] : [node.next])];
    for (const element of arriving) element.opacity = 0;

    const before = capture(list.nodes());

    // The link `previous` held spanned the gap the new node goes in, so it is
    // dropped here and the gap opens with nothing across it.
    previous.next = linked;
    list.rearrange();
    animateFrom(board, list.nodes(), before);

    appear(board, ...arriving);
  },
});

export const removeFromLinkedList = defineLinkedListOperation({
  parseArgs: (values) => {
    const target = parseArgument(values.target ?? '');

    return target === null ? null : { target };
  },
  apply: (board, list, args) => {
    const nodes = list.nodes();
    const index = nodes.findIndex((node) => node.value === args.target);
    if (index === -1) return;

    const going = nodes[index];
    const previous = index === 0 ? null : nodes[index - 1];
    const successor = going.next?.end ?? null;

    // Faded while the list still holds the node, since a node it has unlinked
    // is not serialized and so could not be seen fading. Both links that
    // touched it go with it.
    const detached: Link[] = [going.next, previous?.next ?? null];
    disappear(board, going, ...detached.filter((link) => link !== null));

    const created =
      previous === null || successor === null
        ? null
        : new CoreEdge(previous, successor);

    if (previous === null) list.head = successor;
    else previous.next = created;

    const before = capture(list.nodes());

    // The link that skips the gap is drawn first, and the list closes up
    // under it.
    if (created !== null) {
      created.opacity = 0;
      appear(board, created);
    }

    list.rearrange();
    animateFrom(board, list.nodes(), before);
  },
});
