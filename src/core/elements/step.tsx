import type { CanvasFrame } from '#canvas/frame.tsx';

import type { CoreFunction } from './function';

export interface CoreStep {
  activeLine: number;
  frames: CanvasFrame[];
  callStack: CoreFunction[];
}

export function createCoreStep(): CoreStep {
  return {
    activeLine: 0,
    frames: [],
    callStack: [],
  };
}
