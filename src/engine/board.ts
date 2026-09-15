import type { CanvasFrame } from '#canvas/frame.ts';

import { CoreCallFrame } from './callFrame.ts';
import { createCoreFrame, serializeCoreFrame } from './frame.ts';
import type { CallStackFrame, CoreStep } from './step.ts';
import type { CoreStructure } from './structure.ts';
import type { CoreVariable } from './value.ts';

// Everything a run can see: the structures on the canvas, the calls in
// progress, and the frames drawn since the reader was last shown anything.
export class CoreBoard {
  structures: CoreStructure[];
  callStack: CoreCallFrame[];

  // Frames pushed since the last drain. Empty most of the time — it fills
  // only while a tween is being written out.
  private pending: CanvasFrame[];

  private nextCallId: number;

  constructor() {
    this.structures = [];
    this.callStack = [];
    this.pending = [];
    this.nextCallId = 0;
  }

  add(structure: CoreStructure) {
    if (this.structures.includes(structure)) return;

    this.structures.push(structure);
  }

  remove(structure: CoreStructure) {
    const index = this.structures.indexOf(structure);
    if (index === -1) return;

    this.structures.splice(index, 1);
  }

  // The board as it stands right now.
  toFrame(): CanvasFrame {
    const frame = createCoreFrame();

    for (const structure of this.structures) structure.serialize(frame);

    return serializeCoreFrame(frame);
  }

  // One tick of an animation. Call it after each small mutation; the frames
  // pile up until the next drain, and are played back in order.
  pushFrame() {
    this.pending.push(this.toFrame());
  }

  // Takes the frames drawn since the last drain, leaving none behind. A step
  // that pushed nothing still shows the board, so one frame stands in.
  drainFrames(): CanvasFrame[] {
    if (this.pending.length === 0) this.pushFrame();

    const frames = this.pending;
    this.pending = [];

    return frames;
  }

  call(name: string, parameters: CoreVariable[]): CoreCallFrame {
    const frame = new CoreCallFrame(
      `call-${this.nextCallId++}`,
      name,
      parameters,
    );

    this.callStack.push(frame);

    return frame;
  }

  return() {
    this.callStack.pop();
  }

  // The call in progress, which is the one the memory card shows.
  get frame(): CoreCallFrame {
    const frame = this.callStack.at(-1);

    if (frame === undefined)
      throw new Error('The board has no call in progress');

    return frame;
  }

  private serializeCallStack(): CallStackFrame[] {
    return this.callStack.map((frame) => frame.serialize()).reverse();
  }

  toStep(activeLine: number): CoreStep {
    return {
      activeLine,
      frames: this.drainFrames(),
      callStack: this.serializeCallStack(),
    };
  }
}
