export const NODE_WIDTH = 60;
export const NODE_HEIGHT = 30;
export const NODE_RADIUS = NODE_HEIGHT * 0.25;

export type NodeVariant =
  'primary' | 'secondary' | 'tertiary' | 'success' | 'danger';

// Fills come from the theme's palette, but each one is picked at the step
// that keeps pearl text above 4.5:1 on it — so success is --teal-700 rather
// than the lighter --success, and every variant can share one text color.
// They are also close in luminance, so a canvas mixing variants reads evenly
// instead of having one variant glare.
const NODE_FILL_COLOR: Record<NodeVariant, string> = {
  primary: '#424357', // --midnight-700
  secondary: '#4755a6', // --indigo-500
  tertiary: '#315991', // --sapphire-600
  success: '#23766d', // --teal-700
  danger: '#b63759', // --garnet-500
};

const NODE_TEXT_COLOR = '#f4efe2'; // --pearl-100
const NODE_FONT_SIZE = NODE_HEIGHT * 0.5;
const NODE_FONT = `${NODE_FONT_SIZE}px 'Ubuntu Mono', ui-monospace, monospace`;

// A dark node on a dark canvas has no silhouette of its own, so every node
// carries a hairline rim and a top sheen. Both are drawn in white at low
// alpha rather than derived from the fill, so they look the same on every
// variant.
const NODE_RIM_COLOR = 'rgba(244, 239, 226, 0.18)';
const NODE_SHEEN_COLOR = 'rgba(255, 255, 255, 0.08)';

export interface CanvasNode {
  x: number;
  y: number;
  value: number;
  variant: NodeVariant;
  opacity: number;
}

export function drawCanvasNode(
  ctx: CanvasRenderingContext2D,
  node: CanvasNode,
) {
  const { x, y, value, variant, opacity } = node;

  ctx.save();
  ctx.globalAlpha = opacity;

  ctx.beginPath();
  ctx.roundRect(x, y, NODE_WIDTH, NODE_HEIGHT, NODE_RADIUS);
  ctx.fillStyle = NODE_FILL_COLOR[variant];
  ctx.fill();

  // The sheen fades out by the vertical middle so it lights the top edge
  // instead of washing the whole face.
  const sheen = ctx.createLinearGradient(0, y, 0, y + NODE_HEIGHT / 2);
  sheen.addColorStop(0, NODE_SHEEN_COLOR);
  sheen.addColorStop(1, 'transparent');
  ctx.fillStyle = sheen;
  ctx.fill();

  // Inset by half the line width so the 1px rim lands inside the fill and
  // stays crisp instead of straddling the edge.
  ctx.beginPath();
  ctx.roundRect(
    x + 0.5,
    y + 0.5,
    NODE_WIDTH - 1,
    NODE_HEIGHT - 1,
    NODE_RADIUS - 0.5,
  );
  ctx.lineWidth = 1;
  ctx.strokeStyle = NODE_RIM_COLOR;
  ctx.stroke();

  ctx.fillStyle = NODE_TEXT_COLOR;
  ctx.font = NODE_FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(value.toString(), x + NODE_WIDTH / 2, y + NODE_HEIGHT / 2);

  ctx.restore();
}
