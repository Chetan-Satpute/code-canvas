import { useEffect, useState } from 'react';

import type { CanvasFrame } from '#canvas/frame.ts';
import { arrayLinearSearch } from '#engine/algorithms/array/linear-search.ts';
import { CoreBoard } from '#engine/board.ts';
import { CoreArray } from '#engine/structures/array/structure.ts';
import type { Listing } from '#utils/code.ts';

// Fixed rather than randomized, so the panel's caption can name the target and
// every loop of the demo ends on a match instead of sometimes exhausting the
// array.
//
// The count is what keeps the demo usable on a phone. The array draws at
// `60 + n * 60` pixels, so four cells is 300 — inside the panel on every
// handset down to 360px wide, where five would be cut off at the right edge
// and hide the very element the search is looking for.
const values = [7, 3, 21, 42];
const target = 42;

// Slow enough to read the highlighted line before it moves on, brisk enough
// that the whole search is over in a few seconds.
const stepDelayMs = 700;

// The match is the point of the demo, and the step after it puts the whole
// array back to grey — so that one line is held rather than stepped past.
const foundHoldMs = 2000;

// The pause on the finished run before the array is rebuilt and searched
// again.
const restartDelayMs = 1800;

export interface HeroRun {
  frames: CanvasFrame[];
  // Absent before the first step, the same way the explore page has no active
  // line outside a run.
  activeLine?: number;
}

// A board holding one named array, exactly as the explore page's structure
// registry builds it — the name label is part of what the canvas draws.
function createSession() {
  const board = new CoreBoard();
  const array = new CoreArray(values);

  array.setName('array');
  array.rearrange();
  board.add(array);

  return { board, array };
}

// Plays the real linear search on a real board, on a loop. Nothing here is a
// depiction of the visualizer: the frames are the engine's own, and the hero
// hands them to the same canvas component the explore page uses.
export function useHeroRun(listing: Listing): HeroRun {
  const [run, setRun] = useState<HeroRun>(() => ({
    frames: createSession().board.drainFrames(),
  }));

  useEffect(() => {
    // A demo that restarts forever is exactly what this setting asks pages not
    // to do, so the array is simply left at rest on the canvas.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let timer = 0;
    let cancelled = false;

    const begin = () => {
      const { board, array } = createSession();

      const steps = arrayLinearSearch(board, array, listing, {
        target: target.toString(),
      });

      // Only if the target failed to parse, which a literal cannot.
      if (steps === null) return;

      // The untouched array, before the first line runs.
      setRun({ frames: board.drainFrames() });

      const advance = () => {
        if (cancelled) return;

        const result = steps.next();

        // The finished run stays on screen through the pause, then the whole
        // thing is built again from scratch.
        if (result.done) {
          timer = window.setTimeout(begin, restartDelayMs);
          return;
        }

        const { frames, activeLine } = result.value;
        setRun({ frames, activeLine });

        const found = activeLine === listing.anchors.found;
        timer = window.setTimeout(advance, found ? foundHoldMs : stepDelayMs);
      };

      timer = window.setTimeout(advance, stepDelayMs);
    };

    begin();

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [listing]);

  return run;
}
