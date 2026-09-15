import type { NodeVariant } from '#canvas/elements/node.ts';
import { NODE_HEIGHT, NODE_WIDTH } from '#canvas/elements/node.ts';

import type { CoreFrame } from '../frame.ts';
import { CoreLabel } from './label.ts';

export type NodeLabelPosition = 'top' | 'right' | 'bottom' | 'left';

// A value on the canvas. Its variant is how an algorithm says what it is
// doing to the value — v1 assigned raw hex colors here instead.
export class CoreNode {
  x: number;
  y: number;

  value: number;
  variant: NodeVariant;
  opacity: number;

  // Annotations that travel with the node: the array index above it, a
  // pointer name below it. Repositioned by `rearrange`, so a moving node
  // never leaves its labels behind.
  labels: Partial<Record<NodeLabelPosition, CoreLabel>>;

  constructor(value: number) {
    this.x = 0;
    this.y = 0;

    this.value = value;
    this.variant = 'primary';
    this.opacity = 1;

    this.labels = {};
  }

  setLabel(position: NodeLabelPosition, text?: string) {
    if (text === undefined) {
      delete this.labels[position];
      return;
    }

    const existing = this.labels[position];

    if (existing === undefined) this.labels[position] = new CoreLabel(text);
    else existing.text = text;
  }

  clearLabels() {
    this.labels = {};
  }

  // A label sits one node-cell away in its direction, which is why a label's
  // cell is node-sized: it lines up with the node's column or row without
  // anyone measuring text.
  rearrange() {
    const offsets: Record<NodeLabelPosition, [number, number]> = {
      top: [0, -NODE_HEIGHT],
      right: [NODE_WIDTH, 0],
      bottom: [0, NODE_HEIGHT],
      left: [-NODE_WIDTH, 0],
    };

    for (const [position, label] of Object.entries(this.labels)) {
      const [dx, dy] = offsets[position as NodeLabelPosition];

      label.x = this.x + dx;
      label.y = this.y + dy;
      label.opacity = this.opacity;
    }
  }

  serialize(frame: CoreFrame) {
    for (const label of Object.values(this.labels)) label.serialize(frame);

    frame.nodes.push({
      x: this.x,
      y: this.y,
      value: this.value,
      variant: this.variant,
      opacity: this.opacity,
    });
  }
}
