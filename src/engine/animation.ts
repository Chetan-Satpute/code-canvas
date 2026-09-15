import type { CoreBoard } from './board.ts';

// Anything with a position that can be tweened. A CoreNode and a
// CoreStructure both qualify, so moving one node and moving an entire
// structure are the same call.
interface Movable {
  x: number;
  y: number;
  rearrange(): void;
}

interface Move {
  element: Movable;
  x: number;
  y: number;
}

// A move runs at one pixel per frame until that would take longer than this,
// past which the step grows so the move still lands within it. An array cell
// shifting one place is 60 pixels and so is untouched; what this bounds is
// the long diagonal a merge-sort element travels coming up out of its half,
// which at a pixel a frame would run for six seconds.
const MAX_MOVE_FRAMES = 60;

// How far a move goes still decides how long it takes, and there is no
// easing. An algorithm never states a duration — the cap is a property of the
// animator, not something a caller passes in.
function moveSpeed(moves: Move[]): number {
  let distance = 0;

  for (const move of moves) {
    distance = Math.max(
      distance,
      Math.abs(move.x - move.element.x) + Math.abs(move.y - move.element.y),
    );
  }

  return Math.max(1, Math.ceil(distance / MAX_MOVE_FRAMES));
}

function stepTowards(
  element: Movable,
  x: number,
  y: number,
  speed: number,
): boolean {
  if (element.x === x && element.y === y) return false;

  // One axis at a time, so a diagonal move reads as two legs rather than a
  // slide the reader has to decompose. The last step of a leg is short rather
  // than overshooting, which is what keeps the element on whole pixels.
  if (element.x !== x) element.x += step(x - element.x, speed);
  else element.y += step(y - element.y, speed);

  element.rearrange();

  return true;
}

function step(remaining: number, speed: number): number {
  return Math.sign(remaining) * Math.min(Math.abs(remaining), speed);
}

export function animateMove(
  board: CoreBoard,
  element: Movable,
  x: number,
  y: number,
) {
  animateMoveMany(board, [{ element, x, y }]);
}

// Moves several elements together, one frame for the whole group rather than
// one per element — so a row of nodes shifting along looks like one motion.
export function animateMoveMany(board: CoreBoard, moves: Move[]) {
  // One speed for the whole group, taken from the longest move in it, so
  // elements moving together stay in formation.
  const speed = moveSpeed(moves);

  let moving = true;

  while (moving) {
    moving = false;

    for (const move of moves) {
      if (stepTowards(move.element, move.x, move.y, speed)) moving = true;
    }

    if (moving) board.pushFrame();
  }
}

export function animateMoveBy(
  board: CoreBoard,
  elements: Movable[],
  dx: number,
  dy: number,
) {
  animateMoveMany(
    board,
    elements.map((element) => ({
      element,
      x: element.x + dx,
      y: element.y + dy,
    })),
  );
}

// An edge has no position of its own — it reads its two nodes — so it has
// nothing to recompute when its opacity changes, which is why `rearrange` is
// optional here and required on a `Movable`.
interface Fadable {
  opacity: number;
  rearrange?(): void;
}

const FADE_STEP = 0.1;

export function appear(board: CoreBoard, ...elements: Fadable[]) {
  fade(board, elements, 1);
}

export function disappear(board: CoreBoard, ...elements: Fadable[]) {
  fade(board, elements, 0);
}

function fade(board: CoreBoard, elements: Fadable[], target: number) {
  let fading = true;

  while (fading) {
    fading = false;

    for (const element of elements) {
      if (element.opacity === target) continue;

      const remaining = target - element.opacity;
      element.opacity +=
        Math.sign(remaining) * Math.min(FADE_STEP, Math.abs(remaining));
      element.rearrange?.();

      fading = true;
    }

    if (fading) board.pushFrame();
  }
}
