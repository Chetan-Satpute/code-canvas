import { useRef } from 'react';

import type { CanvasFrame } from '#canvas/frame.ts';
import { useCanvasFrames } from '#hooks/useCanvasFrames.ts';

interface VisualizationCanvasProps {
  // The frames of the current step, played in order. The canvas sizes itself
  // to them, so a large structure is reached by scrolling rather than shrunk.
  frames: CanvasFrame[];
}

function VisualizationCanvas(props: VisualizationCanvasProps) {
  const { frames } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useCanvasFrames(canvasRef, frames);

  return (
    // currentColor in the gradient resolves against text-border.
    <div className="text-border flex h-full overflow-auto bg-[radial-gradient(circle,currentColor_1px,transparent_1px)] [background-size:24px_24px] [background-position:center]">
      {/* Auto margins centre the canvas while there is room and collapse to
          zero once it overflows, which keeps its top-left edge reachable. */}
      <canvas ref={canvasRef} className="m-auto block shrink-0" />
    </div>
  );
}

export default VisualizationCanvas;
