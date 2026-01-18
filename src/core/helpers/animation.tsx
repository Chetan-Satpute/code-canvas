import type { CoreBoard } from '#core/board.tsx';
import type { CoreStructure } from '#core/structure.tsx';

export function animateMove(
  board: CoreBoard,
  structure: CoreStructure,
  targetX: number,
  targetY: number,
  rearrange = true,
) {
  while (structure.x !== targetX || structure.y !== targetY) {
    if (structure.x !== targetX) {
      structure.x += Math.sign(targetX - structure.x);
    } else if (structure.y !== targetY) {
      structure.y += Math.sign(targetY - structure.y);
    }

    if (rearrange) structure.rearrange();
    board.pushFrame();
  }
}

type MoveIntent = {
  structure: CoreStructure;
  targetX: number;
  targetY: number;
};

export function animateMoveMany(
  board: CoreBoard,
  moves: MoveIntent[],
  rearrange = true,
) {
  const isDone = () =>
    moves.every(
      (m) => m.structure.x === m.targetX && m.structure.y === m.targetY,
    );

  while (!isDone()) {
    for (const { structure, targetX, targetY } of moves) {
      if (structure.x !== targetX) {
        structure.x += Math.sign(targetX - structure.x);
      } else if (structure.y !== targetY) {
        structure.y += Math.sign(targetY - structure.y);
      }

      if (rearrange) structure.rearrange();
    }

    board.pushFrame();
  }
}

export function appear<T extends { opacity: number; rearrange?: () => void }>(
  board: CoreBoard,
  element: T,
) {
  for (; element.opacity < 1; element.opacity += 0.1) {
    if (element.rearrange) element.rearrange();
    board.pushFrame();
  }

  element.opacity = 1;
}

export function disappear<
  T extends { opacity: number; rearrange?: () => void },
>(board: CoreBoard, ...elements: T[]) {
  let anyVisible = true;

  while (anyVisible) {
    anyVisible = false;

    for (const element of elements) {
      if (element.opacity > 0) {
        element.opacity = Math.max(0, element.opacity - 0.1);
        if (element.rearrange) element.rearrange();
        anyVisible = true;
      }
    }

    board.pushFrame();
  }
}
