import type { CoreFrame } from '../frame.ts';

// An annotation on the structure — an index, a pointer name, a structure's
// own name. Positioned by whatever owns it, never by itself.
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
    frame.labels.push({
      x: this.x,
      y: this.y,
      text: this.text,
      opacity: this.opacity,
    });
  }
}
