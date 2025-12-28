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
