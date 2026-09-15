import { useEffect, useRef } from 'react';

import { drawCanvasEdge } from '#canvas/elements/edge.ts';
import { drawCanvasLabel } from '#canvas/elements/label.ts';
import { drawCanvasNode, NODE_HEIGHT } from '#canvas/elements/node.ts';

// The drawing surface keeps its own size and the wrapper scrolls to reach it,
// so a large visualization is never squeezed to fit the card. The engine will
// set these from the structure it is drawing.
const CANVAS_WIDTH = 460;
const CANVAS_HEIGHT = 240;

function VisualizationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null) return;

    const context = canvas.getContext('2d');
    if (context === null) return;

    const ratio = window.devicePixelRatio;

    // Assigning width/height resets the context, so the transform that maps
    // CSS pixels onto the scaled backing store has to be set after it.
    canvas.width = Math.round(CANVAS_WIDTH * ratio);
    canvas.height = Math.round(CANVAS_HEIGHT * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);

    const head = { x: 20, y: 50 };
    const second = { x: 140, y: 50 };
    const third = { x: 260, y: 50 };
    const tail = { x: 380, y: 50 };
    const branch = { x: 260, y: 50 + 3 * NODE_HEIGHT };

    drawCanvasEdge(context, {
      start: head,
      end: second,
      opacity: 1,
    });
    drawCanvasEdge(context, {
      start: second,
      end: third,
      opacity: 1,
    });
    drawCanvasEdge(context, {
      start: third,
      end: tail,
      opacity: 1,
    });
    drawCanvasEdge(context, {
      start: second,
      end: branch,
      opacity: 0.6,
    });

    drawCanvasNode(context, {
      ...head,
      value: 12,
      variant: 'primary',
      opacity: 1,
    });
    drawCanvasNode(context, {
      ...second,
      value: 34,
      variant: 'secondary',
      opacity: 1,
    });
    drawCanvasNode(context, {
      ...third,
      value: 56,
      variant: 'tertiary',
      opacity: 1,
    });
    drawCanvasNode(context, {
      ...tail,
      value: 78,
      variant: 'success',
      opacity: 1,
    });
    drawCanvasNode(context, {
      ...branch,
      value: 90,
      variant: 'danger',
      opacity: 0.6,
    });

    [head, second, third, tail].forEach((node, index) => {
      drawCanvasLabel(context, {
        x: node.x,
        y: node.y - NODE_HEIGHT,
        text: index.toString(),
        opacity: 1,
      });
    });

    drawCanvasLabel(context, {
      x: third.x,
      y: third.y + NODE_HEIGHT,
      text: 'mid',
      opacity: 1,
    });
    drawCanvasLabel(context, {
      x: branch.x,
      y: branch.y + NODE_HEIGHT,
      text: 'cycle',
      opacity: 0.6,
    });
  }, []);

  return (
    // currentColor in the gradient resolves against text-border.
    <div className="text-border flex h-full overflow-auto bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:24px_24px] [background-position:center]">
      {/* Auto margins centre the canvas while there is room and collapse to
          zero once it overflows, which keeps its top-left edge reachable. */}
      <canvas
        ref={canvasRef}
        className="m-auto block shrink-0"
        style={{ width: CANVAS_WIDTH, height: CANVAS_HEIGHT }}
      />
    </div>
  );
}

export default VisualizationCanvas;
