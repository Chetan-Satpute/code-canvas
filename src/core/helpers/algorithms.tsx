import type { CanvasFrame } from '#canvas/frame.tsx';
import { runInsertValue } from '#core/array/insert-value/run.tsx';
import { CoreArray } from '#core/array/structure.tsx';
import { CoreBoard } from '#core/board.tsx';
import type { CoreFunctionArgumentValue } from '#core/elements/function.tsx';
import type { CoreStructure } from '#core/structure.tsx';

export interface CoreFunctionContext {
  data: unknown;
  structureID: string;
  algorithmID: string;
  args: Record<string, CoreFunctionArgumentValue>;
  structure: CoreStructure;
  board: CoreBoard;
}

export interface CoreFunctionRunReturn {
  frames: CanvasFrame[];
  data: unknown;
}

export function runAlgorithms(
  context: Omit<CoreFunctionContext, 'board' | 'structure'>,
): CoreFunctionRunReturn | null {
  const { structureID, algorithmID } = context;
  const board = new CoreBoard();

  if (structureID === 'array') {
    if (algorithmID === 'insert-value') {
      const array = CoreArray.fromData(context.data as number[]);
      board.add(array);

      return runInsertValue({
        ...context,
        board,
        structure: array,
      });
    }
  }

  return null;
}
