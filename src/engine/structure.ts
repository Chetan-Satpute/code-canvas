import { NODE_HEIGHT, NODE_WIDTH } from '#canvas/elements/node.ts';
import type { CanvasFrame } from '#canvas/frame.ts';

import {
  type CoreFrame,
  createCoreFrame,
  serializeCoreFrame,
} from './frame.ts';

// A data structure on the board. `Data` is the plain form it converts to and
// from — the shape the app keeps between runs, and what a structure operation
// edits.
export abstract class CoreStructure<Data = unknown> {
  // Top-left of the structure. Everything it owns is laid out relative to
  // this by `rearrange`, so moving the whole structure is two assignments.
  x: number;
  y: number;

  opacity: number;

  constructor() {
    // One cell of margin, so labels above and left of the first node are not
    // clipped by the frame's bounds.
    this.x = NODE_WIDTH;
    this.y = NODE_HEIGHT;

    this.opacity = 1;
  }

  abstract toData(): Data;

  // Replaces the structure's contents in place, so references to it stay
  // valid — the board and the canvas keep pointing at the same object.
  abstract restore(data: Data): void;

  // Captures the current contents and returns the undo. Handing back a
  // closure rather than the data keeps `Data` inside the class, so a caller
  // holding a `CoreStructure<unknown>` can still revert one exactly.
  snapshot(): () => void {
    const data = this.toData();

    return () => this.restore(data);
  }

  // Writes the structure's drawable primitives into the frame being built.
  abstract serialize(frame: CoreFrame): void;

  // Recomputes the positions of everything the structure owns from its own.
  abstract rearrange(): void;

  moveTo(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  toCanvasFrame(): CanvasFrame {
    const frame = createCoreFrame();
    this.serialize(frame);

    return serializeCoreFrame(frame);
  }
}
