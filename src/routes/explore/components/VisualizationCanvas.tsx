import { useEffect, useRef } from 'react';

// The drawing surface keeps its own size and the wrapper scrolls to reach it,
// so a large visualization is never squeezed to fit the card. The engine will
// set these from the structure it is drawing.
const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 800;

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
