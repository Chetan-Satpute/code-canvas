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

  fromData(data: number[]): void {
    this.nodes = [];

    for (const value of data) {
      const node = new CoreNode(value);
      this.nodes.push(node);
    }
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
      this.nodes[i].x = this.x + i * CANVAS_NODE_WIDTH;
      this.nodes[i].y = this.y;

      this.nodes[i].serialize(frame);
    }
  }
}
