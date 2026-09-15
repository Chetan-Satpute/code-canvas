import type { CoreFrame } from '../frame.ts';
import type { CoreNode } from './node.ts';

// A connection between two nodes. It holds the nodes themselves rather than
// coordinates, so it is never positioned: moving either end moves the edge,
// and an edge created mid-animation is drawn correctly from its first frame.
export class CoreEdge<N extends CoreNode = CoreNode> {
  start: N;
  end: N;

  opacity: number;

  constructor(start: N, end: N) {
    this.start = start;
    this.end = end;

    this.opacity = 1;
  }

  serialize(frame: CoreFrame) {
    frame.edges.push({
      start: { x: this.start.x, y: this.start.y },
      end: { x: this.end.x, y: this.end.y },
      opacity: this.opacity,
    });
  }
}
