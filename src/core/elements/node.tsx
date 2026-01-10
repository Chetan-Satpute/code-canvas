import type { CanvasNode } from '#canvas/node.tsx';
import {
  CANVAS_FILL_COLOR,
  CANVAS_NODE_HEIGHT,
  CANVAS_NODE_WIDTH,
} from '#constants/canvas.tsx';

import type { CoreFrame } from './frame';
import { CoreLabel } from './label';

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

  rearrange() {
    if (this.label.top) {
      this.label.top.x = this.x;
      this.label.top.y = this.y - CANVAS_NODE_HEIGHT;
      this.label.top.opacity = this.opacity;
    }

    if (this.label.right) {
      this.label.right.x = this.x + CANVAS_NODE_WIDTH;
      this.label.right.y = this.y;
      this.label.right.opacity = this.opacity;
    }

    if (this.label.bottom) {
      this.label.bottom.x = this.x;
      this.label.bottom.y = this.y + CANVAS_NODE_HEIGHT;
      this.label.bottom.opacity = this.opacity;
    }

    if (this.label.left) {
      this.label.left.x = this.x - CANVAS_NODE_WIDTH;
      this.label.left.y = this.y;
      this.label.left.opacity = this.opacity;
    }
  }

  setLabel(position: keyof typeof this.label, text?: string) {
    if (text) {
      this.label[position] = new CoreLabel(text);
    } else {
      this.label[position] = undefined;
    }
  }
}
