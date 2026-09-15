import type { CanvasEdge } from '#canvas/elements/edge.ts';
import type { CanvasLabel } from '#canvas/elements/label.ts';
import type { CanvasNode } from '#canvas/elements/node.ts';
import { NODE_HEIGHT, NODE_WIDTH } from '#canvas/elements/node.ts';
import type { CanvasFrame } from '#canvas/frame.ts';

// What a structure serializes into: the drawable primitives of one moment,
// before the frame knows how large it has to be.
export interface CoreFrame {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  labels: CanvasLabel[];
}

export function createCoreFrame(): CoreFrame {
  return { nodes: [], edges: [], labels: [] };
}

// Edges are spanned between nodes, so they never reach past one and cannot
// extend the bounds on their own.
export function frameSize(frame: CoreFrame): { width: number; height: number } {
  let width = 0;
  let height = 0;

  for (const node of frame.nodes) {
    width = Math.max(width, node.x + NODE_WIDTH);
    height = Math.max(height, node.y + NODE_HEIGHT);
  }

  for (const label of frame.labels) {
    width = Math.max(width, label.x + NODE_WIDTH);
    height = Math.max(height, label.y + NODE_HEIGHT);
  }

  return { width, height };
}

export function serializeCoreFrame(frame: CoreFrame): CanvasFrame {
  return { ...frame, ...frameSize(frame) };
}
