import { useEffect, useState } from 'react';

// Text drawn into a canvas is rasterized once and never reflows, so a canvas
// painted before its web font arrives keeps the fallback face until something
// else happens to redraw it. Anything drawing text should repaint when this
// flips.
export function useFontsReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    document.fonts.ready.then(() => {
      if (!cancelled) setReady(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
