import {
  CANVAS_FILL_COLOR,
  CANVAS_NODE_HEIGHT,
  CANVAS_NODE_RADIUS,
  CANVAS_NODE_WIDTH,
  CANVAS_TEXT_COLOR,
} from '#constants/canvas.tsx';

export type CornerFlags = number;

export interface CanvasNode {
  x: number;
  y: number;

  value: number;
  color?: string;
  opacity?: number;
}

export function drawCanvasNode(
  ctx: CanvasRenderingContext2D,
  node: CanvasNode,
) {
  const { x, y, value, color = CANVAS_FILL_COLOR, opacity = 1 } = node;

  ctx.globalAlpha = opacity;
  ctx.fillStyle = color;

  ctx.beginPath();
  ctx.roundRect(
    x,
    y,
    CANVAS_NODE_WIDTH,
    CANVAS_NODE_HEIGHT,
    CANVAS_NODE_RADIUS,
  );
  ctx.fill();

  ctx.fillStyle = CANVAS_TEXT_COLOR;
  ctx.font = `${CANVAS_NODE_HEIGHT / 2}px "Ubuntu Mono"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    value.toString(),
    x + CANVAS_NODE_WIDTH / 2,
    y + CANVAS_NODE_HEIGHT / 2,
  );

  ctx.globalAlpha = 1;
  ctx.fillStyle = CANVAS_FILL_COLOR;
}
