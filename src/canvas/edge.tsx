import {
  CANVAS_NODE_HEIGHT,
  CANVAS_NODE_WIDTH,
  CANVAS_STROKE_COLOR,
} from '#constants/canvas.tsx';

export interface CanvasEdge {
  start: { x: number; y: number }; // node centers
  end: { x: number; y: number }; // node centers

  color?: string;
  opacity?: number;
}

export function drawCanvasEdge(
  ctx: CanvasRenderingContext2D,
  edge: CanvasEdge,
) {
  const { start, end, color = CANVAS_STROKE_COLOR, opacity = 1 } = edge;

  // Compute node centers
  const startX = start.x + CANVAS_NODE_WIDTH / 2;
  const startY = start.y + CANVAS_NODE_HEIGHT / 2;
  const endX = end.x + CANVAS_NODE_WIDTH / 2;
  const endY = end.y + CANVAS_NODE_HEIGHT / 2;

  // Direction and angle
  const dx = endX - startX;
  const dy = endY - startY;
  const angle = Math.atan2(dy, dx);

  // Midpoint of line
  let midX = (startX + endX) / 2;
  let midY = (startY + endY) / 2;

  // Arrowhead dimensions
  const arrowLength = 10;

  // Shift midpoint forward so the arrow tip is centered
  midX += (arrowLength / 2) * Math.cos(angle);
  midY += (arrowLength / 2) * Math.sin(angle);

  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 2;

  // Draw the main edge line
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();

  // Draw arrowhead (tip at shifted midpoint)
  ctx.beginPath();
  ctx.moveTo(midX, midY); // tip
  ctx.lineTo(
    midX - arrowLength * Math.cos(angle - Math.PI / 6),
    midY - arrowLength * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    midX - arrowLength * Math.cos(angle + Math.PI / 6),
    midY - arrowLength * Math.sin(angle + Math.PI / 6),
  );
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}
