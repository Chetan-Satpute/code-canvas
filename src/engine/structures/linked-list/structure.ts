import { NODE_WIDTH } from '#canvas/elements/node.ts';

import { CoreEdge } from '../../elements/edge.ts';
import { CoreLabel } from '../../elements/label.ts';
import { CoreNode } from '../../elements/node.ts';
import type { CoreFrame } from '../../frame.ts';
import { CoreStructure } from '../../structure.ts';

// A link to the next node, or its absence. An edge holds both of its nodes,
// so a link is the edge itself rather than a reference to the successor.
export type Link = CoreEdge<CoreLinkedListNode> | null;

export class CoreLinkedListNode extends CoreNode {
  next: Link;

  constructor(value: number) {
    super(value);

    this.next = null;
  }

  setNext(node: CoreLinkedListNode | null) {
    this.next = node === null ? null : new CoreEdge(this, node);
  }

  serialize(frame: CoreFrame) {
    super.serialize(frame);

    // The link is written out by the node it leaves, so a walk that visits
    // every node writes every link exactly once.
    this.next?.serialize(frame);
  }
}

// Cells sit two node-widths apart, unlike the array's flush row: what makes a
// list a list is the link between one node and the next, and the gap is the
// room that link is drawn in.
export class CoreLinkedList extends CoreStructure<number[]> {
  head: CoreLinkedListNode | null;

  // Shown one cell to the left of the first node, naming the structure the
  // algorithm's signature refers to.
  name?: CoreLabel;

  constructor(values: number[] = []) {
    super();

    this.head = null;
    this.restore(values);
  }

  toData(): number[] {
    return this.nodes().map((node) => node.value);
  }

  restore(values: number[]) {
    this.head = null;

    let previous: CoreLinkedListNode | null = null;

    for (const value of values) {
      const node = new CoreLinkedListNode(value);

      if (previous === null) this.head = node;
      else previous.setNext(node);

      previous = node;
    }

    this.rearrange();
  }

  setName(name?: string) {
    this.name = name === undefined ? undefined : new CoreLabel(name);
  }

  // Every node, head first. Following `next` is the only way to reach them,
  // which is the property the algorithms are about.
  nodes(): CoreLinkedListNode[] {
    const nodes: CoreLinkedListNode[] = [];

    for (let node = this.head; node !== null; node = node.next?.end ?? null)
      nodes.push(node);

    return nodes;
  }

  rearrange() {
    this.nodes().forEach((node, index) => {
      node.x = this.x + index * 2 * NODE_WIDTH;
      node.y = this.y;

      // Which node is the head is a property of the list rather than of the
      // node, so the label is rewritten on every layout — the same way the
      // array rewrites its indices. v1 cleared the old head's label by hand
      // when the head changed, and a missed call left two heads labelled.
      node.setLabel('top', index === 0 ? 'head' : undefined);
      node.rearrange();
    });

    if (this.name !== undefined) {
      this.name.x = this.x - NODE_WIDTH;
      this.name.y = this.y;
      this.name.opacity = this.opacity;
    }
  }

  serialize(frame: CoreFrame) {
    for (const node of this.nodes()) node.serialize(frame);

    this.name?.serialize(frame);
  }
}
