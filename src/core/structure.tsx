import type { CanvasFrame } from '#canvas/frame.tsx';
import { CANVAS_NODE_HEIGHT, CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';

import {
  type CoreFrame,
  createCoreFrame,
  serializeCoreFrame,
} from './elements/frame';

export class CoreStructure {
  x: number;
  y: number;

  opacity: number;

  width: number;
  height: number;

  constructor() {
    this.x = CANVAS_NODE_WIDTH;
    this.y = CANVAS_NODE_HEIGHT;

    this.opacity = 1;

    this.width = 0;
    this.height = 0;
  }

  static fromData(_data: unknown): CoreStructure {
    return new CoreStructure();
  }

  toData(): unknown {
    return null;
  }

  toCanvasFrame(): CanvasFrame {
    const frame = createCoreFrame();

    this.serialize(frame);

    return serializeCoreFrame(frame);
  }

  moveTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  serialize(_frame: CoreFrame): void {}

  rearrange() {}
}
