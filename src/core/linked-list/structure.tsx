import { CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import { CoreEdge } from '#core/elements/edge.tsx';
import type { CoreFrame } from '#core/elements/frame.tsx';
import { CoreLabel } from '#core/elements/label.tsx';
import { CoreNode } from '#core/elements/node.tsx';
import { CoreStructure } from '#core/structure.tsx';

export class CoreLinkedListNode extends CoreNode {
  next: CoreEdge<CoreLinkedListNode> | null;

  constructor(value: number) {
    super(value);

    this.next = null;
  }

  serialize(frame: CoreFrame): void {
    super.serialize(frame);

    this.next?.serialize(frame);
  }

  setNext(node?: CoreLinkedListNode | null) {
    if (node) this.next = new CoreEdge(this, node);
    else this.next = null;
  }
}

export class CoreLinkedList extends CoreStructure {
  head: CoreLinkedListNode | null;
  name?: CoreLabel;

  constructor() {
    super();

    this.head = null;
  }

  static fromData(data: number[]): CoreLinkedList {
    const linkedList = new CoreLinkedList();

    if (data.length) {
      linkedList.head = new CoreLinkedListNode(data[0]);

      let ptr = linkedList.head;
      for (let i = 1; i < data.length; i++) {
        const nextNode = new CoreLinkedListNode(data[i]);

        ptr.next = new CoreEdge(ptr, nextNode);
        ptr = ptr.next.end;
      }
    }

    return linkedList;
  }

  toData(): number[] {
    const data: number[] = [];

    for (let ptr = this.head; ptr !== null; ptr = ptr.next?.end || null) {
      data.push(ptr.value);
    }

    return data;
  }

  serialize(frame: CoreFrame): void {
    for (let ptr = this.head; ptr !== null; ptr = ptr.next?.end || null) {
      ptr.serialize(frame);
    }

    this.name?.serialize(frame);
  }

  rearrange(): void {
    if (!this.head) return;

    for (
      let ptr: CoreLinkedListNode | null = this.head, x = this.x;
      ptr !== null;
      ptr = ptr.next?.end || null, x += CANVAS_NODE_WIDTH * 2
    ) {
      ptr.x = x;
      ptr.y = this.y;

      if (this.opacity !== 1) {
        ptr.opacity = this.opacity;
      }
    }

    this.head.setLabel('top', 'head');
    this.head.rearrange();

    if (this.name) {
      this.name.x = this.x - CANVAS_NODE_WIDTH;
      this.name.y = this.y;
    }
  }

  setName(name?: string) {
    if (name) this.name = new CoreLabel(name);
    else this.name = undefined;
  }

  setHead(node?: CoreLinkedListNode | null) {
    if (node) {
      this.head?.setLabel('top');
      this.head = node;
    } else {
      this.head = null;
    }
  }
}
