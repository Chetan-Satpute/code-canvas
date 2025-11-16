import type { CoreFrame } from './elements/frame';

export class CoreStructure {
  x: number;
  y: number;

  width: number;
  height: number;

  constructor() {
    this.x = 0;
    this.y = 0;

    this.width = 0;
    this.height = 0;
  }

  fromData(_data: unknown): void {}

  toData(): unknown {
    return;
  }

  moveTo(x: number, y: number): void {
    this.x = x;
    this.y = y;
  }

  serialize(_frame: CoreFrame): void {}
}
