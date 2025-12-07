import type { CoreBoard } from '#core/board.tsx';
import { CoreNode } from '#core/elements/node.tsx';
import type { CoreFunctionContext } from '#core/helpers/algorithms.tsx';
import type { CoreStructure } from '#core/structure.tsx';
import { setFrames, setStructureData } from '#redux/slice.ts';

import type { CoreArray } from '../structure';

export function runInsertValue({
  context,
  board,
  structure,
}: {
  context: CoreFunctionContext;
  board: CoreBoard;
  structure: CoreStructure;
}) {
  const { args } = context;

  let index = args.index as number;
  const value = args.value as number;
  const array = structure as CoreArray;

  if (index < 0) index = 0;
  if (index >= array.nodes.length) index = array.nodes.length;

  array.nodes.splice(index, 0, new CoreNode(value));
  array.rearrange();

  const frames = [board.toFrame()];
  const data = array.toData();

  context.dispatch(setFrames(frames));
  context.dispatch(setStructureData(data));
}
