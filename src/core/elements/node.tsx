import type { CanvasNode } from '#canvas/node.tsx';
import { CANVAS_FILL_COLOR } from '#constants/canvas.tsx';

import type { CoreFrame } from './frame';

export class CoreNode {
  x: number;
  y: number;

  value: number;
  color: string;
  opacity: number;

  constructor(value: number) {
    this.x = 0;
    this.y = 0;

    this.value = value;
    this.color = CANVAS_FILL_COLOR;
    this.opacity = 1;
  }

  serialize(frame: CoreFrame): void {
    const canvasNode: CanvasNode = {
      x: this.x,
      y: this.y,

      value: this.value,
    };

    if (this.color !== CANVAS_FILL_COLOR) canvasNode.color = this.color;
    if (this.opacity !== 1) canvasNode.opacity = this.opacity;

    frame.nodes.push(canvasNode);
  }
}
