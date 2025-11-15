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
}
