import { parseArgument } from '#utils/argument.ts';

import { appear, disappear } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import { CoreEdge } from '../../elements/edge.ts';
import { defineBinarySearchTreeAlgorithm } from '../../structures/binary-search-tree/algorithm.ts';
import {
  positions,
  relayout,
} from '../../structures/binary-search-tree/layout.ts';
import type { Link } from '../../structures/binary-search-tree/structure.ts';
import {
  CoreBinarySearchTree,
  CoreBinarySearchTreeNode,
} from '../../structures/binary-search-tree/structure.ts';

// The listing this plays against is
// `constants/code/binary-search-tree-remove.md`, whose lines are named by the
// `/*#` markers the build strips out.
export const binarySearchTreeRemove = defineBinarySearchTreeAlgorithm({
  parseArgs: (values) => {
    const value = parseArgument(values.value ?? '');

    return value === null ? null : { value };
  },

  play: function* ({ board, structure: tree, args, step }) {
    const { value } = args;

    board.call('remove', [
      // A tree is read on the canvas, so the signature names its type the way
      // the listing declares it rather than printing its contents.
      { name: 'tree', value: { structure: 'BinarySearchTree' } },
      { name: 'value', value },
    ]);

    const frame = board.frame;

    yield step('enter');

    // `current` and `parent` are references to nodes rather than scalars, so
    // they are named under the nodes they point at instead of being listed in
    // memory. `isLeftChild` is a scalar and goes in memory, which is where
    // the reader can watch the three branches below turn on it.
    let current = tree.root;
    if (current !== null) mark(current, 'current');
    yield step('current');

    let parent: CoreBinarySearchTreeNode | null = null;
    yield step('parent');

    let isLeftChild = false;
    frame.set('isLeftChild', isLeftChild);
    yield step('isLeftChild');

    yield step('searchLoop');

    while (current !== null && current.value !== value) {
      parent = current;
      yield step('setParent');

      yield step('compare');

      if (value < current.value) {
        isLeftChild = true;
        frame.set('isLeftChild', isLeftChild);
        yield step('markLeft');

        unmark(current);
        current = current.left?.end ?? null;
        if (current !== null) mark(current, 'current');
        yield step('goLeft');
      } else {
        isLeftChild = false;
        frame.set('isLeftChild', isLeftChild);
        yield step('markRight');

        unmark(current);
        current = current.right?.end ?? null;
        if (current !== null) mark(current, 'current');
        yield step('goRight');
      }

      yield step('searchLoop');
    }

    yield step('missingCheck');

    if (current === null) {
      yield step('missing');
      yield step('exit');

      board.return();

      return;
    }

    // Found. The node is the one leaving the tree in three of the four cases;
    // in the fourth it stays and takes its successor's value.
    const target = current;
    target.variant = 'danger';
    target.rearrange();

    // The link pointing at `target`, and the assignment that replaces it. The
    // listing spells that out three times per case — the tree's own root
    // reference, the parent's left, the parent's right — and they differ only
    // in which reference is written, so one closure covers all three and the
    // step is what says which line the reader is on.
    // The node being the root is exactly the search never having taken a
    // step, so it is read off `parent` rather than off `tree.root` — which an
    // assignment below has already changed by the time its step is yielded.
    const atRoot = parent === null;

    const incoming = linkFrom(parent, isLeftChild);
    const setIncoming = (child: CoreBinarySearchTreeNode | null): Link =>
      relinkFrom(tree, parent, isLeftChild, child);

    const left = target.left?.end ?? null;
    const right = target.right?.end ?? null;

    yield step('leafCheck');

    if (left === null && right === null) {
      yield step('leafRootCheck');

      replace(board, tree, target, [incoming], () => setIncoming(null));
      yield step(
        branch(atRoot, isLeftChild, 'leafRoot', 'leafLeft', 'leafRight'),
      );

      yield step('leafReturn');
      yield step('exit');

      board.return();

      return;
    }

    yield step('rightOnlyCheck');

    if (left === null) {
      yield step('rightOnlyRootCheck');

      // The child takes the node's place, so the link down to it goes with
      // the node and a link from above takes its place.
      replace(board, tree, target, [incoming, target.right], () =>
        setIncoming(right),
      );
      yield step(
        branch(
          atRoot,
          isLeftChild,
          'rightOnlyRoot',
          'rightOnlyLeft',
          'rightOnlyRight',
        ),
      );

      yield step('rightOnlyReturn');
      yield step('exit');

      board.return();

      return;
    }

    yield step('leftOnlyCheck');

    if (right === null) {
      yield step('leftOnlyRootCheck');

      replace(board, tree, target, [incoming, target.left], () =>
        setIncoming(left),
      );
      yield step(
        branch(
          atRoot,
          isLeftChild,
          'leftOnlyRoot',
          'leftOnlyLeft',
          'leftOnlyRight',
        ),
      );

      yield step('leftOnlyReturn');
      yield step('exit');

      board.return();

      return;
    }

    // Two children. The node itself cannot leave — both of its children would
    // be orphaned — so the smallest value below it on the right takes its
    // place, and that value's node is what leaves instead.
    let successorParent = target;
    yield step('successorParent');

    let successor = right;
    mark(successor, 'successor');
    yield step('successor');

    yield step('successorLoop');

    while (successor.left !== null) {
      successorParent = successor;
      yield step('successorSetParent');

      unmark(successor);
      successor = successor.left.end;
      mark(successor, 'successor');
      yield step('successorGoLeft');

      yield step('successorLoop');
    }

    // Both nodes hold the value for as long as this step is on screen, which
    // is what the assignment does: it copies, and the node it copied from is
    // taken out on the next step.
    target.value = successor.value;
    target.variant = 'success';
    target.rearrange();
    yield step('copyValue');

    yield step('successorSideCheck');

    const going = successor;
    const goingIsLeftChild = successorParent.left?.end === going;
    const goingIncoming = goingIsLeftChild
      ? successorParent.left
      : successorParent.right;

    unmark(going);
    going.variant = 'danger';

    // The successor has no left child — that is what made it the smallest —
    // so lifting its right child into its place is enough.
    replace(board, tree, going, [goingIncoming, going.right], () =>
      relinkFrom(
        tree,
        successorParent,
        goingIsLeftChild,
        going.right?.end ?? null,
      ),
    );
    yield step(goingIsLeftChild ? 'successorLeft' : 'successorRight');

    // The only case where the node the search found is still on the canvas,
    // so it is also the only one that has to put back what the search marked.
    unmark(target);

    yield step('return');
    yield step('exit');

    board.return();
  },
});

function mark(node: CoreBinarySearchTreeNode, name: string) {
  node.variant = 'secondary';
  node.setLabel('bottom', name);
  node.rearrange();
}

function unmark(node: CoreBinarySearchTreeNode) {
  node.variant = 'primary';
  node.setLabel('bottom');
  node.rearrange();
}

// The link pointing at a node, given the parent the search stopped at and the
// side it descended. Null for the root, which nothing points at.
function linkFrom(
  parent: CoreBinarySearchTreeNode | null,
  isLeftChild: boolean,
): Link {
  if (parent === null) return null;

  return isLeftChild ? parent.left : parent.right;
}

// Writes `child` into the reference that pointed at the node being removed,
// and hands back the link it created so the caller can fade it in.
function relinkFrom(
  tree: CoreBinarySearchTree,
  parent: CoreBinarySearchTreeNode | null,
  isLeftChild: boolean,
  child: CoreBinarySearchTreeNode | null,
): Link {
  if (parent === null) {
    tree.root = child;

    return null;
  }

  const edge = child === null ? null : new CoreEdge(parent, child);

  if (isLeftChild) parent.left = edge;
  else parent.right = edge;

  return edge;
}

// Which of the three references a case writes, and so which line the reader
// stops on.
function branch(
  atRoot: boolean,
  isLeftChild: boolean,
  rootLine: string,
  leftLine: string,
  rightLine: string,
): string {
  if (atRoot) return rootLine;

  return isLeftChild ? leftLine : rightLine;
}

// One of the listing's link assignments, animated. The node leaving and every
// link that touched it are faded while the tree still draws them — a node the
// tree no longer holds is not serialized, and so could not be seen fading —
// and only then is the reference written and the layout closed up around the
// gap.
function replace(
  board: CoreBoard,
  tree: CoreBinarySearchTree,
  leaving: CoreBinarySearchTreeNode,
  detached: Link[],
  assign: () => Link,
) {
  const before = positions(tree);

  disappear(board, leaving, ...detached.filter((link) => link !== null));

  const created = assign();

  if (created !== null) {
    created.opacity = 0;
    appear(board, created);
  }

  relayout(board, tree, before);
}
