import { useRef } from 'react';

function Main() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <main className="no-scrollbar flex-1 overflow-auto">
      <canvas ref={canvasRef} className="mx-10 my-5 lg:mx-20 lg:my-10" />
    </main>
  );
}

export default Main;
