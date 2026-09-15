import { useLayoutEffect, useRef } from 'react';

import {
  type CanvasFrame,
  canvasFramesSize,
  renderCanvasFrame,
} from '#canvas/frame.ts';
import { useFontsReady } from '#hooks/useFontsReady.ts';

// Plays a step's frames into one canvas, one per animation frame, and holds
// on the last until the next step replaces them. A step that carries a single
// frame simply draws it.
export function useCanvasFrames(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  frames: CanvasFrame[],
) {
  const requestRef = useRef<number | null>(null);

  // The canvas paints its own text, so the first step is drawn in the
  // fallback face if it lands before the web font does. Replaying once the
  // font arrives is what puts the real one on screen.
  const fontsReady = useFontsReady();

  // Otherwise keyed on the array's identity: every step installs a new one,
  // so a new step restarts the playback and re-rendering the same step does
  // not.
  useLayoutEffect(() => {
    if (frames.length === 0) return;

    // While the step is playing the element holds the largest size any of
    // its frames needs, so a structure growing mid-animation does not make it
    // jitter against its container.
    const size = canvasFramesSize(frames);

    let index = 0;

    const drawNext = () => {
      const canvas = canvasRef.current;
      if (canvas === null || index >= frames.length) return;

      const frame = frames[index];
      const isLast = index === frames.length - 1;

      // The last frame settles the element to its own size, so a step that
      // shrank the structure leaves no slack behind it.
      renderCanvasFrame(canvas, frame, isLast ? frame : size);
      index++;

      if (!isLast) requestRef.current = requestAnimationFrame(drawNext);
    };

    requestRef.current = requestAnimationFrame(drawNext);

    return () => {
      if (requestRef.current !== null) cancelAnimationFrame(requestRef.current);
    };
  }, [canvasRef, frames, fontsReady]);
}
