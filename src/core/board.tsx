import type { CanvasFrame } from '#canvas/frame.tsx';

import { createCoreFrame, serializeCoreFrame } from './elements/frame';
import { CoreStructure } from './structure';

export class CoreBoard {
  structures: CoreStructure[];

  constructor() {
    this.structures = [];
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
}
