import { NODE_WIDTH } from '#canvas/elements/node.ts';

import { CoreLabel } from '../../elements/label.ts';
import { CoreNode } from '../../elements/node.ts';
import type { CoreFrame } from '../../frame.ts';
import { CoreStructure } from '../../structure.ts';

// Cells sit flush against each other, with no gap, because an array's
// defining property is that its elements are contiguous.
export class CoreArray extends CoreStructure<number[]> {
  nodes: CoreNode[];

  // Shown one cell to the left of the first element, naming the structure the
  // algorithm's signature refers to.
  name?: CoreLabel;

  constructor(values: number[] = []) {
    super();

    this.nodes = [];
    this.restore(values);
  }

  toData(): number[] {
    return this.nodes.map((node) => node.value);
  }

  restore(values: number[]) {
    this.nodes = values.map((value) => new CoreNode(value));
    this.rearrange();
  }

  setName(name?: string) {
    this.name = name === undefined ? undefined : new CoreLabel(name);
  }

  rearrange() {
    this.nodes.forEach((node, index) => {
      node.x = this.x + index * NODE_WIDTH;
      node.y = this.y;

      // Indices are a property of the array, not of the node, so they are
      // rewritten on every layout — an element that shifts takes its new
      // index, not the one it was created with.
      node.setLabel('top', index.toString());
      node.rearrange();
    });

    if (this.name !== undefined) {
      this.name.x = this.x - NODE_WIDTH;
      this.name.y = this.y;
      this.name.opacity = this.opacity;
    }
  }

  serialize(frame: CoreFrame) {
    for (const node of this.nodes) node.serialize(frame);

    this.name?.serialize(frame);
  }
}
