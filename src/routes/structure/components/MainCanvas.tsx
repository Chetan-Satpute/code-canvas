import { useLayoutEffect, useRef } from 'react';

import { renderCanvasFrame } from '#canvas/frame.tsx';
import { CoreArray } from '#core/array/structure.tsx';
import { createCoreFrame, serializeCoreFrame } from '#core/elements/frame.tsx';

function MainCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;

    const id = window.requestAnimationFrame(() => {
      if (!canvas) return;

      const frame = createCoreFrame();

      const array = new CoreArray();
      array.fromData([1, 20, 30, 40, 5]);

      array.serialize(frame);

      const canvasFrame = serializeCoreFrame(frame);

      renderCanvasFrame(canvas, canvasFrame);
    });

    return () => window.cancelAnimationFrame(id);
  }, []);

  return (
    <main className="no-scrollbar flex-1 overflow-auto">
      <canvas ref={canvasRef} className="mx-10 my-5 lg:mx-20 lg:my-10" />
    </main>
  );
}

export default MainCanvas;
