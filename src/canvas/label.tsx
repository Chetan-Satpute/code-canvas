import {
  CANVAS_NODE_HEIGHT,
  CANVAS_NODE_WIDTH,
  CANVAS_TEXT_COLOR,
} from '#constants/canvas.tsx';

export interface CanvasLabel {
  x: number;
  y: number;

  text: string;
  opacity?: number;
}

export function drawCanvasLabel(
  ctx: CanvasRenderingContext2D,
  label: CanvasLabel,
) {
  const { x, y, text, opacity = 1 } = label;

  ctx.globalAlpha = opacity;

  ctx.fillStyle = CANVAS_TEXT_COLOR;
  ctx.font = `${CANVAS_NODE_HEIGHT / 2}px "Ubuntu Mono"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(
    text.toString(),
    x + CANVAS_NODE_WIDTH / 2,
    y + CANVAS_NODE_HEIGHT / 2,
  );

  ctx.globalAlpha = 1;
}
