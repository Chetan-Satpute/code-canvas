import { type CanvasEdge, drawCanvasEdge } from './elements/edge.ts';
import { type CanvasLabel, drawCanvasLabel } from './elements/label.ts';
import { type CanvasNode, drawCanvasNode } from './elements/node.ts';

// One drawn moment, and the only thing the engine hands the renderer.
export interface CanvasFrame {
  nodes: CanvasNode[];
  edges: CanvasEdge[];
  labels: CanvasLabel[];

  width: number;
  height: number;
}

// Edges first so a node always covers the line's end, then labels on top.
export function drawCanvasFrame(
  ctx: CanvasRenderingContext2D,
  frame: CanvasFrame,
) {
  for (const edge of frame.edges) drawCanvasEdge(ctx, edge);
  for (const node of frame.nodes) drawCanvasNode(ctx, node);
  for (const label of frame.labels) drawCanvasLabel(ctx, label);
}

// The size the canvas element is given, in CSS pixels. Held apart from the
// frame's own size so a structure growing mid-animation does not resize the
// element on every frame, which would make it jitter against its container.
export interface CanvasSize {
  width: number;
  height: number;
}

export function renderCanvasFrame(
  canvas: HTMLCanvasElement,
  frame: CanvasFrame,
  size: CanvasSize,
) {
  const ratio = window.devicePixelRatio;

  // Assigning width/height clears the canvas and resets the context, so the
  // transform mapping CSS pixels onto the scaled backing store has to be set
  // after it — and the clear is why it is assigned every frame.
  canvas.width = Math.round(size.width * ratio);
  canvas.height = Math.round(size.height * ratio);
  canvas.style.width = `${size.width}px`;
  canvas.style.height = `${size.height}px`;

  const ctx = canvas.getContext('2d');
  if (ctx === null) return;

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  drawCanvasFrame(ctx, frame);
}

// A step's frames are played into one element, so the element is sized once
// to the largest of them rather than to each in turn.
export function canvasFramesSize(frames: CanvasFrame[]): CanvasSize {
  let width = 0;
  let height = 0;

  for (const frame of frames) {
    width = Math.max(width, frame.width);
    height = Math.max(height, frame.height);
  }

  return { width, height };
}
