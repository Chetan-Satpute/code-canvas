import { NODE_HEIGHT, NODE_WIDTH } from '#canvas/elements/node.ts';

import { CoreEdge } from '../../elements/edge.ts';
import { CoreLabel } from '../../elements/label.ts';
import { CoreNode } from '../../elements/node.ts';
import type { CoreFrame } from '../../frame.ts';
import { CoreStructure } from '../../structure.ts';

// One subtree in plain form. An absent child is `null`, and so is an empty
// tree.
export interface BinarySearchTreeData {
  value: number;
  left: BinarySearchTreeData | null;
  right: BinarySearchTreeData | null;
}

// A child link, or its absence. An edge holds both of its nodes, so a link
// is the edge itself rather than a reference to the child.
export type Link = CoreEdge<CoreBinarySearchTreeNode> | null;

// What an insert put into the tree, so the caller can fade it in.
export interface Insertion {
  node: CoreBinarySearchTreeNode;
  // The link now pointing at it, or null when the tree was empty and it
  // became the root.
  edge: Link;
}

// What a removal will take out of the tree. The change is held back as
// `unlink` rather than applied, because a node the tree no longer holds is
// not serialized and so could not be seen fading — the same reason
// `snapshot` hands back a closure instead of doing the work.
export interface Removal {
  // The node that leaves. For a node with two children that is the in-order
  // successor: `unlink` copies its value over the node holding the value
  // being removed, and takes the successor out instead.
  node: CoreBinarySearchTreeNode;
  // The link pointing at the leaving node, or null when it is the root.
  edge: Link;
  unlink: () => void;
}

export class CoreBinarySearchTreeNode extends CoreNode {
  // The link to a child rather than the child itself. A `CoreEdge` holds both
  // of its nodes and reads their positions when it serializes, so the line
  // follows whatever the layout does with either end.
  left: Link;
  right: Link;

  constructor(value: number) {
    super(value);

    this.left = null;
    this.right = null;
  }

  setLeft(child: CoreBinarySearchTreeNode | null) {
    this.left = child === null ? null : new CoreEdge(this, child);
  }

  setRight(child: CoreBinarySearchTreeNode | null) {
    this.right = child === null ? null : new CoreEdge(this, child);
  }

  serialize(frame: CoreFrame) {
    super.serialize(frame);

    // Each edge is written out by the node it leaves, so a walk that visits
    // every node writes every edge exactly once.
    this.left?.serialize(frame);
    this.right?.serialize(frame);
  }
}

export class CoreBinarySearchTree extends CoreStructure<BinarySearchTreeData | null> {
  root: CoreBinarySearchTreeNode | null;

  // Shown one cell to the left of the tree, naming the structure the
  // algorithm's signature refers to.
  name?: CoreLabel;

  constructor(data: BinarySearchTreeData | null = null) {
    super();

    this.root = null;
    this.restore(data);
  }

  toData(): BinarySearchTreeData | null {
    const capture = (
      node: CoreBinarySearchTreeNode | null,
    ): BinarySearchTreeData | null =>
      node === null
        ? null
        : {
            value: node.value,
            left: capture(node.left?.end ?? null),
            right: capture(node.right?.end ?? null),
          };

    return capture(this.root);
  }

  restore(data: BinarySearchTreeData | null) {
    const build = (
      subtree: BinarySearchTreeData | null,
    ): CoreBinarySearchTreeNode | null => {
      if (subtree === null) return null;

      const node = new CoreBinarySearchTreeNode(subtree.value);
      node.setLeft(build(subtree.left));
      node.setRight(build(subtree.right));

      return node;
    };

    this.root = build(data);
    this.rearrange();
  }

  setName(name?: string) {
    this.name = name === undefined ? undefined : new CoreLabel(name);
  }

  // Every node, smallest value first. It is also the order the layout lays
  // nodes out in, so it is what a caller walks to find every node once.
  inorder(): CoreBinarySearchTreeNode[] {
    const nodes: CoreBinarySearchTreeNode[] = [];

    const walk = (node: CoreBinarySearchTreeNode | null) => {
      if (node === null) return;

      walk(node.left?.end ?? null);
      nodes.push(node);
      walk(node.right?.end ?? null);
    };

    walk(this.root);

    return nodes;
  }

  // An in-order walk handing out one column at a time, with depth deciding
  // the row. It gives every node a column of its own and draws no crossings,
  // without measuring a single subtree: two nodes at the same depth always
  // have an ancestor between them in order, so they are never in neighbouring
  // columns either.
  rearrange() {
    let column = 0;

    const walk = (node: CoreBinarySearchTreeNode | null, depth: number) => {
      if (node === null) return;

      walk(node.left?.end ?? null, depth + 1);

      node.x = this.x + column * NODE_WIDTH;
      // Two rows apart, so the edge between a node and its child is drawn in
      // a row nothing is laid out on.
      node.y = this.y + depth * 2 * NODE_HEIGHT;
      column++;

      // Which node is the root is a property of the tree rather than of the
      // node, so the label is rewritten on every layout — the same way the
      // array rewrites its indices.
      node.setLabel('top', node === this.root ? 'root' : undefined);
      node.rearrange();

      walk(node.right?.end ?? null, depth + 1);
    };

    walk(this.root, 0);

    if (this.name !== undefined) {
      // The tree's own left edge rather than the root's: the root sits at its
      // in-order column, which is somewhere in the middle of the tree.
      this.name.x = this.x - NODE_WIDTH;
      this.name.y = this.y;
      this.name.opacity = this.opacity;
    }
  }

  serialize(frame: CoreFrame) {
    for (const node of this.inorder()) node.serialize(frame);

    this.name?.serialize(frame);
  }

  // Links a new node into the one position the ordering allows. Returns null
  // if the tree already holds the value: a binary search tree carries no
  // duplicates, so there is nothing to insert. The new node is not laid out
  // here — `rearrange` is what places it, and every column after it moves.
  insert(value: number): Insertion | null {
    const node = new CoreBinarySearchTreeNode(value);

    if (this.root === null) {
      this.root = node;

      return { node, edge: null };
    }

    let current = this.root;

    for (;;) {
      if (value === current.value) return null;

      if (value < current.value) {
        if (current.left === null) {
          current.setLeft(node);

          return { node, edge: current.left };
        }

        current = current.left.end;
      } else {
        if (current.right === null) {
          current.setRight(node);

          return { node, edge: current.right };
        }

        current = current.right.end;
      }
    }
  }

  // Works out what removing `value` takes out of the tree without changing
  // anything, handing back the change as `unlink`. Returns null if the tree
  // does not hold the value.
  remove(value: number): Removal | null {
    let current = this.root;
    let parent: CoreBinarySearchTreeNode | null = null;
    let isLeftChild = false;

    while (current !== null && current.value !== value) {
      parent = current;

      if (value < current.value) {
        isLeftChild = true;
        current = current.left?.end ?? null;
      } else {
        isLeftChild = false;
        current = current.right?.end ?? null;
      }
    }

    if (current === null) return null;

    const node = current;
    const left = node.left?.end ?? null;
    const right = node.right?.end ?? null;

    // The link that points at `node`, which is the tree's own root reference
    // when it has no parent.
    const edge =
      parent === null ? null : isLeftChild ? parent.left : parent.right;

    const replace = (child: CoreBinarySearchTreeNode | null) => {
      if (parent === null) this.root = child;
      else if (isLeftChild) parent.setLeft(child);
      else parent.setRight(child);
    };

    // A leaf, or a node with one child: whatever pointed at the node points
    // at its child instead, and at nothing for a leaf.
    if (left === null || right === null)
      return { node, edge, unlink: () => replace(left ?? right) };

    // Two children. The in-order successor is the smallest value in the right
    // subtree, and the only value that can take the node's place without
    // disturbing the order.
    let successorParent = node;
    let successor = right;

    while (successor.left !== null) {
      successorParent = successor;
      successor = successor.left.end;
    }

    const successorIsLeftChild = successorParent.left?.end === successor;

    return {
      node: successor,
      edge: successorIsLeftChild ? successorParent.left : successorParent.right,
      unlink: () => {
        node.value = successor.value;

        // The successor has no left child — that is what made it the
        // smallest — so lifting its right child into its place is enough.
        const child = successor.right?.end ?? null;

        if (successorIsLeftChild) successorParent.setLeft(child);
        else successorParent.setRight(child);
      },
    };
  }
}
