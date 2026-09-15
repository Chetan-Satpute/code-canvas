import type { CanvasFrame } from '#canvas/frame.ts';

import { CoreCallFrame } from './callFrame.ts';
import type { CoreNode } from './elements/node.ts';
import { createCoreFrame, serializeCoreFrame } from './frame.ts';
import type { CallStackFrame, CoreStep } from './step.ts';
import type { CoreStructure } from './structure.ts';
import type { CoreVariable } from './value.ts';

// Everything a run can see: the structures on the canvas, the calls in
// progress, and the frames drawn since the reader was last shown anything.
export class CoreBoard {
  structures: CoreStructure[];
  callStack: CoreCallFrame[];

  // Nodes belonging to no structure, drawn after all of them. A value in
  // flight is what this is for: `array[i] = left[j]` copies a value, so the
  // node the reader watches travel between the two is an element of neither,
  // and it passes over whatever lies between them.
  floating: CoreNode[];

  // Frames pushed since the last drain. Empty most of the time — it fills
  // only while a tween is being written out.
  private pending: CanvasFrame[];

  private nextCallId: number;

  constructor() {
    this.structures = [];
    this.callStack = [];
    this.floating = [];
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

  float(node: CoreNode) {
    if (this.floating.includes(node)) return;

    this.floating.push(node);
  }

  unfloat(node: CoreNode) {
    const index = this.floating.indexOf(node);
    if (index === -1) return;

    this.floating.splice(index, 1);
  }

  // Captures everything a run can change and returns the undo: which
  // structures are on the board, what each of them holds, and the calls in
  // progress. A structure's own snapshot cannot cover the first of those, and
  // an algorithm that splits — merge sort adds one structure per half — would
  // otherwise leave them stranded when the reader stops it midway.
  snapshot(): () => void {
    const structures = [...this.structures];
    const restoreStructures = structures.map((structure) =>
      structure.snapshot(),
    );
    const callStack = [...this.callStack];
    const floating = [...this.floating];

    return () => {
      this.structures = structures;
      for (const restore of restoreStructures) restore();

      // A value the run was in the middle of moving belongs to no structure,
      // so nothing else would take it off the canvas.
      this.floating = floating;

      // A run stopped inside a call has frames the algorithm never returned
      // from, and the next run would push onto them.
      this.callStack = callStack;

      // Frames pushed by the work being undone describe a board that no
      // longer exists, so they are dropped rather than played.
      this.pending = [];
    };
  }

  // The board as it stands right now.
  toFrame(): CanvasFrame {
    const frame = createCoreFrame();

    for (const structure of this.structures) structure.serialize(frame);
    for (const node of this.floating) node.serialize(frame);

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
