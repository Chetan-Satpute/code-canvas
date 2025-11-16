import { useLayoutEffect, useRef } from 'react';

import { type CanvasFrame, renderCanvasFrame } from '#canvas/frame.tsx';

interface MainCanvasProps {
  frames: CanvasFrame[];
}

function MainCanvas(props: MainCanvasProps) {
  const { frames } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    let animationFrameID: number | null = null;

    const createFrameCallback = (frameIndex: number) => () => {
      if (frameIndex >= frames.length) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const canvasFrame = frames[frameIndex];

      renderCanvasFrame(canvas, canvasFrame);

      animationFrameID = window.requestAnimationFrame(
        createFrameCallback(frameIndex + 1),
      );
    };

    animationFrameID = window.requestAnimationFrame(createFrameCallback(0));

    return () => {
      if (animationFrameID) window.cancelAnimationFrame(animationFrameID);
    };
  }, [frames]);

  return (
    <main className="no-scrollbar flex-1 overflow-auto">
      <canvas ref={canvasRef} className="mx-10 my-5 lg:mx-20 lg:my-10" />
    </main>
  );
}

export default MainCanvas;
