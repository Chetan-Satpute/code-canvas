import type { CanvasFrame } from '#canvas/frame.tsx';

import { createCoreFrame, serializeCoreFrame } from './elements/frame';
import type { CoreFunction } from './elements/function';
import type { CoreStepActionPayload } from './helpers/types';
import { CoreStructure } from './structure';

export class CoreBoard {
  structures: CoreStructure[];
  callstack: CoreFunction[];
  frames: CanvasFrame[];

  constructor() {
    this.structures = [];
    this.callstack = [];
    this.frames = [];
  }

  add(structure: CoreStructure) {
    const structureIndex = this.structures.indexOf(structure);
    if (structureIndex !== -1) return;

    this.structures.push(structure);
  }

  remove(structure: CoreStructure) {
    const structureIndex = this.structures.indexOf(structure);
    if (structureIndex === -1) return;

    this.structures.splice(structureIndex, 1);
  }

  toFrame(): CanvasFrame {
    const frame = createCoreFrame();

    for (const structure of this.structures) {
      structure.serialize(frame);
    }

    const canvasFrame = serializeCoreFrame(frame);

    return canvasFrame;
  }

  pushFrame() {
    this.frames.push(this.toFrame());
  }

  serialize(activeCodeLine: number): CoreStepActionPayload {
    const frames = this.frames;

    if (frames.length === 0) {
      this.pushFrame();
    }

    this.frames = [];

    return {
      activeCodeLine,
      callStack: [...this.callstack].reverse(),
      frames,
    };
  }
}
