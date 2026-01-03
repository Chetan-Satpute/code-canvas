import { CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';
import type { CoreFrame } from '#core/elements/frame.tsx';
import { CoreLabel } from '#core/elements/label.tsx';
import { CoreNode } from '#core/elements/node.tsx';
import { CoreStructure } from '#core/structure.tsx';

export class CoreArray extends CoreStructure {
  name?: CoreLabel;
  nodes: CoreNode[];

  constructor() {
    super();

    this.nodes = [];
  }

  static fromData(data: number[]): CoreArray {
    const array = new CoreArray();

    array.nodes = [];

    for (const value of data) {
      array.push(value);
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

    this.name?.serialize(frame);
  }

  rearrange(): void {
    for (let i = 0; i < this.nodes.length; i++) {
      this.nodes[i].x = this.x + i * CANVAS_NODE_WIDTH;
      this.nodes[i].y = this.y;

      if (!this.nodes[i].label.top) {
        this.nodes[i].label.top = new CoreLabel(i.toString());
      }

      const topLabel = this.nodes[i].label.top;
      if (topLabel) topLabel.text = i.toString();
      this.nodes[i].rearrange();
    }

    if (this.name) {
      this.name.x = this.x - CANVAS_NODE_WIDTH;
      this.name.y = this.y;
    }
  }

  push(value: number) {
    const index = this.nodes.length;
    const node = new CoreNode(value);

    this.nodes.push(node);
    node.label.top = new CoreLabel(index.toString());
  }

  setName(name?: string) {
    if (name) this.name = new CoreLabel(name);
    else this.name = undefined;
  }
}
