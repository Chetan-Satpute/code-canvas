import type { ThunkDispatch, UnknownAction } from '@reduxjs/toolkit';

import { runInsertValue } from '#core/array/insert-value/run.tsx';
import { CoreBoard } from '#core/board.tsx';
import type { CoreFunctionArgumentValue } from '#core/elements/function.tsx';

import { createStructureFromData } from './structures';

export interface CoreFunctionContext {
  data: unknown;
  structureID: string;
  algorithmID: string;
  args: Record<string, CoreFunctionArgumentValue>;
  dispatch: ThunkDispatch<unknown, unknown, UnknownAction>;
}

export function runAlgorithms(context: CoreFunctionContext) {
  const { structureID, algorithmID, data } = context;

  const board = new CoreBoard();
  const structure = createStructureFromData(structureID, data);
  board.add(structure);

  if (structureID === 'array') {
    if (algorithmID === 'insert-value') {
      runInsertValue({ context, board, structure });
    }
  }
}
