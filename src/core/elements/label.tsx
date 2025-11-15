import type { CanvasLabel } from '#canvas/label.tsx';

import type { CoreFrame } from './frame';

export class CoreLabel {
  text: string;

  x: number;
  y: number;
  opacity: number;

  constructor(text: string) {
    this.text = text;

    this.x = 0;
    this.y = 0;
    this.opacity = 1;
  }

  serialize(frame: CoreFrame) {
    const canvasLabel: CanvasLabel = {
      x: this.x,
      y: this.y,
      text: this.text,
    };

    if (this.opacity !== 1) canvasLabel.opacity = this.opacity;

    frame.labels.push(canvasLabel);
  }
}
