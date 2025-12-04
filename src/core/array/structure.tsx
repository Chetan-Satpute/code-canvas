import { CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import type { CoreFrame } from '#core/elements/frame.tsx';
import { CoreNode } from '#core/elements/node.tsx';
import { CoreStructure } from '#core/structure.tsx';

export class CoreArray extends CoreStructure {
  nodes: CoreNode[];

  constructor() {
    super();

    this.nodes = [];
  }

  static fromData(data: number[]): CoreArray {
    const array = new CoreArray();

    array.nodes = [];

    for (const value of data) {
      const node = new CoreNode(value);
      array.nodes.push(node);
    }

    return array;
  }

  toData(): number[] {
    const data: number[] = [];

    for (const node of this.nodes) {
      data.push(node.value);
    }

    return data;
  }

  serialize(frame: CoreFrame): void {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].serialize(frame);
    }
  }

  rearrange(): void {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].x = this.x + i * CANVAS_NODE_WIDTH;
      this.nodes[i].y = this.y;
    }
  }
}
