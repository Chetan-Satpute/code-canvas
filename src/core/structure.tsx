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

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
