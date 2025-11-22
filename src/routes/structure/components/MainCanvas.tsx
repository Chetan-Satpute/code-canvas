import { useRef } from 'react';

import { type CanvasFrame } from '#canvas/frame.tsx';

import { useRenderCanvasFrames } from '../hooks/canvas';

interface MainCanvasProps {
  frames: CanvasFrame[];
}

function MainCanvas(props: MainCanvasProps) {
  const { frames } = props;

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useRenderCanvasFrames(canvasRef, frames);

  return (
    <main className="no-scrollbar flex-1 overflow-auto">
      <canvas ref={canvasRef} className="mx-10 my-5 lg:mx-20 lg:my-10" />
    </main>
  );
}

export default MainCanvas;
