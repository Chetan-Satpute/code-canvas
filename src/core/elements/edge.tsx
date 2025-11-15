import type { CanvasEdge } from '#canvas/edge.tsx';
import { CANVAS_FILL_COLOR } from '#constants/canvas.tsx';

import type { CoreFrame } from './frame';
import type { CoreNode } from './node';

export class CoreEdge {
  start: CoreNode;
  end: CoreNode;

  color: string;
  opacity: number;

  constructor(start: CoreNode, end: CoreNode) {
    this.start = start;
    this.end = end;

    this.color = CANVAS_FILL_COLOR;
    this.opacity = 1;
  }

  serialize(frame: CoreFrame) {
    const canvasEdge: CanvasEdge = {
      start: { x: this.start.x, y: this.start.y },
      end: { x: this.end.x, y: this.end.y },
    };

    if (this.color !== CANVAS_FILL_COLOR) canvasEdge.color = this.color;
    if (this.opacity !== 1) canvasEdge.opacity = this.opacity;

    frame.edges.push(canvasEdge);
  }
}
