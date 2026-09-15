import { parseArgument } from '#utils/argument.ts';

import { appear } from '../../animation.ts';
import type { CoreBoard } from '../../board.ts';
import { CoreEdge } from '../../elements/edge.ts';
import { animateFrom, capture } from '../../layout.ts';
import { defineBinarySearchTreeAlgorithm } from '../../structures/binary-search-tree/algorithm.ts';
import {
  CoreBinarySearchTree,
  CoreBinarySearchTreeNode,
} from '../../structures/binary-search-tree/structure.ts';

// The listing this plays against is
// `constants/code/binary-search-tree-insert.md`, whose lines are named by the
// `/*#` markers the build strips out.
export const binarySearchTreeInsert = defineBinarySearchTreeAlgorithm({
  parseArgs: (values) => {
    const value = parseArgument(values.value ?? '');

    return value === null ? null : { value };
  },

  play: function* ({ board, structure: tree, args, step }) {
    const { value } = args;

    board.call('insert', [
      // A tree is read on the canvas, so the signature names its type the way
      // the listing declares it rather than printing its contents.
      { name: 'tree', value: { structure: 'BinarySearchTree' } },
      { name: 'value', value },
    ]);

    yield step('enter');
    yield step('emptyCheck');

    if (tree.root === null) {
      const node = new CoreBinarySearchTreeNode(value);
      node.opacity = 0;
      node.variant = 'success';

      tree.root = node;
      tree.rearrange();
      appear(board, node);

      yield step('setRoot');
      yield step('rootReturn');

      node.variant = 'primary';
      yield step('exit');

      board.return();

      return;
    }

    // `current` is a reference to a node rather than a scalar, so it is named
    // under the node it points at instead of being listed in memory.
    let current = tree.root;
    mark(current, 'current');
    yield step('current');

    yield step('loop');

    for (;;) {
      yield step('equalCheck');

      if (value === current.value) {
        // The tree already holds the value, and a binary search tree carries
        // no duplicates — so the descent stops here having changed nothing.
        current.variant = 'danger';
        yield step('duplicate');

        break;
      }

      yield step('lessCheck');

      if (value < current.value) {
        yield step('leftCheck');

        if (current.left === null) {
          const node = attach(board, tree, current, 'left', value);
          yield step('setLeft');

          unmark(current);
          node.variant = 'success';
          yield step('leftBreak');

          node.variant = 'primary';

          break;
        }

        unmark(current);
        current = current.left.end;
        mark(current, 'current');
        yield step('goLeft');
      } else {
        yield step('rightCheck');

        if (current.right === null) {
          const node = attach(board, tree, current, 'right', value);
          yield step('setRight');

          unmark(current);
          node.variant = 'success';
          yield step('rightBreak');

          node.variant = 'primary';

          break;
        }

        unmark(current);
        current = current.right.end;
        mark(current, 'current');
        yield step('goRight');
      }

      yield step('loop');
    }

    // Whichever way the loop ended, the node it stopped on is still named and
    // colored — and no color outlives the run that set it.
    unmark(current);

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

// `current.left = new Node(value)`, and its mirror on the right. Every node
// has a column of its own, so a new leaf pushes the nodes in-order after it
// one column along: the shift is what makes room, and the node and the link
// to it fade in once the room exists.
function attach(
  board: CoreBoard,
  tree: CoreBinarySearchTree,
  parent: CoreBinarySearchTreeNode,
  side: 'left' | 'right',
  value: number,
): CoreBinarySearchTreeNode {
  const node = new CoreBinarySearchTreeNode(value);
  node.opacity = 0;

  // The edge is built here rather than through `setLeft` because the listing
  // assigns the link itself, and the fade needs a handle on it.
  const edge = new CoreEdge(parent, node);
  edge.opacity = 0;

  const before = capture(tree.inorder());

  if (side === 'left') parent.left = edge;
  else parent.right = edge;

  tree.rearrange();
  animateFrom(board, tree.inorder(), before);

  appear(board, node, edge);

  return node;
}
