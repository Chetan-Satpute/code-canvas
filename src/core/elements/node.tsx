import type { CanvasNode } from '#canvas/node.tsx';
import { CANVAS_FILL_COLOR } from '#constants/canvas.tsx';

import type { CoreFrame } from './frame';
import type { CoreLabel } from './label';

export class CoreNode {
  x: number;
  y: number;

  value: number;
  color: string;
  opacity: number;

  label: {
    top?: CoreLabel;
    left?: CoreLabel;
    right?: CoreLabel;
    bottom?: CoreLabel;
  };

  constructor(value: number) {
    this.x = 0;
    this.y = 0;

    this.value = value;
    this.color = CANVAS_FILL_COLOR;
    this.opacity = 1;

    this.label = {};
  }

  serialize(frame: CoreFrame): void {
    const canvasNode: CanvasNode = {
      x: this.x,
      y: this.y,

      value: this.value,
    };

    if (this.color !== CANVAS_FILL_COLOR) canvasNode.color = this.color;
    if (this.opacity !== 1) canvasNode.opacity = this.opacity;

    this.label.top?.serialize(frame);
    this.label.left?.serialize(frame);
    this.label.right?.serialize(frame);
    this.label.bottom?.serialize(frame);

    frame.nodes.push(canvasNode);
  }
}
