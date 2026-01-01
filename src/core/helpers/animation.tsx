import type { CoreBoard } from '#core/board.tsx';
import type { CoreStructure } from '#core/structure.tsx';

export function animateMove(
  board: CoreBoard,
  structure: CoreStructure,
  targetX: number,
  targetY: number,
) {
  while (structure.x !== targetX || structure.y !== targetY) {
    if (structure.x !== targetX) {
      structure.x += Math.sign(targetX - structure.x);
    } else if (structure.y !== targetY) {
      structure.y += Math.sign(targetY - structure.y);
    }

    structure.rearrange();
    board.pushFrame();
  }
}

export function appear<T extends { opacity: number; rearrange: () => void }>(
  board: CoreBoard,
  element: T,
) {
  for (; element.opacity < 1; element.opacity += 0.1) {
    element.rearrange();
    board.pushFrame();
  }

  element.opacity = 1;
}

export function disappear<T extends { opacity: number; rearrange: () => void }>(
  board: CoreBoard,
  element: T,
) {
  for (; element.opacity > 0; element.opacity -= 0.1) {
    element.rearrange();
    board.pushFrame();
  }

  element.opacity = 0;
}
