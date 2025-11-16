import type { CanvasEdge } from '#canvas/edge.tsx';
import type { CanvasFrame } from '#canvas/frame.tsx';
import type { CanvasLabel } from '#canvas/label.tsx';
import type { CanvasNode } from '#canvas/node.tsx';
import { CANVAS_NODE_HEIGHT, CANVAS_NODE_WIDTH } from '#constants/canvas.tsx';

export interface CoreFrame {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  labels: CanvasLabel[];
}

export function createCoreFrame(): CoreFrame {
  return { nodes: [], edges: [], labels: [] };
}

export function serializeCoreFrame(frame: CoreFrame): CanvasFrame {
  const { nodes, edges, labels } = frame;

  const { width, height } = frameSize(frame);

  return { nodes, edges, labels, width, height };
}

export function frameSize(frame: CoreFrame): {
  width: number;
  height: number;
} {
  let height = 0;
  let width = 0;

  for (const node of frame.nodes) {
    width = Math.max(width, node.x + CANVAS_NODE_WIDTH);
    height = Math.max(height, node.y + CANVAS_NODE_HEIGHT);
  }

  for (const label of frame.labels) {
    width = Math.max(width, label.x + CANVAS_NODE_WIDTH);
    height = Math.max(height, label.y + CANVAS_NODE_HEIGHT);
  }

  return { width, height };
}
