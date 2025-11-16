import { type CanvasEdge, drawCanvasEdge } from './edge';
import { type CanvasLabel, drawCanvasLabel } from './label';
import { type CanvasNode, drawCanvasNode } from './node';

export interface CanvasFrame {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  labels: CanvasLabel[];

  height: number;
  width: number;
}

export function drawCanvasFrame(
  ctx: CanvasRenderingContext2D,
  frame: CanvasFrame,
) {
  const { nodes, edges, labels } = frame;

  for (const edge of edges) drawCanvasEdge(ctx, edge);
  for (const node of nodes) drawCanvasNode(ctx, node);
  for (const label of labels) drawCanvasLabel(ctx, label);
}

export function renderCanvasFrame(
  canvas: HTMLCanvasElement,
  frame: CanvasFrame,
) {
  canvas.height = frame.height;
  canvas.width = frame.width;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  drawCanvasFrame(ctx, frame);
}
