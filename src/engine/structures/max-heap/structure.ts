import type { NodeVariant } from '#canvas/elements/node.ts';
import { NODE_HEIGHT, NODE_WIDTH } from '#canvas/elements/node.ts';

import { CoreEdge } from '../../elements/edge.ts';
import { CoreLabel } from '../../elements/label.ts';
import type { NodeLabelPosition } from '../../elements/node.ts';
import { CoreNode } from '../../elements/node.ts';
import type { CoreFrame } from '../../frame.ts';
import { CoreStructure } from '../../structure.ts';

// A child link, or its absence.
export type Link = CoreEdge<CoreMaxHeapTreeNode> | null;

// How far below the array row the tree is drawn. Two rows would put the
// tree's own `top` label in the row the array's cursors are named in, so it
// is three: the array's labels sit one below it, the tree's one above itself.
const TREE_OFFSET = 3 * NODE_HEIGHT;

export class CoreMaxHeapTreeNode extends CoreNode {
  left: Link;
  right: Link;

  constructor(value: number) {
    super(value);

    this.left = null;
    this.right = null;
  }

  setLeft(child: CoreMaxHeapTreeNode | null) {
    this.left = child === null ? null : new CoreEdge(this, child);
  }

  setRight(child: CoreMaxHeapTreeNode | null) {
    this.right = child === null ? null : new CoreEdge(this, child);
  }

  serialize(frame: CoreFrame) {
    super.serialize(frame);

    this.left?.serialize(frame);
    this.right?.serialize(frame);
  }
}

// One value of the heap, drawn in both views at once. Everything that says
// something about a value — its color, its name, whether it is on the canvas
// at all — is set through here rather than on either node, which is what
// keeps the two views from drifting apart.
export class CoreMaxHeapNode {
  arrayNode: CoreNode;
  treeNode: CoreMaxHeapTreeNode;

  constructor(value: number) {
    this.arrayNode = new CoreNode(value);
    this.treeNode = new CoreMaxHeapTreeNode(value);
  }

  get value(): number {
    return this.arrayNode.value;
  }

  get opacity(): number {
    return this.arrayNode.opacity;
  }

  set opacity(opacity: number) {
    this.arrayNode.opacity = opacity;
    this.treeNode.opacity = opacity;
  }

  set variant(variant: NodeVariant) {
    this.arrayNode.variant = variant;
    this.treeNode.variant = variant;
  }

  setLabel(position: NodeLabelPosition, text?: string) {
    this.arrayNode.setLabel(position, text);
    this.treeNode.setLabel(position, text);
  }

  rearrange() {
    this.arrayNode.rearrange();
    this.treeNode.rearrange();
  }

  serialize(frame: CoreFrame) {
    this.arrayNode.serialize(frame);
    this.treeNode.serialize(frame);
  }
}

// What the last element leaving takes with it, held back rather than applied
// so the caller can fade the node and its link while the heap still draws
// them — the same shape the binary search tree's removal uses.
export interface Removal {
  node: CoreMaxHeapNode;
  edge: Link;
  unlink: () => void;
}

export class CoreMaxHeap extends CoreStructure<number[]> {
  nodes: CoreMaxHeapNode[];

  // One name per view, because the two are one structure and the listings
  // call it by a single name.
  arrayName?: CoreLabel;
  treeName?: CoreLabel;

  constructor(values: number[] = []) {
    super();

    this.nodes = [];
    this.restore(values);
  }

  toData(): number[] {
    return this.nodes.map((node) => node.value);
  }

  restore(values: number[]) {
    this.nodes = values.map((value) => new CoreMaxHeapNode(value));
    this.link();
    this.rearrange();
  }

  setName(name?: string) {
    this.arrayName = name === undefined ? undefined : new CoreLabel(name);
    this.treeName = name === undefined ? undefined : new CoreLabel(name);
  }

  // Wires the tree from the array: the element at `index` has its children at
  // `2 * index + 1` and `2 * index + 2`. That relation is the whole of what
  // makes an array a heap, so the tree is derived from it every time rather
  // than maintained alongside it.
  link() {
    this.nodes.forEach((node, index) => {
      const left = 2 * index + 1;
      const right = 2 * index + 2;

      node.treeNode.setLeft(
        left < this.nodes.length ? this.nodes[left].treeNode : null,
      );
      node.treeNode.setRight(
        right < this.nodes.length ? this.nodes[right].treeNode : null,
      );
    });
  }

  // `[heap[a], heap[b]] = [heap[b], heap[a]]`. The elements exchange places,
  // so the nodes themselves move; the tree is then wired from the new
  // arrangement, which leaves its shape identical and its two values traded.
  swap(a: number, b: number) {
    [this.nodes[a], this.nodes[b]] = [this.nodes[b], this.nodes[a]];
    this.link();
  }

  // `heap.push(value)`. The new element goes at the end, where it is a leaf
  // hanging off the node that owns that slot.
  push(value: number): { node: CoreMaxHeapNode; edge: Link } {
    const node = new CoreMaxHeapNode(value);

    this.nodes.push(node);
    this.link();

    return { node, edge: this.linkTo(this.nodes.length - 1) };
  }

  // `heap.pop()`, worked out but not applied.
  removeLast(): Removal | null {
    if (this.nodes.length === 0) return null;

    const index = this.nodes.length - 1;

    return {
      node: this.nodes[index],
      edge: this.linkTo(index),
      unlink: () => {
        this.nodes.pop();
        this.link();
      },
    };
  }

  // The link pointing at the element in a slot, which is null for the top.
  // An odd index is a left child and an even one a right child, since the two
  // children of `i` are `2i + 1` and `2i + 2`.
  private linkTo(index: number): Link {
    if (index === 0) return null;

    const parent = this.nodes[Math.floor((index - 1) / 2)].treeNode;

    return index % 2 === 1 ? parent.left : parent.right;
  }

  rearrange() {
    this.nodes.forEach((node, index) => {
      node.arrayNode.x = this.x + index * NODE_WIDTH;
      node.arrayNode.y = this.y;

      // Indices are a property of the heap, not of the element in the slot,
      // so they are rewritten on every layout — the same as the array's.
      node.arrayNode.setLabel('top', index.toString());
      node.arrayNode.rearrange();
    });

    this.layOutTree();

    if (this.arrayName !== undefined) {
      this.arrayName.x = this.x - NODE_WIDTH;
      this.arrayName.y = this.y;
      this.arrayName.opacity = this.opacity;
    }

    if (this.treeName !== undefined) {
      this.treeName.x = this.x - NODE_WIDTH;
      this.treeName.y = this.y + TREE_OFFSET;
      this.treeName.opacity = this.opacity;
    }
  }

  // The same in-order walk the binary search tree lays out with: a column at a
  // time, a row per depth. It gives every node a column of its own and draws
  // no crossings, without measuring a single subtree.
  private layOutTree() {
    const top = this.nodes[0]?.treeNode;
    if (top === undefined) return;

    let column = 0;

    const walk = (node: CoreMaxHeapTreeNode | null, depth: number) => {
      if (node === null) return;

      walk(node.left?.end ?? null, depth + 1);

      node.x = this.x + column * NODE_WIDTH;
      node.y = this.y + TREE_OFFSET + depth * 2 * NODE_HEIGHT;
      column++;

      // Which element is on top is a property of the heap rather than of the
      // element, so the label is rewritten on every layout. It sits above the
      // tree's own root, where the array row's indices cannot reach it.
      node.setLabel('top', node === top ? 'top' : undefined);
      node.rearrange();

      walk(node.right?.end ?? null, depth + 1);
    };

    walk(top, 0);
  }

  serialize(frame: CoreFrame) {
    for (const node of this.nodes) node.serialize(frame);

    this.arrayName?.serialize(frame);
    this.treeName?.serialize(frame);
  }
}
