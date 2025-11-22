import { useLayoutEffect, useRef } from 'react';

import { type CanvasFrame, renderCanvasFrame } from '#canvas/frame.tsx';

export function useRenderCanvasFrames(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  frames: CanvasFrame[],
) {
  const frameIndexRef = useRef(0);
  const requestIDRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    frameIndexRef.current = 0;

    const renderNextFrame = () => {
      const canvas = canvasRef.current;
      const frameIndex = frameIndexRef.current;

      if (!canvas || frameIndex >= frames.length) return;

      const frame = frames[frameIndex];
      renderCanvasFrame(canvas, frame);

      frameIndexRef.current++;

      requestIDRef.current = requestAnimationFrame(renderNextFrame);
    };

    requestIDRef.current = requestAnimationFrame(renderNextFrame);

    return () => {
      if (requestIDRef.current) cancelAnimationFrame(requestIDRef.current);
    };
  }, [canvasRef, frames]);
}
