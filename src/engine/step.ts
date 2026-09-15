import type { CanvasFrame } from '#canvas/frame.ts';

import type { CoreVariable } from './value.ts';

// One call stack entry as the UI reads it — the immutable snapshot of a
// `CoreCallFrame`, the way a CanvasFrame is the snapshot of a structure.
export interface CallStackFrame {
  id: string;
  signature: string;
  // Scalars only. A structure is read on the canvas, not in the memory card.
  variables: CoreVariable[];
}

// One point in a run that the reader is shown.
export interface CoreStep {
  // 1-based, matching the code card's gutter.
  activeLine: number;

  // A step is a film strip, not a picture: the frames are played one per
  // animation frame, so a single step can carry a second of movement. Always
  // holds at least one frame.
  frames: CanvasFrame[];

  // Innermost frame first, the order the call stack card lays out.
  callStack: CallStackFrame[];
}
