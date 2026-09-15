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

// Movement is one pixel per frame, so how long a move takes is decided by how
// far it goes, and there is no easing. It is the whole timing model, carried
// over from v1: an algorithm never states a duration.
function stepTowards(element: Movable, x: number, y: number): boolean {
  if (element.x === x && element.y === y) return false;

  // One axis at a time, so a diagonal move reads as two legs rather than a
  // slide the reader has to decompose.
  if (element.x !== x) element.x += Math.sign(x - element.x);
  else element.y += Math.sign(y - element.y);

  element.rearrange();

  return true;
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
  let moving = true;

  while (moving) {
    moving = false;

    for (const move of moves) {
      if (stepTowards(move.element, move.x, move.y)) moving = true;
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

interface Fadable {
  opacity: number;
  rearrange(): void;
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
      element.rearrange();

      fading = true;
    }

    if (fading) board.pushFrame();
  }
}
